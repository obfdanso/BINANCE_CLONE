import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Animated, ActivityIndicator } from 'react-native';
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { usePortfolio } from '../../contexts/PortfolioContext';
import { getUserTrades } from '../../services/tradingService';
import styles from '../styles/WalletDashboard.styles';

const GREEN = '#00C896';

export default function WalletDashboard() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    // Balances and history come from the backend rather than the copy this
    // device happened to save in AsyncStorage.
    const {
        holdings,
        totalValue,
        currency: portfolioCurrency,
        loading: portfolioLoading,
        error: portfolioError,
        refresh: refreshPortfolio,
    } = usePortfolio();

    const [trades, setTrades] = useState([]);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const data = await getUserTrades();
                if (!cancelled) setTrades(Array.isArray(data) ? data : []);
            } catch {
                // The wallet still shows balances if history cannot be loaded.
                if (!cancelled) setTrades([]);
            }
        })();
        return () => { cancelled = true; };
    }, []);

    const balance = totalValue;

    const assets = holdings.map(h => ({
        symbol: h.asset,
        name: h.asset,
        amount: h.amount,
        value: h.value,
    }));

    const transactions = trades.map(t => ({
        id: t.id,
        type: t.side || t.type || 'TRADE',
        amount: Number(t.quantity) || 0,
        symbol: t.symbol || '',
        date: t.executedAt || t.createdAt || null,
        status: t.status || 'COMPLETED',
    }));
    const [activeTab, setActiveTab] = useState('Wallet');
    const [isBalanceVisible, setIsBalanceVisible] = useState(true);
    const [selectedCrypto, setSelectedCrypto] = useState('BTC');
    const [selectedTimeframe, setSelectedTimeframe] = useState('1D');

    // Animation for balance card
    const balanceAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(balanceAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true
        }).start();
    }, []);

    const formatBalance = (amount) => {
        const n = Number(amount) || 0;
        // BTC and ETH are not ISO currency codes, so Intl cannot format them.
        if (portfolioCurrency === 'BTC') return `${n.toFixed(8)} BTC`;
        if (portfolioCurrency === 'ETH') return `${n.toFixed(6)} ETH`;
        if (portfolioCurrency === 'USDT') return `${n.toFixed(2)} USDT`;
        try {
            return new Intl.NumberFormat(portfolioCurrency === 'GHS' ? 'en-GH' : 'en-US', {
                style: 'currency',
                currency: portfolioCurrency,
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(n);
        } catch {
            return `${n.toFixed(2)} ${portfolioCurrency}`;
        }
    };


    /**
     * Holding values come back priced in USD, so the USD total is their sum.
     * This previously multiplied the cedi balance by a hardcoded 0.065, which
     * disagreed with the backend's own rate of roughly 0.096 and understated
     * the figure by about a third.
     */
    const formatUSDEquivalent = () => {
        const usdTotal = holdings.reduce((sum, h) => sum + h.value, 0);
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(usdTotal);
    };

    const formatTransactionTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInHours = (now - date) / (1000 * 60 * 60);

        if (diffInHours < 1) {
            return 'Just now';
        } else if (diffInHours < 24) {
            return `${Math.floor(diffInHours)}h ago`;
        } else {
            return date.toLocaleDateString();
        }
    };

    const getTransactionIcon = (type) => {
        switch (type) {
            case 'deposit':
                return 'arrow-down-circle';
            case 'send':
                return 'arrow-up-circle';
            default:
                return 'swap-horizontal';
        }
    };

    const getTransactionColor = (type, amount) => {
        if (type === 'deposit' || amount > 0) {
            return GREEN;
        } else {
            return '#FF6B6B';
        }
    };

    return (
        <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerCenter}>
                    <View style={{ flexDirection: 'row', backgroundColor: '#1A1F2E', borderRadius: 16, padding: 2 }}>
                        <TouchableOpacity
                            style={{ backgroundColor: activeTab === 'Exchange' ? '#232834' : 'transparent', borderRadius: 14, paddingHorizontal: 18, paddingVertical: 6, marginRight: 2 }}
                            onPress={() => router.push('/(tabs)')}
                        >
                            <Text style={{ color: activeTab === 'Exchange' ? '#fff' : '#aaa', fontWeight: 'bold', fontSize: 15 }}>Exchange</Text>
                            {activeTab === 'Exchange' && (
                                <View style={{ alignSelf: 'center', width: 16, height: 2, backgroundColor: GREEN, marginTop: 2, borderRadius: 1 }} />
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ backgroundColor: activeTab === 'Wallet' ? '#232834' : 'transparent', borderRadius: 14, paddingHorizontal: 18, paddingVertical: 6 }}
                            onPress={() => setActiveTab('Wallet')}
                        >
                            <Text style={{ color: activeTab === 'Wallet' ? '#fff' : '#aaa', fontWeight: 'bold', fontSize: 15 }}>Wallet</Text>
                            {activeTab === 'Wallet' && (
                                <View style={{ alignSelf: 'center', width: 16, height: 2, backgroundColor: GREEN, marginTop: 2, borderRadius: 1 }} />
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.headerRight}>
                    <TouchableOpacity
                        style={styles.notificationButton}
                        onPress={() => router.push('/screens/WalletSettings')}
                    >
                        <Ionicons name="settings-outline" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.contentWrapper}>

                <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                    {/* Balance Overview */}
                    <Animated.View
                        style={[
                            styles.balanceCard,
                            {
                                opacity: balanceAnim,
                                transform: [{
                                    translateY: balanceAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [20, 0]
                                    })
                                }]
                            }
                        ]}
                    >
                        <View style={styles.balanceHeader}>
                            <Text style={styles.balanceLabel}>Total Balance</Text>
                            <TouchableOpacity
                                style={styles.eyeButton}
                                onPress={() => setIsBalanceVisible(!isBalanceVisible)}
                            >
                                <Ionicons
                                    name={isBalanceVisible ? "eye-off-outline" : "eye-outline"}
                                    size={20}
                                    color="#666"
                                />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.balanceAmount}>
                            {isBalanceVisible ? formatBalance(balance) : '****'}
                        </Text>
                        <Text style={styles.balanceChange}>
                            {isBalanceVisible ? `${formatUSDEquivalent()} (USD)` : '****'}
                        </Text>
                    </Animated.View>

                    {/* Quick Actions */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 16, marginBottom: 18 }}>
                        {[
                            { icon: 'download', label: 'Deposit', iconType: 'Feather', onPress: () => router.push('/screens/GhsDeposit') },
                            { icon: 'arrow-up-circle-outline', label: 'Send', iconType: 'Ionicons', onPress: () => router.push('/screens/Send') },
                            { icon: 'trending-up', label: 'Earn', iconType: 'MaterialIcons', onPress: () => router.push('/screens/Earn') },
                        ].map((item, idx) => (
                            <TouchableOpacity key={idx} style={{ alignItems: 'center', flex: 1 }} onPress={item.onPress} activeOpacity={0.7}>
                                <View style={{ backgroundColor: '#1A1F2E', borderRadius: 32, padding: 16, marginBottom: 6, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' }}>
                                    {item.iconType === 'MaterialIcons' ? (
                                        <MaterialIcons name={item.icon} size={24} style={{ color: GREEN }} />
                                    ) : item.iconType === 'Ionicons' ? (
                                        <Ionicons name={item.icon} size={24} style={{ color: GREEN }} />
                                    ) : (
                                        <Feather name={item.icon} size={24} style={{ color: GREEN }} />
                                    )}
                                </View>
                                <Text style={{ color: '#aaa', fontSize: 12, textAlign: 'center' }}>{item.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Market Overview */}
                    <View style={styles.marketSection}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Market Overview</Text>
                        </View>

                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cryptoScroll}>
                            {[
                                { symbol: 'BTC', name: 'Bitcoin', price: '$118,068', change: '-0.33%', icon: 'bitcoin', color: '#F7931A' },
                                { symbol: 'ETH', name: 'Ethereum', price: '$3,786.98', change: '-0.52%', icon: 'ethereum', color: '#627EEA' },
                                { symbol: 'BNB', name: 'BNB', price: '$835.51', change: '+4.77%', icon: 'binance', color: '#F3BA2F' },
                                { symbol: 'ADA', name: 'Cardano', price: '$0.804', change: '-1.73%', icon: 'cardano', color: '#0033AD' },
                            ].map((crypto, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.cryptoCard,
                                        selectedCrypto === crypto.symbol && styles.selectedCryptoCard
                                    ]}
                                    activeOpacity={0.8}
                                    onPress={() => setSelectedCrypto(crypto.symbol)}
                                >
                                    <LinearGradient
                                        colors={[crypto.color + '20', 'transparent']}
                                        style={styles.cryptoGradient}
                                    >
                                        <View style={styles.cryptoHeader}>
                                            <Text style={styles.cryptoSymbol}>{crypto.symbol}</Text>
                                        </View>
                                        <Text style={styles.cryptoName}>{crypto.name}</Text>
                                        <Text style={styles.cryptoPrice}>{crypto.price}</Text>
                                        <View style={[
                                            styles.cryptoChange,
                                            { backgroundColor: crypto.change.startsWith('+') ? GREEN + '20' : '#FF6B6B20' }
                                        ]}>
                                            <Text style={[
                                                styles.cryptoChangeText,
                                                { color: crypto.change.startsWith('+') ? GREEN : '#FF6B6B' }
                                            ]}>
                                                {crypto.change}
                                            </Text>
                                        </View>
                                    </LinearGradient>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Performance Chart */}
                    <View style={styles.chartSection}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>{selectedCrypto} Performance</Text>
                            <View style={styles.timeFilter}>
                                <TouchableOpacity
                                    style={[
                                        styles.timeButton,
                                        selectedTimeframe === '1D' && styles.activeTimeButton
                                    ]}
                                    onPress={() => setSelectedTimeframe('1D')}
                                >
                                    <Text style={selectedTimeframe === '1D' ? styles.activeTimeText : styles.timeText}>1D</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        styles.timeButton,
                                        selectedTimeframe === '1W' && styles.activeTimeButton
                                    ]}
                                    onPress={() => setSelectedTimeframe('1W')}
                                >
                                    <Text style={selectedTimeframe === '1W' ? styles.activeTimeText : styles.timeText}>1W</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        styles.timeButton,
                                        selectedTimeframe === '1M' && styles.activeTimeButton
                                    ]}
                                    onPress={() => setSelectedTimeframe('1M')}
                                >
                                    <Text style={selectedTimeframe === '1M' ? styles.activeTimeText : styles.timeText}>1M</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        styles.timeButton,
                                        selectedTimeframe === '1Y' && styles.activeTimeButton
                                    ]}
                                    onPress={() => setSelectedTimeframe('1Y')}
                                >
                                    <Text style={selectedTimeframe === '1Y' ? styles.activeTimeText : styles.timeText}>1Y</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.chartContainer}>
                            <View style={styles.chartContent}>
                                <View style={styles.chartHeader}>
                                    <Text style={styles.chartTitle}>{selectedCrypto} Performance</Text>
                                    <Text style={styles.chartPrice}>
                                        {selectedCrypto === 'BTC' && '$118,068'}
                                        {selectedCrypto === 'ETH' && '$3,786.98'}
                                        {selectedCrypto === 'BNB' && '$835.51'}
                                        {selectedCrypto === 'ADA' && '$0.804'}
                                    </Text>
                                </View>

                                {/* Candlestick Chart */}
                                <View style={styles.chartArea}>
                                    <View style={styles.candlestickContainer}>
                                        {selectedCrypto === 'BTC' && selectedTimeframe === '1D' && (
                                            <>
                                                <View style={[styles.candlestick, { left: '8%', top: '65%', height: '25%', backgroundColor: '#FF6B6B' }]}>
                                                    <View style={[styles.wick, { height: '8%', backgroundColor: '#FF6B6B' }]} />
                                                    <View style={[styles.body, { height: '17%', backgroundColor: '#FF6B6B' }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '20%', top: '45%', height: '35%', backgroundColor: '#FF6B6B' }]}>
                                                    <View style={[styles.wick, { height: '12%', backgroundColor: '#FF6B6B' }]} />
                                                    <View style={[styles.body, { height: '23%', backgroundColor: '#FF6B6B' }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '32%', top: '25%', height: '45%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '15%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '30%', backgroundColor: GREEN }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '44%', top: '35%', height: '35%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '10%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '25%', backgroundColor: GREEN }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '56%', top: '50%', height: '30%', backgroundColor: '#FF6B6B' }]}>
                                                    <View style={[styles.wick, { height: '8%', backgroundColor: '#FF6B6B' }]} />
                                                    <View style={[styles.body, { height: '22%', backgroundColor: '#FF6B6B' }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '68%', top: '60%', height: '25%', backgroundColor: '#FF6B6B' }]}>
                                                    <View style={[styles.wick, { height: '6%', backgroundColor: '#FF6B6B' }]} />
                                                    <View style={[styles.body, { height: '19%', backgroundColor: '#FF6B6B' }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '80%', top: '70%', height: '20%', backgroundColor: '#FF6B6B' }]}>
                                                    <View style={[styles.wick, { height: '5%', backgroundColor: '#FF6B6B' }]} />
                                                    <View style={[styles.body, { height: '15%', backgroundColor: '#FF6B6B' }]} />
                                                </View>
                                            </>
                                        )}

                                        {selectedCrypto === 'BTC' && selectedTimeframe === '1W' && (
                                            <>
                                                <View style={[styles.candlestick, { left: '10%', top: '60%', height: '30%', backgroundColor: '#FF6B6B' }]}>
                                                    <View style={[styles.wick, { height: '10%', backgroundColor: '#FF6B6B' }]} />
                                                    <View style={[styles.body, { height: '20%', backgroundColor: '#FF6B6B' }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '25%', top: '40%', height: '40%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '12%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '28%', backgroundColor: GREEN }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '40%', top: '30%', height: '35%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '8%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '27%', backgroundColor: GREEN }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '55%', top: '45%', height: '30%', backgroundColor: '#FF6B6B' }]}>
                                                    <View style={[styles.wick, { height: '6%', backgroundColor: '#FF6B6B' }]} />
                                                    <View style={[styles.body, { height: '24%', backgroundColor: '#FF6B6B' }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '70%', top: '55%', height: '25%', backgroundColor: '#FF6B6B' }]}>
                                                    <View style={[styles.wick, { height: '5%', backgroundColor: '#FF6B6B' }]} />
                                                    <View style={[styles.body, { height: '20%', backgroundColor: '#FF6B6B' }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '85%', top: '65%', height: '20%', backgroundColor: '#FF6B6B' }]}>
                                                    <View style={[styles.wick, { height: '4%', backgroundColor: '#FF6B6B' }]} />
                                                    <View style={[styles.body, { height: '16%', backgroundColor: '#FF6B6B' }]} />
                                                </View>
                                            </>
                                        )}

                                        {selectedCrypto === 'BTC' && selectedTimeframe === '1M' && (
                                            <>
                                                <View style={[styles.candlestick, { left: '8%', top: '70%', height: '20%', backgroundColor: '#FF6B6B' }]}>
                                                    <View style={[styles.wick, { height: '6%', backgroundColor: '#FF6B6B' }]} />
                                                    <View style={[styles.body, { height: '14%', backgroundColor: '#FF6B6B' }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '20%', top: '50%', height: '35%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '10%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '25%', backgroundColor: GREEN }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '32%', top: '25%', height: '50%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '15%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '35%', backgroundColor: GREEN }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '44%', top: '15%', height: '60%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '18%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '42%', backgroundColor: GREEN }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '56%', top: '20%', height: '55%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '12%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '43%', backgroundColor: GREEN }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '68%', top: '30%', height: '45%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '8%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '37%', backgroundColor: GREEN }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '80%', top: '40%', height: '35%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '6%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '29%', backgroundColor: GREEN }]} />
                                                </View>
                                            </>
                                        )}

                                        {selectedCrypto === 'BTC' && selectedTimeframe === '1Y' && (
                                            <>
                                                <View style={[styles.candlestick, { left: '5%', top: '80%', height: '15%', backgroundColor: '#FF6B6B' }]}>
                                                    <View style={[styles.wick, { height: '4%', backgroundColor: '#FF6B6B' }]} />
                                                    <View style={[styles.body, { height: '11%', backgroundColor: '#FF6B6B' }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '15%', top: '60%', height: '25%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '8%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '17%', backgroundColor: GREEN }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '25%', top: '40%', height: '35%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '10%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '25%', backgroundColor: GREEN }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '35%', top: '20%', height: '45%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '12%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '33%', backgroundColor: GREEN }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '45%', top: '10%', height: '55%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '15%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '40%', backgroundColor: GREEN }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '55%', top: '5%', height: '60%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '18%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '42%', backgroundColor: GREEN }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '65%', top: '8%', height: '58%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '16%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '42%', backgroundColor: GREEN }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '75%', top: '15%', height: '50%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '12%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '38%', backgroundColor: GREEN }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '85%', top: '25%', height: '40%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '8%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '32%', backgroundColor: GREEN }]} />
                                                </View>
                                            </>
                                        )}
                                        {selectedCrypto === 'ETH' && selectedTimeframe === '1D' && (
                                            <>
                                                <View style={[styles.candlestick, { left: '8%', top: '55%', height: '30%', backgroundColor: '#FF6B6B' }]}>
                                                    <View style={[styles.wick, { height: '10%', backgroundColor: '#FF6B6B' }]} />
                                                    <View style={[styles.body, { height: '20%', backgroundColor: '#FF6B6B' }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '20%', top: '35%', height: '40%', backgroundColor: '#FF6B6B' }]}>
                                                    <View style={[styles.wick, { height: '12%', backgroundColor: '#FF6B6B' }]} />
                                                    <View style={[styles.body, { height: '28%', backgroundColor: '#FF6B6B' }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '32%', top: '20%', height: '50%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '15%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '35%', backgroundColor: GREEN }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '44%', top: '40%', height: '35%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '10%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '25%', backgroundColor: GREEN }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '56%', top: '55%', height: '30%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '8%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '22%', backgroundColor: GREEN }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '68%', top: '70%', height: '25%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '6%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '19%', backgroundColor: GREEN }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '80%', top: '85%', height: '15%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '4%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '11%', backgroundColor: GREEN }]} />
                                                </View>
                                            </>
                                        )}

                                        {selectedCrypto === 'ETH' && selectedTimeframe === '1W' && (
                                            <>
                                                <View style={[styles.candlestick, { left: '10%', top: '60%', height: '25%', backgroundColor: '#FF6B6B' }]}>
                                                    <View style={[styles.wick, { height: '8%', backgroundColor: '#FF6B6B' }]} />
                                                    <View style={[styles.body, { height: '17%', backgroundColor: '#FF6B6B' }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '25%', top: '45%', height: '30%', backgroundColor: '#FF6B6B' }]}>
                                                    <View style={[styles.wick, { height: '10%', backgroundColor: '#FF6B6B' }]} />
                                                    <View style={[styles.body, { height: '20%', backgroundColor: '#FF6B6B' }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '40%', top: '30%', height: '35%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '12%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '23%', backgroundColor: GREEN }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '55%', top: '40%', height: '30%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '8%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '22%', backgroundColor: GREEN }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '70%', top: '50%', height: '25%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '6%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '19%', backgroundColor: GREEN }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '85%', top: '65%', height: '20%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '5%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '15%', backgroundColor: GREEN }]} />
                                                </View>
                                            </>
                                        )}

                                        {selectedCrypto === 'ETH' && selectedTimeframe === '1M' && (
                                            <>
                                                <View style={[styles.candlestick, { left: '8%', top: '70%', height: '20%', backgroundColor: '#FF6B6B' }]}>
                                                    <View style={[styles.wick, { height: '6%', backgroundColor: '#FF6B6B' }]} />
                                                    <View style={[styles.body, { height: '14%', backgroundColor: '#FF6B6B' }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '20%', top: '55%', height: '30%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '10%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '20%', backgroundColor: GREEN }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '32%', top: '35%', height: '40%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '12%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '28%', backgroundColor: GREEN }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '44%', top: '25%', height: '45%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '15%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '30%', backgroundColor: GREEN }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '56%', top: '20%', height: '50%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '18%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '32%', backgroundColor: GREEN }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '68%', top: '15%', height: '55%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '20%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '35%', backgroundColor: GREEN }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '80%', top: '25%', height: '45%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '12%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '33%', backgroundColor: GREEN }]} />
                                                </View>
                                            </>
                                        )}

                                        {selectedCrypto === 'ETH' && selectedTimeframe === '1Y' && (
                                            <>
                                                <View style={[styles.candlestick, { left: '5%', top: '75%', height: '20%', backgroundColor: '#FF6B6B' }]}>
                                                    <View style={[styles.wick, { height: '6%', backgroundColor: '#FF6B6B' }]} />
                                                    <View style={[styles.body, { height: '14%', backgroundColor: '#FF6B6B' }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '15%', top: '55%', height: '30%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '10%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '20%', backgroundColor: GREEN }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '25%', top: '35%', height: '40%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '12%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '28%', backgroundColor: GREEN }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '35%', top: '20%', height: '50%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '15%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '35%', backgroundColor: GREEN }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '45%', top: '10%', height: '60%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '18%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '42%', backgroundColor: GREEN }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '55%', top: '8%', height: '62%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '20%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '42%', backgroundColor: GREEN }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '65%', top: '12%', height: '58%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '16%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '42%', backgroundColor: GREEN }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '75%', top: '18%', height: '52%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '14%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '38%', backgroundColor: GREEN }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '85%', top: '30%', height: '40%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '10%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '30%', backgroundColor: GREEN }]} />
                                                </View>
                                            </>
                                        )}
                                        {selectedCrypto === 'BNB' && selectedTimeframe === '1D' && (
                                            <>
                                                <View style={[styles.candlestick, { left: '8%', top: '85%', height: '15%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '4%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '11%', backgroundColor: GREEN }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '20%', top: '70%', height: '25%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '6%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '19%', backgroundColor: GREEN }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '32%', top: '50%', height: '35%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '8%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '27%', backgroundColor: GREEN }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '44%', top: '30%', height: '45%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '12%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '33%', backgroundColor: GREEN }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '56%', top: '15%', height: '55%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '15%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '40%', backgroundColor: GREEN }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '68%', top: '8%', height: '60%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '18%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '42%', backgroundColor: GREEN }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '80%', top: '5%', height: '65%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '20%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '45%', backgroundColor: GREEN }]} />
                                                </View>
                                            </>
                                        )}

                                        {selectedCrypto === 'BNB' && selectedTimeframe === '1W' && (
                                            <>
                                                <View style={[styles.candlestick, { left: '10%', top: '80%', height: '15%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '5%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '10%', backgroundColor: GREEN }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '25%', top: '65%', height: '20%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '6%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '14%', backgroundColor: GREEN }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '40%', top: '50%', height: '25%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '8%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '17%', backgroundColor: GREEN }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '55%', top: '35%', height: '30%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '10%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '20%', backgroundColor: GREEN }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '70%', top: '20%', height: '35%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '12%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '23%', backgroundColor: GREEN }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '85%', top: '10%', height: '40%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '15%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '25%', backgroundColor: GREEN }]} />
                                                </View>
                                            </>
                                        )}

                                        {selectedCrypto === 'BNB' && selectedTimeframe === '1M' && (
                                            <>
                                                <View style={[styles.candlestick, { left: '8%', top: '85%', height: '10%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '3%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '7%', backgroundColor: GREEN }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '20%', top: '70%', height: '15%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '5%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '10%', backgroundColor: GREEN }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '32%', top: '55%', height: '20%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '6%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '14%', backgroundColor: GREEN }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '44%', top: '40%', height: '25%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '8%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '17%', backgroundColor: GREEN }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '56%', top: '25%', height: '30%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '10%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '20%', backgroundColor: GREEN }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '68%', top: '15%', height: '35%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '12%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '23%', backgroundColor: GREEN }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '80%', top: '8%', height: '40%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '15%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '25%', backgroundColor: GREEN }]} />
                                                </View>
                                            </>
                                        )}

                                        {selectedCrypto === 'BNB' && selectedTimeframe === '1Y' && (
                                            <>
                                                <View style={[styles.candlestick, { left: '5%', top: '90%', height: '8%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '2%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '6%', backgroundColor: GREEN }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '15%', top: '75%', height: '15%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '5%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '10%', backgroundColor: GREEN }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '25%', top: '60%', height: '20%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '6%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '14%', backgroundColor: GREEN }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '35%', top: '45%', height: '25%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '8%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '17%', backgroundColor: GREEN }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '45%', top: '30%', height: '30%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '10%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '20%', backgroundColor: GREEN }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '55%', top: '20%', height: '35%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '12%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '23%', backgroundColor: GREEN }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '65%', top: '12%', height: '40%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '15%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '25%', backgroundColor: GREEN }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '75%', top: '8%', height: '45%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '18%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '27%', backgroundColor: GREEN }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '85%', top: '5%', height: '50%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '20%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '30%', backgroundColor: GREEN }]} />
                                                </View>
                                            </>
                                        )}
                                        {selectedCrypto === 'ADA' && selectedTimeframe === '1D' && (
                                            <>
                                                <View style={[styles.candlestick, { left: '8%', top: '45%', height: '35%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '10%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '25%', backgroundColor: GREEN }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '20%', top: '60%', height: '25%', backgroundColor: '#FF6B6B' }]}>
                                                    <View style={[styles.wick, { height: '8%', backgroundColor: '#FF6B6B' }]} />
                                                    <View style={[styles.body, { height: '17%', backgroundColor: '#FF6B6B' }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '32%', top: '80%', height: '15%', backgroundColor: '#FF6B6B' }]}>
                                                    <View style={[styles.wick, { height: '4%', backgroundColor: '#FF6B6B' }]} />
                                                    <View style={[styles.body, { height: '11%', backgroundColor: '#FF6B6B' }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '44%', top: '70%', height: '20%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '6%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '14%', backgroundColor: GREEN }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '56%', top: '55%', height: '30%', backgroundColor: '#FF6B6B' }]}>
                                                    <View style={[styles.wick, { height: '8%', backgroundColor: '#FF6B6B' }]} />
                                                    <View style={[styles.body, { height: '22%', backgroundColor: '#FF6B6B' }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '68%', top: '65%', height: '25%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '6%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '19%', backgroundColor: GREEN }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '80%', top: '60%', height: '30%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '8%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '22%', backgroundColor: GREEN }]} />
                                                </View>
                                            </>
                                        )}

                                        {selectedCrypto === 'ADA' && selectedTimeframe === '1W' && (
                                            <>
                                                <View style={[styles.candlestick, { left: '10%', top: '50%', height: '30%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '10%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '20%', backgroundColor: GREEN }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '25%', top: '65%', height: '20%', backgroundColor: '#FF6B6B' }]}>
                                                    <View style={[styles.wick, { height: '6%', backgroundColor: '#FF6B6B' }]} />
                                                    <View style={[styles.body, { height: '14%', backgroundColor: '#FF6B6B' }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '40%', top: '75%', height: '15%', backgroundColor: '#FF6B6B' }]}>
                                                    <View style={[styles.wick, { height: '4%', backgroundColor: '#FF6B6B' }]} />
                                                    <View style={[styles.body, { height: '11%', backgroundColor: '#FF6B6B' }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '55%', top: '60%', height: '25%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '8%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '17%', backgroundColor: GREEN }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '70%', top: '70%', height: '20%', backgroundColor: '#FF6B6B' }]}>
                                                    <View style={[styles.wick, { height: '6%', backgroundColor: '#FF6B6B' }]} />
                                                    <View style={[styles.body, { height: '14%', backgroundColor: '#FF6B6B' }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '85%', top: '55%', height: '30%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '10%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '20%', backgroundColor: GREEN }]} />
                                                </View>
                                            </>
                                        )}

                                        {selectedCrypto === 'ADA' && selectedTimeframe === '1M' && (
                                            <>
                                                <View style={[styles.candlestick, { left: '8%', top: '60%', height: '25%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '8%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '17%', backgroundColor: GREEN }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '20%', top: '70%', height: '20%', backgroundColor: '#FF6B6B' }]}>
                                                    <View style={[styles.wick, { height: '6%', backgroundColor: '#FF6B6B' }]} />
                                                    <View style={[styles.body, { height: '14%', backgroundColor: '#FF6B6B' }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '32%', top: '80%', height: '15%', backgroundColor: '#FF6B6B' }]}>
                                                    <View style={[styles.wick, { height: '4%', backgroundColor: '#FF6B6B' }]} />
                                                    <View style={[styles.body, { height: '11%', backgroundColor: '#FF6B6B' }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '44%', top: '65%', height: '25%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '8%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '17%', backgroundColor: GREEN }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '56%', top: '75%', height: '20%', backgroundColor: '#FF6B6B' }]}>
                                                    <View style={[styles.wick, { height: '6%', backgroundColor: '#FF6B6B' }]} />
                                                    <View style={[styles.body, { height: '14%', backgroundColor: '#FF6B6B' }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '68%', top: '60%', height: '30%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '10%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '20%', backgroundColor: GREEN }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '80%', top: '50%', height: '35%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '12%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '23%', backgroundColor: GREEN }]} />
                                                </View>
                                            </>
                                        )}

                                        {selectedCrypto === 'ADA' && selectedTimeframe === '1Y' && (
                                            <>
                                                <View style={[styles.candlestick, { left: '5%', top: '70%', height: '20%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '6%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '14%', backgroundColor: GREEN }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '15%', top: '80%', height: '15%', backgroundColor: '#FF6B6B' }]}>
                                                    <View style={[styles.wick, { height: '4%', backgroundColor: '#FF6B6B' }]} />
                                                    <View style={[styles.body, { height: '11%', backgroundColor: '#FF6B6B' }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '25%', top: '85%', height: '10%', backgroundColor: '#FF6B6B' }]}>
                                                    <View style={[styles.wick, { height: '3%', backgroundColor: '#FF6B6B' }]} />
                                                    <View style={[styles.body, { height: '7%', backgroundColor: '#FF6B6B' }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '35%', top: '75%', height: '20%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '6%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '14%', backgroundColor: GREEN }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '45%', top: '85%', height: '10%', backgroundColor: '#FF6B6B' }]}>
                                                    <View style={[styles.wick, { height: '3%', backgroundColor: '#FF6B6B' }]} />
                                                    <View style={[styles.body, { height: '7%', backgroundColor: '#FF6B6B' }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '55%', top: '70%', height: '25%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '8%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '17%', backgroundColor: GREEN }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '65%', top: '80%', height: '15%', backgroundColor: '#FF6B6B' }]}>
                                                    <View style={[styles.wick, { height: '4%', backgroundColor: '#FF6B6B' }]} />
                                                    <View style={[styles.body, { height: '11%', backgroundColor: '#FF6B6B' }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '75%', top: '65%', height: '30%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '10%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '20%', backgroundColor: GREEN }]} />
                                                </View>
                                                <View style={[styles.candlestick, { left: '85%', top: '55%', height: '35%', backgroundColor: GREEN }]}>
                                                    <View style={[styles.wick, { height: '12%', backgroundColor: GREEN }]} />
                                                    <View style={[styles.body, { height: '23%', backgroundColor: GREEN }]} />
                                                </View>
                                            </>
                                        )}
                                    </View>
                                </View>

                                <View style={styles.chartFooter}>
                                    <Text style={styles.chartSubtitle}>
                                        {selectedCrypto === 'BTC' && selectedTimeframe === '1D' && 'Bitcoin showing slight decline today'}
                                        {selectedCrypto === 'BTC' && selectedTimeframe === '1W' && 'Bitcoin mixed performance this week'}
                                        {selectedCrypto === 'BTC' && selectedTimeframe === '1M' && 'Bitcoin strong monthly growth trend'}
                                        {selectedCrypto === 'BTC' && selectedTimeframe === '1Y' && 'Bitcoin impressive yearly performance'}
                                        {selectedCrypto === 'ETH' && selectedTimeframe === '1D' && 'Ethereum trending downward today'}
                                        {selectedCrypto === 'ETH' && selectedTimeframe === '1W' && 'Ethereum recovery pattern this week'}
                                        {selectedCrypto === 'ETH' && selectedTimeframe === '1M' && 'Ethereum strong monthly growth'}
                                        {selectedCrypto === 'ETH' && selectedTimeframe === '1Y' && 'Ethereum impressive yearly gains'}
                                        {selectedCrypto === 'BNB' && selectedTimeframe === '1D' && 'BNB showing strong growth today'}
                                        {selectedCrypto === 'BNB' && selectedTimeframe === '1W' && 'BNB consistent weekly gains'}
                                        {selectedCrypto === 'BNB' && selectedTimeframe === '1M' && 'BNB exceptional monthly performance'}
                                        {selectedCrypto === 'BNB' && selectedTimeframe === '1Y' && 'BNB outstanding yearly growth'}
                                        {selectedCrypto === 'ADA' && selectedTimeframe === '1D' && 'Cardano experiencing volatility today'}
                                        {selectedCrypto === 'ADA' && selectedTimeframe === '1W' && 'Cardano mixed weekly performance'}
                                        {selectedCrypto === 'ADA' && selectedTimeframe === '1M' && 'Cardano volatile monthly pattern'}
                                        {selectedCrypto === 'ADA' && selectedTimeframe === '1Y' && 'Cardano stable yearly trend'}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Combined Assets and Transactions */}
                    <View style={styles.combinedSection}>
                        {/* Assets Section */}
                        <View style={styles.subSection}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Your Assets</Text>
                            </View>

                            {portfolioError ? (
                                <TouchableOpacity
                                    onPress={() => refreshPortfolio()}
                                    style={{ backgroundColor: '#2A1F1F', borderColor: '#FF6B6B', borderWidth: 1, borderRadius: 12, padding: 16 }}
                                >
                                    <Text style={{ color: '#FF6B6B', fontSize: 13 }}>{portfolioError}</Text>
                                    <Text style={{ color: '#888', fontSize: 12, marginTop: 4 }}>Tap to retry</Text>
                                </TouchableOpacity>
                            ) : portfolioLoading && assets.length === 0 ? (
                                <View style={{ padding: 24, alignItems: 'center' }}>
                                    <ActivityIndicator color={GREEN} />
                                    <Text style={{ color: '#888', fontSize: 13, marginTop: 8 }}>Loading your assets...</Text>
                                </View>
                            ) : assets.length > 0 ? (
                                assets.map((asset, index) => (
                                    <View key={index} style={styles.assetItem}>
                                        <View style={styles.assetLeft}>
                                            <View style={styles.assetIcon}>
                                                <Text style={styles.assetSymbol}>{asset.symbol}</Text>
                                            </View>
                                            <View style={styles.assetInfo}>
                                                <Text style={styles.assetName}>{asset.name}</Text>
                                                <Text style={styles.assetAmount}>{asset.amount.toFixed(2)} {asset.symbol}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.assetRight}>
                                            <Text style={styles.assetValue}>${asset.value.toFixed(2)}</Text>
                                        </View>
                                    </View>
                                ))
                            ) : (
                                <View style={styles.emptyStateContainer}>
                                    <Ionicons name="wallet-outline" size={48} color="#666" />
                                    <Text style={styles.emptyStateTitle}>No Assets Yet</Text>
                                    <Text style={styles.emptyStateText}>Start by depositing your first cryptocurrency to see your assets here.</Text>
                                </View>
                            )}
                        </View>

                        {/* Divider */}
                        <View style={styles.sectionDivider} />

                        {/* Recent Transactions Section */}
                        <View style={styles.subSection}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Recent Transactions</Text>
                            </View>

                            {transactions.length > 0 ? (
                                transactions.slice(0, 5).map((transaction, index) => (
                                    <View key={transaction.id} style={styles.transactionItem}>
                                        <View style={styles.transactionLeft}>
                                            <View style={[styles.transactionIcon, { backgroundColor: getTransactionColor(transaction.type, transaction.amount) + '20' }]}>
                                                <Ionicons
                                                    name={getTransactionIcon(transaction.type)}
                                                    size={20}
                                                    color={getTransactionColor(transaction.type, transaction.amount)}
                                                />
                                            </View>
                                            <View style={styles.transactionInfo}>
                                                <Text style={styles.transactionDescription}>{transaction.description}</Text>
                                                <Text style={styles.transactionTime}>{formatTransactionTime(transaction.timestamp)}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.transactionRight}>
                                            <Text style={[
                                                styles.transactionAmount,
                                                { color: getTransactionColor(transaction.type, transaction.amount) }
                                            ]}>
                                                {transaction.amount > 0 ? '+' : ''}₵{Math.abs(transaction.amount).toFixed(2)}
                                            </Text>
                                            <Text style={styles.transactionStatus}>{transaction.status}</Text>
                                        </View>
                                    </View>
                                ))
                            ) : (
                                <View style={styles.emptyStateContainer}>
                                    <Ionicons name="receipt-outline" size={48} color="#666" />
                                    <Text style={styles.emptyStateTitle}>No Transactions</Text>
                                    <Text style={styles.emptyStateText}>Your transaction history will appear here once you start using your wallet.</Text>
                                </View>
                            )}
                        </View>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
} 