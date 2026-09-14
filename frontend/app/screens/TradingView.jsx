import React, { useState, useEffect } from 'react';
import { useMarketData } from '../../contexts/MarketDataContext';
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Rect, Line, Text as SvgText } from 'react-native-svg';
import styles from '../styles/TradingView.styles';

const GREEN = '#00C896';
const RED = '#FF4D4F';

// Candlestick data for different timeframes
const candlestickData = {
    '1H': [
        { time: '09:00', open: 117.5, high: 117.8, low: 117.3, close: 117.6, volume: 1250 },
        { time: '10:00', open: 117.6, high: 117.9, low: 117.4, close: 117.7, volume: 1380 },
        { time: '11:00', open: 117.7, high: 118.1, low: 117.5, close: 118.0, volume: 1520 },
        { time: '12:00', open: 118.0, high: 118.3, low: 117.8, close: 117.9, volume: 1450 }, // Bearish
        { time: '13:00', open: 117.9, high: 118.2, low: 117.6, close: 117.8, volume: 1680 }, // Bearish
        { time: '14:00', open: 117.8, high: 118.1, low: 117.5, close: 118.0, volume: 1420 },
        { time: '15:00', open: 118.0, high: 118.4, low: 117.8, close: 118.3, volume: 1560 },
        { time: '16:00', open: 118.3, high: 118.6, low: 118.1, close: 118.5, volume: 1340 },
    ],
    '4H': [
        { time: '00:00', open: 117.2, high: 117.8, low: 117.0, close: 117.5, volume: 5200 },
        { time: '04:00', open: 117.5, high: 118.2, low: 117.3, close: 118.0, volume: 6100 },
        { time: '08:00', open: 118.0, high: 118.5, low: 117.8, close: 117.9, volume: 5800 }, // Bearish
        { time: '12:00', open: 117.9, high: 118.3, low: 117.6, close: 118.2, volume: 6500 },
        { time: '16:00', open: 118.2, high: 118.6, low: 117.9, close: 118.4, volume: 5900 },
        { time: '20:00', open: 118.4, high: 118.8, low: 118.2, close: 118.6, volume: 5400 },
    ],
    '1D': [
        { time: 'Mon', open: 116.8, high: 118.5, low: 116.5, close: 118.2, volume: 25000 },
        { time: 'Tue', open: 118.2, high: 119.0, low: 117.8, close: 117.9, volume: 28000 }, // Bearish
        { time: 'Wed', open: 117.9, high: 118.5, low: 117.5, close: 118.3, volume: 32000 },
        { time: 'Thu', open: 118.3, high: 118.8, low: 118.0, close: 118.6, volume: 29000 },
        { time: 'Fri', open: 118.6, high: 119.2, low: 118.3, close: 118.8, volume: 35000 },
        { time: 'Sat', open: 118.8, high: 119.5, low: 118.5, close: 119.2, volume: 22000 },
        { time: 'Sun', open: 119.2, high: 119.8, low: 119.0, close: 119.5, volume: 18000 },
    ],
    '1W': [
        { time: 'Week 1', open: 115.0, high: 118.0, low: 114.5, close: 117.5, volume: 150000 },
        { time: 'Week 2', open: 117.5, high: 119.0, low: 117.0, close: 118.8, volume: 180000 },
        { time: 'Week 3', open: 118.8, high: 120.0, low: 118.5, close: 119.2, volume: 200000 },
        { time: 'Week 4', open: 119.2, high: 120.5, low: 119.0, close: 119.8, volume: 220000 }, // Bearish
    ],
    '1M': [
        { time: 'Jan', open: 110.0, high: 125.0, low: 108.0, close: 123.0, volume: 800000 },
        { time: 'Feb', open: 123.0, high: 135.0, low: 122.0, close: 132.0, volume: 900000 },
        { time: 'Mar', open: 132.0, high: 140.0, low: 130.0, close: 135.0, volume: 1000000 }, // Bearish
        { time: 'Apr', open: 135.0, high: 145.0, low: 134.0, close: 143.0, volume: 1100000 },
    ],
};

