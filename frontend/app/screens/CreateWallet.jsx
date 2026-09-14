import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Animated, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useWallet } from '../../contexts/WalletContext';
import styles from '../styles/CreateWallet.styles';

const GREEN = '#00C896';

export default function CreateWallet() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { createWallet } = useWallet();
    const [walletName, setWalletName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('error'); // 'error' or 'success'

    // Animation for wallet icon
    const walletAnim = useRef(new Animated.Value(0)).current;

    const showCustomAlert = (title, message, type = 'error') => {
        setAlertTitle(title);
        setAlertMessage(message);
        setAlertType(type);
        setShowAlert(true);
    };

    const handleCreateWallet = async () => {
        // Validate form
        if (!walletName.trim()) {
            showCustomAlert('Error', 'Please enter a wallet name');
            return;
        }

        if (password.length < 8) {
            showCustomAlert('Error', 'Password must be at least 8 characters long');
            return;
        }

        if (password !== confirmPassword) {
            showCustomAlert('Error', 'Passwords do not match');
            return;
        }

        if (!agreeToTerms) {
            showCustomAlert('Error', 'Please agree to the terms and conditions');
            return;
        }

        // Create wallet using context
        const success = await createWallet(walletName, password);
        if (success) {
            showCustomAlert('Success!', 'Your Bitby wallet has been created successfully!', 'success');
        } else {
            showCustomAlert('Error', 'Failed to create wallet. Please try again.');
        }
    };

    const handleAlertClose = () => {
        setShowAlert(false);
        if (alertType === 'success') {
            router.push('/screens/WalletDashboard');
        }
    };

    // Animate wallet icon on mount
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(walletAnim, {
                    toValue: 1,
                    duration: 2000,
                    useNativeDriver: true
                }),
                Animated.timing(walletAnim, {
                    toValue: 0,
                    duration: 2000,
                    useNativeDriver: true
                }),
            ])
        ).start();
    }, []);

    return (
        <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={20} color="#fff" />
                </TouchableOpacity>
            </View>

            <View style={styles.contentWrapper}>
                {/* Wallet Info Card */}
                <View style={styles.infoCard}>
                    <Animated.View
                        style={[
                            styles.infoIconCircle,
                            {
                                transform: [{
                                    scale: walletAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [1, 1.1]
                                    })
                                }]
                            }
                        ]}
                    >
                        <Ionicons name="wallet-outline" size={28} color={GREEN} />
                    </Animated.View>
                    <View style={{ flex: 1, minWidth: 0 }}>
                        <Text style={styles.infoTitle} numberOfLines={1} ellipsizeMode="tail">Create Your Bitby Wallet</Text>
                        <Text style={styles.infoDesc} numberOfLines={2} ellipsizeMode="tail">Set up your secure cryptocurrency wallet to start managing your digital assets</Text>
                    </View>
                </View>

                <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

                    {/* Form */}
                    <View style={styles.formContainer}>
                        {/* Wallet Name */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Wallet Name</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Enter wallet name"
                                placeholderTextColor="#666"
                                value={walletName}
                                onChangeText={setWalletName}
                                autoCapitalize="words"
                            />
                        </View>

                        {/* Password */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Password</Text>
                            <View style={styles.passwordContainer}>
                                <TextInput
                                    style={[styles.textInput, { flex: 1 }]}
                                    placeholder="Enter password"
                                    placeholderTextColor="#666"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowPassword(!showPassword)}
                                    style={styles.eyeButton}
                                >
                                    <Ionicons
                                        name={showPassword ? "eye-off" : "eye"}
                                        size={20}
                                        color="#666"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Confirm Password */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Confirm Password</Text>
                            <View style={styles.passwordContainer}>
                                <TextInput
                                    style={[styles.textInput, { flex: 1 }]}
                                    placeholder="Confirm your password"
                                    placeholderTextColor="#666"
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry={!showConfirmPassword}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                    style={styles.eyeButton}
                                >
                                    <Ionicons
                                        name={showConfirmPassword ? "eye-off" : "eye"}
                                        size={20}
                                        color="#666"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Terms and Conditions */}
                        <View style={styles.termsContainer}>
                            <TouchableOpacity
                                onPress={() => setAgreeToTerms(!agreeToTerms)}
                                style={styles.checkboxContainer}
                            >
                                <View style={[styles.checkbox, agreeToTerms && styles.checkboxChecked]}>
                                    {agreeToTerms && (
                                        <Ionicons name="checkmark" size={16} color="#fff" />
                                    )}
                                </View>
                                <Text style={styles.termsText}>
                                    I agree to the{' '}
                                    <Text style={styles.termsLink}>Terms of Service</Text>
                                    {' '}and{' '}
                                    <Text style={styles.termsLink}>Privacy Policy</Text>
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Security Notice */}
                        <View style={styles.securityNotice}>
                            <Ionicons name="shield-checkmark" size={20} color={GREEN} />
                            <Text style={styles.securityText}>
                                Your private keys are encrypted and stored securely on your device.
                            </Text>
                        </View>

                        {/* Create Wallet Button */}
                        <TouchableOpacity
                            style={styles.createButton}
                            onPress={handleCreateWallet}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.createButtonText}>Create Wallet</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>

            {/* Custom Alert Modal */}
            <Modal
                visible={showAlert}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowAlert(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.alertContainer}>
                        <View style={[
                            styles.alertIconContainer,
                            alertType === 'error' ? styles.errorIconContainer : styles.successIconContainer
                        ]}>
                            <Ionicons
                                name={alertType === 'error' ? 'alert-circle' : 'checkmark-circle'}
                                size={32}
                                color={alertType === 'error' ? '#FF6B6B' : GREEN}
                            />
                        </View>
                        <Text style={styles.alertTitle}>{alertTitle}</Text>
                        <Text style={styles.alertMessage}>{alertMessage}</Text>
                        <TouchableOpacity
                            style={[
                                styles.alertButton,
                                alertType === 'error' ? styles.errorButton : styles.successButton
                            ]}
                            onPress={handleAlertClose}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.alertButtonText}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
} 