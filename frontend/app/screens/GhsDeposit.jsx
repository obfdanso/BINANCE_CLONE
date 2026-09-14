import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Animated, TextInput, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useNotifications } from '../../contexts/NotificationsContext';

import styles from '../styles/GhsDeposit.styles';

const GREEN = '#00C896';

export default function GhsDeposit() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { notifications } = useNotifications();
    const [amount, setAmount] = useState('');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('mobile_money');


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

    // Calculate unread notifications count
    const unreadCount = notifications.filter(notification => !notification.read).length;

    const paymentMethods = [
        {
            id: 'mobile_money',
            name: 'Mobile Money',
            icon: 'phone-portrait',
            color: '#FFC107',
            description: 'MTN',
            fee: '2.5 GHS',
            processingTime: 'Instant'
        },
    ];

    const handlePaymentMethodSelect = (method) => {
        setSelectedPaymentMethod(method);
    };

    const handleProceed = () => {
        if (!amount || parseFloat(amount) < 10) {
            Alert.alert('Invalid Amount', 'Please enter a valid amount of at least ₵10.00 GHS');
            return;
        }
        if (!selectedPaymentMethod) {
            Alert.alert('Select Payment Method', 'Please select a payment method to continue');
            return;
        }
        router.push({
            pathname: '/screens/GhsDepositConfirm',
            params: {
                amount: amount,
                paymentMethod: 'Mobile Money'
            }
        });
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
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
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


                    {/* Amount Input */}
                    <Animated.View
                        style={[
                            styles.amountCard,
                            {
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }]
                            }
                        ]}
                    >
                        <Text style={styles.amountLabel}>Enter Amount (GHS)</Text>
                        <View style={styles.amountInputContainer}>
                            <Text style={styles.currencySymbol}>₵</Text>
                            <TextInput
                                style={styles.amountInput}
                                value={amount}
                                onChangeText={(text) => setAmount(formatAmount(text))}
                                placeholder="0.00"
                                placeholderTextColor="#666"
                                keyboardType="numeric"
                                autoFocus
                            />
                        </View>
                        <Text style={styles.amountHint}>Minimum deposit: ₵10.00</Text>
                    </Animated.View>

                    {/* Payment Method Selection */}
                    <Animated.View
                        style={[
                            styles.paymentMethodCard,
                            {
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }]
                            }
                        ]}
                    >
                        <Text style={styles.sectionTitle}>Select Payment Method</Text>

                        {paymentMethods.map((method) => (
                            <TouchableOpacity
                                key={method.id}
                                style={[
                                    styles.paymentMethodItem,
                                    selectedPaymentMethod === method.id && styles.selectedPaymentMethod
                                ]}
                                onPress={() => handlePaymentMethodSelect(method)}
                            >
                                <View style={styles.paymentMethodLeft}>
                                    <View style={[styles.paymentIcon, { backgroundColor: '#1A1F2E', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' }]}>
                                        <Ionicons name={method.icon} size={20} color={GREEN} />
                                    </View>
                                    <View style={styles.paymentMethodInfo}>
                                        <Text style={styles.paymentMethodName}>{method.name}</Text>
                                        <Text style={styles.paymentMethodDesc}>{method.description}</Text>
                                    </View>
                                </View>
                                <View style={styles.paymentMethodRight}>
                                    <Text style={styles.paymentFee}>Fee: {method.fee}</Text>
                                    <Text style={styles.paymentTime}>{method.processingTime}</Text>
                                </View>
                                {selectedPaymentMethod === method.id && (
                                    <View style={styles.selectedIndicator}>
                                        <Ionicons name="checkmark-circle" size={24} color={GREEN} />
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))}
                    </Animated.View>

                    {/* Proceed Button */}
                    <Animated.View
                        style={[
                            styles.proceedButtonContainer,
                            {
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }]
                            }
                        ]}
                    >
                        <TouchableOpacity
                            style={[
                                styles.proceedButton,
                                (!amount || parseFloat(amount) < 10 || !selectedPaymentMethod) && styles.proceedButtonDisabled
                            ]}
                            onPress={handleProceed}
                            disabled={!amount || parseFloat(amount) < 10 || !selectedPaymentMethod}
                        >
                            <Text style={[
                                styles.proceedButtonText,
                                (!amount || parseFloat(amount) < 10 || !selectedPaymentMethod) && styles.proceedButtonTextDisabled
                            ]}>
                                Proceed to Payment
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
} 