// Comprehensive coin data with real market information
const coinData = {
    'BTC': {
        name: 'Bitcoin',
        icon: 'bitcoin',
        iconType: 'FontAwesome5',
        color: '#F7931A',
        price: '$117,707.98',
        change: '+0.03%',
        high24h: '$118,500.00',
        low24h: '$116,200.00',
        volume24h: '$2.5B',
        marketCap: '$2.3T'
    },
    'ETH': {
        name: 'Ethereum',
        icon: 'ethereum',
        iconType: 'FontAwesome5',
        color: '#627EEA',
        price: '$3,571.62',
        change: '+0.50%',
        high24h: '$3,690.67',
        low24h: '$3,450.00',
        volume24h: '$1.8B',
        marketCap: '$428.6B'
    },
    'BNB': {
        name: 'BNB',
        icon: 'coins',
        iconType: 'FontAwesome5',
        color: '#F3BA2F',
        price: '$730.49',
        change: '-0.34%',
        high24h: '$750.00',
        low24h: '$720.00',
        volume24h: '$450M',
        marketCap: '$110.2B'
    },
    'SOL': {
        name: 'Solana',
        icon: 'bolt',
        iconType: 'Ionicons',
        color: '#9945FF',
        price: '$183.03',
        change: '+4.4%',
        high24h: '$190.00',
        low24h: '$175.00',
        volume24h: '$320M',
        marketCap: '$82.1B'
    },
    'XRP': {
        name: 'Ripple',
        icon: 'currency-exchange',
        iconType: 'MaterialIcons',
        color: '#23292F',
        price: '$3.07',
        change: '+3.89%',
        high24h: '$3.15',
        low24h: '$2.95',
        volume24h: '$280M',
        marketCap: '$168.5B'
    },
    'DOGE': {
        name: 'Dogecoin',
        icon: 'dog',
        iconType: 'FontAwesome5',
        color: '#C2A633',
        price: '$0.2255',
        change: '+7.38%',
        high24h: '$0.2350',
        low24h: '$0.2100',
        volume24h: '$180M',
        marketCap: '$32.4B'
    },
    'ADA': {
        name: 'Cardano',
        icon: 'diamond',
        iconType: 'FontAwesome5',
        color: '#0033AD',
        price: '$0.7961',
        change: '+2.63%',
        high24h: '$0.8100',
        low24h: '$0.7750',
        volume24h: '$120M',
        marketCap: '$28.2B'
    },
    'TRX': {
        name: 'TRON',
        icon: 'flash',
        iconType: 'Ionicons',
        color: '#FF0000',
        price: '$0.139',
        change: '+1.12%',
        high24h: '$0.142',
        low24h: '$0.137',
        volume24h: '$90M',
        marketCap: '$12.4B'
    },
    'SUI': {
        name: 'Sui',
        icon: 'cube',
        iconType: 'FontAwesome5',
        color: '#6FBCF0',
        price: '$3.62',
        change: '+3.74%',
        high24h: '$3.75',
        low24h: '$3.50',
        volume24h: '$85M',
        marketCap: '$4.2B'
    },
    'LINK': {
        name: 'Chainlink',
        icon: 'link',
        iconType: 'Ionicons',
        color: '#2A5ADA',
        price: '$17.54',
        change: '+4.21%',
        high24h: '$18.00',
        low24h: '$16.80',
        volume24h: '$150M',
        marketCap: '$10.3B'
    },
    'SHIB': {
        name: 'Shiba Inu',
        icon: 'paw',
        iconType: 'FontAwesome5',
        color: '#FF6B35',
        price: '$0.00001327',
        change: '+4.52%',
        high24h: '$0.00001350',
        low24h: '$0.00001270',
        volume24h: '$95M',
        marketCap: '$7.8B'
    },
    'PEPE': {
        name: 'Pepe',
        icon: 'frog',
        iconType: 'FontAwesome5',
        color: '#00FF00',
        price: '$0.00001193',
        change: '+7.11%',
        high24h: '$0.00001200',
        low24h: '$0.00001100',
        volume24h: '$75M',
        marketCap: '$5.0B'
    },
    'HBAR': {
        name: 'Hedera',
        icon: 'leaf',
        iconType: 'Ionicons',
        color: '#000000',
        price: '$0.2367',
        change: '+4.19%',
        high24h: '$0.2450',
        low24h: '$0.2270',
        volume24h: '$45M',
        marketCap: '$8.4B'
    },
    'DOT': {
        name: 'Polkadot',
        icon: 'circle',
        iconType: 'FontAwesome5',
        color: '#E6007A',
        price: '$4.00',
        change: '+4.1%',
        high24h: '$4.15',
        low24h: '$3.85',
        volume24h: '$110M',
        marketCap: '$5.1B'
    },
    'MATIC': {
        name: 'Polygon',
        icon: 'hexagon',
        iconType: 'FontAwesome5',
        color: '#8247E5',
        price: '$0.75',
        change: '+2.2%',
        high24h: '$0.77',
        low24h: '$0.73',
        volume24h: '$180M',
        marketCap: '$7.2B'
    },
    'LTC': {
        name: 'Litecoin',
        icon: 'coins',
        iconType: 'FontAwesome5',
        color: '#BFBBBB',
        price: '$85.00',
        change: '+1.5%',
        high24h: '$87.00',
        low24h: '$83.50',
        volume24h: '$120M',
        marketCap: '$6.3B'
    },
    'BCH': {
        name: 'Bitcoin Cash',
        icon: 'bitcoin',
        iconType: 'FontAwesome5',
        color: '#0AC18E',
        price: '$320.00',
        change: '+1.1%',
        high24h: '$325.00',
        low24h: '$315.00',
        volume24h: '$85M',
        marketCap: '$6.3B'
    },
    'AVAX': {
        name: 'Avalanche',
        icon: 'snow',
        iconType: 'Ionicons',
        color: '#E84142',
        price: '$28.00',
        change: '+2.8%',
        high24h: '$29.00',
        low24h: '$27.20',
        volume24h: '$140M',
        marketCap: '$10.8B'
    },
    'UNI': {
        name: 'Uniswap',
        icon: 'swap-horizontal',
        iconType: 'Ionicons',
        color: '#FF007A',
        price: '$7.50',
        change: '+3.0%',
        high24h: '$7.75',
        low24h: '$7.25',
        volume24h: '$95M',
        marketCap: '$4.5B'
    },
    'XLM': {
        name: 'Stellar',
        icon: 'star',
        iconType: 'Ionicons',
        color: '#000000',
        price: '$0.4163',
        change: '+3.36%',
        high24h: '$0.4250',
        low24h: '$0.4020',
        volume24h: '$65M',
        marketCap: '$11.5B'
    },
    'SYRUP': {
        name: 'Syrup',
        icon: 'water',
        iconType: 'Ionicons',
        color: '#FF6B6B',
        price: '$0.6054',
        change: '+32.39%',
        high24h: '$0.6500',
        low24h: '$0.5800',
        volume24h: '$25M',
        marketCap: '$1.2B'
    },
    'CRO': {
        name: 'Cronos',
        icon: 'diamond',
        iconType: 'FontAwesome5',
        color: '#1E3A8A',
        price: '$0.1281',
        change: '+5.84%',
        high24h: '$0.1350',
        low24h: '$0.1210',
        volume24h: '$35M',
        marketCap: '$3.2B'
    },
    'CFX': {
        name: 'Conflux',
        icon: 'flash',
        iconType: 'Ionicons',
        color: '#FF6B35',
        price: '$0.1801',
        change: '+5.45%',
        high24h: '$0.1900',
        low24h: '$0.1700',
        volume24h: '$28M',
        marketCap: '$1.8B'
    },
    'PUMP': {
        name: 'Pump',
        icon: 'trending-up',
        iconType: 'Ionicons',
        color: '#FF6B6B',
        price: '$0.002553',
        change: '-19.64%',
        high24h: '$0.003200',
        low24h: '$0.002400',
        volume24h: '$15M',
        marketCap: '$850M'
    },
    'FARTCOIN': {
        name: 'Fartcoin',
        icon: 'cloud',
        iconType: 'Ionicons',
        color: '#8B4513',
        price: '$1.32',
        change: '-12.89%',
        high24h: '$1.5500',
        low24h: '$1.2800',
        volume24h: '$8M',
        marketCap: '$420M'
    },
    'WIF': {
        name: 'WIF',
        icon: 'paw',
        iconType: 'FontAwesome5',
        color: '#FFD700',
        price: '$1.03',
        change: '-11.68%',
        high24h: '$1.1800',
        low24h: '$1.0100',
        volume24h: '$12M',
        marketCap: '$1.1B'
    },
};

