import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity, ScrollView, Animated, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { BlurView } from 'expo-blur';
import { useUser } from '../../contexts/UserContext';

export default function PreviewOrder() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { balance, updateBalance, hasFirstDeposit, updateFirstDeposit } = useUser();
    const iconAnim = useRef(new Animated.Value(0)).current;
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const {
        mode = 'Buy',
        amount = '0',
        currency = 'GHS',
        usdtAmount = '0',
        paymentMethod = 'MTN Mobile Money'
    } = params;

    // Pulse icon animation
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(iconAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
                Animated.timing(iconAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    const handleConfirmOrder = () => {
        setShowConfirmModal(true);
    };

    const handleConfirmYes = () => {
        setShowConfirmModal(false);

        const ghsAmountValue = parseFloat(amount);

        if (mode === 'Buy') {
            // When buying USDT, subtract GHS from balance
            const newBalance = balance - ghsAmountValue;
            if (newBalance >= 0) {
                updateBalance(newBalance);
                setShowSuccessModal(true);
            } else {
                // Handle insufficient balance
                alert('Insufficient balance for this transaction');
            }
        } else if (mode === 'Sell') {
            // When selling USDT, add GHS to balance
            const newBalance = balance + ghsAmountValue;
            updateBalance(newBalance);
            setShowSuccessModal(true);
        }
    };

    const handleConfirmNo = () => {
        setShowConfirmModal(false);
    };

    const handleSuccessOk = () => {
        setShowSuccessModal(false);
        router.back();
    };

    const handleCancel = () => {
        router.back();
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" translucent />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleCancel} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={20} color="#fff" />
                </TouchableOpacity>
                <View style={styles.placeholder} />
            </View>

            {/* Description Box */}
            <View style={styles.descriptionContainer}>
                <View style={styles.descriptionBox}>
                    <Animated.View style={[styles.descriptionIcon, { transform: [{ scale: iconAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.15] }) }] }]}>
                        <Ionicons name="document-text" size={24} color="#00C896" />
                    </Animated.View>
                    <View style={styles.descriptionContent}>
                        <Text style={styles.descriptionTitle}>Preview Order</Text>
                        <Text style={styles.descriptionText}>
                            Review your transaction details, fees, and terms before confirming your {mode.toLowerCase()} order.
                        </Text>
                    </View>
                </View>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Order Summary Card */}
                <View style={styles.summaryCard}>
                    <View style={styles.summaryHeader}>
                        <View style={styles.modeBadge}>
                            <Text style={styles.modeText}>{mode}</Text>
                        </View>
                        <Text style={styles.summaryTitle}>Order Summary</Text>
                    </View>

                    {/* Amount Details */}
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Amount</Text>
                        <Text style={styles.detailValue}>{amount} {currency}</Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>USDT Equivalent</Text>
                        <Text style={styles.detailValue}>{usdtAmount} USDT</Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Payment Method</Text>
                        <Text style={styles.detailValue}>{paymentMethod}</Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Transaction Type</Text>
                        <Text style={styles.detailValue}>{mode} USDT</Text>
                    </View>
                </View>

                {/* Fee Information */}
                <View style={styles.feeCard}>
                    <Text style={styles.feeTitle}>Fee Breakdown</Text>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Network Fee</Text>
                        <Text style={styles.detailValue}>0.001 USDT</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Processing Fee</Text>
                        <Text style={styles.detailValue}>0.5%</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.detailRow}>
                        <Text style={styles.totalLabel}>Total Amount</Text>
                        <Text style={styles.totalValue}>{usdtAmount} USDT</Text>
                    </View>
                </View>

                {/* Action Button */}
                <View style={styles.actionContainer}>
                    <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmOrder}>
                        <Text style={styles.confirmButtonText}>
                            {mode}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Terms and Conditions */}
                <View style={styles.termsCard}>
                    <Text style={styles.termsTitle}>Important Information</Text>
                    <Text style={styles.termsText}>
                        • Transaction will be processed within 2-5 minutes{'\n'}
                        • Rates are locked for 30 seconds{'\n'}
                        • Ensure your payment method has sufficient funds{'\n'}
                        • By proceeding, you agree to our terms of service
                    </Text>
                </View>
            </ScrollView>

            {/* Confirmation Modal */}
            <Modal
                visible={showConfirmModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowConfirmModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <BlurView intensity={30} tint="dark" style={styles.modalBlur}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalIcon}>
                                <Ionicons name="help-circle" size={48} color="#00C896" />
                            </View>
                            <Text style={styles.modalTitle}>Confirm {mode}</Text>
                            <Text style={styles.modalText}>
                                Are you sure you want to {mode.toLowerCase()} {usdtAmount} USDT for {amount} {currency}?
                            </Text>
                            <View style={styles.modalButtons}>
                                <TouchableOpacity style={styles.modalButtonNo} onPress={handleConfirmNo}>
                                    <Text style={styles.modalButtonNoText}>No</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.modalButtonYes} onPress={handleConfirmYes}>
                                    <Text style={styles.modalButtonYesText}>Yes</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </BlurView>
                </View>
            </Modal>

            {/* Success Modal */}
            <Modal
                visible={showSuccessModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowSuccessModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <BlurView intensity={30} tint="dark" style={styles.modalBlur}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalIcon}>
                                <Ionicons name="checkmark-circle" size={48} color="#00C896" />
                            </View>
                            <Text style={styles.modalTitle}>Success!</Text>
                            <Text style={styles.modalText}>
                                Your {mode.toLowerCase()} order has been successfully processed.{'\n\n'}
                                {mode === 'Buy' ?
                                    `You bought ${usdtAmount} USDT for ${amount} ${currency}` :
                                    `You sold ${usdtAmount} USDT for ${amount} ${currency}`
                                }
                                {'\n\n'}Updated Balance: ₵{balance.toFixed(2)}
                            </Text>
                            <TouchableOpacity style={styles.modalButtonYes} onPress={handleSuccessOk}>
                                <Text style={styles.modalButtonYesText}>OK</Text>
                            </TouchableOpacity>
                        </View>
                    </BlurView>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A0F1E',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 8,
    },
    backButton: {
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
    },
    placeholder: {
        width: 40,
    },
    descriptionContainer: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 20,
    },
    descriptionBox: {
        backgroundColor: '#1A1F2E',
        borderRadius: 16,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.06)',
    },
    descriptionIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#232834',
        alignItems: 'center',
        justifyContent: 'center',
    },
    descriptionContent: {
        flex: 1,
    },
    descriptionTitle: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
    },
    descriptionText: {
        color: '#CCCCCC',
        fontSize: 14,
        lineHeight: 20,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    summaryCard: {
        backgroundColor: '#1A1F2E',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.06)',
    },
    summaryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        gap: 12,
    },
    modeBadge: {
        backgroundColor: '#00C896',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    modeText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    summaryTitle: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.06)',
    },
    detailLabel: {
        color: '#CCCCCC',
        fontSize: 14,
    },
    detailValue: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    feeCard: {
        backgroundColor: '#1A1F2E',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.06)',
    },
    feeTitle: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 16,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.06)',
        marginVertical: 12,
    },
    totalLabel: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    totalValue: {
        color: '#00C896',
        fontSize: 16,
        fontWeight: '600',
    },
    termsCard: {
        backgroundColor: '#1A1F2E',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.06)',
    },
    termsTitle: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
    },
    termsText: {
        color: '#CCCCCC',
        fontSize: 14,
        lineHeight: 20,
    },
    actionContainer: {
        marginTop: 24,
        marginBottom: 20,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#CCCCCC',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#CCCCCC',
        fontSize: 16,
        fontWeight: '600',
    },
    confirmButton: {
        flex: 1,
        backgroundColor: '#00C896',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    confirmButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    // Modal Styles
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    modalBlur: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#1A1F2E',
        borderRadius: 20,
        padding: 24,
        margin: 20,
        width: '90%',
        maxWidth: 400,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.06)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 10,
    },
    modalIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(0, 200, 150, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(0, 200, 150, 0.3)',
    },
    modalTitle: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
        textAlign: 'center',
    },
    modalText: {
        color: '#aaa',
        fontSize: 16,
        lineHeight: 24,
        textAlign: 'center',
        marginBottom: 24,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        gap: 12,
    },
    modalButtonNo: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 12,
        flex: 1,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
    },
    modalButtonNoText: {
        color: '#aaa',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalButtonYes: {
        backgroundColor: '#00C896',
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 12,
        flex: 1,
        alignItems: 'center',
        shadowColor: '#00C896',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    modalButtonYesText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
}); 