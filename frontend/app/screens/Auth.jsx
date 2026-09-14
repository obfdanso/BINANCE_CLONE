import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import { useState, useLayoutEffect } from 'react';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from '../styles/Auth.styles.js';
import { useAuth } from '../../contexts/AuthContext';
import { requestEmailSignup } from '../../services/authService';



const GREEN = '#00C896';

export default function Auth() {
    const router = useRouter();
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const { signIn } = useAuth();
    const [activeTab, setActiveTab] = useState('Sign In');

    // Sign In states
    const [signInEmail, setSignInEmail] = useState('');
    const [signInPassword, setSignInPassword] = useState('');
    const [showSignInPassword, setShowSignInPassword] = useState(false);
    const [signInEmailError, setSignInEmailError] = useState('');
    const [signInPasswordError, setSignInPasswordError] = useState('');

    // Sign Up states
    const [signUpEmail, setSignUpEmail] = useState('');
    const [agree, setAgree] = useState(false);
    const [signUpEmailError, setSignUpEmailError] = useState('');
    const [agreeError, setAgreeError] = useState('');

    // Loading state
    const [loading, setLoading] = useState(false);

    useLayoutEffect(() => {
        navigation.setOptions?.({ headerShown: false });
    }, [navigation]);

    const handleTabSwitch = (tab) => {
        setActiveTab(tab);
        // Clear all errors when switching tabs
        setSignInEmailError('');
        setSignInPasswordError('');
        setSignUpEmailError('');
        setAgreeError('');
    };

    // Check if sign in form is complete
    const isSignInComplete = signInEmail.trim() !== '' && signInPassword.trim() !== '';

    // Check if sign up form is complete (only email and terms required)
    const isSignUpComplete = signUpEmail.trim() !== '' && agree;

    const handleSignIn = async () => {
        setSignInEmailError('');
        setSignInPasswordError('');
        setLoading(true);

        try {
            // The backend accepts either a username or an email here.
            await signIn(signInEmail.trim(), signInPassword);
            router.replace('/(tabs)/dashboard');
        } catch (error) {
            // Credential failures belong under the password field; anything
            // else (server down, timeout) is shown above it.
            if (error.status === 400 || error.status === 401) {
                setSignInPasswordError('Incorrect email/username or password.');
            } else {
                setSignInEmailError(error.message || 'Could not sign in. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSignUp = async () => {
        setSignUpEmailError('');
        setLoading(true);

        try {
            // Asks the backend to email a verification code; the OTP screen
            // needs the address to complete the next step.
            await requestEmailSignup(signUpEmail.trim());
            router.replace({ pathname: '/screens/Otp', params: { email: signUpEmail.trim() } });
        } catch (error) {
            setSignUpEmailError(error.message || 'Could not start signup. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top }]}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Welcome Section */}
                <View style={styles.welcomeSection}>
                    <Text style={styles.title}>Welcome to Bitby</Text>
                    <Text style={styles.subtitle}>
                        {activeTab === 'Sign In'
                            ? 'Sign in to access your trading account and manage your digital assets'
                            : 'Create your account to start trading and managing your digital assets securely'
                        }
                    </Text>
                </View>

                {/* Auth Toggle */}
                <View style={styles.toggleContainer}>
                    <TouchableOpacity
                        style={[styles.toggleButton, activeTab === 'Sign In' && styles.toggleButtonActive]}
                        onPress={() => handleTabSwitch('Sign In')}
                    >
                        <Text style={[styles.toggleText, activeTab === 'Sign In' ? styles.toggleTextActive : styles.toggleTextInactive]}>
                            Sign In
                        </Text>
                        {activeTab === 'Sign In' && <View style={styles.greenBar} />}
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.toggleButton, activeTab === 'Sign Up' && styles.toggleButtonActive]}
                        onPress={() => handleTabSwitch('Sign Up')}
                    >
                        <Text style={[styles.toggleText, activeTab === 'Sign Up' ? styles.toggleTextActive : styles.toggleTextInactive]}>
                            Sign Up
                        </Text>
                        {activeTab === 'Sign Up' && <View style={styles.greenBar} />}
                    </TouchableOpacity>
                </View>

                {activeTab === 'Sign In' ? (
                    /* Sign In Form */
                    <View style={styles.formCard}>
                        <View style={styles.formHeader}>
                            <MaterialIcons name="login" size={24} color={GREEN} />
                            <Text style={styles.formTitle}>Sign In</Text>
                        </View>

                        {/* Email Input */}
                        <View style={styles.inputContainer}>
                            <View style={styles.inputWrapper}>
                                <Ionicons name="mail-outline" size={20} color="#aaa" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="email@gmail.com"
                                    placeholderTextColor="#aaa"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    value={signInEmail}
                                    onChangeText={setSignInEmail}
                                />
                            </View>
                            {signInEmailError ? <Text style={styles.errorText}>{signInEmailError}</Text> : null}
                        </View>

                        {/* Password Input */}
                        <View style={styles.inputContainer}>
                            <View style={styles.inputWrapper}>
                                <MaterialCommunityIcons name="lock-outline" size={20} color="#aaa" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Password"
                                    placeholderTextColor="#aaa"
                                    secureTextEntry={!showSignInPassword}
                                    value={signInPassword}
                                    onChangeText={setSignInPassword}
                                />
                                <TouchableOpacity onPress={() => setShowSignInPassword(!showSignInPassword)} style={styles.eyeIcon}>
                                    <Ionicons name={showSignInPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#aaa" />
                                </TouchableOpacity>
                            </View>
                            {signInPasswordError ? <Text style={styles.errorText}>{signInPasswordError}</Text> : null}
                        </View>

                        {/* Forgot Password Link */}
                        <TouchableOpacity style={styles.forgotPasswordLink} onPress={() => router.push('/screens/ForgotPassword')}>
                            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                        </TouchableOpacity>

                        {/* Sign In Button */}
                        <TouchableOpacity
                            style={[styles.signInButton, (!isSignInComplete || loading) && styles.disabledButton]}
                            onPress={handleSignIn}
                            activeOpacity={0.8}
                            disabled={!isSignInComplete || loading}
                        >
                            <Text style={[styles.signInButtonText, (!isSignInComplete || loading) && styles.disabledButtonText]}>
                                {loading ? 'Signing In...' : 'Sign In'}
                            </Text>
                            {!loading && <Ionicons name="arrow-forward" size={20} color={isSignInComplete ? "#fff" : "#666"} />}
                        </TouchableOpacity>
                    </View>
                ) : (
                    /* Sign Up Form */
                    <View style={styles.formCard}>
                        <View style={styles.formHeader}>
                            <MaterialIcons name="person-add" size={24} color={GREEN} />
                            <Text style={styles.formTitle}>Create Account</Text>
                        </View>

                        {/* Email Input */}
                        <View style={styles.inputContainer}>
                            <View style={styles.inputWrapper}>
                                <Ionicons name="mail-outline" size={20} color="#aaa" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="email@example.com"
                                    placeholderTextColor="#aaa"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    value={signUpEmail}
                                    onChangeText={setSignUpEmail}
                                />
                            </View>
                            {signUpEmailError ? <Text style={styles.errorText}>{signUpEmailError}</Text> : null}
                        </View>



                        {/* Terms Checkbox */}
                        <View style={styles.checkboxContainer}>
                            <TouchableOpacity style={styles.checkbox} onPress={() => setAgree(!agree)}>
                                <View style={[styles.checkboxBox, agree && styles.checkboxBoxActive]}>
                                    {agree && <Ionicons name="checkmark" size={16} color="#fff" />}
                                </View>
                            </TouchableOpacity>
                            <Text style={styles.checkboxLabel}>I agree with the terms and conditions</Text>
                        </View>
                        {agreeError ? <Text style={styles.errorText}>{agreeError}</Text> : null}

                        {/* Sign Up Button */}
                        <TouchableOpacity
                            style={[styles.signUpButton, (!isSignUpComplete || loading) && styles.disabledButton]}
                            onPress={handleSignUp}
                            activeOpacity={0.8}
                            disabled={!isSignUpComplete || loading}
                        >
                            <Text style={[styles.signUpButtonText, (!isSignUpComplete || loading) && styles.disabledButtonText]}>
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </Text>
                            {!loading && <Ionicons name="arrow-forward" size={20} color={isSignUpComplete ? "#fff" : "#666"} />}
                        </TouchableOpacity>




                    </View>
                )}

                {/* Social Login Section */}
                <View style={styles.socialCard}>
                    <View style={styles.dividerRow}>
                        <View style={styles.divider} />
                        <Text style={styles.orWith}>Or continue with</Text>
                        <View style={styles.divider} />
                    </View>

                    <TouchableOpacity
                        style={styles.socialButton}
                        onPress={() => router.push('/screens/TelegramAuth')}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.socialButtonText}>Continue with Telegram</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
} 