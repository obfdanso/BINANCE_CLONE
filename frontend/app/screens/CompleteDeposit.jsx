import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Animated, TextInput, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useNotifications } from '../../contexts/NotificationsContext';
import { BlurView } from 'expo-blur';
import styles from '../styles/CompleteDeposit.styles';

const GREEN = '#00C896';

export default function CompleteDeposit() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const params = useLocalSearchParams();
    const { notifications } = useNotifications();
    const [showQRModal, setShowQRModal] = useState(false);
    const [copiedAddress, setCopiedAddress] = useState(false);
    const [amount, setAmount] = useState('');
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // Get selected coin and network from params
    const selectedCoin = params.coin || '';
    const selectedNetwork = params.network || '';

    // Animation values
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Pulse animation for the deposit icon
        const pulseAnimation = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.1,
                    duration: 2000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 2000,
                    useNativeDriver: true,
                }),
            ])
        );
        pulseAnimation.start();
    }, []);

    // Calculate unread notifications count
    const unreadCount = notifications.filter(notification => !notification.read).length;

    const handleCopyAddress = () => {
        setCopiedAddress(true);
        setTimeout(() => setCopiedAddress(false), 2000);
        Alert.alert('Copied!', 'Deposit address copied to clipboard');
    };

    const handleShareAddress = () => {
        Alert.alert('Share', 'Share deposit address');
    };

    const handleViewHistory = () => {
        Alert.alert('History', 'View deposit history');
    };

    return (
        <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top + 10 }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                {/* Description Box */}
                <View style={styles.descriptionBox}>
                    <Animated.View style={[styles.descriptionIcon, { transform: [{ scale: pulseAnim }] }]}>
                        <Feather name="download" size={24} color={GREEN} />
                    </Animated.View>
                    <View style={styles.descriptionContent}>
                        <Text style={styles.descriptionTitle}>Complete Deposit</Text>
                        <Text style={styles.descriptionText}>
                            Send {selectedCoin} via {selectedNetwork} to complete your deposit.
                        </Text>
                    </View>
                </View>

                {/* Selected Coin & Network Info */}
                <View style={styles.infoSection}>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Coin:</Text>
                        <Text style={styles.infoValue}>{selectedCoin}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Network:</Text>
                        <Text style={styles.infoValue}>{selectedNetwork}</Text>
                    </View>
                </View>

                {/* Amount Input */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Enter Amount</Text>
                    <View style={styles.amountContainer}>
                        <TextInput
                            style={styles.amountInput}
                            placeholder="0.00"
                            placeholderTextColor="#aaa"
                            value={amount}
                            onChangeText={setAmount}
                            keyboardType="numeric"
                            autoFocus={false}
                        />
                        <Text style={styles.currencyLabel}>{selectedCoin}</Text>
                    </View>
                </View>

                {/* Deposit Button */}
                <View style={styles.depositButtonContainer}>
                    <TouchableOpacity
                        style={[styles.depositButton, !amount && styles.depositButtonDisabled]}
                        onPress={() => {
                            if (amount) {
                                setShowConfirmModal(true);
                            }
                        }}
                        disabled={!amount}
                    >
                        <Text style={[styles.depositButtonText, !amount && styles.depositButtonTextDisabled]}>
                            Confirm Deposit
                        </Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>

            {/* Confirmation Modal */}
            {showConfirmModal && (
                <View style={styles.modalOverlay}>
                    <BlurView intensity={30} tint="dark" style={styles.modalBlur}>
                        <View style={styles.confirmModalContent}>
                            <View style={styles.confirmModalHeader}>
                                <View style={styles.confirmIconContainer}>
                                    <MaterialCommunityIcons name="alert-circle-outline" size={32} color={GREEN} />
                                </View>
                                <Text style={styles.confirmModalTitle}>Confirm Deposit</Text>
                                <Text style={styles.confirmModalText}>
                                    Are you sure you want to deposit {amount} {selectedCoin} via {selectedNetwork}?
                                </Text>
                            </View>
                            <View style={styles.confirmModalButtons}>
                                <TouchableOpacity
                                    style={styles.cancelButton}
                                    onPress={() => setShowConfirmModal(false)}
                                >
                                    <Text style={styles.cancelButtonText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.confirmButton}
                                    onPress={() => {
                                        setShowConfirmModal(false);
                                        setShowSuccessModal(true);
                                    }}
                                >
                                    <Text style={styles.confirmButtonText}>Confirm</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </BlurView>
                </View>
            )}

            {/* Success Modal */}
            {showSuccessModal && (
                <View style={styles.modalOverlay}>
                    <BlurView intensity={30} tint="dark" style={styles.modalBlur}>
                        <View style={styles.successModalContent}>
                            <View style={styles.successModalHeader}>
                                <View style={styles.successIconContainer}>
                                    <Ionicons name="checkmark-circle" size={60} color={GREEN} />
                                </View>
                                <Text style={styles.successModalTitle}>Deposit Successful!</Text>
                                <Text style={styles.successModalText}>
                                    Your deposit of {amount} {selectedCoin} has been initiated successfully.
                                </Text>
                            </View>
                            <TouchableOpacity
                                style={styles.successButton}
                                onPress={() => {
                                    setShowSuccessModal(false);
                                    router.back();
                                }}
                            >
                                <Text style={styles.successButtonText}>Done</Text>
                            </TouchableOpacity>
                        </View>
                    </BlurView>
                </View>
            )}

            {/* QR Code Modal */}
            {showQRModal && (
                <View style={styles.modalOverlay}>
                    <BlurView intensity={30} tint="dark" style={styles.modalBlur}>
                        <View style={styles.qrModalContent}>
                            <View style={styles.qrModalHeader}>
                                <Text style={styles.qrModalTitle}>Scan QR Code</Text>
                                <TouchableOpacity onPress={() => setShowQRModal(false)}>
                                    <Ionicons name="close" size={24} color="#aaa" />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.qrCodeContainer}>
                                <View style={styles.qrCode}>
                                    <MaterialCommunityIcons name="qrcode" size={120} color="#fff" />
                                </View>
                                <Text style={styles.qrAddressText}>
                                    bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh
                                </Text>
                                <TouchableOpacity style={styles.qrCopyButton} onPress={handleCopyAddress}>
                                    <Ionicons name="copy-outline" size={20} color={GREEN} />
                                    <Text style={styles.qrCopyButtonText}>Copy Address</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </BlurView>
                </View>
            )}
        </SafeAreaView>
    );
} 