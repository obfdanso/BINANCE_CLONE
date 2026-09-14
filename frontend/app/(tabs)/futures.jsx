import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    StatusBar,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Dimensions,
    Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PanGestureHandler, State, GestureHandlerRootView } from 'react-native-gesture-handler';
import { FuturesStyles } from '../styles/Futures.styles';


export default function Futures() {
    const insets = useSafeAreaInsets();
    const [selectedNavTab, setSelectedNavTab] = useState('USD-M');
    const [selectedLeverage, setSelectedLeverage] = useState('20x');
    const [orderType] = useState('Limit');
    const [price, setPrice] = useState('117718.7');
    const [amount, setAmount] = useState('');
    const [tpSlSelected, setTpSlSelected] = useState(false);
    const [reduceOnlySelected, setReduceOnlySelected] = useState(false);
    const [showCoinModal, setShowCoinModal] = useState(false);
    const [selectedCoin, setSelectedCoin] = useState('BTCUSDT');
    const [leverageValue, setLeverageValue] = useState(20);
    const [sliderValue, setSliderValue] = useState(50);
    const [currentPrices, setCurrentPrices] = useState({
        BTCUSDT: { price: 117720.9, change: -0.28 },
        ETHUSDT: { price: 3571.5, change: 0.15 },
        SOLUSDT: { price: 142.8, change: 2.45 },
        ADAUSDT: { price: 0.485, change: -1.23 },
        DOTUSDT: { price: 7.23, change: 0.87 }
    });

    // Available coins
    const availableCoins = [
        { symbol: 'BTCUSDT', name: 'Bitcoin' },
        { symbol: 'ETHUSDT', name: 'Ethereum' },
        { symbol: 'SOLUSDT', name: 'Solana' },
        { symbol: 'ADAUSDT', name: 'Cardano' },
        { symbol: 'DOTUSDT', name: 'Polkadot' }
    ];

    // Handle leverage selection
    const handleLeverageSelect = (option) => {
        setSelectedLeverage(option);
        if (option === '20x') {
            setLeverageValue(20);
        } else if (option === 'S') {
            setLeverageValue(50);
        }
    };

    // Handle price adjustment
    const adjustPrice = (direction) => {
        const currentPrice = parseFloat(price);
        const coin = selectedCoin;
        let increment = 0;

        // Set increment based on coin
        switch (coin) {
            case 'BTCUSDT':
                increment = direction === 'up' ? 0.1 : -0.1;
                break;
            case 'ETHUSDT':
                increment = direction === 'up' ? 0.1 : -0.1;
                break;
            case 'SOLUSDT':
                increment = direction === 'up' ? 0.01 : -0.01;
                break;
            case 'ADAUSDT':
                increment = direction === 'up' ? 0.001 : -0.001;
                break;
            case 'DOTUSDT':
                increment = direction === 'up' ? 0.01 : -0.01;
                break;
            default:
                increment = direction === 'up' ? 0.1 : -0.1;
        }

        const newPrice = Math.max(0, currentPrice + increment);
        setPrice(newPrice.toFixed(3));
    };

    // Handle slider change
    const handleSliderChange = (value) => {
        setSliderValue(Math.max(0, Math.min(100, value)));
        // Update amount based on slider
        const maxAmount = 1.0; // Example max amount
        const newAmount = (maxAmount * value / 100).toFixed(3);
        setAmount(newAmount);
    };

    // Handle slider gesture
    const onSliderGestureEvent = (event) => {
        const { translationX } = event.nativeEvent;
        const sliderWidth = 200; // Approximate slider width
        const newValue = sliderValue + (translationX / sliderWidth) * 100;
        handleSliderChange(newValue);
    };

    // Handle slider state change
    const onSliderStateChange = (event) => {
        if (event.nativeEvent.state === State.END) {
            // Slider gesture ended
        }
    };

    // Update prices every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentPrices(prevPrices => {
                const newPrices = {};
                Object.keys(prevPrices).forEach(coin => {
                    const currentPrice = prevPrices[coin].price;
                    const randomChange = (Math.random() - 0.5) * 1000; // ±500 range
                    const newPrice = currentPrice + randomChange;
                    const percentageChange = (randomChange / currentPrice) * 100;

                    newPrices[coin] = {
                        price: Math.max(0, newPrice), // Ensure price doesn't go negative
                        change: percentageChange
                    };
                });
                return newPrices;
            });
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    // USD-M Data (BTCUSDT)
    const usdmSellOrders = [
        { price: '117,722.3', amount: '0.125' },
        { price: '117,721.8', amount: '0.250' },
        { price: '117,721.3', amount: '0.500' },
        { price: '117,720.8', amount: '0.750' },
    ];

    const usdmBuyOrders = [
        { price: '117,720.8', amount: '0.125' },
        { price: '117,720.7', amount: '0.250' },
        { price: '117,720.6', amount: '0.500' },
        { price: '117,720.5', amount: '0.750' },
    ];

    // COIN-M Data (ETHUSDT)
    const coinmSellOrders = [
        { price: '3,571.8', amount: '2.5' },
        { price: '3,571.6', amount: '5.0' },
        { price: '3,571.4', amount: '7.5' },
        { price: '3,571.2', amount: '10.0' },
    ];

    const coinmBuyOrders = [
        { price: '3,571.2', amount: '2.5' },
        { price: '3,571.0', amount: '5.0' },
        { price: '3,570.8', amount: '7.5' },
        { price: '3,570.6', amount: '10.0' },
    ];

    // SOLUSDT Data
    const solSellOrders = [
        { price: '142.85', amount: '15.5' },
        { price: '142.80', amount: '25.0' },
        { price: '142.75', amount: '35.0' },
        { price: '142.70', amount: '45.0' },
    ];

    const solBuyOrders = [
        { price: '142.70', amount: '15.5' },
        { price: '142.65', amount: '25.0' },
        { price: '142.60', amount: '35.0' },
        { price: '142.55', amount: '45.0' },
    ];

    // ADAUSDT Data
    const adaSellOrders = [
        { price: '0.4855', amount: '500' },
        { price: '0.4850', amount: '750' },
        { price: '0.4845', amount: '1000' },
        { price: '0.4840', amount: '1250' },
    ];

    const adaBuyOrders = [
        { price: '0.4840', amount: '500' },
        { price: '0.4835', amount: '750' },
        { price: '0.4830', amount: '1000' },
        { price: '0.4825', amount: '1250' },
    ];

    // DOTUSDT Data
    const dotSellOrders = [
        { price: '7.235', amount: '50' },
        { price: '7.230', amount: '75' },
        { price: '7.225', amount: '100' },
        { price: '7.220', amount: '125' },
    ];

    const dotBuyOrders = [
        { price: '7.220', amount: '50' },
        { price: '7.215', amount: '75' },
        { price: '7.210', amount: '100' },
        { price: '7.205', amount: '125' },
    ];

    const navTabs = ['USD-M', 'COIN-M'];
    const leverageOptions = ['20x', 'S'];

    // Get current data based on selected tab and coin
    const getCurrentData = () => {
        const coin = selectedCoin;
        const isUSDMTab = selectedNavTab === 'USD-M';
        const currentPriceData = currentPrices[coin] || { price: 117720.9, change: -0.28 };

        let sellOrders, buyOrders, priceInput, currentPrice, currentPriceSub, amountLabel, amountButton, maxValue, costValue;

        if (isUSDMTab) {
            switch (coin) {
                case 'BTCUSDT':
                    sellOrders = usdmSellOrders;
                    buyOrders = usdmBuyOrders;
                    priceInput = currentPriceData.price.toFixed(1);
                    currentPrice = currentPriceData.price.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
                    currentPriceSub = (currentPriceData.price + 10.3).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
                    amountLabel = 'Amount (BTC)';
                    amountButton = 'BTC';
                    maxValue = '0.000 BTC';
                    costValue = '0 USDT';
                    break;
                case 'ETHUSDT':
                    sellOrders = coinmSellOrders;
                    buyOrders = coinmBuyOrders;
                    priceInput = currentPriceData.price.toFixed(1);
                    currentPrice = currentPriceData.price.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
                    currentPriceSub = (currentPriceData.price + 1.3).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
                    amountLabel = 'Amount (ETH)';
                    amountButton = 'ETH';
                    maxValue = '0.00 ETH';
                    costValue = '0 USDT';
                    break;
                case 'SOLUSDT':
                    sellOrders = solSellOrders;
                    buyOrders = solBuyOrders;
                    priceInput = currentPriceData.price.toFixed(1);
                    currentPrice = currentPriceData.price.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
                    currentPriceSub = (currentPriceData.price + 0.4).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
                    amountLabel = 'Amount (SOL)';
                    amountButton = 'SOL';
                    maxValue = '0.00 SOL';
                    costValue = '0 USDT';
                    break;
                case 'ADAUSDT':
                    sellOrders = adaSellOrders;
                    buyOrders = adaBuyOrders;
                    priceInput = currentPriceData.price.toFixed(3);
                    currentPrice = currentPriceData.price.toFixed(3);
                    currentPriceSub = (currentPriceData.price + 0.002).toFixed(3);
                    amountLabel = 'Amount (ADA)';
                    amountButton = 'ADA';
                    maxValue = '0.00 ADA';
                    costValue = '0 USDT';
                    break;
                case 'DOTUSDT':
                    sellOrders = dotSellOrders;
                    buyOrders = dotBuyOrders;
                    priceInput = currentPriceData.price.toFixed(2);
                    currentPrice = currentPriceData.price.toFixed(2);
                    currentPriceSub = (currentPriceData.price + 0.02).toFixed(2);
                    amountLabel = 'Amount (DOT)';
                    amountButton = 'DOT';
                    maxValue = '0.00 DOT';
                    costValue = '0 USDT';
                    break;
                default:
                    sellOrders = usdmSellOrders;
                    buyOrders = usdmBuyOrders;
                    priceInput = currentPriceData.price.toFixed(1);
                    currentPrice = currentPriceData.price.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
                    currentPriceSub = (currentPriceData.price + 10.3).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
                    amountLabel = 'Amount (BTC)';
                    amountButton = 'BTC';
                    maxValue = '0.000 BTC';
                    costValue = '0 USDT';
            }
        } else {
            // COIN-M tab
            switch (coin) {
                case 'BTCUSDT':
                    sellOrders = usdmSellOrders;
                    buyOrders = usdmBuyOrders;
                    priceInput = currentPriceData.price.toFixed(1);
                    currentPrice = currentPriceData.price.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
                    currentPriceSub = (currentPriceData.price + 10.3).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
                    amountLabel = 'Amount (BTC)';
                    amountButton = 'BTC';
                    maxValue = '0.000 BTC';
                    costValue = '0 BTC';
                    break;
                case 'ETHUSDT':
                    sellOrders = coinmSellOrders;
                    buyOrders = coinmBuyOrders;
                    priceInput = currentPriceData.price.toFixed(1);
                    currentPrice = currentPriceData.price.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
                    currentPriceSub = (currentPriceData.price + 1.3).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
                    amountLabel = 'Amount (ETH)';
                    amountButton = 'ETH';
                    maxValue = '0.00 ETH';
                    costValue = '0 ETH';
                    break;
                case 'SOLUSDT':
                    sellOrders = solSellOrders;
                    buyOrders = solBuyOrders;
                    priceInput = currentPriceData.price.toFixed(1);
                    currentPrice = currentPriceData.price.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
                    currentPriceSub = (currentPriceData.price + 0.4).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
                    amountLabel = 'Amount (SOL)';
                    amountButton = 'SOL';
                    maxValue = '0.00 SOL';
                    costValue = '0 SOL';
                    break;
                case 'ADAUSDT':
                    sellOrders = adaSellOrders;
                    buyOrders = adaBuyOrders;
                    priceInput = currentPriceData.price.toFixed(3);
                    currentPrice = currentPriceData.price.toFixed(3);
                    currentPriceSub = (currentPriceData.price + 0.002).toFixed(3);
                    amountLabel = 'Amount (ADA)';
                    amountButton = 'ADA';
                    maxValue = '0.00 ADA';
                    costValue = '0 ADA';
                    break;
                case 'DOTUSDT':
                    sellOrders = dotSellOrders;
                    buyOrders = dotBuyOrders;
                    priceInput = currentPriceData.price.toFixed(2);
                    currentPrice = currentPriceData.price.toFixed(2);
                    currentPriceSub = (currentPriceData.price + 0.02).toFixed(2);
                    amountLabel = 'Amount (DOT)';
                    amountButton = 'DOT';
                    maxValue = '0.00 DOT';
                    costValue = '0 DOT';
                    break;
                default:
                    sellOrders = usdmSellOrders;
                    buyOrders = usdmBuyOrders;
                    priceInput = currentPriceData.price.toFixed(1);
                    currentPrice = currentPriceData.price.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
                    currentPriceSub = (currentPriceData.price + 10.3).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
                    amountLabel = 'Amount (BTC)';
                    amountButton = 'BTC';
                    maxValue = '0.000 BTC';
                    costValue = '0 BTC';
            }
        }

        return {
            tradingPair: `${coin} Perp`,
            priceChange: `${currentPriceData.change >= 0 ? '+' : ''}${currentPriceData.change.toFixed(2)}%`,
            fundingRate: '0.0100%',
            countdown: '06:44:29',
            currentPrice,
            currentPriceSub,
            sellOrders,
            buyOrders,
            availableBalance: isUSDMTab ? '0.00 USDT' : `0.000 ${amountButton}`,
            amountLabel,
            amountPlaceholder: isUSDMTab ? '0.000' : '0.00',
            amountButton,
            maxLabel: 'Max',
            maxValue,
            costLabel: 'Cost',
            costValue,
            priceInput
        };
    };

    const currentData = getCurrentData();

    // Update price input when tab or coin changes
    useEffect(() => {
        setPrice(currentData.priceInput);
    }, [selectedNavTab, selectedCoin]);

    const handleCoinSelect = (coinSymbol) => {
        setSelectedCoin(coinSymbol);
        setShowCoinModal(false);
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView style={FuturesStyles.container}>
                <StatusBar barStyle="light-content" backgroundColor="#0A0F1E" />

                {/* Navigation Tabs */}
                <View style={[FuturesStyles.navigationTabs, { paddingTop: insets.top + 12 }]}>
                    <View style={FuturesStyles.tabContainer}>
                        {navTabs.map((tab) => (
                            <TouchableOpacity
                                key={tab}
                                style={[
                                    FuturesStyles.navTab,
                                    selectedNavTab === tab && FuturesStyles.navTabActive
                                ]}
                                onPress={() => setSelectedNavTab(tab)}
                            >
                                <Text style={[
                                    FuturesStyles.navTabText,
                                    selectedNavTab === tab && FuturesStyles.navTabTextActive
                                ]}>
                                    {tab}
                                </Text>
                                {selectedNavTab === tab && (
                                    <View style={FuturesStyles.activeIndicator} />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Trading Pair Section */}
                <View style={FuturesStyles.tradingPairSection}>
                    <TouchableOpacity
                        style={FuturesStyles.tradingPairInfo}
                        onPress={() => setShowCoinModal(true)}
                    >
                        <Text style={FuturesStyles.tradingPairText}>{currentData.tradingPair} ▼</Text>
                        <Text style={[
                            FuturesStyles.priceChange,
                            { color: currentData.priceChange.startsWith('+') ? '#00C896' : '#FF4D4F' }
                        ]}>
                            {currentData.priceChange}
                        </Text>
                        <Text style={FuturesStyles.fundingInfo}>Funding / Countdown</Text>
                        <Text style={FuturesStyles.fundingInfo}>{currentData.fundingRate} / {currentData.countdown}</Text>
                    </TouchableOpacity>
                </View>

                {/* Coin Selection Modal */}
                <Modal
                    visible={showCoinModal}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setShowCoinModal(false)}
                >
                    <View style={FuturesStyles.modalOverlay}>
                        <View style={FuturesStyles.modalContent}>
                            <View style={FuturesStyles.modalHeader}>
                                <Text style={FuturesStyles.modalTitle}>Select Trading Pair</Text>
                                <TouchableOpacity onPress={() => setShowCoinModal(false)}>
                                    <Ionicons name="close" size={24} color="#FFFFFF" />
                                </TouchableOpacity>
                            </View>
                            <ScrollView style={FuturesStyles.modalScroll}>
                                {availableCoins.map((coin) => {
                                    const coinData = currentPrices[coin.symbol] || { price: 0, change: 0 };
                                    return (
                                        <TouchableOpacity
                                            key={coin.symbol}
                                            style={[
                                                FuturesStyles.coinOption,
                                                selectedCoin === coin.symbol && FuturesStyles.coinOptionSelected
                                            ]}
                                            onPress={() => handleCoinSelect(coin.symbol)}
                                        >
                                            <View style={FuturesStyles.coinInfo}>
                                                <Text style={FuturesStyles.coinSymbol}>{coin.symbol}</Text>
                                                <Text style={FuturesStyles.coinName}>{coin.name}</Text>
                                            </View>
                                            <View style={FuturesStyles.coinPrice}>
                                                <Text style={FuturesStyles.coinPriceText}>
                                                    {coinData.price.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 3 })}
                                                </Text>
                                                <Text style={[
                                                    FuturesStyles.coinChange,
                                                    { color: coinData.change >= 0 ? '#00C896' : '#FF4D4F' }
                                                ]}>
                                                    {coinData.change >= 0 ? '+' : ''}{coinData.change.toFixed(2)}%
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })}
                            </ScrollView>
                        </View>
                    </View>
                </Modal>

                {/* Main Content */}
                <View style={FuturesStyles.mainContent}>
                    {/* Order Book Section */}
                    <View style={FuturesStyles.orderBookSection}>
                        <View style={FuturesStyles.orderBookHeader}>
                            <Text style={FuturesStyles.orderBookTitle}>Price (USDT)</Text>
                            <Text style={FuturesStyles.orderBookTitle}>Amount ({currentData.amountButton})</Text>
                        </View>

                        <View style={FuturesStyles.orderBookContent}>
                            {/* Sell Orders */}
                            <View style={FuturesStyles.sellOrders}>
                                {currentData.sellOrders.map((order, index) => (
                                    <View key={index} style={[FuturesStyles.orderRow, FuturesStyles.sellOrderRow]}>
                                        <Text style={[FuturesStyles.orderPrice, FuturesStyles.sellPrice]}>
                                            {order.price}
                                        </Text>
                                        <Text style={FuturesStyles.orderAmount}>{order.amount}</Text>
                                    </View>
                                ))}
                            </View>

                            {/* Current Price */}
                            <View style={FuturesStyles.currentPrice}>
                                <Text style={FuturesStyles.currentPriceText}>{currentData.currentPrice}</Text>
                                <Text style={FuturesStyles.currentPriceSubtext}>{currentData.currentPriceSub}</Text>
                            </View>

                            {/* Buy Orders */}
                            <View style={FuturesStyles.buyOrders}>
                                {currentData.buyOrders.map((order, index) => (
                                    <View key={index} style={[FuturesStyles.orderRow, FuturesStyles.buyOrderRow]}>
                                        <Text style={[FuturesStyles.orderPrice, FuturesStyles.buyPrice]}>
                                            {order.price}
                                        </Text>
                                        <Text style={FuturesStyles.orderAmount}>{order.amount}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                        <View style={FuturesStyles.orderBookFooter}>
                            <View style={FuturesStyles.precisionSelector}>
                                <Text style={FuturesStyles.precisionText}>0.1</Text>
                                <Ionicons name="chevron-down" size={16} color="#CCCCCC" />
                            </View>
                            <Ionicons name="grid" size={16} color="#CCCCCC" />
                        </View>
                    </View>

                    {/* Order Form Section */}
                    <View style={FuturesStyles.orderFormSection}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {/* Leverage Section */}
                            <View style={FuturesStyles.leverageSection}>
                                {leverageOptions.map((option) => (
                                    <TouchableOpacity
                                        key={option}
                                        style={[
                                            FuturesStyles.leverageButton,
                                            selectedLeverage === option && FuturesStyles.leverageButtonActive
                                        ]}
                                        onPress={() => handleLeverageSelect(option)}
                                    >
                                        <Text style={[
                                            FuturesStyles.leverageButtonText,
                                            selectedLeverage === option && FuturesStyles.leverageButtonTextActive
                                        ]}>
                                            {option}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* Available Balance */}
                            <View style={FuturesStyles.availableBalance}>
                                <Text style={FuturesStyles.availableText}>Avbl</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={FuturesStyles.availableAmount}>{currentData.availableBalance}</Text>
                                    <Ionicons name="swap-horizontal" size={16} color="#CCCCCC" style={{ marginLeft: 5 }} />
                                </View>
                            </View>

                            {/* Order Type */}
                            <View style={FuturesStyles.orderTypeSection}>
                                <TouchableOpacity style={FuturesStyles.orderTypeButton}>
                                    <Ionicons name="information-circle" size={16} color="#CCCCCC" />
                                    <Text style={FuturesStyles.orderTypeText}>{orderType}</Text>
                                    <Ionicons name="chevron-down" size={16} color="#CCCCCC" />
                                </TouchableOpacity>
                            </View>

                            {/* Price Input */}
                            <View style={FuturesStyles.inputSection}>
                                <Text style={FuturesStyles.inputLabel}>Price</Text>
                                <View style={FuturesStyles.inputContainer}>
                                    <TouchableOpacity onPress={() => adjustPrice('down')}>
                                        <Ionicons name="remove" size={20} color="#CCCCCC" />
                                    </TouchableOpacity>
                                    <TextInput
                                        style={FuturesStyles.inputField}
                                        value={price}
                                        onChangeText={setPrice}
                                        keyboardType="numeric"
                                        placeholderTextColor="#999999"
                                    />
                                    <TouchableOpacity onPress={() => adjustPrice('up')}>
                                        <Ionicons name="add" size={20} color="#CCCCCC" />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={FuturesStyles.inputButton}>
                                        <Text style={FuturesStyles.inputButtonText}>BBO</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Amount Input */}
                            <View style={FuturesStyles.inputSection}>
                                <Text style={FuturesStyles.inputLabel}>{currentData.amountLabel}</Text>
                                <View style={FuturesStyles.inputContainer}>
                                    <TouchableOpacity>
                                        <Ionicons name="remove" size={20} color="#CCCCCC" />
                                    </TouchableOpacity>
                                    <TextInput
                                        style={FuturesStyles.inputField}
                                        value={amount}
                                        onChangeText={setAmount}
                                        placeholder={currentData.amountPlaceholder}
                                        placeholderTextColor="#999999"
                                        keyboardType="numeric"
                                    />
                                    <TouchableOpacity>
                                        <Ionicons name="add" size={20} color="#CCCCCC" />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={FuturesStyles.inputButton}>
                                        <Text style={FuturesStyles.inputButtonText}>{currentData.amountButton}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Slider */}
                            <View style={FuturesStyles.sliderContainer}>
                                <PanGestureHandler
                                    onGestureEvent={onSliderGestureEvent}
                                    onHandlerStateChange={onSliderStateChange}
                                >
                                    <View style={FuturesStyles.slider}>
                                        <View style={[FuturesStyles.sliderThumb, { position: 'absolute', left: `${sliderValue}%`, top: -8 }]} />
                                    </View>
                                </PanGestureHandler>
                            </View>

                            {/* Radio Buttons */}
                            <View style={FuturesStyles.radioSection}>
                                <TouchableOpacity
                                    style={FuturesStyles.radioButton}
                                    onPress={() => setTpSlSelected(!tpSlSelected)}
                                >
                                    <View style={[
                                        FuturesStyles.radioCircle,
                                        tpSlSelected && FuturesStyles.radioCircleSelected
                                    ]} />
                                    <Text style={FuturesStyles.radioText}>TP/SL</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={FuturesStyles.radioButton}
                                    onPress={() => setReduceOnlySelected(!reduceOnlySelected)}
                                >
                                    <View style={[
                                        FuturesStyles.radioCircle,
                                        reduceOnlySelected && FuturesStyles.radioCircleSelected
                                    ]} />
                                    <Text style={FuturesStyles.radioText}>Reduce Only</Text>
                                </TouchableOpacity>
                            </View>

                            {/* GTC */}
                            <View style={FuturesStyles.gtcSection}>
                                <Text style={FuturesStyles.gtcText}>GTC</Text>
                                <Ionicons name="chevron-down" size={16} color="#CCCCCC" />
                            </View>

                            {/* Max/Cost Section */}
                            <View style={FuturesStyles.maxCostSection}>
                                <View style={FuturesStyles.maxCostItem}>
                                    <Text style={FuturesStyles.maxCostLabel}>{currentData.maxLabel}</Text>
                                    <Text style={FuturesStyles.maxCostValue}>{currentData.maxValue}</Text>
                                </View>
                                <View style={FuturesStyles.maxCostItem}>
                                    <Text style={FuturesStyles.maxCostLabel}>{currentData.costLabel}</Text>
                                    <Text style={FuturesStyles.maxCostValue}>{currentData.costValue}</Text>
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </SafeAreaView>
        </GestureHandlerRootView>
    );
}