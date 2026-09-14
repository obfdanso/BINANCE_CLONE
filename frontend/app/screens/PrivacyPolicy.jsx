import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from '../styles/PrivacyPolicy.styles';

export default function PrivacyPolicy() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const pulseAnim = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
            ])
        ).start();
    }, []);
    return (
        <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={20} color="#fff" />
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
                {/* Top Card */}
                <View style={styles.topCard}>
                    <Animated.View style={[styles.iconBubble, { transform: [{ scale: pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.15] }) }] }]}>
                        <MaterialCommunityIcons name="shield-check" size={32} color="#00C896" />
                    </Animated.View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.topCardTitle}>Privacy Policy</Text>
                        <Text style={styles.topCardDesc}>How we protect and handle your personal data</Text>
                    </View>
                </View>
                {/* Sections */}
                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>1. Information We Collect</Text>
                    <Text style={styles.sectionText}>
                        We collect information you provide directly to us, such as when you create an account, make a transaction, or contact us for support. This may include your name, email address, phone number, and payment information.
                    </Text>
                </View>
                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
                    <Text style={styles.sectionText}>
                        We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices and support messages, and respond to your comments and questions.
                    </Text>
                </View>
                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>3. Information Sharing</Text>
                    <Text style={styles.sectionText}>
                        We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy. We may share information with service providers who assist us in operating our platform.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}