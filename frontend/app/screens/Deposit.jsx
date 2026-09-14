import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useNotifications } from '../../contexts/NotificationsContext';
import { usePayment } from '../../contexts/PaymentContext';
import { BlurView } from 'expo-blur';
import styles from '../styles/Deposit.styles';

const GREEN = '#00C896';

export default function Deposit() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { notifications } = useNotifications();
    const { getConnectedMobileMoney } = usePayment();
    const [showMobileMoneyModal, setShowMobileMoneyModal] = useState(false);
    const [selectedMobileMoney, setSelectedMobileMoney] = useState('');

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


    // Get connected mobile money providers
    const mobileMoneyProviders = getConnectedMobileMoney().map(mobile => ({
        name: mobile.name,
        color: '#FFC107'
    }));

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
                        <Text style={styles.descriptionTitle}>Deposit</Text>
                        <Text style={styles.descriptionText}>
                            Send fiat to your Bitby wallet. Choose your preferred mobile money provider to get started.
                        </Text>
                    </View>
                </View>

                {/* Mobile Money Selection */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Select Mobile Money</Text>
                    {mobileMoneyProviders.length > 0 ? (
                        <TouchableOpacity
                            style={styles.mobileMoneySelector}
                            onPress={() => setShowMobileMoneyModal(true)}
                        >
                            <View style={styles.mobileMoneyInfo}>
                                <View style={styles.mobileMoneyDetails}>
                                    {selectedMobileMoney ? (
                                        <Text style={styles.mobileMoneyName}>{selectedMobileMoney}</Text>
                                    ) : (
                                        <Text style={styles.placeholderText}>Select mobile money provider</Text>
                                    )}
                                </View>
                            </View>
                            <Ionicons name="chevron-down" size={20} color="#aaa" />
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.noMobileMoneyContainer}>
                            <Ionicons name="phone-portrait-outline" size={24} color="#666" />
                            <Text style={styles.noMobileMoneyText}>No mobile money connected</Text>
                            <TouchableOpacity
                                style={styles.connectMobileMoneyButton}
                                onPress={() => router.push('/screens/PaymentMethods')}
                            >
                                <Text style={styles.connectMobileMoneyButtonText}>Connect Mobile Money</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                {/* Continue Button */}
                {selectedMobileMoney && (
                    <View style={styles.continueButtonContainer}>
                        <TouchableOpacity
                            style={styles.continueButton}
                            onPress={() => {
                                router.push({
                                    pathname: '/screens/CompleteFiatDeposit',
                                    params: { provider: selectedMobileMoney }
                                });
                            }}
                        >
                            <Text style={styles.continueButtonText}>Continue</Text>
                        </TouchableOpacity>
                    </View>
                )}

            </ScrollView>

            {/* Mobile Money Selection Modal */}
            {showMobileMoneyModal && (
                <View style={styles.modalOverlay}>
                    <BlurView intensity={30} tint="dark" style={styles.modalBlur}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Select Mobile Money</Text>
                                <TouchableOpacity onPress={() => setShowMobileMoneyModal(false)}>
                                    <Ionicons name="close" size={24} color="#aaa" />
                                </TouchableOpacity>
                            </View>
                            <ScrollView style={styles.mobileMoneyList}>
                                {mobileMoneyProviders.map((provider) => (
                                    <TouchableOpacity
                                        key={provider.name}
                                        style={styles.mobileMoneyItem}
                                        onPress={() => {
                                            setSelectedMobileMoney(provider.name);
                                            setShowMobileMoneyModal(false);
                                        }}
                                    >
                                        <View style={styles.mobileMoneyItemDetails}>
                                            <Text style={styles.mobileMoneyItemName}>{provider.name}</Text>
                                        </View>
                                        {selectedMobileMoney === provider.name && (
                                            <Ionicons name="checkmark-circle" size={24} color={GREEN} />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    </BlurView>
                </View>
            )}
        </SafeAreaView>
    );
} 