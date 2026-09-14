import React, { useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useNotifications } from '../../contexts/NotificationsContext';
import styles from '../styles/AddFunds.styles';

const GREEN = '#00C896';

export default function AddFunds() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { notifications } = useNotifications();


    // Animation values
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Pulse animation for the add funds icon
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
                        <MaterialIcons name="account-balance-wallet" size={24} color={GREEN} />
                    </Animated.View>
                    <View style={styles.descriptionContent}>
                        <Text style={styles.descriptionTitle}>Add Funds to Your Account</Text>
                        <Text style={styles.descriptionText}>
                            Choose your preferred method to add funds and start trading.
                        </Text>
                    </View>
                </View>

                {/* New to Crypto Box */}
                <View style={styles.newToCryptoBox}>
                    <View style={styles.newToCryptoIcon}>
                        <Feather name="users" size={24} color={GREEN} />
                    </View>
                    <View style={styles.newToCryptoContent}>
                        <Text style={styles.newToCryptoTitle}>New to crypto?</Text>
                        <Text style={styles.newToCryptoText}>
                            Try P2P trading - buy and sell crypto directly with other users. No fees, instant transactions.
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={styles.p2pButton}
                        onPress={() => router.push('/screens/P2P')}
                    >
                        <Text style={styles.p2pButtonText}>Try P2P</Text>
                    </TouchableOpacity>
                </View>

                {/* Already Know Crypto Box */}
                <View style={styles.alreadyKnowCryptoBox}>
                    <View style={styles.alreadyKnowCryptoIcon}>
                        <Feather name="download" size={24} color={GREEN} />
                    </View>
                    <View style={styles.alreadyKnowCryptoContent}>
                        <Text style={styles.alreadyKnowCryptoTitle}>Already know crypto?</Text>
                        <Text style={styles.alreadyKnowCryptoText}>
                            Deposit your existing crypto directly to your wallet. Fast and secure transfers.
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={styles.depositButton}
                        onPress={() => router.push('/screens/Deposit')}
                    >
                        <Text style={styles.depositButtonText}>Deposit</Text>
                    </TouchableOpacity>
                </View>


            </ScrollView>


        </SafeAreaView>
    );
} 