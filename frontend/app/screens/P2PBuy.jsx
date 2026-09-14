import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Animated, Alert } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useUser } from '../../contexts/UserContext';
import { usePayment } from '../../contexts/PaymentContext';
import styles from '../styles/P2PBuy.styles';
import { createOrder } from '../../services/p2pService';
import { usePortfolio } from '../../contexts/PortfolioContext';

const GREEN = '#00C896';
const RED = '#FF4D4F';

export default function P2PBuy() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const params = useLocalSearchParams();
    const { listingId, trader, price, limit, payment, selectedCrypto } = params;

    const [amount, setAmount] = useState('');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const { balance, hasFirstDeposit } = useUser();
    const { getConnectedMobileMoney } = usePayment();
    const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [showInsufficientBalanceModal, setShowInsufficientBalanceModal] = useState(false);
    const [calculatedCrypto, setCalculatedCrypto] = useState('0');
    const [placing, setPlacing] = useState(false);
    const [orderError, setOrderError] = useState('');
    const { refresh: refreshPortfolio } = usePortfolio();

    // Animation values
    const modalOpacity = useRef(new Animated.Value(0)).current;
    const modalScale = useRef(new Animated.Value(0.9)).current;

    // Get connected mobile money payment methods
    const paymentMethods = getConnectedMobileMoney().map(mobile => mobile.name);

    const backButtonStyle = {
        backgroundColor: 'rgba(35,40,52,0.95)',
        borderRadius: 30,
        padding: 12,
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.08)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.16,
        shadowRadius: 8,
        elevation: 4,
        alignItems: 'center',
        justifyContent: 'center',
    };

    // Calculate crypto amount when USD amount changes
    useEffect(() => {
        if (amount && price) {
            const cryptoAmount = (parseFloat(amount) / parseFloat(price)).toFixed(6);
            setCalculatedCrypto(cryptoAmount);
        } else {
            setCalculatedCrypto('0');
        }
    }, [amount, price]);

    // Animate modal
    const animateModal = (show) => {
        if (show) {
            // Reset animation values first
            modalOpacity.setValue(0);
            modalScale.setValue(0.9);

            Animated.parallel([
                Animated.timing(modalOpacity, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(modalScale, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(modalOpacity, {
                    toValue: 0,
                    duration: 150,
                    useNativeDriver: true,
                }),
                Animated.timing(modalScale, {
                    toValue: 0.9,
                    duration: 150,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    };

    const handleBuyPress = () => {
        console.log('Buy button pressed');
        console.log('Amount:', amount);
        console.log('Selected payment method:', selectedPaymentMethod);
        console.log('Limit:', limit);

        // Check if user has made first deposit
        if (!hasFirstDeposit) {
            setShowInsufficientBalanceModal(true);
            return;
        }

        // Validate inputs
        if (!amount || parseFloat(amount) <= 0) {
            Alert.alert('Invalid Amount', 'Please enter a valid amount');
            return;
        }
        if (!selectedPaymentMethod) {
            Alert.alert('Payment Method Required', 'Please select a payment method');
            return;
        }

        // Check if user has sufficient balance
        const userAmount = parseFloat(amount);
        if (userAmount > balance) {
            setShowInsufficientBalanceModal(true);
            return;
        }

        // Parse the limit range (e.g., "₵100-₵50,000" -> max: 50000)
        const limitRange = limit?.split('-');
        const maxLimit = parseFloat(limitRange?.[1]?.replace(/[^0-9.]/g, '') || '0');

        console.log('Max limit:', maxLimit, 'User amount:', userAmount, 'Balance:', balance);

        if (userAmount > maxLimit) {
            Alert.alert('Amount Too High', `Maximum amount for this trader is ₵${maxLimit.toLocaleString()}`);
            return;
        }

        console.log('Setting confirmation popup to true');
        setShowConfirmationPopup(true);
    };

    /**
     * Places the order against the listing.
     *
     * The Confirm button used to call a handler that only swapped popups, so
     * the screen reported a successful purchase without telling the backend.
     * A second handler here did check the payment method but was attached to
     * nothing; the two are merged into this one.
     */
    const handleAmountConfirm = async () => {
        if (!selectedPaymentMethod) {
            Alert.alert('Payment Method Required', 'Please select a payment method');
            return;
        }
        if (!listingId) {
            setOrderError('This offer is missing its listing reference. Go back and pick it again.');
            return;
        }

        setOrderError('');
        setPlacing(true);
        try {
            // The backend takes the crypto amount; the field collects cedis.
            await createOrder({
                listingId: Number(listingId),
                amount: Number(calculatedCrypto),
            });
            await refreshPortfolio();
            setShowConfirmationPopup(false);
            setShowSuccessPopup(true);
            animateModal(true);
        } catch (error) {
            setOrderError(error.message || 'Could not place the order.');
        } finally {
            setPlacing(false);
        }
    };

    const handleFinalConfirm = () => {
        console.log('Final confirm, going back');
        setShowSuccessPopup(false);
        setTimeout(() => {
            router.back();
        }, 200);
    };

    const closeModal = () => {
        console.log('Closing modal');
        setShowConfirmationPopup(false);
        setShowSuccessPopup(false);
    };

    return (
        <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top + 10 }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={backButtonStyle}>
                    <Ionicons name="arrow-back" size={20} color="#fff" />
                </TouchableOpacity>
                <View style={{ flex: 1 }} />
            </View>

            {/* Description Box */}
            <View style={styles.descriptionBox}>
                <View style={styles.descriptionContent}>
                    <Animated.View style={styles.descriptionIconContainer}>
                        <Feather name="users" size={24} color={GREEN} />
                    </Animated.View>
                    <Text style={styles.descriptionText}>
                        Complete your purchase with {trader} using your preferred payment method
                    </Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Trader Info Card */}
                <View style={styles.traderCard}>
                    <View style={styles.traderHeader}>
                        <View style={styles.traderAvatar}>
                            <Text style={styles.traderInitial}>{trader?.charAt(0)}</Text>
                        </View>
                        <View style={styles.traderInfo}>
                            <Text style={styles.traderName}>{trader}</Text>
                            <Text style={styles.traderStatus}>Online • Verified</Text>
                        </View>
                    </View>
                    <View style={styles.traderDetails}>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Price:</Text>
                            <Text style={styles.detailValue}>₵{price}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Limit:</Text>
                            <Text style={styles.detailValue}>{limit}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Payment:</Text>
                            <Text style={styles.detailValue}>{payment}</Text>
                        </View>
                    </View>
                </View>

                {/* Amount Input Box */}
                <View style={styles.inputBox}>
                    <Text style={styles.inputLabel}>Amount (GHS)</Text>
                    <View style={styles.amountInputBox}>
                        <Text style={styles.currencySymbol}>₵</Text>
                        <TextInput
                            style={styles.amountInputField}
                            placeholder="Enter amount"
                            placeholderTextColor="#666"
                            value={amount}
                            onChangeText={setAmount}
                            keyboardType="numeric"
                        />
                    </View>
                    {amount && price && (
                        <View style={styles.calculationDisplay}>
                            <Text style={styles.calculationText}>
                                You&apos;ll receive: <Text style={styles.calculationValue}>{calculatedCrypto} {selectedCrypto}</Text>
                            </Text>
                        </View>
                    )}
                    <View style={styles.limitHint}>
                        <Ionicons name="information-circle-outline" size={16} color="#aaa" />
                        <Text style={styles.limitHintText}>Trader limit: {limit}</Text>
                    </View>
                </View>

                {/* Payment Method Selection Box */}
                <View style={styles.inputBox}>
                    <Text style={styles.inputLabel}>Payment Method</Text>
                    <View style={styles.paymentMethodBox}>
                        {paymentMethods.map((method) => (
                            <TouchableOpacity
                                key={method}
                                style={[
                                    styles.paymentMethodOption,
                                    selectedPaymentMethod === method && styles.paymentMethodOptionActive,
                                ]}
                                onPress={() => setSelectedPaymentMethod(method)}
                            >
                                <View style={styles.paymentMethodContent}>
                                    <Ionicons
                                        name={method === 'Bank Transfer' ? 'card-outline' : 'phone-portrait-outline'}
                                        size={20}
                                        color={selectedPaymentMethod === method ? GREEN : '#aaa'}
                                    />
                                    <Text style={[
                                        styles.paymentMethodText,
                                        selectedPaymentMethod === method && styles.paymentMethodTextActive,
                                    ]}>
                                        {method}
                                    </Text>
                                </View>
                                {selectedPaymentMethod === method && (
                                    <Ionicons name="checkmark-circle" size={20} color={GREEN} />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Buy Button */}
                <TouchableOpacity style={styles.buyButton} onPress={handleBuyPress}>
                    <Text style={styles.buyButtonText}>Buy {selectedCrypto}</Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Confirmation Modal */}
            {showConfirmationPopup && (
                <View style={styles.modalOverlay}>
                    <View style={styles.simpleOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Confirm Order</Text>
                                <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                                    <Ionicons name="close" size={24} color="#aaa" />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.modalBody}>
                                <View style={styles.confirmationCard}>
                                    <View style={styles.confirmationRow}>
                                        <Text style={styles.confirmationLabel}>Amount:</Text>
                                        <Text style={styles.confirmationValue}>₵{amount}</Text>
                                    </View>
                                    <View style={styles.confirmationRow}>
                                        <Text style={styles.confirmationLabel}>You&apos;ll receive:</Text>
                                        <Text style={styles.confirmationValue}>{calculatedCrypto} {selectedCrypto}</Text>
                                    </View>
                                    <View style={styles.confirmationRow}>
                                        <Text style={styles.confirmationLabel}>Payment method:</Text>
                                        <Text style={styles.confirmationValue}>{selectedPaymentMethod}</Text>
                                    </View>
                                    <View style={styles.confirmationRow}>
                                        <Text style={styles.confirmationLabel}>Trader:</Text>
                                        <Text style={styles.confirmationValue}>{trader}</Text>
                                    </View>
                                </View>
                                <View style={styles.warningBox}>
                                    <Ionicons name="warning-outline" size={20} color="#FFA500" />
                                    {orderError ? (
                                        <Text style={[styles.warningText, { color: RED }]}>{orderError}</Text>
                                    ) : null}
                                    <Text style={styles.warningText}>
                                        Please ensure you have the funds ready. The trader will contact you shortly.
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.modalFooter}>
                                <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
                                    <Text style={styles.cancelButtonText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.confirmButton}
                                    onPress={handleAmountConfirm}
                                    disabled={placing}
                                >
                                    <Text style={styles.confirmButtonText}>
                                        {placing ? 'Placing...' : 'Confirm'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            )}

            {/* Success Modal */}
            {showSuccessPopup && (
                <View style={styles.modalOverlay}>
                    <View style={styles.simpleOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Transaction Successful!</Text>
                                <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                                    <Ionicons name="close" size={24} color="#aaa" />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.modalBody}>
                                <Ionicons name="check-circle" size={60} color={GREEN} style={styles.successIcon} />
                                <Text style={styles.successMessage}>Your buy order has been created.</Text>
                                <Text style={styles.successMessage}>The trader will contact you shortly.</Text>
                            </View>
                            <View style={styles.modalFooter}>
                                <TouchableOpacity style={styles.confirmButton} onPress={handleFinalConfirm}>
                                    <Text style={styles.confirmButtonText}>OK</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            )}

            {/* Insufficient Balance Modal */}
            {showInsufficientBalanceModal && (
                <View style={styles.modalOverlay}>
                    <View style={styles.simpleOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Insufficient Balance</Text>
                                <TouchableOpacity onPress={() => setShowInsufficientBalanceModal(false)} style={styles.closeButton}>
                                    <Ionicons name="close" size={24} color="#aaa" />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.modalBody}>
                                <Ionicons name="wallet-outline" size={60} color={RED} style={styles.successIcon} />
                                <Text style={styles.successMessage}>
                                    {!hasFirstDeposit
                                        ? "You need to add funds to your account first before making purchases."
                                        : `You don't have enough balance to complete this purchase. Your current balance is ₵${balance.toFixed(2)}.`
                                    }
                                </Text>
                            </View>
                            <View style={styles.modalFooter}>
                                <TouchableOpacity
                                    style={styles.cancelButton}
                                    onPress={() => setShowInsufficientBalanceModal(false)}
                                >
                                    <Text style={styles.cancelButtonText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.confirmButton}
                                    onPress={() => {
                                        setShowInsufficientBalanceModal(false);
                                        router.push('/screens/Deposit');
                                    }}
                                >
                                    <Text style={styles.confirmButtonText}>Add Funds</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
} 