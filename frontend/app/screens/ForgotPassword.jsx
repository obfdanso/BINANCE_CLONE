import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import { useState, useLayoutEffect } from 'react';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from '../styles/ForgotPassword.styles.js';


export default function ForgotPassword() {
    const router = useRouter();
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');

    useLayoutEffect(() => {
        navigation.setOptions?.({ headerShown: false });
    }, [navigation]);

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = () => {
        let valid = true;

        if (!email) {
            setEmailError('Email is required');
            valid = false;
        } else if (!validateEmail(email)) {
            setEmailError('Please enter a valid email address');
            valid = false;
        } else {
            setEmailError('');
        }

        if (!valid) return;

        // Navigate to OTP screen for password reset
        router.replace({
            pathname: '/screens/Otp',
            params: {
                authMethod: 'passwordReset',
                email: email
            }
        });
    };

    const handleBackToSignIn = () => {
        router.replace('/screens/SignIn');
    };



    return (
        <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top }]}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Back Button */}
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.7}>
                    <Ionicons name="arrow-back" size={28} color="#fff" />
                </TouchableOpacity>

                {/* Welcome Section */}
                <View style={styles.welcomeSection}>
                    <View style={styles.iconContainer}>
                        <MaterialIcons name="lock-reset" size={48} color="#00C896" />
                    </View>
                    <Text style={styles.title}>Forgot Password</Text>
                    <Text style={styles.subtitle}>
                        Enter your email address and we&apos;ll send you a link to reset your password.
                    </Text>
                </View>

                {/* Form Card */}
                <View style={styles.formCard}>
                    <View style={styles.formHeader}>
                        <MaterialIcons name="email" size={24} color="#00C896" />
                        <Text style={styles.formTitle}>Reset Password</Text>
                    </View>

                    {/* Email Input */}
                    <View style={styles.inputContainer}>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="mail-outline" size={20} color="#aaa" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your email"
                                placeholderTextColor="#aaa"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={email}
                                onChangeText={(text) => {
                                    setEmail(text);
                                    if (emailError) setEmailError('');
                                }}
                            />
                        </View>
                        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity
                        style={[styles.submitButton, !email.trim() && styles.disabledButton]}
                        onPress={handleSubmit}
                        activeOpacity={0.8}
                        disabled={!email.trim()}
                    >
                        <Text style={[styles.submitButtonText, !email.trim() && styles.disabledButtonText]}>
                            Send OTP
                        </Text>
                        <Ionicons name="arrow-forward" size={20} color={email.trim() ? "#fff" : "#666"} />
                    </TouchableOpacity>
                </View>



                {/* Back to Sign In */}
                <View style={styles.backToSignInCard}>
                    <Text style={styles.backToSignInText}>Remember your password? </Text>
                    <TouchableOpacity onPress={handleBackToSignIn}>
                        <Text style={styles.backToSignInLink}>Sign in</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
} 