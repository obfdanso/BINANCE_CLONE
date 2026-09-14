import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import { useState, useLayoutEffect } from 'react';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from '../styles/SignIn.styles.js';
import { useAuth } from '../../contexts/AuthContext';


export default function SignIn() {
    const router = useRouter();
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const { signIn } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [loading, setLoading] = useState(false);

    useLayoutEffect(() => {
        navigation.setOptions?.({ headerShown: false });
    }, [navigation]);

    const handleSignIn = async () => {
        setEmailError('');
        setPasswordError('');
        setLoading(true);

        try {
            await signIn(email.trim(), password);
            router.replace('/(tabs)/dashboard');
        } catch (error) {
            if (error.status === 400 || error.status === 401) {
                setPasswordError('Incorrect email/username or password.');
            } else {
                setEmailError(error.message || 'Could not sign in. Please try again.');
            }
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
                {/* Top right Sign Up link */}
                <TouchableOpacity style={styles.topRightLink} onPress={() => router.push('/screens/SignUp')}>
                    <Text style={styles.topRightText}>Sign Up</Text>
                </TouchableOpacity>

                {/* Welcome Section */}
                <View style={styles.welcomeSection}>
                    <View style={styles.avatarContainer}>
                        <Image source={require('../../assets/images/icon.png')} style={styles.avatar} />
                    </View>
                    <Text style={styles.title}>Welcome Back!</Text>
                    <Text style={styles.subtitle}>Sign in to access your trading account and manage your digital assets</Text>
                </View>

                {/* Sign In Form Card */}
                <View style={styles.formCard}>
                    <View style={styles.formHeader}>
                        <MaterialIcons name="login" size={24} color="#00C896" />
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
                                value={email}
                                onChangeText={setEmail}
                            />
                        </View>
                        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
                    </View>

                    {/* Password Input */}
                    <View style={styles.inputContainer}>
                        <View style={styles.inputWrapper}>
                            <MaterialCommunityIcons name="lock-outline" size={20} color="#aaa" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Password"
                                placeholderTextColor="#aaa"
                                secureTextEntry={!showPassword}
                                value={password}
                                onChangeText={setPassword}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#aaa" />
                            </TouchableOpacity>
                        </View>
                        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
                    </View>

                    {/* Forgot Password Link */}
                    <TouchableOpacity style={styles.forgotPasswordLink} onPress={() => router.push('/screens/ForgotPassword')}>
                        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                    </TouchableOpacity>

                    {/* Sign In Button */}
                    <TouchableOpacity
                        style={[styles.signInButton, loading && styles.signInButtonDisabled]}
                        onPress={handleSignIn}
                        activeOpacity={0.8}
                        disabled={loading}
                    >
                        <Text style={styles.signInButtonText}>
                            {loading ? 'Signing In...' : 'Sign In'}
                        </Text>
                        {!loading && <Ionicons name="arrow-forward" size={20} color="#fff" />}
                    </TouchableOpacity>
                </View>

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

                {/* Bottom Sign Up Link */}
                <View style={styles.bottomRow}>
                    <Text style={styles.bottomText}>Don't have an account? </Text>
                    <TouchableOpacity onPress={() => router.push('/screens/SignUp')}>
                        <Text style={styles.bottomLink}>Sign up</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
} 