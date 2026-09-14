import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Animated, TextInput } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useNotifications } from '../../contexts/NotificationsContext';
import { useUser } from '../../contexts/UserContext';
import { BlurView } from 'expo-blur';
import styles from '../styles/CompleteFiatDeposit.styles';

const GREEN = '#00C896';

export default function CompleteFiatDeposit() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const params = useLocalSearchParams();
    const { notifications } = useNotifications();
    const { hasFirstDeposit, updateFirstDeposit, balance, updateBalance } = useUser();
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [amount, setAmount] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [phoneError, setPhoneError] = useState('');

    // Get selected provider from params
    const selectedProvider = params.provider || '';

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

    // Validate phone number
    const validatePhoneNumber = (number) => {
        const mtnPrefixes = ['024', '025', '054', '055', '059'];
        if (number.length >= 3) {
            const prefix = number.substring(0, 3);
            if (!mtnPrefixes.includes(prefix)) {
                setPhoneError('This number is not MTN');
                return false;
            } else {
                setPhoneError('');
                return true;
            }
        } else {
            setPhoneError('');
            return true;
        }
    };

    const handlePhoneNumberChange = (text) => {
        setPhoneNumber(text);
        validatePhoneNumber(text);
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
                        <Text style={styles.descriptionTitle}>Complete Fiat Deposit</Text>
                        <Text style={styles.descriptionText}>
                            Complete your deposit via {selectedProvider}.
                        </Text>
                    </View>
                </View>

                {/* Selected Provider Info */}
                <View style={styles.infoSection}>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Provider:</Text>
                        <Text style={styles.infoValue}>{selectedProvider}</Text>
                    </View>
                </View>

                {/* Phone Number Input */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Mobile Money Number</Text>
                    <View style={styles.phoneContainer}>
                        <TextInput
                            style={[styles.phoneInput, phoneError ? styles.phoneInputError : null]}
                            placeholder="Enter 10-digit MTN number"
                            placeholderTextColor="#aaa"
                            value={phoneNumber}
                            onChangeText={handlePhoneNumberChange}
                            keyboardType="phone-pad"
                            maxLength={10}
                            autoFocus={false}
                        />
                        <Text style={styles.phoneHint}>
                            {phoneNumber.length}/10 digits
                        </Text>
                        {phoneError ? (
                            <Text style={styles.errorText}>{phoneError}</Text>
                        ) : null}
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
                        <Text style={styles.currencyLabel}>GHS</Text>
                    </View>
                </View>

                {/* Deposit Button */}
                <View style={styles.depositButtonContainer}>
                    <TouchableOpacity
                        style={[
                            styles.depositButton,
                            (!amount || !phoneNumber || phoneNumber.length !== 10 || phoneError !== '') && styles.depositButtonDisabled
                        ]}
                        onPress={() => {
                            if (amount && phoneNumber && phoneNumber.length === 10 && phoneError === '') {
                                setShowConfirmModal(true);
                            }
                        }}
                        disabled={!amount || !phoneNumber || phoneNumber.length !== 10 || phoneError !== ''}
                    >
                        <Text style={[
                            styles.depositButtonText,
                            (!amount || !phoneNumber || phoneNumber.length !== 10 || phoneError !== '') && styles.depositButtonTextDisabled
                        ]}>
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
                                    Are you sure you want to deposit GHS {amount} via {selectedProvider} to {phoneNumber}?
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
                                        const depositAmount = parseFloat(amount);

                                        // Update balance based on whether it's first deposit or not
                                        if (!hasFirstDeposit) {
                                            updateFirstDeposit(depositAmount);
                                        } else {
                                            // Add deposit amount to existing balance
                                            updateBalance(balance + depositAmount);
                                        }
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
                                    Your deposit of GHS {amount} via {selectedProvider} has been initiated successfully.
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
        </SafeAreaView>
    );
} 