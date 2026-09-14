import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useNotifications } from '../../contexts/NotificationsContext';
import { useWallet } from '../../contexts/WalletContext';
import { BlurView } from 'expo-blur';
import styles from '../styles/GhsDepositConfirm.styles';

const GREEN = '#00C896';
const BLUE = '#1890FF';

export default function GhsDepositConfirm() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const params = useLocalSearchParams();
    const { notifications } = useNotifications();
    const { updateBalance, addTransaction, updateAssets } = useWallet();
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);


    // Get deposit details from params or use defaults
    const amount = params.amount || '0';
    const paymentMethod = params.paymentMethod || 'Mobile Money';

    const handleConfirmDeposit = () => {
        setIsProcessing(true);
        // Simulate processing time
        setTimeout(async () => {
            try {
                const depositAmount = parseFloat(amount);

                // Update wallet balance with the deposited amount
                await updateBalance(depositAmount);

                // Add transaction record
                await addTransaction({
                    type: 'deposit',
                    amount: depositAmount,
                    currency: 'GHS',
                    description: 'GHS Deposit via Mobile Money',
                    status: 'completed',
                    fee: 2.50
                });

                // Update assets (GHS)
                await updateAssets({
                    symbol: 'GHS',
                    name: 'Ghanaian Cedi',
                    amount: depositAmount,
                    value: depositAmount
                });

                setIsProcessing(false);
                setShowSuccessModal(true);
            } catch (error) {
                console.log('Error processing deposit:', error);
                setIsProcessing(false);
            }
        }, 3000);
    };

    const handleSuccessClose = () => {
        setShowSuccessModal(false);
        router.push('/screens/WalletDashboard');
    };

    const handleBack = () => {
        router.back();
    };

    return (
        <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={handleBack}
                >
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <Text style={styles.headerTitle}></Text>
                </View>
                <View style={styles.headerRight}>
                </View>
            </View>

            <View style={styles.contentWrapper}>
                <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                    {/* Confirmation Card */}
                    <Animated.View
                        style={[
                            styles.confirmationCard,
                            {
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }]
                            }
                        ]}
                    >
                        <View style={styles.confirmationHeader}>
                            <View style={styles.confirmationIcon}>
                                <Ionicons name="checkmark-circle" size={40} color={GREEN} />
                            </View>
                            <Text style={styles.confirmationTitle}>Confirm Your Deposit</Text>
                            <Text style={styles.confirmationSubtitle}>Review your deposit details before proceeding</Text>
                        </View>
                    </Animated.View>

                    {/* Deposit Details */}
                    <Animated.View
                        style={[
                            styles.detailsCard,
                            {
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }]
                            }
                        ]}
                    >
                        <Text style={styles.sectionTitle}>Deposit Details</Text>

                        <View style={styles.detailRow}>
                            <View style={styles.detailLeft}>
                                <Ionicons name="cash-outline" size={20} color="#aaa" />
                                <Text style={styles.detailLabel}>Amount</Text>
                            </View>
                            <Text style={styles.detailValue}>₵{amount}</Text>
                        </View>

                        <View style={styles.detailRow}>
                            <View style={styles.detailLeft}>
                                <Ionicons name="phone-portrait-outline" size={20} color="#aaa" />
                                <Text style={styles.detailLabel}>Payment Method</Text>
                            </View>
                            <Text style={styles.detailValue}>{paymentMethod}</Text>
                        </View>

                        <View style={styles.detailRow}>
                            <View style={styles.detailLeft}>
                                <Ionicons name="card-outline" size={20} color="#aaa" />
                                <Text style={styles.detailLabel}>Processing Fee</Text>
                            </View>
                            <Text style={styles.detailValue}>₵2.50</Text>
                        </View>

                        <View style={styles.detailRow}>
                            <View style={styles.detailLeft}>
                                <Ionicons name="time-outline" size={20} color="#aaa" />
                                <Text style={styles.detailLabel}>Processing Time</Text>
                            </View>
                            <Text style={styles.detailValue}>Instant</Text>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Total Amount</Text>
                            <Text style={styles.totalValue}>₵{(parseFloat(amount) + 2.50).toFixed(2)}</Text>
                        </View>
                    </Animated.View>

                    {/* Confirm Button */}
                    <Animated.View
                        style={[
                            styles.confirmButtonContainer,
                            {
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }]
                            }
                        ]}
                    >
                        <TouchableOpacity
                            style={[
                                styles.confirmButton,
                                isProcessing && styles.confirmButtonProcessing
                            ]}
                            onPress={handleConfirmDeposit}
                            disabled={isProcessing}
                        >
                            {isProcessing ? (
                                <View style={styles.processingContainer}>
                                    <Animated.View style={styles.spinner} />
                                    <Text style={styles.confirmButtonText}>Processing...</Text>
                                </View>
                            ) : (
                                <Text style={styles.confirmButtonText}>Confirm Payment</Text>
                            )}
                        </TouchableOpacity>
                    </Animated.View>

                    {/* Important Notice */}
                    <Animated.View
                        style={[
                            styles.noticeCard,
                            {
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }]
                            }
                        ]}
                    >
                        <View style={styles.noticeHeader}>
                            <Ionicons name="information-circle-outline" size={20} color={BLUE} />
                            <Text style={styles.noticeTitle}>Important Notice</Text>
                        </View>
                        <Text style={styles.noticeText}>
                            • You will be redirected to MTN Mobile Money to complete your payment{'\n'}
                            • Ensure you have sufficient balance in your mobile money account{'\n'}
                            • The processing fee of ₵2.50 will be deducted from your payment{'\n'}
                            • Your funds will be available immediately after successful payment
                        </Text>
                    </Animated.View>
                </ScrollView>
            </View>

            {/* Success Modal */}
            {showSuccessModal && (
                <BlurView intensity={30} tint="dark" style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Ionicons name="checkmark-circle" size={40} color={GREEN} />
                            <Text style={styles.modalTitle}>Payment Successful!</Text>
                        </View>

                        <Text style={styles.successMessage}>
                            Your deposit of ₵{amount} has been processed successfully.
                            Your funds are now available in your wallet.
                        </Text>

                        <TouchableOpacity
                            style={styles.successButton}
                            onPress={handleSuccessClose}
                        >
                            <Text style={styles.successButtonText}>Continue</Text>
                        </TouchableOpacity>
                    </View>
                </BlurView>
            )}
        </SafeAreaView>
    );
} 