// Legacy coin mapping for backward compatibility

// Candlestick Chart Component
const CandlestickChart = ({ data, width = 300, height = 200 }) => {
    if (!data || data.length === 0) return null;

    const padding = 20;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;

    // Calculate price range
    const prices = data.flatMap(d => [d.high, d.low]);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;

    // Calculate dimensions - much thinner for authentic look
    const candleWidth = data.length <= 4 ?
        chartWidth / data.length * 0.08 : // Very thin for 1W and 1M
        chartWidth / data.length * 0.12;  // Thin for others
    const candleSpacing = chartWidth / data.length;

    const priceToY = (price) => {
        return padding + chartHeight - ((price - minPrice) / priceRange) * chartHeight;
    };

    const xToX = (index) => {
        return padding + index * candleSpacing + candleSpacing / 2;
    };

    return (
        <Svg width={width} height={height}>
            {/* Background grid lines */}
            {[0, 1, 2, 3, 4].map((i) => (
                <Line
                    key={`grid-${i}`}
                    x1={padding}
                    y1={padding + (chartHeight / 4) * i}
                    x2={width - padding}
                    y2={padding + (chartHeight / 4) * i}
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="0.5"
                />
            ))}

            {/* Vertical grid lines for time markers */}
            {data.map((_, index) => (
                <Line
                    key={`vgrid-${index}`}
                    x1={xToX(index)}
                    y1={padding}
                    x2={xToX(index)}
                    y2={height - padding}
                    stroke="rgba(255,255,255,0.02)"
                    strokeWidth="0.5"
                />
            ))}

            {/* Candlesticks */}
            {data.map((candle, index) => {
                const x = xToX(index);
                const openY = priceToY(candle.open);
                const closeY = priceToY(candle.close);
                const highY = priceToY(candle.high);
                const lowY = priceToY(candle.low);

                const isGreen = candle.close >= candle.open;
                const color = isGreen ? GREEN : RED;

                return (
                    <React.Fragment key={index}>
                        {/* Wick - very thin line */}
                        <Line
                            x1={x}
                            y1={highY}
                            x2={x}
                            y2={lowY}
                            stroke={color}
                            strokeWidth="1"
                            strokeOpacity="0.8"
                        />

                        {/* Body - filled rectangle */}
                        <Rect
                            x={x - candleWidth / 2}
                            y={Math.min(openY, closeY)}
                            width={candleWidth}
                            height={Math.max(Math.abs(closeY - openY), 1)} // Minimum height of 1
                            fill={color}
                            stroke="transparent"
                        />
                    </React.Fragment>
                );
            })}

            {/* Price labels on the right */}
            {[0, 1, 2, 3, 4].map((i) => {
                const price = minPrice + (priceRange / 4) * (4 - i);
                return (
                    <SvgText
                        key={`price-${i}`}
                        x={width - padding - 5}
                        y={padding + (chartHeight / 4) * i + 4}
                        fontSize="9"
                        fill="#666"
                        textAnchor="end"
                        fontFamily="monospace"
                    >
                        ${price.toFixed(2)}
                    </SvgText>
                );
            })}

            {/* Time labels at the bottom */}
            {data.map((candle, index) => (
                <SvgText
                    key={`time-${index}`}
                    x={xToX(index)}
                    y={height - 5}
                    fontSize="8"
                    fill="#666"
                    textAnchor="middle"
                    fontFamily="monospace"
                >
                    {candle.time}
                </SvgText>
            ))}
        </Svg>
    );
};

