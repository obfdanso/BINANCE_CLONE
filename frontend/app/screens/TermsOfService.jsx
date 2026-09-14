import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import styles from '../styles/TermsOfService.styles';

export default function TermsOfService() {
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
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={20} color="#fff" />
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
                {/* Top Card */}
                <View style={styles.topCard}>
                    <Animated.View style={[styles.iconBubble, { transform: [{ scale: pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.15] }) }] }]}>
                        <MaterialCommunityIcons name="file-document-outline" size={32} color="#00C896" />
                    </Animated.View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.topCardTitle}>Terms of Service</Text>
                        <Text style={styles.topCardDesc}>Please read these terms carefully before using our services</Text>
                    </View>
                </View>

                {/* Sections */}
                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
                    <Text style={styles.sectionText}>
                        By accessing and using the Bitby application, you accept and agree to be bound by the terms and provision of this agreement.
                    </Text>
                </View>

                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>2. Use License</Text>
                    <Text style={styles.sectionText}>
                        Permission is granted to temporarily download one copy of the app per device for personal, non-commercial transitory viewing only.
                    </Text>
                </View>

                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>3. Disclaimer</Text>
                    <Text style={styles.sectionText}>
                        The materials on Bitby's application are provided on an 'as is' basis. Bitby makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
} 