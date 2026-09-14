import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useNavigation, useLocalSearchParams } from 'expo-router';
import { useState, useLayoutEffect } from 'react';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from '../styles/CreatePassword.styles.js';
import { completeSignup } from '../../services/authService';
import { useAuth } from '../../contexts/AuthContext';


export default function CreatePassword() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const email = params.email;
    const { signIn } = useAuth();
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [loading, setLoading] = useState(false);

    useLayoutEffect(() => {
        navigation.setOptions?.({ headerShown: false });
    }, [navigation]);

    const handleCreatePassword = async () => {
        setPasswordError('');
        setConfirmPasswordError('');

        if (password !== confirmPassword) {
            setConfirmPasswordError('Passwords do not match.');
            return;
        }
        if (!email) {
            setPasswordError('Missing email address. Please start the signup again.');
            return;
        }

        setLoading(true);
        try {
            // Creates the account, then signs in so the user lands on the
            // dashboard authenticated rather than merely routed there.
            await completeSignup({ email, password });
            await signIn(email, password);
            router.replace('/(tabs)/dashboard');
        } catch (error) {
            setPasswordError(error.message || 'Could not create your account. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Check if form is complete
    const isFormComplete = password.trim() !== '' && confirmPassword.trim() !== '' && password === confirmPassword;

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
                        <MaterialIcons name="lock-person" size={48} color="#00C896" />
                    </View>
                    <Text style={styles.title}>Create Your Password</Text>
                    <Text style={styles.subtitle}>
                        Set a strong password to secure your account and protect your digital assets
                    </Text>
                </View>

                {/* Password Form Card */}
                <View style={styles.formCard}>
                    <View style={styles.formHeader}>
                        <MaterialIcons name="security" size={24} color="#00C896" />
                        <Text style={styles.formTitle}>Secure Your Account</Text>
                    </View>

                    {/* Password Input */}
                    <View style={styles.inputContainer}>
                        <View style={styles.inputWrapper}>
                            <MaterialCommunityIcons name="lock-outline" size={20} color="#aaa" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your password"
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
                                placeholder="Confirm your password"
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

                    {/* Password Requirements */}
                    <View style={styles.requirementsCard}>
                        <Text style={styles.requirementsTitle}>Password Requirements:</Text>
                        <View style={styles.requirementItem}>
                            <Ionicons
                                name={password.length >= 8 ? "checkmark-circle" : "ellipse-outline"}
                                size={16}
                                color={password.length >= 8 ? "#00C896" : "#aaa"}
                            />
                            <Text style={[styles.requirementText, password.length >= 8 && styles.requirementMet]}>
                                At least 8 characters
                            </Text>
                        </View>
                        <View style={styles.requirementItem}>
                            <Ionicons
                                name={password === confirmPassword && confirmPassword !== '' ? "checkmark-circle" : "ellipse-outline"}
                                size={16}
                                color={password === confirmPassword && confirmPassword !== '' ? "#00C896" : "#aaa"}
                            />
                            <Text style={[styles.requirementText, password === confirmPassword && confirmPassword !== '' && styles.requirementMet]}>
                                Passwords match
                            </Text>
                        </View>
                    </View>

                    {/* Create Password Button */}
                    <TouchableOpacity
                        style={[styles.createPasswordButton, (!isFormComplete || loading) && styles.disabledButton]}
                        onPress={handleCreatePassword}
                        activeOpacity={0.8}
                        disabled={!isFormComplete || loading}
                    >
                        <Text style={[styles.createPasswordButtonText, (!isFormComplete || loading) && styles.disabledButtonText]}>
                            {loading ? 'Creating Account...' : 'Create Password'}
                        </Text>
                        {!loading && <Ionicons name="arrow-forward" size={20} color={isFormComplete ? "#fff" : "#666"} />}
                    </TouchableOpacity>
                </View>

                {/* Security Info */}
                <View style={styles.securityCard}>
                    <View style={styles.securityHeader}>
                        <Ionicons name="shield-checkmark" size={20} color="#00C896" />
                        <Text style={styles.securityTitle}>Your Security</Text>
                    </View>
                    <Text style={styles.securityText}>
                        Your password is encrypted and stored securely. We never have access to your actual password.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
} 