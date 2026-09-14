import React, { useState, useEffect, useRef } from 'react';
import { useMarketData } from '../../contexts/MarketDataContext';
import { getConvertQuote } from '../../services/convertService';
import { getPriceHistory } from '../../services/marketService';
import { View, Text, ScrollView, TouchableOpacity, Animated, TextInput } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useNotifications } from '../../contexts/NotificationsContext';
import { BlurView } from 'expo-blur';
import styles from '../styles/Convert.styles';

const GREEN = '#00C896';
const RED = '#FF4D4F';

export default function Convert() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { notifications } = useNotifications();
    const [fromCoin, setFromCoin] = useState('');
    const [toCoin, setToCoin] = useState('');
    const [amount, setAmount] = useState('');
    const [showFromModal, setShowFromModal] = useState(false);
    const [showToModal, setShowToModal] = useState(false);
    const [conversionRate, setConversionRate] = useState(0);
    const [estimatedAmount, setEstimatedAmount] = useState('0.00');
    const [isLoading, setIsLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState('');
    const [showPerformanceModal, setShowPerformanceModal] = useState(false);
    const [performanceData, setPerformanceData] = useState(null);
    const [performanceLoading, setPerformanceLoading] = useState(false);
    const [showNoCoinModal, setShowNoCoinModal] = useState(false);

    // Animation values
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Pulse animation for the convert icon
        const pulseAnimation = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.1,
                    duration: 2000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 2000,
                    useNativeDriver: true,
                }),
            ])
        );
        pulseAnimation.start();
    }, []);


    // Coin list and prices come from the shared live market feed, so this
    // screen shows the same numbers as the rest of the app and does not hit
    // CoinGecko directly.
    const { coins: liveCoins, getCoin } = useMarketData();

    const popularCoins = (liveCoins.length > 0 ? liveCoins.slice(0, 20) : []).map(coin => ({
        symbol: coin.symbol,
        name: coin.name,
        price: `$${coin.priceLabel}`,
    }));

    // Fee and expiry returned alongside the quote.
    const [quoteFee, setQuoteFee] = useState(null);
    const [quoteError, setQuoteError] = useState('');

    // Calculate conversion rate and estimated amount
    useEffect(() => {
        if (fromCoin && toCoin && amount) {
            fetchConversionRate(fromCoin, toCoin, amount);
        }
    }, [fromCoin, toCoin, amount]);

    /**
     * Asks the backend to price the conversion.
     *
     * This used to derive a rate by dividing two CoinGecko spot prices, which
     * ignored the fee the backend actually charges - the figure on screen was
     * never what the user would receive. /convert/quote returns the real
     * output amount, the fee and an expiry.
     */
    const fetchConversionRate = async (from, to, value) => {
        const parsed = parseFloat(value);
        if (!from || !to || !Number.isFinite(parsed) || parsed <= 0) return;

        setIsLoading(true);
        setQuoteError('');
        try {
            const quote = await getConvertQuote(from, to, parsed);

            if (quote.success === false) {
                setQuoteError(quote.message || 'Could not price this conversion.');
                setEstimatedAmount('0.00');
                return;
            }

            setConversionRate(Number(quote.exchangeRate) || 0);
            setEstimatedAmount(Number(quote.toAmount).toFixed(6));
            setQuoteFee(quote.fee != null ? Number(quote.fee) : null);
            setLastUpdated(new Date().toLocaleTimeString());
        } catch (error) {
            setQuoteError(error.message || 'Could not reach the server for a quote.');
            setEstimatedAmount('0.00');
        } finally {
            setIsLoading(false);
        }
    };


    // Test conversion logic with known values

    // Show coin performance for the past month
    const showCoinPerformance = async (coinSymbol) => {
        if (!coinSymbol) {
            setShowNoCoinModal(true);
            return;
        }

        setPerformanceLoading(true);
        setShowPerformanceModal(true);

        try {
            // The backend stores its own price history, so the chart matches
            // the prices the rest of the app is quoting.
            const history = await getPriceHistory(coinSymbol, { days: 30 });

            const prices = (history || [])
                .map(point => ({
                    date: new Date(point.timestamp).toLocaleDateString(),
                    price: Number(point.price),
                }))
                .filter(p => Number.isFinite(p.price));

            if (prices.length === 0) {
                // A coin the backend has not recorded history for yet: show the
                // current price rather than inventing a trend.
                const coin = getCoin(coinSymbol);
                setPerformanceData({
                    symbol: coinSymbol,
                    currentPrice: coin?.price ?? 0,
                    startPrice: coin?.price ?? 0,
                    changePercent: 0,
                    changeAmount: 0,
                    prices: [],
                    empty: true,
                });
                return;
            }

            const currentPrice = prices[prices.length - 1].price;
            const startPrice = prices[0].price;
            const changeAmount = currentPrice - startPrice;
            const changePercent = startPrice > 0 ? (changeAmount / startPrice) * 100 : 0;

            setPerformanceData({
                symbol: coinSymbol,
                currentPrice,
                startPrice,
                changePercent,
                changeAmount,
                prices,
            });
        } catch (error) {
            // Previously this fell back to invented figures (a $50,000 price
            // and +11.11%). Surfacing the failure is more honest.
            setPerformanceData({
                symbol: coinSymbol,
                currentPrice: 0,
                startPrice: 0,
                changePercent: 0,
                changeAmount: 0,
                prices: [],
                error: error.message || 'Could not load price history.',
            });
        } finally {
            setPerformanceLoading(false);
        }
    };

    return (
        <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top + 10 }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.tradeButton}
                    onPress={() => showCoinPerformance(fromCoin)}
                >
                    <Ionicons name="analytics" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                {/* Description Box */}
                <View style={styles.descriptionBox}>
                    <Animated.View style={[styles.descriptionIcon, { transform: [{ scale: pulseAnim }] }]}>
                        <Feather name="repeat" size={24} color={GREEN} />
                    </Animated.View>
                    <View style={styles.descriptionContent}>
                        <Text style={styles.descriptionTitle}>Convert Crypto</Text>
                        <Text style={styles.descriptionText}>
                            Instantly convert between different cryptocurrencies with competitive rates.
                        </Text>
                    </View>
                </View>

                {/* From Coin Selection */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>From</Text>
                    <TouchableOpacity
                        style={styles.selector}
                        onPress={() => setShowFromModal(true)}
                    >
                        <View style={styles.selectorContent}>
                            {fromCoin ? (
                                <Text style={styles.selectorText}>{fromCoin}</Text>
                            ) : (
                                <Text style={styles.placeholderText}>Select coin</Text>
                            )}
                        </View>
                        <Ionicons name="chevron-down" size={20} color="#aaa" />
                    </TouchableOpacity>

                    {/* Amount Input */}
                    <View style={styles.amountContainer}>
                        <TextInput
                            style={styles.amountInput}
                            placeholder="0.00"
                            placeholderTextColor="#aaa"
                            value={amount}
                            onChangeText={setAmount}
                            keyboardType="numeric"
                            autoFocus={false}
                        />
                        <Text style={styles.currencyLabel}>{fromCoin || ''}</Text>
                    </View>
                </View>

                {/* Swap Icon */}
                <View style={styles.swapContainer}>
                    <TouchableOpacity
                        style={styles.swapButton}
                        onPress={() => {
                            const temp = fromCoin;
                            setFromCoin(toCoin);
                            setToCoin(temp);
                        }}
                    >
                        <Ionicons name="swap-vertical" size={24} color={GREEN} />
                    </TouchableOpacity>
                </View>

                {/* To Coin Selection */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>To</Text>
                    <TouchableOpacity
                        style={styles.selector}
                        onPress={() => setShowToModal(true)}
                    >
                        <View style={styles.selectorContent}>
                            {toCoin ? (
                                <Text style={styles.selectorText}>{toCoin}</Text>
                            ) : (
                                <Text style={styles.placeholderText}>Select coin</Text>
                            )}
                        </View>
                        <Ionicons name="chevron-down" size={20} color="#aaa" />
                    </TouchableOpacity>

                    {/* Estimated Amount */}
                    <View style={styles.estimatedContainer}>
                        <Text style={styles.estimatedLabel}>You will receive</Text>
                        {isLoading ? (
                            <Text style={styles.estimatedAmount}>Calculating...</Text>
                        ) : (
                            <Text style={styles.estimatedAmount}>{estimatedAmount}</Text>
                        )}
                        <Text style={styles.estimatedCurrency}>{toCoin || ''}</Text>
                    </View>
                </View>

                {/* Conversion Rate */}
                {fromCoin && toCoin && (
                    <View style={styles.rateContainer}>
                        <View style={styles.rateHeader}>
                            <Text style={styles.rateLabel}>Conversion Rate</Text>
                            <TouchableOpacity
                                style={styles.refreshButton}
                                onPress={() => fetchConversionRate(fromCoin, toCoin, amount)}
                                disabled={isLoading}
                            >
                                <Ionicons
                                    name="refresh"
                                    size={16}
                                    color={isLoading ? '#666' : GREEN}
                                />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.rateValue}>1 {fromCoin} = {Number(conversionRate).toFixed(6)} {toCoin}</Text>
                        {quoteFee != null && (
                            <Text style={styles.lastUpdated}>
                                Fee: {quoteFee.toFixed(8)} {toCoin}
                            </Text>
                        )}
                        {quoteError ? (
                            <Text style={[styles.lastUpdated, { color: '#FF6B6B' }]}>{quoteError}</Text>
                        ) : null}
                        {lastUpdated && (
                            <Text style={styles.lastUpdated}>Last updated: {lastUpdated}</Text>
                        )}
                    </View>
                )}


            </ScrollView>

            {/* From Coin Selection Modal */}
            {showFromModal && (
                <View style={styles.modalOverlay}>
                    <BlurView intensity={30} tint="dark" style={styles.modalBlur}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Select From Coin</Text>
                                <TouchableOpacity onPress={() => setShowFromModal(false)}>
                                    <Ionicons name="close" size={24} color="#aaa" />
                                </TouchableOpacity>
                            </View>
                            <ScrollView style={styles.modalList}>
                                {popularCoins.map((coin) => (
                                    <TouchableOpacity
                                        key={coin.symbol}
                                        style={styles.modalItem}
                                        onPress={() => {
                                            setFromCoin(coin.symbol);
                                            setShowFromModal(false);
                                        }}
                                    >
                                        <View style={styles.modalItemContent}>
                                            <Text style={styles.modalItemName}>{coin.symbol}</Text>
                                            <Text style={styles.modalItemSubtext}>{coin.name}</Text>
                                        </View>
                                        <Text style={styles.modalItemPrice}>{coin.price}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    </BlurView>
                </View>
            )}

            {/* To Coin Selection Modal */}
            {showToModal && (
                <View style={styles.modalOverlay}>
                    <BlurView intensity={30} tint="dark" style={styles.modalBlur}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Select To Coin</Text>
                                <TouchableOpacity onPress={() => setShowToModal(false)}>
                                    <Ionicons name="close" size={24} color="#aaa" />
                                </TouchableOpacity>
                            </View>
                            <ScrollView style={styles.modalList}>
                                {popularCoins.map((coin) => (
                                    <TouchableOpacity
                                        key={coin.symbol}
                                        style={styles.modalItem}
                                        onPress={() => {
                                            setToCoin(coin.symbol);
                                            setShowToModal(false);
                                        }}
                                    >
                                        <View style={styles.modalItemContent}>
                                            <Text style={styles.modalItemName}>{coin.symbol}</Text>
                                            <Text style={styles.modalItemSubtext}>{coin.name}</Text>
                                        </View>
                                        <Text style={styles.modalItemPrice}>{coin.price}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    </BlurView>
                </View>
            )}

            {/* Performance Modal */}
            {showPerformanceModal && (
                <View style={styles.modalOverlay}>
                    <BlurView intensity={30} tint="dark" style={styles.modalBlur}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>
                                    {performanceData?.symbol || 'Coin'} Performance (30 Days)
                                </Text>
                                <TouchableOpacity onPress={() => setShowPerformanceModal(false)}>
                                    <Ionicons name="close" size={24} color="#aaa" />
                                </TouchableOpacity>
                            </View>

                            {performanceLoading ? (
                                <View style={styles.performanceLoading}>
                                    <Text style={styles.loadingText}>Loading performance data...</Text>
                                </View>
                            ) : performanceData ? (
                                <ScrollView style={styles.performanceContent}>
                                    {/* Performance Summary */}
                                    <View style={styles.performanceSummary}>
                                        <View style={styles.performanceRow}>
                                            <Text style={styles.performanceLabel}>Current Price:</Text>
                                            <Text style={styles.performanceValue}>
                                                ${performanceData.currentPrice.toLocaleString('en-US', {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 6
                                                })}
                                            </Text>
                                        </View>
                                        <View style={styles.performanceRow}>
                                            <Text style={styles.performanceLabel}>30 Days Ago:</Text>
                                            <Text style={styles.performanceValue}>
                                                ${performanceData.startPrice.toLocaleString('en-US', {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 6
                                                })}
                                            </Text>
                                        </View>
                                        <View style={styles.performanceRow}>
                                            <Text style={styles.performanceLabel}>Change:</Text>
                                            <Text style={[
                                                styles.performanceValue,
                                                { color: performanceData.changePercent >= 0 ? GREEN : RED }
                                            ]}>
                                                {performanceData.changePercent >= 0 ? '+' : ''}{performanceData.changePercent.toFixed(2)}%
                                                ({performanceData.changeAmount >= 0 ? '+' : ''}${performanceData.changeAmount.toLocaleString('en-US', {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 6
                                                })})
                                            </Text>
                                        </View>
                                    </View>

                                    {/* Performance Graph */}
                                    {performanceData.prices.length > 0 && (
                                        <View style={styles.priceHistory}>
                                            <Text style={styles.priceHistoryTitle}>Price Performance (30 Days)</Text>
                                            <View style={styles.graphContainer}>
                                                {(() => {
                                                    const prices = performanceData.prices.map(p => p.price);
                                                    const minPrice = Math.min(...prices);
                                                    const maxPrice = Math.max(...prices);
                                                    const priceRange = maxPrice - minPrice;

                                                    return (
                                                        <>
                                                            <View style={styles.graph}>
                                                                {performanceData.prices.map((price, index) => {
                                                                    // Calculate relative position for the graph
                                                                    const relativePosition = priceRange > 0
                                                                        ? ((price.price - minPrice) / priceRange)
                                                                        : 0.5;

                                                                    const barHeight = Math.max(2, relativePosition * 60); // Minimum 2px height
                                                                    const barColor = price.price >= performanceData.startPrice ? GREEN : RED;

                                                                    return (
                                                                        <View key={index} style={styles.graphBarContainer}>
                                                                            <View
                                                                                style={[
                                                                                    styles.graphBar,
                                                                                    {
                                                                                        height: barHeight,
                                                                                        backgroundColor: barColor,
                                                                                        opacity: 0.8
                                                                                    }
                                                                                ]}
                                                                            />
                                                                        </View>
                                                                    );
                                                                })}
                                                            </View>
                                                            <View style={styles.graphLabels}>
                                                                <Text style={styles.graphLabel}>${minPrice.toLocaleString('en-US', {
                                                                    minimumFractionDigits: 2,
                                                                    maximumFractionDigits: 6
                                                                })}</Text>
                                                                <Text style={styles.graphLabel}>${maxPrice.toLocaleString('en-US', {
                                                                    minimumFractionDigits: 2,
                                                                    maximumFractionDigits: 6
                                                                })}</Text>
                                                            </View>
                                                        </>
                                                    );
                                                })()}
                                            </View>

                                            {/* Price History Table */}
                                            <View style={styles.priceTable}>
                                                <Text style={styles.priceTableTitle}>Recent Prices</Text>
                                                {performanceData.prices.slice(-7).map((price, index) => (
                                                    <View key={index} style={styles.priceRow}>
                                                        <Text style={styles.priceDate}>{price.date}</Text>
                                                        <Text style={styles.priceValue}>
                                                            ${price.price.toLocaleString('en-US', {
                                                                minimumFractionDigits: 2,
                                                                maximumFractionDigits: 6
                                                            })}
                                                        </Text>
                                                    </View>
                                                ))}
                                            </View>
                                        </View>
                                    )}
                                </ScrollView>
                            ) : (
                                <View style={styles.performanceError}>
                                    <Text style={styles.errorText}>Failed to load performance data</Text>
                                </View>
                            )}
                        </View>
                    </BlurView>
                </View>
            )}

            {/* No Coin Selected Modal */}
            {showNoCoinModal && (
                <View style={styles.modalOverlay}>
                    <BlurView intensity={30} tint="dark" style={styles.modalBlur}>
                        <View style={styles.noCoinModalContent}>
                            <View style={styles.noCoinModalHeader}>
                                <View style={styles.noCoinIconContainer}>
                                    <Ionicons name="alert-circle" size={32} color={RED} />
                                </View>
                                <Text style={styles.noCoinModalTitle}>No Coin Selected</Text>
                                <Text style={styles.noCoinModalText}>
                                    Please select a &quot;From&quot; coin first to view its performance data.
                                </Text>
                            </View>
                            <TouchableOpacity
                                style={styles.noCoinButton}
                                onPress={() => setShowNoCoinModal(false)}
                            >
                                <Text style={styles.noCoinButtonText}>OK</Text>
                            </TouchableOpacity>
                        </View>
                    </BlurView>
                </View>
            )}
        </SafeAreaView>
    );
} 