export default function TradingView() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { symbol, price, change } = params;
    const insets = useSafeAreaInsets();

    // The dropdown lists whatever the market feed currently carries, rather
    // than a fixed twenty that could name coins the backend does not track.
    const { coins: liveCoins } = useMarketData();
    const availableCoins = liveCoins.map(c => ({
        symbol: `${c.symbol}/USDT`,
        name: c.name,
        baseCoin: c.symbol,
    }));

    const [timeframe, setTimeframe] = useState('1D');
    const [showCoinDropdown, setShowCoinDropdown] = useState(false);
    const [selectedCoin, setSelectedCoin] = useState(symbol || 'BTC/USDT');

    // Initialize selectedCoin when component mounts
    useEffect(() => {
        if (symbol) {
            setSelectedCoin(symbol);
        }
    }, [symbol]);

    const timeframes = ['1H', '4H', '1D', '1W', '1M'];

    // Get current candlestick data based on timeframe
    const currentChartData = candlestickData[timeframe] || candlestickData['1D'];

    const handleBack = () => {
        router.back();
    };

    const handleBuy = () => {
        router.push({
            pathname: '/screens/Margin',
            params: {
                selectedPair: selectedCoin
            }
        });
    };

    const handleSell = () => {
        router.push({
            pathname: '/screens/Margin',
            params: {
                selectedPair: selectedCoin
            }
        });
    };

    const handleCoinSelect = (coinSymbol) => {
        setSelectedCoin(coinSymbol);
        setShowCoinDropdown(false);
    };

    // Extract base coin from selected coin
    const baseCoin = selectedCoin?.split('/')[0] || 'BTC';
    const coinInfo = coinData[baseCoin] || coinData['BTC']; // Default to BTC if not found

    // Render coin icon based on mapping
    const renderCoinIcon = () => {
        const { icon, iconType, color } = coinInfo;

        switch (iconType) {
            case 'FontAwesome5':
                return <FontAwesome5 name={icon} size={20} color={color} />;
            case 'Ionicons':
                return <Ionicons name={icon} size={20} color={color} />;
            case 'MaterialIcons':
                return <MaterialIcons name={icon} size={20} color={color} />;
            default:
                return <FontAwesome5 name="bitcoin" size={20} color="#F7931A" />;
        }
    };

    return (
        <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
            {/* Enhanced Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Coin Information Section */}
            <View style={styles.coinInfoSection}>
                <TouchableOpacity
                    style={styles.symbolContainer}
                    onPress={() => setShowCoinDropdown(!showCoinDropdown)}
                    activeOpacity={0.7}
                >
                    <View style={styles.symbolIcon}>
                        {renderCoinIcon()}
                    </View>
                    <View style={styles.symbolInfo}>
                        <Text style={styles.symbolText}>{selectedCoin}</Text>
                        <Text style={styles.symbolName}>{coinInfo.name}</Text>
                    </View>
                </TouchableOpacity>
                <View style={styles.priceContainer}>
                    <Text style={styles.priceText}>{coinInfo.price}</Text>
                    <View style={[styles.changeContainer, { backgroundColor: coinInfo.change?.startsWith('-') ? RED : GREEN }]}>
                        <Ionicons
                            name={coinInfo.change?.startsWith('-') ? "trending-down" : "trending-up"}
                            size={12}
                            color="#fff"
                            style={{ marginRight: 4 }}
                        />
                        <Text style={styles.changeText}>{coinInfo.change}</Text>
                    </View>
                </View>
            </View>

            {/* Coin Dropdown */}
            {showCoinDropdown && (
                <View style={styles.dropdownContainer}>
                    <ScrollView style={styles.dropdownScroll} showsVerticalScrollIndicator={false}>
                        {availableCoins.map((coin, index) => (
                            <TouchableOpacity
                                key={coin.symbol}
                                style={[
                                    styles.dropdownItem,
                                    selectedCoin === coin.symbol && styles.selectedDropdownItem
                                ]}
                                onPress={() => handleCoinSelect(coin.symbol)}
                                activeOpacity={0.7}
                            >
                                <View style={styles.dropdownItemContent}>
                                    <View style={styles.dropdownItemIcon}>
                                        {coinData[coin.baseCoin]?.iconType === 'FontAwesome5' ? (
                                            <FontAwesome5
                                                name={coinData[coin.baseCoin]?.icon || 'bitcoin'}
                                                size={16}
                                                color={coinData[coin.baseCoin]?.color || '#F7931A'}
                                            />
                                        ) : (
                                            <Ionicons
                                                name={coinData[coin.baseCoin]?.icon || 'logo-bitcoin'}
                                                size={16}
                                                color={coinData[coin.baseCoin]?.color || '#F7931A'}
                                            />
                                        )}
                                    </View>
                                    <View style={styles.dropdownItemText}>
                                        <Text style={styles.dropdownItemSymbol}>{coin.symbol}</Text>
                                        <Text style={styles.dropdownItemName}>{coin.name}</Text>
                                    </View>
                                    {selectedCoin === coin.symbol && (
                                        <Ionicons name="checkmark" size={16} color={GREEN} />
                                    )}
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Enhanced Chart Section */}
                <View style={styles.chartSection}>
                    {/* Timeframe Tabs */}
                    <View style={styles.timeframeTabs}>
                        {timeframes.map((tf) => (
                            <TouchableOpacity
                                key={tf}
                                style={[styles.timeframeTab, timeframe === tf && styles.activeTimeframeTab]}
                                onPress={() => setTimeframe(tf)}
                            >
                                <Text style={[styles.timeframeText, timeframe === tf && styles.activeTimeframeText]}>
                                    {tf}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Enhanced Chart */}
                    <View style={styles.chartContainer}>
                        <View style={styles.chartHeader}>
                            <Text style={styles.chartTitle}>Price Chart</Text>
                            <View style={styles.chartControls}>
                                <TouchableOpacity style={styles.chartControl}>
                                    <Ionicons name="expand" size={16} color="#fff" />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.chartControl}>
                                    <Ionicons name="settings-outline" size={16} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.chartArea}>
                            <CandlestickChart
                                data={currentChartData}
                                width={Dimensions.get('window').width - 72}
                                height={200}
                            />
                        </View>
                    </View>

                    {/* Enhanced Market Stats */}
                    <View style={styles.marketStats}>
                        <View style={styles.statCard}>
                            <Text style={styles.statLabel}>24h High</Text>
                            <Text style={styles.statValue}>{coinInfo.high24h}</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={styles.statLabel}>24h Low</Text>
                            <Text style={styles.statValue}>{coinInfo.low24h}</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={styles.statLabel}>24h Volume</Text>
                            <Text style={styles.statValue}>{coinInfo.volume24h}</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={styles.statLabel}>Market Cap</Text>
                            <Text style={styles.statValue}>{coinInfo.marketCap}</Text>
                        </View>
                    </View>
                </View>

                {/* Enhanced Trading Interface */}
                <View style={styles.tradingSection}>



                    {/* Enhanced Buy/Sell Interface */}
                    <View style={styles.orderInterface}>
                        {/* Buy Section */}
                        <View style={styles.buySection}>
                            <TouchableOpacity style={styles.buyButton} onPress={handleBuy}>
                                <Ionicons name="trending-up" size={20} color="#fff" style={{ marginRight: 8 }} />
                                <Text style={styles.buyButtonText}>Buy {symbol?.split('/')[0] || 'BTC'}</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Sell Section */}
                        <View style={styles.sellSection}>
                            <TouchableOpacity style={styles.sellButton} onPress={handleSell}>
                                <Ionicons name="trending-down" size={20} color="#fff" style={{ marginRight: 8 }} />
                                <Text style={styles.sellButtonText}>Sell {symbol?.split('/')[0] || 'BTC'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>


            </ScrollView>
        </SafeAreaView>
    );
} 