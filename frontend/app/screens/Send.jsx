import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useWallet } from '../../contexts/WalletContext';
import { usePortfolio } from '../../contexts/PortfolioContext';
import styles from '../styles/Send.styles';

const GREEN = '#00C896';

export default function Send() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { updateBalance, addTransaction } = useWallet();
    // The sufficiency check now weighs the request against the account's real
    // cedi balance rather than the copy this device had saved.
    const { getBalance } = usePortfolio();
    const balance = getBalance('GHS');
    const [amount, setAmount] = useState('');
    const [receiver, setReceiver] = useState('');
    const [selectedCurrency, setSelectedCurrency] = useState('GHS');
    const [showCurrencyModal, setShowCurrencyModal] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const currencies = [
        { symbol: 'GHS', name: 'Ghanaian Cedi' },
    ];

    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleSend = () => {
        if (!amount.trim()) {
            Alert.alert('Error', 'Please enter the amount to send');
            return;
        }

        if (!receiver.trim()) {
            Alert.alert('Error', 'Please enter the receiver\'s address or wallet name');
            return;
        }

        if (parseFloat(amount) <= 0) {
            Alert.alert('Error', 'Amount must be greater than 0');
            return;
        }

        // Check if user has sufficient balance
        const sendAmount = parseFloat(amount);
        if (sendAmount > balance) {
            Alert.alert('Insufficient Balance', 'You don\'t have enough funds to complete this transaction.');
            return;
        }

        setShowConfirmationModal(true);
    };

    const handleConfirmSend = async () => {
        setShowConfirmationModal(false);
        setIsProcessing(true);

        // NOTE: there is no backend endpoint for sending to a wallet address.
        // /api/assets/withdraw is a Paystack mobile-money payout keyed on a
        // phone number, which is a different operation from what this screen
        // collects, so the transfer itself is still local.
        setTimeout(async () => {
            try {
                // Deduct the amount from wallet balance
                const sendAmount = parseFloat(amount);
                await updateBalance(-sendAmount); // Deduct amount (negative value)

                // Add transaction record
                await addTransaction({
                    type: 'send',
                    amount: -sendAmount,
                    currency: 'GHS',
                    description: `Sent to ${receiver}`,
                    status: 'completed',
                    receiver: receiver
                });

                setIsProcessing(false);
                setShowSuccessModal(true);
            } catch {
                Alert.alert('Error', 'Failed to process the transaction. Please try again.');
                setIsProcessing(false);
            }
        }, 2000);
    };

    const handleSuccessClose = () => {
        setShowSuccessModal(false);
        router.push('/screens/WalletDashboard');
    };

    const formatAmount = (text) => {
        // Remove any non-numeric characters except decimal point
        const cleaned = text.replace(/[^0-9.]/g, '');
        // Ensure only one decimal point
        const parts = cleaned.split('.');
        if (parts.length > 2) {
            return parts[0] + '.' + parts.slice(1).join('');
        }
        return cleaned;
    };

    return (
        <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={20} color="#fff" />
                </TouchableOpacity>
                <View style={styles.headerRight} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Description Box */}
                <View style={styles.descriptionBox}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={styles.descriptionIcon}>
                            <Ionicons name="arrow-up-circle-outline" size={22} color={GREEN} />
                        </View>
                        <View style={styles.descriptionTextContainer}>
                            <Text style={styles.descriptionTitle}>Send Crypto</Text>
                            <Text style={styles.descriptionText}>Transfer your cryptocurrencies to another wallet or address</Text>
                        </View>
                    </View>
                </View>

                {/* Amount Section */}
                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>Amount</Text>

                    <View style={styles.amountContainer}>
                        <View style={styles.currencySelector}>
                            <TouchableOpacity
                                style={styles.currencyButton}
                                onPress={() => setShowCurrencyModal(true)}
                            >
                                <Text style={styles.currencySymbol}>{selectedCurrency}</Text>
                                <Ionicons name="chevron-down" size={16} color="#aaa" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.amountInputContainer}>
                            <TextInput
                                style={styles.amountInput}
                                placeholder="0.00"
                                placeholderTextColor="#666"
                                value={amount}
                                onChangeText={(text) => setAmount(formatAmount(text))}
                                keyboardType="decimal-pad"
                                autoFocus={true}
                            />
                            <Text style={styles.currencyLabel}>{selectedCurrency}</Text>
                        </View>
                    </View>

                    <View style={styles.balanceInfo}>
                        <Text style={styles.balanceLabel}>Available Balance:</Text>
                        <Text style={styles.balanceAmount}>₵{balance.toFixed(2)}</Text>
                    </View>
                </View>

                {/* Receiver Section */}
                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>Receiver</Text>

                    <TextInput
                        style={styles.receiverInput}
                        placeholder="Enter wallet address or Bitby username"
                        placeholderTextColor="#666"
                        value={receiver}
                        onChangeText={setReceiver}
                        multiline={false}
                    />

                    <View style={styles.receiverInfo}>
                        <Ionicons name="information-circle-outline" size={16} color="#666" />
                        <Text style={styles.receiverInfoText}>
                            You can send to a wallet address or search for a Bitby username
                        </Text>
                    </View>
                </View>

                {/* Network Fee Section */}
                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>Network Fee</Text>

                    <View style={styles.feeContainer}>
                        <View style={styles.feeRow}>
                            <Text style={styles.feeLabel}>Estimated Fee:</Text>
                            <Text style={styles.feeAmount}>0.001 {selectedCurrency}</Text>
                        </View>
                        <View style={styles.feeRow}>
                            <Text style={styles.feeLabel}>Total Amount:</Text>
                            <Text style={styles.totalAmount}>
                                {amount ? (parseFloat(amount) + 0.001).toFixed(6) : '0.001'} {selectedCurrency}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Send Button */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.sendButton, (!amount.trim() || !receiver.trim()) && styles.disabledButton]}
                        onPress={handleSend}
                        disabled={!amount.trim() || !receiver.trim()}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.sendButtonText}>Send</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Currency Selection Modal */}
            {showCurrencyModal && (
                <Modal
                    transparent={true}
                    visible={showCurrencyModal}
                    animationType="fade"
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <View style={styles.modalHeader}>
                                    <View style={styles.modalHeaderContent}>
                                        <View style={styles.modalHeaderIcon}>
                                            <Ionicons name="wallet-outline" size={20} color={GREEN} />
                                        </View>
                                        <Text style={styles.modalTitle}>Select Currency</Text>
                                    </View>
                                    <TouchableOpacity
                                        style={styles.closeButton}
                                        onPress={() => setShowCurrencyModal(false)}
                                    >
                                        <Ionicons name="close" size={20} color="#aaa" />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.currencyList}>
                                    {currencies.map((currency) => (
                                        <TouchableOpacity
                                            key={currency.symbol}
                                            style={[
                                                styles.currencyOption,
                                                selectedCurrency === currency.symbol && styles.selectedCurrencyOption
                                            ]}
                                            onPress={() => {
                                                setSelectedCurrency(currency.symbol);
                                                setShowCurrencyModal(false);
                                            }}
                                            activeOpacity={0.7}
                                        >
                                            <View style={styles.currencyOptionContent}>
                                                <View style={styles.currencyOptionText}>
                                                    <Text style={[
                                                        styles.currencyOptionSymbol,
                                                        selectedCurrency === currency.symbol && styles.selectedCurrencySymbol
                                                    ]}>
                                                        {currency.symbol}
                                                    </Text>
                                                    <Text style={styles.currencyOptionName}>{currency.name}</Text>
                                                </View>
                                            </View>
                                            {selectedCurrency === currency.symbol && (
                                                <View style={styles.checkmarkContainer}>
                                                    <Ionicons name="checkmark-circle" size={20} color={GREEN} />
                                                </View>
                                            )}
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
            )}

            {/* Confirmation Modal */}
            {showConfirmationModal && (
                <Modal
                    transparent={true}
                    visible={showConfirmationModal}
                    animationType="fade"
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <View style={styles.modalHeader}>
                                    <View style={styles.modalHeaderContent}>
                                        <View style={styles.modalHeaderIcon}>
                                            <Ionicons name="warning-outline" size={20} color="#FFA500" />
                                        </View>
                                        <Text style={styles.modalTitle}>Confirm Transaction</Text>
                                    </View>
                                    <TouchableOpacity
                                        style={styles.closeButton}
                                        onPress={() => setShowConfirmationModal(false)}
                                    >
                                        <Ionicons name="close" size={20} color="#aaa" />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.confirmationContent}>
                                    <Text style={styles.confirmationText}>
                                        Are you sure you want to send {amount} {selectedCurrency} to:
                                    </Text>
                                    <Text style={styles.receiverAddress}>{receiver}</Text>

                                    <View style={styles.transactionDetails}>
                                        <View style={styles.detailRow}>
                                            <Text style={styles.detailLabel}>Amount:</Text>
                                            <Text style={styles.detailValue}>{amount} {selectedCurrency}</Text>
                                        </View>
                                        <View style={styles.detailRow}>
                                            <Text style={styles.detailLabel}>Network Fee:</Text>
                                            <Text style={styles.detailValue}>0.001 {selectedCurrency}</Text>
                                        </View>
                                        <View style={styles.detailRow}>
                                            <Text style={styles.detailLabel}>Total:</Text>
                                            <Text style={styles.detailValue}>{(parseFloat(amount) + 0.001).toFixed(6)} {selectedCurrency}</Text>
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.modalButtons}>
                                    <TouchableOpacity
                                        style={styles.cancelButton}
                                        onPress={() => setShowConfirmationModal(false)}
                                    >
                                        <Text style={styles.cancelButtonText}>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.confirmButton}
                                        onPress={handleConfirmSend}
                                    >
                                        <Text style={styles.confirmButtonText}>Confirm Send</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
            )}

            {/* Success Modal */}
            {showSuccessModal && (
                <Modal
                    transparent={true}
                    visible={showSuccessModal}
                    animationType="fade"
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <View style={styles.successIconContainer}>
                                    <Ionicons name="checkmark-circle" size={64} color={GREEN} />
                                </View>
                                <Text style={styles.successTitle}>Transaction Successful!</Text>
                                <Text style={styles.successText}>
                                    Your {amount} {selectedCurrency} has been sent successfully to {receiver}.
                                </Text>
                                <TouchableOpacity
                                    style={styles.successButton}
                                    onPress={handleSuccessClose}
                                >
                                    <Text style={styles.successButtonText}>Done</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            )}
        </SafeAreaView>
    );
} 