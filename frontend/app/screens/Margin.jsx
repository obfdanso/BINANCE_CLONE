import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { Animated } from 'react-native';
import styles from '../styles/Margin.styles';

const GREEN = '#00C896';
const RED = '#FF4D4F';
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function Margin() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const params = useLocalSearchParams();
    const [selectedPair, setSelectedPair] = useState(params.selectedPair || 'BTC/USDT');
    const [leverage, setLeverage] = useState('10x');
    const [amount, setAmount] = useState('');
    const [orderType, setOrderType] = useState('Market');
    const [showLeverageModal, setShowLeverageModal] = useState(false);
    const [showPairModal, setShowPairModal] = useState(false);
    const [showTransferModal, setShowTransferModal] = useState(false);
    const [stopLoss, setStopLoss] = useState('');
    const [takeProfit, setTakeProfit] = useState('');
    const [positionSize, setPositionSize] = useState('');
    const [dynamicTradingPairs, setDynamicTradingPairs] = useState(tradingPairs);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [tradeAction, setTradeAction] = useState('buy'); // 'buy' or 'sell'
    const [orderAmount, setOrderAmount] = useState('');
    const [orderPrice, setOrderPrice] = useState('');

    // Animated values for price changes
    const priceAnimation = useRef(new Animated.Value(0)).current;
    const changeAnimation = useRef(new Animated.Value(0)).current;

    const tradingPairs = [
        { symbol: 'BTC/USDT', price: '118,234.50', change: '+2.87%', volume: '4.5B', high: '118,500', low: '117,800' },
        { symbol: 'ETH/USDT', price: '3,678.90', change: '+1.87%', volume: '1.6B', high: '3,700', low: '3,650' },
        { symbol: 'BNB/USDT', price: '598.45', change: '-0.32%', volume: '950M', high: '600', low: '595' },
        { symbol: 'SOL/USDT', price: '142.30', change: '-2.15%', volume: '720M', high: '145', low: '140' },
        { symbol: 'ADA/USDT', price: '0.4321', change: '-1.45%', volume: '380M', high: '0.438', low: '0.428' },
        { symbol: 'XRP/USDT', price: '0.5123', change: '+0.65%', volume: '520M', high: '0.515', low: '0.508' },
        { symbol: 'DOT/USDT', price: '6.789', change: '+3.24%', volume: '310M', high: '6.82', low: '6.75' },
        { symbol: 'MATIC/USDT', price: '0.654', change: '-1.87%', volume: '480M', high: '0.658', low: '0.650' },
    ];

    const leverageOptions = ['1x', '2x', '5x', '10x', '20x', '50x', '100x'];

    // Mock price data for chart (BTC 24h data)
    const priceData = [
        { time: '00:00', price: 117500 },
        { time: '04:00', price: 117800 },
        { time: '08:00', price: 118000 },
        { time: '12:00', price: 118200 },
        { time: '16:00', price: 118150 },
        { time: '20:00', price: 118234 },
    ];

    // Simulate real-time price updates
    useEffect(() => {
        const interval = setInterval(() => {
            // Generate random prices within ranges for each pair
            const updatedPairs = tradingPairs.map(pair => {
                let newPrice, priceRange;

                switch (pair.symbol) {
                    case 'BTC/USDT':
                        priceRange = { min: 116000, max: 120999 };
                        newPrice = Math.random() * (priceRange.max - priceRange.min) + priceRange.min;
                        break;
                    case 'ETH/USDT':
                        priceRange = { min: 3600, max: 3800 };
                        newPrice = Math.random() * (priceRange.max - priceRange.min) + priceRange.min;
                        break;
                    case 'BNB/USDT':
                        priceRange = { min: 590, max: 610 };
                        newPrice = Math.random() * (priceRange.max - priceRange.min) + priceRange.min;
                        break;
                    case 'SOL/USDT':
                        priceRange = { min: 140, max: 150 };
                        newPrice = Math.random() * (priceRange.max - priceRange.min) + priceRange.min;
                        break;
                    case 'ADA/USDT':
                        priceRange = { min: 0.42, max: 0.45 };
                        newPrice = Math.random() * (priceRange.max - priceRange.min) + priceRange.min;
                        break;
                    case 'XRP/USDT':
                        priceRange = { min: 0.50, max: 0.53 };
                        newPrice = Math.random() * (priceRange.max - priceRange.min) + priceRange.min;
                        break;
                    case 'DOT/USDT':
                        priceRange = { min: 6.7, max: 6.9 };
                        newPrice = Math.random() * (priceRange.max - priceRange.min) + priceRange.min;
                        break;
                    case 'MATIC/USDT':
                        priceRange = { min: 0.64, max: 0.67 };
                        newPrice = Math.random() * (priceRange.max - priceRange.min) + priceRange.min;
                        break;
                    default:
                        newPrice = parseFloat(pair.price.replace(/,/g, ''));
                }

                // Calculate percentage change
                const oldPrice = parseFloat(pair.price.replace(/,/g, ''));
                const priceChange = ((newPrice - oldPrice) / oldPrice) * 100;

                return {
                    ...pair,
                    price: newPrice.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                    change: `${priceChange > 0 ? '+' : ''}${priceChange.toFixed(2)}%`,
                    high: (newPrice * 1.005).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                    low: (newPrice * 0.995).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                };
            });

            // Animate price change
            Animated.sequence([
                Animated.timing(priceAnimation, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(priceAnimation, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();

            // Update the trading pairs state
            setDynamicTradingPairs(updatedPairs);
        }, 1000); // Update every 1 second

        return () => clearInterval(interval);
    }, [selectedPair]);

    const handleLeverageChange = (newLeverage) => {
        setLeverage(newLeverage);
        setShowLeverageModal(false);
    };

    const handlePairSelect = (pair) => {
        setSelectedPair(pair.symbol);
        setShowPairModal(false);
    };

    const handleBuyPress = () => {
        setTradeAction('buy');
        setOrderPrice(currentPair.price);
        setShowOrderModal(true);
    };

    const handleSellPress = () => {
        setTradeAction('sell');
        setOrderPrice(currentPair.price);
        setShowOrderModal(true);
    };

    const handleOrderSubmit = () => {
        // Here you would typically submit the order to your backend
        console.log(`${tradeAction.toUpperCase()} Order:`, {
            pair: selectedPair,
            amount: orderAmount,
            price: orderPrice,
            leverage: leverage,
            stopLoss: stopLoss,
            takeProfit: takeProfit
        });

        // Show success message
        Alert.alert(
            'Order Submitted',
            `${tradeAction.toUpperCase()} order for ${orderAmount} ${selectedPair.split('/')[0]} at ${orderPrice} has been submitted.`,
            [
                {
                    text: 'OK',
                    onPress: () => {
                        setShowOrderModal(false);
                        setOrderAmount('');
                        setOrderPrice('');
                    }
                }
            ]
        );
    };

    // Get current pair data
    const getCurrentPairData = () => {
        if (!dynamicTradingPairs || dynamicTradingPairs.length === 0) {
            return tradingPairs.find(pair => pair.symbol === selectedPair) || tradingPairs[0];
        }
        return dynamicTradingPairs.find(pair => pair.symbol === selectedPair) || dynamicTradingPairs[0];
    };

    const currentPair = getCurrentPairData() || tradingPairs[0];

    const calculatePositionSize = () => {
        if (amount && leverage) {
            const leverageNum = parseInt(leverage.replace('x', ''));
            const positionValue = parseFloat(amount) * leverageNum;
            setPositionSize(positionValue.toFixed(2));
        }
    };

    useEffect(() => {
        calculatePositionSize();
    }, [amount, leverage]);

    // Responsive styles based on screen size
    const isTablet = screenWidth > 768;

    return (
        <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={[styles.header, isTablet && styles.headerTablet]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={20} color="#fff" />
                </TouchableOpacity>
            </View>

            <ScrollView
                style={[styles.container, isTablet && styles.containerTablet]}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={isTablet && styles.scrollContentTablet}
            >
                {/* Price Chart Section */}
                <View style={[styles.chartContainer, isTablet && styles.chartContainerTablet]}>
                    <View style={[styles.chartHeader, isTablet && styles.chartHeaderTablet]}>
                        <TouchableOpacity
                            style={styles.pairSelector}
                            onPress={() => setShowPairModal(true)}
                        >
                            <View style={styles.pairInfo}>
                                <Text style={[styles.pairSymbol, isTablet && styles.pairSymbolTablet]}>{selectedPair}</Text>
                                <Animated.Text
                                    style={[
                                        styles.pairPrice,
                                        isTablet && styles.pairPriceTablet,
                                        {
                                            transform: [{
                                                scale: priceAnimation.interpolate({
                                                    inputRange: [0, 1],
                                                    outputRange: [1, 1.02]
                                                })
                                            }],
                                            color: '#fff'
                                        }
                                    ]}
                                >
                                    ${currentPair.price}
                                </Animated.Text>
                            </View>
                            <Ionicons name="chevron-down" size={20} color="#aaa" />
                        </TouchableOpacity>
                        <View style={styles.priceChangeContainer}>
                            <Animated.Text
                                style={[
                                    styles.priceChange,
                                    currentPair.change.startsWith('+') ? styles.positiveChange : styles.negativeChange,
                                    isTablet && styles.priceChangeTablet,
                                    {
                                        transform: [{
                                            scale: changeAnimation.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [1, 1.05]
                                            })
                                        }]
                                    }
                                ]}
                            >
                                {currentPair.change}
                            </Animated.Text>
                            <Text style={styles.priceChangeLabel}>24h</Text>
                        </View>
                    </View>

                    {/* Simple Price Chart */}
                    <View style={[styles.chartArea, isTablet && styles.chartAreaTablet]}>
                        <View style={styles.chartLine}>
                            {priceData.map((point, index) => (
                                <View key={index} style={styles.chartPoint} />
                            ))}
                        </View>
                    </View>

                    <View style={[styles.priceStats, isTablet && styles.priceStatsTablet]}>
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>24h High</Text>
                            <Text style={styles.statValue}>${currentPair.high}</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>24h Low</Text>
                            <Text style={styles.statValue}>${currentPair.low}</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>24h Vol</Text>
                            <Text style={styles.statValue}>{currentPair.volume}</Text>
                        </View>
                    </View>
                </View>



                {/* Account Overview */}
                <View style={[styles.accountContainer, isTablet && styles.accountContainerTablet]}>
                    <View style={styles.accountHeader}>
                        <Text style={styles.sectionTitle}>Account Overview</Text>
                        <TouchableOpacity style={styles.refreshButton}>
                            <Ionicons name="refresh" size={16} color={GREEN} />
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.accountGrid, isTablet && styles.accountGridTablet]}>
                        <View style={styles.accountItem}>
                            <Text style={styles.accountLabel}>Available Balance</Text>
                            <Text style={styles.accountValue}>$1,250.00</Text>
                        </View>
                        <View style={styles.accountItem}>
                            <Text style={styles.accountLabel}>Used Margin</Text>
                            <Text style={styles.accountValue}>$0.00</Text>
                        </View>
                        <View style={styles.accountItem}>
                            <Text style={styles.accountLabel}>Free Margin</Text>
                            <Text style={styles.accountValue}>$1,250.00</Text>
                        </View>
                        <View style={styles.accountItem}>
                            <Text style={styles.accountLabel}>Margin Level</Text>
                            <Text style={styles.accountValue}>∞</Text>
                        </View>
                    </View>
                </View>

                {/* Position Calculator */}
                <View style={[styles.calculatorContainer, isTablet && styles.calculatorContainerTablet]}>
                    <Text style={styles.sectionTitle}>Position Calculator</Text>
                    <View style={styles.calculatorRow}>
                        <Text style={styles.calculatorLabel}>Position Size</Text>
                        <Text style={styles.calculatorValue}>{positionSize} USDT</Text>
                    </View>
                    <View style={styles.calculatorRow}>
                        <Text style={styles.calculatorLabel}>Leverage</Text>
                        <TouchableOpacity
                            style={styles.leverageButton}
                            onPress={() => setShowLeverageModal(true)}
                        >
                            <Text style={styles.leverageValue}>{leverage}</Text>
                            <Ionicons name="chevron-down" size={16} color="#aaa" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Trading Interface */}
                <View style={[styles.tradingContainer, isTablet && styles.tradingContainerTablet]}>
                    <Text style={styles.sectionTitle}>Trade</Text>

                    {/* Order Type */}
                    <View style={styles.orderTypeContainer}>
                        <TouchableOpacity
                            style={[styles.orderTypeButton, orderType === 'Market' && styles.orderTypeButtonActive]}
                            onPress={() => setOrderType('Market')}
                        >
                            <Text style={[styles.orderTypeText, orderType === 'Market' && styles.orderTypeTextActive]}>
                                Market
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.orderTypeButton, orderType === 'Limit' && styles.orderTypeButtonActive]}
                            onPress={() => setOrderType('Limit')}
                        >
                            <Text style={[styles.orderTypeText, orderType === 'Limit' && styles.orderTypeTextActive]}>
                                Limit
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Amount Input */}
                    <View style={styles.amountContainer}>
                        <Text style={styles.amountLabel}>Amount (USDT)</Text>
                        <TextInput
                            style={styles.amountInput}
                            placeholder="0.00"
                            placeholderTextColor="#666"
                            value={amount}
                            onChangeText={setAmount}
                            keyboardType="numeric"
                        />
                    </View>

                    {/* Risk Management */}
                    <View style={styles.riskContainer}>
                        <Text style={styles.riskTitle}>Risk Management</Text>
                        <View style={styles.riskRow}>
                            <Text style={styles.riskLabel}>Stop Loss</Text>
                            <TextInput
                                style={styles.riskInput}
                                placeholder="0.00"
                                placeholderTextColor="#666"
                                value={stopLoss}
                                onChangeText={setStopLoss}
                                keyboardType="numeric"
                            />
                        </View>
                        <View style={styles.riskRow}>
                            <Text style={styles.riskLabel}>Take Profit</Text>
                            <TextInput
                                style={styles.riskInput}
                                placeholder="0.00"
                                placeholderTextColor="#666"
                                value={takeProfit}
                                onChangeText={setTakeProfit}
                                keyboardType="numeric"
                            />
                        </View>
                    </View>

                    {/* Action Buttons */}
                    <View style={[styles.actionButtonsContainer, isTablet && styles.actionButtonsContainerTablet]}>
                        <TouchableOpacity
                            style={[styles.buyButton, isTablet && styles.buyButtonTablet]}
                            onPress={handleBuyPress}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="trending-up" size={20} color="#fff" style={{ marginRight: 8 }} />
                            <Text style={[styles.buyButtonText, isTablet && styles.buyButtonTextTablet]}>
                                Buy {selectedPair.split('/')[0]}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.sellButton, isTablet && styles.sellButtonTablet]}
                            onPress={handleSellPress}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="trending-down" size={20} color="#fff" style={{ marginRight: 8 }} />
                            <Text style={[styles.sellButtonText, isTablet && styles.sellButtonTextTablet]}>
                                Sell {selectedPair.split('/')[0]}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Open Positions */}
                <View style={[styles.positionsContainer, isTablet && styles.positionsContainerTablet]}>
                    <View style={styles.positionsHeader}>
                        <Text style={styles.sectionTitle}>Open Positions</Text>
                    </View>
                    <View style={styles.noPositionsContainer}>
                        <Ionicons name="document-outline" size={48} color="#666" />
                        <Text style={styles.noPositionsText}>No open positions</Text>
                        <Text style={styles.noPositionsSubtext}>Start trading to see your positions here</Text>
                    </View>
                </View>


            </ScrollView>

            {/* Leverage Modal */}
            {showLeverageModal && (
                <View style={styles.modalOverlay}>
                    <BlurView intensity={30} tint="dark" style={styles.modalBlur}>
                        <View style={[styles.modalContent, isTablet && styles.modalContentTablet]}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Select Leverage</Text>
                                <TouchableOpacity
                                    style={styles.closeButton}
                                    onPress={() => setShowLeverageModal(false)}
                                >
                                    <Ionicons name="close" size={24} color="#aaa" />
                                </TouchableOpacity>
                            </View>
                            <ScrollView style={styles.leverageList}>
                                {leverageOptions.map((option) => (
                                    <TouchableOpacity
                                        key={option}
                                        style={[
                                            styles.leverageItem,
                                            leverage === option && styles.leverageItemActive
                                        ]}
                                        onPress={() => handleLeverageChange(option)}
                                    >
                                        <Text style={[
                                            styles.leverageItemText,
                                            leverage === option && styles.leverageItemTextActive
                                        ]}>
                                            {option}
                                        </Text>
                                        {leverage === option && (
                                            <Ionicons name="checkmark" size={20} color={GREEN} />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    </BlurView>
                </View>
            )}

            {/* Trading Pair Modal */}
            {showPairModal && (
                <View style={styles.modalOverlay}>
                    <BlurView intensity={30} tint="dark" style={styles.modalBlur}>
                        <View style={[styles.modalContent, isTablet && styles.modalContentTablet]}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Select Trading Pair</Text>
                                <TouchableOpacity
                                    style={styles.closeButton}
                                    onPress={() => setShowPairModal(false)}
                                >
                                    <Ionicons name="close" size={24} color="#aaa" />
                                </TouchableOpacity>
                            </View>
                            <ScrollView style={styles.pairList}>
                                {(dynamicTradingPairs || tradingPairs).map((pair) => (
                                    <TouchableOpacity
                                        key={pair.symbol}
                                        style={[
                                            styles.pairItem,
                                            selectedPair === pair.symbol && styles.pairItemActive
                                        ]}
                                        onPress={() => handlePairSelect(pair)}
                                    >
                                        <View style={styles.pairItemInfo}>
                                            <Text style={styles.pairItemSymbol}>{pair.symbol}</Text>
                                            <Text style={styles.pairItemPrice}>${pair.price}</Text>
                                        </View>
                                        <View style={styles.pairItemStats}>
                                            <Text style={[
                                                styles.pairItemChange,
                                                pair.change.startsWith('+') ? styles.positiveChange : styles.negativeChange
                                            ]}>
                                                {pair.change}
                                            </Text>
                                            <Text style={styles.pairItemVolume}>Vol: {pair.volume}</Text>
                                        </View>
                                        {selectedPair === pair.symbol && (
                                            <Ionicons name="checkmark" size={20} color={GREEN} />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    </BlurView>
                </View>
            )}

            {/* Transfer Modal */}
            {showTransferModal && (
                <View style={styles.modalOverlay}>
                    <BlurView intensity={30} tint="dark" style={styles.modalBlur}>
                        <View style={[styles.modalContent, isTablet && styles.modalContentTablet]}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Transfer Funds</Text>
                                <TouchableOpacity
                                    style={styles.closeButton}
                                    onPress={() => setShowTransferModal(false)}
                                >
                                    <Ionicons name="close" size={24} color="#aaa" />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.transferOptions}>
                                <TouchableOpacity style={styles.transferOption}>
                                    <Ionicons name="arrow-up" size={24} color={GREEN} />
                                    <Text style={styles.transferOptionText}>Spot to Margin</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.transferOption}>
                                    <Ionicons name="arrow-down" size={24} color={RED} />
                                    <Text style={styles.transferOptionText}>Margin to Spot</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </BlurView>
                </View>
            )}

            {/* Order Modal */}
            {showOrderModal && (
                <View style={styles.modalOverlay}>
                    <BlurView intensity={30} tint="dark" style={styles.modalBlur}>
                        <View style={[styles.modalContent, isTablet && styles.modalContentTablet]}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>
                                    {tradeAction === 'buy' ? 'Buy' : 'Sell'} {selectedPair.split('/')[0]}
                                </Text>
                                <TouchableOpacity
                                    style={styles.closeButton}
                                    onPress={() => setShowOrderModal(false)}
                                >
                                    <Ionicons name="close" size={24} color="#aaa" />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.orderForm}>
                                <View style={styles.orderInputContainer}>
                                    <Text style={styles.orderInputLabel}>Amount ({selectedPair.split('/')[0]})</Text>
                                    <TextInput
                                        style={styles.orderInput}
                                        placeholder="0.00"
                                        placeholderTextColor="#666"
                                        value={orderAmount}
                                        onChangeText={setOrderAmount}
                                        keyboardType="numeric"
                                    />
                                </View>

                                <View style={styles.orderInputContainer}>
                                    <Text style={styles.orderInputLabel}>Price (USDT)</Text>
                                    <TextInput
                                        style={styles.orderInput}
                                        placeholder="0.00"
                                        placeholderTextColor="#666"
                                        value={orderPrice}
                                        onChangeText={setOrderPrice}
                                        keyboardType="numeric"
                                    />
                                </View>

                                <View style={styles.orderSummary}>
                                    <Text style={styles.orderSummaryLabel}>Order Summary</Text>
                                    <View style={styles.orderSummaryRow}>
                                        <Text style={styles.orderSummaryText}>Pair:</Text>
                                        <Text style={styles.orderSummaryValue}>{selectedPair}</Text>
                                    </View>
                                    <View style={styles.orderSummaryRow}>
                                        <Text style={styles.orderSummaryText}>Leverage:</Text>
                                        <Text style={styles.orderSummaryValue}>{leverage}</Text>
                                    </View>
                                    <View style={styles.orderSummaryRow}>
                                        <Text style={styles.orderSummaryText}>Action:</Text>
                                        <Text style={[styles.orderSummaryValue, { color: tradeAction === 'buy' ? GREEN : RED }]}>
                                            {tradeAction.toUpperCase()}
                                        </Text>
                                    </View>
                                </View>

                                <TouchableOpacity
                                    style={[
                                        styles.submitOrderButton,
                                        { backgroundColor: tradeAction === 'buy' ? GREEN : RED }
                                    ]}
                                    onPress={handleOrderSubmit}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.submitOrderButtonText}>
                                        {tradeAction === 'buy' ? 'Buy' : 'Sell'} {selectedPair.split('/')[0]}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </BlurView>
                </View>
            )}
        </SafeAreaView>
    );
} 