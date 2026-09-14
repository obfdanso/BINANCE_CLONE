import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, StatusBar, TouchableOpacity, ScrollView } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { usePayment } from '../../contexts/PaymentContext';
import styles from '../styles/Trade.styles';
import { getConvertQuote } from '../../services/convertService';

export default function Trade() {
    const router = useRouter();
    const { getConnectedMobileMoney } = usePayment();
    const [buySellMode, setBuySellMode] = useState('Buy');
    const [amount, setAmount] = useState('0');
    const [currency] = useState('GHS');
    const [usdtAmount, setUsdtAmount] = useState('0');
    // GHS per USDT, quoted by the backend rather than assumed.
    const [ghsToUsdtRate, setGhsToUsdtRate] = useState(null);
    const [rateError, setRateError] = useState('');

    const [paymentMethod, setPaymentMethod] = useState('');
    const [showPaymentDropdown, setShowPaymentDropdown] = useState(false);
    const [availablePaymentMethods, setAvailablePaymentMethods] = useState([]);

    // Get connected mobile money and set default payment method
    useEffect(() => {
        const allMobileMoney = [
            { id: 1, name: 'MTN Mobile Money', desc: 'Connected', connected: true, number: '+233 59 234 7667' },
        ];

        // Show all payment methods, with connected ones first
        const connectedMethods = allMobileMoney.filter(mobile => mobile.connected);
        const unconnectedMethods = allMobileMoney.filter(mobile => !mobile.connected);
        const allPaymentOptions = [...connectedMethods, ...unconnectedMethods].map(mobile => mobile.name);

        setAvailablePaymentMethods(allPaymentOptions);

        // Set default payment method to first connected option, or first available option
        if (connectedMethods.length > 0 && !paymentMethod) {
            setPaymentMethod(connectedMethods[0].name);
        } else if (allPaymentOptions.length > 0 && !paymentMethod) {
            setPaymentMethod(allPaymentOptions[0]);
        }
    }, [getConnectedMobileMoney, paymentMethod]);

    const MINIMUM_USDT = 1;

    /**
     * Ask the backend what a cedi is worth in USDT instead of assuming it.
     * A quote for 1 GHS gives the rate directly, fee included.
     */
    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const quote = await getConvertQuote('GHS', 'USDT', 1);
                if (cancelled) return;
                if (quote?.success !== false && Number(quote?.exchangeRate) > 0) {
                    setGhsToUsdtRate(Number(quote.exchangeRate));
                    setRateError('');
                } else {
                    setRateError(quote?.message || 'Could not load the exchange rate.');
                }
            } catch (error) {
                if (!cancelled) setRateError(error.message || 'Could not reach the server for a rate.');
            }
        })();

        return () => { cancelled = true; };
    }, []);

    // The smallest cedi amount that buys the 1 USDT minimum.
    const MINIMUM_GHS = ghsToUsdtRate ? MINIMUM_USDT / ghsToUsdtRate : null;

    const handleNumberPress = (num) => {
        let newAmount = amount;

        if (num === 'backspace') {
            newAmount = amount.slice(0, -1) || '0';
        } else if (num === '.') {
            if (!amount.includes('.')) {
                newAmount = amount + '.';
            }
        } else {
            if (amount === '0') {
                newAmount = num;
            } else {
                newAmount = amount + num;
            }
        }

        setAmount(newAmount);

        // Convert to USDT using the quoted rate.
        if (ghsToUsdtRate) {
            const usdtValue = (parseFloat(newAmount) || 0) * ghsToUsdtRate;
            setUsdtAmount(usdtValue.toFixed(2));
        }
    };

    // Check if amount is below minimum
    const isAmountBelowMinimum = () => {
        if (!MINIMUM_GHS) return false; // rate not loaded yet
        const currentAmount = parseFloat(amount) || 0;
        return currentAmount > 0 && currentAmount < MINIMUM_GHS;
    };



    const handlePaymentMethodSelect = (method) => {
        setPaymentMethod(method);
        setShowPaymentDropdown(false);
    };

    const handleBuyMinimum = () => {
        // Check if amount is 0 (minimum amount) or has a value (preview order)
        if (amount === '0' || amount === '0.0' || amount === '0.00') {
            // Set minimum amount to 1 USDT worth. Without a rate there is no
            // minimum to apply, so leave the field alone.
            if (!MINIMUM_GHS) return;
            setAmount(MINIMUM_GHS.toFixed(2));
            setUsdtAmount(MINIMUM_USDT.toFixed(2));
        } else {
            // Navigate to preview order
            router.push({
                pathname: '/screens/PreviewOrder',
                params: {
                    mode: buySellMode,
                    amount: amount,
                    currency: currency,
                    usdtAmount: usdtAmount,
                    paymentMethod: paymentMethod
                }
            });
        }
    };

    const keypadNumbers = [
        ['1', '2', '3'],
        ['4', '5', '6'],
        ['7', '8', '9'],
        ['.', '0', 'backspace']
    ];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" translucent />

            {/* Top Spacing for Status Bar */}
            <View style={styles.statusBarSpacing} />

            {/* Sticky Margin Text */}
            <View style={styles.stickyMarginTextContainer}>
                <TouchableOpacity
                    style={styles.marginTextButton}
                    onPress={() => router.push('/screens/Margin')}
                >
                    <Text style={styles.marginText}>Margin</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.marginTextButton}
                    onPress={() => router.push('/screens/Spot')}
                >
                    <Text style={styles.spotText}>Spot</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.scrollContainer}
                contentContainerStyle={styles.scrollContentContainer}
                showsVerticalScrollIndicator={false}
            >

                {/* Buy/Sell Toggle */}
                <View style={styles.toggleSection}>
                    <View style={styles.toggleContainer}>
                        <TouchableOpacity
                            style={[
                                styles.toggleButton,
                                buySellMode === 'Buy' && styles.activeToggleButton
                            ]}
                            onPress={() => setBuySellMode('Buy')}
                        >
                            <Text style={[
                                styles.toggleText,
                                buySellMode === 'Buy' && styles.activeToggleText
                            ]}>
                                Buy
                            </Text>
                            {buySellMode === 'Buy' && <View style={styles.greenBar} />}
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.toggleButton,
                                buySellMode === 'Sell' && styles.activeToggleButton
                            ]}
                            onPress={() => setBuySellMode('Sell')}
                        >
                            <Text style={[
                                styles.toggleText,
                                buySellMode === 'Sell' && styles.activeToggleText
                            ]}>
                                Sell
                            </Text>
                            {buySellMode === 'Sell' && <View style={styles.greenBar} />}
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Amount Section */}
                <View style={styles.amountSectionContainer}>
                    <Text style={styles.amountLabel}>Amount</Text>
                    <View style={styles.amountRow}>
                        <Text style={styles.amountText}>{amount}</Text>
                        <View style={styles.currencyContainer}>
                            <Text style={styles.currencyText}>{currency}</Text>
                        </View>
                    </View>
                    <View style={styles.usdtRow}>
                        <View style={styles.usdtContainer}>
                            <Ionicons name="swap-vertical" size={14} color="#00C896" />
                            <Text style={styles.usdtText}>{usdtAmount} USDT</Text>
                        </View>
                    </View>
                    {isAmountBelowMinimum() && (
                        <View style={styles.minimumAmountContainer}>
                            <Text style={styles.minimumAmountText}>
                                Minimum amount is {MINIMUM_GHS.toFixed(2)} GHS
                            </Text>
                        </View>
                    )}
                    {rateError ? (
                        <View style={styles.minimumAmountContainer}>
                            <Text style={[styles.minimumAmountText, { color: '#FF6B6B' }]}>{rateError}</Text>
                        </View>
                    ) : null}
                </View>

                {/* Payment Method Section */}
                <View style={styles.paymentSectionContainer}>
                    <TouchableOpacity
                        style={styles.sectionHeader}
                        onPress={() => setShowPaymentDropdown(true)}
                    >
                        <View style={styles.sectionLeft}>
                            <View style={styles.paymentIcon}>
                                <Ionicons
                                    name="phone-portrait"
                                    size={20}
                                    color="#00C896"
                                />
                            </View>
                            <View style={styles.paymentInfo}>
                                <Text style={styles.sectionTitle}>Payment Method</Text>
                                <Text style={styles.paymentMethod}>{paymentMethod}</Text>
                            </View>
                        </View>
                        <Ionicons name="chevron-down" size={20} color="#aaa" />
                    </TouchableOpacity>
                </View>

                {/* Payment Method Modal */}
                {showPaymentDropdown && (
                    <View style={styles.modalOverlay}>
                        <BlurView intensity={30} tint="dark" style={styles.modalBlur}>
                            <View style={styles.modalContent}>
                                <View style={styles.modalHeader}>
                                    <Text style={styles.modalTitle}>Select Payment Method</Text>
                                    <TouchableOpacity
                                        onPress={() => setShowPaymentDropdown(false)}
                                        style={styles.closeButton}
                                    >
                                        <Ionicons name="close" size={24} color="#fff" />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.paymentMethodsList}>
                                    {availablePaymentMethods.map((method) => {
                                        const isConnected = method === 'MTN Mobile Money'; // MTN is connected by default
                                        return (
                                            <TouchableOpacity
                                                key={method}
                                                style={[
                                                    styles.paymentMethodItem,
                                                    paymentMethod === method && styles.paymentMethodItemActive,
                                                    !isConnected && styles.paymentMethodItemDisabled
                                                ]}
                                                onPress={() => handlePaymentMethodSelect(method)}
                                                disabled={!isConnected}
                                            >
                                                <View style={styles.paymentMethodLeft}>
                                                    <View style={[
                                                        styles.paymentMethodIcon,
                                                        isConnected ? styles.paymentMethodIconConnected : styles.paymentMethodIconDisabled
                                                    ]}>
                                                        <Ionicons
                                                            name="phone-portrait"
                                                            size={20}
                                                            color={isConnected ? (paymentMethod === method ? "#00C896" : "#aaa") : "#666"}
                                                        />
                                                    </View>
                                                    <View style={styles.paymentMethodInfo}>
                                                        <Text style={[
                                                            styles.paymentMethodText,
                                                            paymentMethod === method && styles.paymentMethodTextActive,
                                                            !isConnected && styles.paymentMethodTextDisabled
                                                        ]}>
                                                            {method}
                                                        </Text>
                                                        <Text style={[
                                                            styles.paymentMethodStatus,
                                                            isConnected ? styles.paymentMethodStatusConnected : styles.paymentMethodStatusDisabled
                                                        ]}>
                                                            {isConnected ? 'Connected' : 'Not Connected'}
                                                        </Text>
                                                    </View>
                                                </View>
                                                {paymentMethod === method && isConnected && (
                                                    <Ionicons name="checkmark-circle" size={20} color="#00C896" />
                                                )}
                                                {!isConnected && (
                                                    <Ionicons name="lock-closed" size={16} color="#666" />
                                                )}
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>

                                <TouchableOpacity
                                    style={styles.cancelButton}
                                    onPress={() => setShowPaymentDropdown(false)}
                                >
                                    <Text style={styles.cancelButtonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </BlurView>
                    </View>
                )}

                {/* Action Button */}
                <TouchableOpacity style={styles.actionButton} onPress={handleBuyMinimum}>
                    <Text style={styles.actionButtonText}>
                        {amount === '0' || amount === '0.0' || amount === '0.00'
                            ? (buySellMode === 'Buy' ? 'Buy Minimum Amount' : 'Sell Minimum Amount')
                            : 'Preview Order'
                        }
                    </Text>
                </TouchableOpacity>

                {/* Numeric Keypad */}
                <View style={styles.keypadContainer}>
                    {keypadNumbers.map((row, rowIndex) => (
                        <View key={rowIndex} style={styles.keypadRow}>
                            {row.map((num) => (
                                <TouchableOpacity
                                    key={num}
                                    style={styles.keypadButton}
                                    onPress={() => handleNumberPress(num)}
                                >
                                    {num === 'backspace' ? (
                                        <Ionicons name="backspace" size={24} color="#FFFFFF" />
                                    ) : (
                                        <Text style={styles.keypadText}>{num}</Text>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
} 