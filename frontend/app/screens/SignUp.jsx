import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import { useState, useLayoutEffect } from 'react';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from '../styles/SignUp.styles.js';
import { requestEmailSignup } from '../../services/authService';


export default function SignUp() {
    const router = useRouter();
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agree, setAgree] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [passwordError] = useState('');
    const [confirmPasswordError] = useState('');
    const [agreeError, setAgreeError] = useState('');
    const [loading, setLoading] = useState(false);

    useLayoutEffect(() => {
        navigation.setOptions?.({ headerShown: false });
    }, [navigation]);

    const handleSignUp = async () => {
        setEmailError('');
        setAgreeError('');

        if (!agree) {
            setAgreeError('Please accept the terms to continue.');
            return;
        }

        setLoading(true);
        try {
            // Ask the backend to email a verification code. Otp needs the
            // address to verify against, so it is passed along.
            await requestEmailSignup(email.trim());
            router.replace({
                pathname: '/screens/Otp',
                params: { email: email.trim() },
            });
        } catch (error) {
            setEmailError(error.message || 'Could not start signup. Please try again.');
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
                    <View style={styles.avatarContainer}>
                        <Image source={require('../../assets/images/icon.png')} style={styles.avatar} />
                    </View>
                    <Text style={styles.title}>Welcome to Bitby</Text>
                    <Text style={styles.subtitle}>Create your account to start trading and managing your digital assets securely</Text>
                </View>

                {/* Sign Up Form Card */}
                <View style={styles.formCard}>
                    <View style={styles.formHeader}>
                        <MaterialIcons name="person-add" size={24} color="#00C896" />
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
                                placeholder="New password"
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

                    {/* Confirm Password Input */}
                    <View style={styles.inputContainer}>
                        <View style={styles.inputWrapper}>
                            <MaterialCommunityIcons name="lock-outline" size={20} color="#aaa" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Confirm password"
                                placeholderTextColor="#aaa"
                                secureTextEntry={!showConfirmPassword}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                            />
                            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
                                <Ionicons name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#aaa" />
                            </TouchableOpacity>
                        </View>
                        {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
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
                </View>

                {/* Bottom Sign In Link */}
                <View style={styles.bottomRow}>
                    <Text style={styles.bottomText}>Already have an account? </Text>
                    <TouchableOpacity onPress={() => router.push('/screens/SignIn')}>
                        <Text style={styles.bottomLink}>Sign in</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
} 