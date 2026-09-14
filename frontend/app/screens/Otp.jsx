import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams, useNavigation } from 'expo-router';
import { useState, useRef, useLayoutEffect } from 'react';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from '../styles/Otp.styles.js';
import { verifyEmailOtp, requestEmailSignup } from '../../services/authService';

const OTP_LENGTH = 6;

export default function Otp() {
    const router = useRouter();
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const params = useLocalSearchParams();
    const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
    const [error, setError] = useState('');
    const [resendMsg, setResendMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const inputs = useRef([]);

    // Check authentication method
    const isPasswordReset = params.authMethod === 'passwordReset';
    const email = params.email;

    useLayoutEffect(() => {
        navigation.setOptions?.({ headerShown: false });
    }, [navigation]);

    const handleChange = (text, idx) => {
        if (/^[0-9]?$/.test(text)) {
            const newOtp = [...otp];
            newOtp[idx] = text;
            setOtp(newOtp);
            setError('');
            if (resendMsg) setResendMsg('');
            if (text && idx < OTP_LENGTH - 1) {
                inputs.current[idx + 1].focus();
            }
            if (newOtp.join('').length === OTP_LENGTH && !newOtp.includes('')) {
                handleSubmit(newOtp.join(''));
            }
        }
    };

    const handleKeyPress = (e, idx) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[idx] && idx > 0) {
            inputs.current[idx - 1].focus();
        }
    };

    const handleSubmit = async (enteredOtp) => {
        // A password reset carries its own code to the reset screen, which
        // submits both together; there is nothing to verify here.
        if (isPasswordReset) {
            router.replace({
                pathname: '/screens/ResetPassword',
                params: { email, otp: enteredOtp },
            });
            return;
        }

        if (!email) {
            setError('Missing email address. Please start the signup again.');
            return;
        }

        setError('');
        setLoading(true);
        try {
            // The backend decides whether the code is right - it used to be
            // compared against a hardcoded '123456' on the device.
            await verifyEmailOtp(email, enteredOtp);
            router.replace({
                pathname: '/screens/CreatePassword',
                params: { email },
            });
        } catch (err) {
            setError(err.message || 'Invalid OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setOtp(Array(OTP_LENGTH).fill(''));
        setError('');
        setResendMsg('');

        // inputs.current[0] is undefined until the first input mounts.
        inputs.current[0]?.focus();

        if (!email) {
            setError('Missing email address. Please start the signup again.');
            return;
        }

        setLoading(true);
        try {
            await requestEmailSignup(email);
            setResendMsg('Check your email for a new OTP code');
        } catch (err) {
            setError(err.message || 'Could not resend the code.');
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
                {/* Back Button */}
                <TouchableOpacity style={styles.backButton} onPress={() => router.push('/screens/Auth')} activeOpacity={0.7}>
                    <Ionicons name="arrow-back" size={28} color="#fff" />
                </TouchableOpacity>

                {/* Welcome Section */}
                <View style={styles.welcomeSection}>
                    <View style={styles.iconContainer}>
                        <MaterialIcons name="verified" size={48} color="#00C896" />
                    </View>
                    <Text style={styles.title}>Verify Your Account</Text>
                    <Text style={styles.subtitle}>
                        {isPasswordReset
                            ? "Enter the reset code we've sent to your email"
                            : "Enter the verification code we've sent to your email"
                        }
                    </Text>
                </View>

                {/* OTP Card */}
                <View style={styles.otpCard}>
                    <View style={styles.otpHeader}>
                        <MaterialIcons name="lock-clock" size={24} color="#00C896" />
                        <Text style={styles.otpTitle}>Enter OTP Code</Text>
                    </View>

                    {/* OTP Inputs */}
                    <View style={styles.otpRow}>
                        {otp.map((digit, idx) => (
                            <TextInput
                                key={idx}
                                ref={ref => (inputs.current[idx] = ref)}
                                style={[styles.otpInput, digit && styles.otpInputFilled]}
                                keyboardType="number-pad"
                                maxLength={1}
                                value={digit}
                                onChangeText={text => handleChange(text, idx)}
                                onKeyPress={e => handleKeyPress(e, idx)}
                                returnKeyType="done"
                                autoFocus={idx === 0}
                                editable={!loading}
                            />
                        ))}
                    </View>

                    {error ? <Text style={styles.errorText}>{error}</Text> : null}

                    {/* Resend Code */}
                    <TouchableOpacity style={styles.resendButton} onPress={handleResend}>
                        <Text style={styles.resendText}>
                            {isPasswordReset ? 'Resend reset code' : 'Resend code'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Resend Message */}
                {resendMsg ? (
                    <View style={styles.resendMsgCard}>
                        <View style={styles.resendMsgHeader}>
                            <Ionicons name="checkmark-circle" size={20} color="#00C896" />
                            <Text style={styles.resendMsgTitle}>Code Sent</Text>
                        </View>
                        <Text style={styles.resendMsg}>{resendMsg}</Text>
                        <TouchableOpacity style={styles.okButton} onPress={() => setResendMsg('')}>
                            <Text style={styles.okButtonText}>OK</Text>
                        </TouchableOpacity>
                    </View>
                ) : null}

            </ScrollView>
        </SafeAreaView>
    );
} 