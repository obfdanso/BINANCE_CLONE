import { View, Text, TextInput, TouchableOpacity, Linking, ScrollView } from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import { useState, useLayoutEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from '../styles/TelegramAuth.styles.js';


export default function TelegramAuth() {
    const router = useRouter();
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const [telegramUsername, setTelegramUsername] = useState('');
    const [usernameError, setUsernameError] = useState('');

    useLayoutEffect(() => {
        navigation.setOptions?.({ headerShown: false });
    }, [navigation]);

    const validateTelegramUsername = (username) => {
        // Telegram username validation: 5-32 characters, alphanumeric and underscores
        const telegramRegex = /^[a-zA-Z0-9_]{5,32}$/;
        return telegramRegex.test(username);
    };

    const handleTelegramAuth = async () => {
        if (!telegramUsername) {
            setUsernameError('Telegram username is required');
            return;
        }

        if (!validateTelegramUsername(telegramUsername)) {
            setUsernameError('Please enter a valid Telegram username (5-32 characters, letters, numbers, and underscores only)');
            return;
        }

        setUsernameError('');

        try {
            // Construct Telegram bot URL with username parameter
            const telegramBotUrl = `https://t.me/your_bot_username?start=${telegramUsername}`;

            // Open Telegram app
            const canOpen = await Linking.canOpenURL(telegramBotUrl);
            if (canOpen) {
                await Linking.openURL(telegramBotUrl);

                // Navigate to OTP screen with Telegram context
                router.replace({
                    pathname: '/screens/Otp',
                    params: {
                        authMethod: 'telegram',
                        telegramUsername: telegramUsername
                    }
                });
            } else {
                setUsernameError('Unable to open Telegram. Please make sure Telegram is installed.');
            }
        } catch {
            setUsernameError('Failed to open Telegram. Please try again.');
        }
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
                        <FontAwesome5 name="telegram-plane" size={48} color="#00C896" />
                    </View>
                    <Text style={styles.title}>Connect with Telegram</Text>
                    <Text style={styles.subtitle}>
                        Enter your Telegram username to receive a verification code
                    </Text>
                </View>

                {/* Telegram Form Card */}
                <View style={styles.formCard}>
                    <View style={styles.formHeader}>
                        <Text style={styles.formTitle}>Telegram Authentication</Text>
                    </View>

                    {/* Username Input */}
                    <View style={styles.inputContainer}>
                        <View style={styles.inputWrapper}>
                            <Text style={styles.atSymbol}>@</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="username"
                                placeholderTextColor="#aaa"
                                autoCapitalize="none"
                                value={telegramUsername}
                                onChangeText={(text) => {
                                    setTelegramUsername(text);
                                    if (usernameError) setUsernameError('');
                                }}
                                autoFocus
                            />
                        </View>
                        {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}
                    </View>

                    {/* Continue Button */}
                    <TouchableOpacity
                        style={[styles.telegramButton, !telegramUsername.trim() && styles.disabledButton]}
                        onPress={handleTelegramAuth}
                        activeOpacity={0.8}
                        disabled={!telegramUsername.trim()}
                    >
                        <FontAwesome5 name="telegram-plane" size={20} color={telegramUsername.trim() ? "#fff" : "#666"} />
                        <Text style={[styles.telegramButtonText, !telegramUsername.trim() && styles.disabledButtonText]}>
                            Continue with Telegram
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Instructions Card */}
                <View style={styles.instructionsCard}>
                    <View style={styles.instructionsHeader}>
                        <Ionicons name="information-circle" size={20} color="#00C896" />
                        <Text style={styles.instructionsTitle}>How it works</Text>
                    </View>
                    <Text style={styles.instructionsText}>
                        You'll be redirected to Telegram where you'll receive a verification code.
                        After receiving the code, you'll be brought back here to enter it.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
} 