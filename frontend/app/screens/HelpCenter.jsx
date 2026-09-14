import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Linking, Animated } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import styles from '../styles/HelpCenter.styles';

const FAQS = [
    { q: 'How do I add a payment method?', a: 'Go to Profile > Payment Methods and tap to connect.' },
    { q: 'What are the transaction limits?', a: 'Transaction limits depend on your verification level.' },
    { q: 'How do I reset my password?', a: 'Go to Sign In, tap Forgot Password, and follow the instructions.' },
    { q: 'Is my information secure?', a: 'Yes, we use industry-standard security to protect your data.' },
];

export default function HelpCenter() {
    const router = useRouter();
    const [open, setOpen] = useState(null);
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
                        <Ionicons name="help" size={32} color="#00C896" />
                    </Animated.View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.topCardTitle}>How can we help?</Text>
                        <Text style={styles.topCardDesc}>Find answers to common questions and get support</Text>
                    </View>
                </View>

                {/* Contact Support */}
                <View style={styles.supportCard}>
                    <Text style={styles.supportTitle}>Contact Support</Text>
                    <TouchableOpacity style={styles.supportRow} activeOpacity={0.8} onPress={() => Linking.openURL('mailto:bitbyapplication@gmail.com')}>
                        <View style={styles.iconBubble}>
                            <MaterialCommunityIcons name="email-outline" size={22} color="#00C896" />
                        </View>
                        <View>
                            <Text style={styles.supportRowTitle}>Email Support</Text>
                            <Text style={styles.supportRowDesc}>bitbyapplication@gmail.com</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* FAQ */}
                <View style={styles.faqCard}>
                    <Text style={styles.faqTitle}>Frequently Asked Questions</Text>
                    {FAQS.map((item, idx) => (
                        <View key={item.q}>
                            <TouchableOpacity style={styles.faqRow} onPress={() => setOpen(open === idx ? null : idx)}>
                                <Text style={styles.faqQ}>{item.q}</Text>
                                <Ionicons name={open === idx ? 'chevron-up' : 'chevron-down'} size={20} color="#aaa" />
                            </TouchableOpacity>
                            {open === idx && <Text style={styles.faqA}>{item.a}</Text>}
                            {idx < FAQS.length - 1 && <View style={styles.faqDivider} />}
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
} 