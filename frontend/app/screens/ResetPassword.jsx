import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams, useNavigation } from 'expo-router';
import { useState, useLayoutEffect } from 'react';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from '../styles/ResetPassword.styles.js';


export default function ResetPassword() {
    const router = useRouter();
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const params = useLocalSearchParams();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [newPasswordError, setNewPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);


    useLayoutEffect(() => {
        navigation.setOptions?.({ headerShown: false });
    }, [navigation]);

    const validatePassword = (password) => {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (password.length < minLength) {
            return 'Password must be at least 8 characters long';
        }
        if (!hasUpperCase) {
            return 'Password must contain at least one uppercase letter';
        }
        if (!hasLowerCase) {
            return 'Password must contain at least one lowercase letter';
        }
        if (!hasNumbers) {
            return 'Password must contain at least one number';
        }
        if (!hasSpecialChar) {
            return 'Password must contain at least one special character';
        }
        return '';
    };

    const handleSubmit = () => {
        let valid = true;

        // Validate new password
        const newPasswordValidation = validatePassword(newPassword);
        if (newPasswordValidation) {
            setNewPasswordError(newPasswordValidation);
            valid = false;
        } else {
            setNewPasswordError('');
        }

        // Validate confirm password
        if (!confirmPassword) {
            setConfirmPasswordError('Please confirm your password');
            valid = false;
        } else if (newPassword !== confirmPassword) {
            setConfirmPasswordError('Passwords do not match');
            valid = false;
        } else {
            setConfirmPasswordError('');
        }

        if (!valid) return;

        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setShowSuccessModal(true);

            // Automatically navigate to SignIn after showing success message
            setTimeout(() => {
                router.replace('/screens/SignIn');
            }, 2000); // 2 seconds delay to show success message
        }, 1500);
    };

    const handleSuccessClose = () => {
        setShowSuccessModal(false);
        // Navigate to sign in screen immediately if user clicks close
        router.replace('/screens/SignIn');
    };

    const handleBack = () => {
        router.back();
    };

    return (
        <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top }]}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Back Button */}
                <TouchableOpacity style={styles.backButton} onPress={handleBack} activeOpacity={0.7}>
                    <Ionicons name="arrow-back" size={28} color="#fff" />
                </TouchableOpacity>

                {/* Welcome Section */}
                <View style={styles.welcomeSection}>
                    <View style={styles.iconContainer}>
                        <MaterialIcons name="lock-reset" size={48} color="#00C896" />
                    </View>
                    <Text style={styles.title}>Create New Password</Text>
                    <Text style={styles.subtitle}>
                        Create a strong password for your account. Make sure it&apos;s unique and secure.
                    </Text>
                </View>

                {/* Form Card */}
                <View style={styles.formCard}>
                    <View style={styles.formHeader}>
                        <MaterialIcons name="security" size={24} color="#00C896" />
                        <Text style={styles.formTitle}>Reset Password</Text>
                    </View>

                    {/* New Password Input */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>New Password</Text>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="lock-closed-outline" size={20} color="#aaa" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Enter new password"
                                placeholderTextColor="#aaa"
                                secureTextEntry={!showNewPassword}
                                autoCapitalize="none"
                                value={newPassword}
                                onChangeText={(text) => {
                                    setNewPassword(text);
                                    if (newPasswordError) setNewPasswordError('');
                                }}
                            />
                            <TouchableOpacity
                                onPress={() => setShowNewPassword(!showNewPassword)}
                                style={styles.eyeIcon}
                            >
                                <Ionicons
                                    name={showNewPassword ? "eye-outline" : "eye-off-outline"}
                                    size={20}
                                    color="#aaa"
                                />
                            </TouchableOpacity>
                        </View>
                        {newPasswordError ? <Text style={styles.errorText}>{newPasswordError}</Text> : null}
                    </View>

                    {/* Confirm Password Input */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Confirm New Password</Text>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="lock-closed-outline" size={20} color="#aaa" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Confirm new password"
                                placeholderTextColor="#aaa"
                                secureTextEntry={!showConfirmPassword}
                                autoCapitalize="none"
                                value={confirmPassword}
                                onChangeText={(text) => {
                                    setConfirmPassword(text);
                                    if (confirmPasswordError) setConfirmPasswordError('');
                                }}
                            />
                            <TouchableOpacity
                                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                style={styles.eyeIcon}
                            >
                                <Ionicons
                                    name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                                    size={20}
                                    color="#aaa"
                                />
                            </TouchableOpacity>
                        </View>
                        {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
                    </View>

                    {/* Password Requirements */}
                    <View style={styles.requirementsContainer}>
                        <Text style={styles.requirementsTitle}>Password Requirements:</Text>
                        <View style={styles.requirementItem}>
                            <Ionicons
                                name={newPassword.length >= 8 ? "checkmark-circle" : "ellipse-outline"}
                                size={16}
                                color={newPassword.length >= 8 ? "#00C896" : "#6C6C7A"}
                            />
                            <Text style={[styles.requirementText, { color: newPassword.length >= 8 ? "#00C896" : "#6C6C7A" }]}>
                                At least 8 characters
                            </Text>
                        </View>
                        <View style={styles.requirementItem}>
                            <Ionicons
                                name={/[A-Z]/.test(newPassword) ? "checkmark-circle" : "ellipse-outline"}
                                size={16}
                                color={/[A-Z]/.test(newPassword) ? "#00C896" : "#6C6C7A"}
                            />
                            <Text style={[styles.requirementText, { color: /[A-Z]/.test(newPassword) ? "#00C896" : "#6C6C7A" }]}>
                                One uppercase letter
                            </Text>
                        </View>
                        <View style={styles.requirementItem}>
                            <Ionicons
                                name={/[a-z]/.test(newPassword) ? "checkmark-circle" : "ellipse-outline"}
                                size={16}
                                color={/[a-z]/.test(newPassword) ? "#00C896" : "#6C6C7A"}
                            />
                            <Text style={[styles.requirementText, { color: /[a-z]/.test(newPassword) ? "#00C896" : "#6C6C7A" }]}>
                                One lowercase letter
                            </Text>
                        </View>
                        <View style={styles.requirementItem}>
                            <Ionicons
                                name={/\d/.test(newPassword) ? "checkmark-circle" : "ellipse-outline"}
                                size={16}
                                color={/\d/.test(newPassword) ? "#00C896" : "#6C6C7A"}
                            />
                            <Text style={[styles.requirementText, { color: /\d/.test(newPassword) ? "#00C896" : "#6C6C7A" }]}>
                                One number
                            </Text>
                        </View>
                        <View style={styles.requirementItem}>
                            <Ionicons
                                name={/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? "checkmark-circle" : "ellipse-outline"}
                                size={16}
                                color={/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? "#00C896" : "#6C6C7A"}
                            />
                            <Text style={[styles.requirementText, { color: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? "#00C896" : "#6C6C7A" }]}>
                                One special character
                            </Text>
                        </View>
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity
                        style={[styles.submitButton, (!newPassword.trim() || !confirmPassword.trim() || isLoading) && styles.disabledButton]}
                        onPress={handleSubmit}
                        activeOpacity={0.8}
                        disabled={!newPassword.trim() || !confirmPassword.trim() || isLoading}
                    >
                        <Text style={[styles.submitButtonText, (!newPassword.trim() || !confirmPassword.trim() || isLoading) && styles.disabledButtonText]}>
                            {isLoading ? 'Resetting Password...' : 'Reset Password'}
                        </Text>
                        {!isLoading && <Ionicons name="arrow-forward" size={20} color={newPassword.trim() && confirmPassword.trim() ? "#fff" : "#666"} />}
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Success Modal */}
            {showSuccessModal && (
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalIcon}>
                            <Ionicons name="checkmark-circle" size={48} color="#00C896" />
                        </View>
                        <Text style={styles.modalTitle}>Password Reset Successful</Text>
                        <Text style={styles.modalMessage}>
                            Your password has been successfully reset. You will be redirected to the sign in page shortly.
                        </Text>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={handleSuccessClose}
                        >
                            <Text style={styles.modalButtonText}>Sign In Now</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
} 