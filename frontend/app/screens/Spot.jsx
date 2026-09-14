import React, { useState, useEffect } from 'react';
import { useMarketData } from '../../contexts/MarketDataContext';
import { getTradingPairs } from '../../services/tradingService';
import {
    View,
    Text,
    SafeAreaView,
    StatusBar,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Dimensions,
    Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from '../styles/Spot.styles';


export default function Spot() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [selectedPair, setSelectedPair] = useState('BTCUSDT');
    const [orderType, setOrderType] = useState('Market');
    const [side, setSide] = useState('Buy');
    const [amount, setAmount] = useState('');
    const [price, setPrice] = useState('62000');
    const [showPairModal, setShowPairModal] = useState(false);
    const [showOrderTypeModal, setShowOrderTypeModal] = useState(false);

    // Trading pairs data
    /**
     * Pairs come from the backend, which is the list orders can actually be
     * placed against. The fixed six here included SOL, ADA and DOT, none of
     * which the backend trades, while omitting the BTC/GHS and ETH/GHS pairs
     * it does.
     */
    const { getCoin } = useMarketData();
    const [pairs, setPairs] = useState([]);
    const [pairsError, setPairsError] = useState('');

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const data = await getTradingPairs();
                if (!cancelled) { setPairs(Array.isArray(data) ? data : []); setPairsError(''); }
            } catch (error) {
                if (!cancelled) setPairsError(error.message || 'Could not load trading pairs.');
            }
        })();
        return () => { cancelled = true; };
    }, []);

    const tradingPairs = pairs.map(p => {
        const coin = getCoin(p.baseAsset);
        return {
            symbol: p.symbol,
            name: coin?.name || p.baseAsset,
            price: coin?.price ?? 0,
            change: coin ? Number(coin.change24h) : 0,
            volume: coin?.volume24h ?? '-',
        };
    });

    const orderTypes = ['Market', 'Limit', 'Stop-limit', 'OCO'];

    // Get current pair data
    const currentPair = tradingPairs.find(pair => pair.symbol === selectedPair) || tradingPairs[0];

    // Update price when pair changes
    useEffect(() => {
        setPrice(currentPair.price.toString());
    }, [selectedPair]);

    const handlePairSelect = (symbol) => {
        setSelectedPair(symbol);
        setShowPairModal(false);
    };

    const handleOrderTypeSelect = (type) => {
        setOrderType(type);
        setShowOrderTypeModal(false);
    };

    const handlePlaceOrder = () => {
        // Navigate to order confirmation or execute order
        router.push({
            pathname: '/screens/PreviewOrder',
            params: {
                mode: 'Spot',
                side: side,
                pair: selectedPair,
                orderType: orderType,
                amount: amount,
                price: price
            }
        });
    };

    const formatPrice = (price) => {
        if (price >= 1000) {
            return price.toLocaleString();
        }
        return price.toString();
    };

    const formatChange = (change) => {
        const isPositive = change >= 0;
        return `${isPositive ? '+' : ''}${change.toFixed(2)}%`;
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0A0F1E" />

            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>
            </View>

            {/* Trading Pair Selector */}
            <View style={styles.pairSelector}>
                <TouchableOpacity
                    style={styles.pairButton}
                    onPress={() => setShowPairModal(true)}
                >
                    <View style={styles.pairInfo}>
                        <Text style={styles.pairSymbol}>{selectedPair}</Text>
                        <Text style={styles.pairName}>{currentPair.name}</Text>
                    </View>
                    <View style={styles.pairPrice}>
                        <Text style={styles.priceText}>${formatPrice(currentPair.price)}</Text>
                        <Text style={[
                            styles.changeText,
                            { color: currentPair.change >= 0 ? '#00C896' : '#FF4D4F' }
                        ]}>
                            {formatChange(currentPair.change)}
                        </Text>
                    </View>
                    <Ionicons name="chevron-down" size={20} color="#CCCCCC" />
                </TouchableOpacity>
            </View>

            {/* Buy/Sell Toggle */}
            <View style={styles.toggleSection}>
                <View style={styles.toggleContainer}>
                    <TouchableOpacity
                        style={[
                            styles.toggleButton,
                            side === 'Buy' && styles.buyToggleButton
                        ]}
                        onPress={() => setSide('Buy')}
                    >
                        <Text style={[
                            styles.toggleText,
                            side === 'Buy' && styles.buyToggleText
                        ]}>
                            Buy
                        </Text>
                        {side === 'Buy' && (
                            <View style={styles.activeIndicator} />
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.toggleButton,
                            side === 'Sell' && styles.sellToggleButton
                        ]}
                        onPress={() => setSide('Sell')}
                    >
                        <Text style={[
                            styles.toggleText,
                            side === 'Sell' && styles.sellToggleText
                        ]}>
                            Sell
                        </Text>
                        {side === 'Sell' && (
                            <View style={styles.activeIndicator} />
                        )}
                    </TouchableOpacity>
                </View>
            </View>

            {/* Order Form */}
            <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                {/* Order Type */}
                <View style={styles.formSection}>
                    <Text style={styles.sectionLabel}>Order Type</Text>
                    <TouchableOpacity
                        style={styles.orderTypeButton}
                        onPress={() => setShowOrderTypeModal(true)}
                    >
                        <Text style={styles.orderTypeText}>{orderType}</Text>
                        <Ionicons name="chevron-down" size={16} color="#CCCCCC" />
                    </TouchableOpacity>
                </View>

                {/* Price Input (for Limit orders) */}
                {orderType === 'Limit' && (
                    <View style={styles.formSection}>
                        <Text style={styles.sectionLabel}>Price</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.inputField}
                                value={price}
                                onChangeText={setPrice}
                                keyboardType="numeric"
                                placeholder="0.00"
                                placeholderTextColor="#666666"
                            />
                            <Text style={styles.inputSuffix}>USDT</Text>
                        </View>
                    </View>
                )}

                {/* Amount Input */}
                <View style={styles.formSection}>
                    <Text style={styles.sectionLabel}>Amount</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.inputField}
                            value={amount}
                            onChangeText={setAmount}
                            keyboardType="numeric"
                            placeholder="0.00"
                            placeholderTextColor="#666666"
                        />
                        <Text style={styles.inputSuffix}>{selectedPair.replace('USDT', '')}</Text>
                    </View>
                    <View style={styles.amountOptions}>
                        <TouchableOpacity style={styles.amountOption}>
                            <Text style={styles.amountOptionText}>25%</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.amountOption}>
                            <Text style={styles.amountOptionText}>50%</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.amountOption}>
                            <Text style={styles.amountOptionText}>75%</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.amountOption}>
                            <Text style={styles.amountOptionText}>100%</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Total */}
                <View style={styles.formSection}>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.totalValue}>
                            {amount && price ? (parseFloat(amount) * parseFloat(price)).toFixed(2) : '0.00'} USDT
                        </Text>
                    </View>
                </View>

                {/* Available Balance */}
                <View style={styles.formSection}>
                    <View style={styles.balanceRow}>
                        <Text style={styles.balanceLabel}>Available</Text>
                        <Text style={styles.balanceValue}>
                            {side === 'Buy' ? '0.00 USDT' : `0.00 ${selectedPair.replace('USDT', '')}`}
                        </Text>
                    </View>
                </View>

                {/* Place Order Button */}
                <TouchableOpacity
                    style={[
                        styles.placeOrderButton,
                        side === 'Buy' ? styles.buyButton : styles.sellButton
                    ]}
                    onPress={handlePlaceOrder}
                >
                    <Text style={styles.placeOrderText}>
                        {side} {selectedPair.replace('USDT', '')}
                    </Text>
                </TouchableOpacity>

                {/* Market Info */}
                <View style={styles.marketInfoSection}>
                    <Text style={styles.marketInfoTitle}>Market Info</Text>
                    <View style={styles.marketInfoGrid}>
                        <View style={styles.marketInfoItem}>
                            <Text style={styles.marketInfoLabel}>24h Change</Text>
                            <Text style={[
                                styles.marketInfoValue,
                                { color: currentPair.change >= 0 ? '#00C896' : '#FF4D4F' }
                            ]}>
                                {formatChange(currentPair.change)}
                            </Text>
                        </View>
                        <View style={styles.marketInfoItem}>
                            <Text style={styles.marketInfoLabel}>24h Volume</Text>
                            <Text style={styles.marketInfoValue}>{currentPair.volume}</Text>
                        </View>
                        <View style={styles.marketInfoItem}>
                            <Text style={styles.marketInfoLabel}>24h High</Text>
                            <Text style={styles.marketInfoValue}>${formatPrice(currentPair.price * 1.02)}</Text>
                        </View>
                        <View style={styles.marketInfoItem}>
                            <Text style={styles.marketInfoLabel}>24h Low</Text>
                            <Text style={styles.marketInfoValue}>${formatPrice(currentPair.price * 0.98)}</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Trading Pair Modal */}
            <Modal
                visible={showPairModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowPairModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <BlurView intensity={30} tint="dark" style={styles.modalBlur}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Select Trading Pair</Text>
                                <TouchableOpacity onPress={() => setShowPairModal(false)}>
                                    <Ionicons name="close" size={24} color="#FFFFFF" />
                                </TouchableOpacity>
                            </View>
                            <ScrollView style={styles.modalScroll}>
                                {tradingPairs.map((pair) => (
                                    <TouchableOpacity
                                        key={pair.symbol}
                                        style={[
                                            styles.pairOption,
                                            selectedPair === pair.symbol && styles.pairOptionSelected
                                        ]}
                                        onPress={() => handlePairSelect(pair.symbol)}
                                    >
                                        <View style={styles.pairOptionInfo}>
                                            <Text style={styles.pairOptionSymbol}>{pair.symbol}</Text>
                                            <Text style={styles.pairOptionName}>{pair.name}</Text>
                                        </View>
                                        <View style={styles.pairOptionPrice}>
                                            <Text style={styles.pairOptionPriceText}>
                                                ${formatPrice(pair.price)}
                                            </Text>
                                            <Text style={[
                                                styles.pairOptionChange,
                                                { color: pair.change >= 0 ? '#00C896' : '#FF4D4F' }
                                            ]}>
                                                {formatChange(pair.change)}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    </BlurView>
                </View>
            </Modal>

            {/* Order Type Modal */}
            <Modal
                visible={showOrderTypeModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowOrderTypeModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <BlurView intensity={30} tint="dark" style={styles.modalBlur}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Select Order Type</Text>
                                <TouchableOpacity onPress={() => setShowOrderTypeModal(false)}>
                                    <Ionicons name="close" size={24} color="#FFFFFF" />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.modalScroll}>
                                {orderTypes.map((type) => (
                                    <TouchableOpacity
                                        key={type}
                                        style={[
                                            styles.orderTypeOption,
                                            orderType === type && styles.orderTypeOptionSelected
                                        ]}
                                        onPress={() => handleOrderTypeSelect(type)}
                                    >
                                        <Text style={[
                                            styles.orderTypeOptionText,
                                            orderType === type && styles.orderTypeOptionTextSelected
                                        ]}>
                                            {type}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </BlurView>
                </View>
            </Modal>
        </SafeAreaView>
    );
} 