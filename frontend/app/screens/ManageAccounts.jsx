import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import styles from '../styles/ManageAccounts.styles';

const GREEN = '#00C896';
const RED = '#FF6B6B';
const YELLOW = '#FFC300';
const GRAY = '#aaa';

export default function ManageAccounts() {
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
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={20} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Description Card */}
            <View style={styles.descriptionBox}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Animated.View style={[styles.iconBubble, { marginRight: 18, transform: [{ scale: pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.15] }) }] }]}>
                        <MaterialCommunityIcons name="shield-check" size={32} color={GREEN} />
                    </Animated.View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.descriptionTitle}>Manage Accounts</Text>
                        <Text style={styles.descriptionText}>Control your account settings and preferences</Text>
                    </View>
                </View>
            </View>

            {/* Account Actions Card */}
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Account Actions</Text>
                <TouchableOpacity style={styles.actionRow} activeOpacity={0.85} onPress={() => router.push('/screens/DisableAccount')}>
                    <View style={[styles.iconBubble, { backgroundColor: 'rgba(0,200,150,0.10)' }]}>
                        <Ionicons name="pause" size={22} color={GREEN} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.actionTitle}>Disable Account</Text>
                        <Text style={styles.actionDesc}>Temporarily disable your account</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={22} color={GRAY} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionRow} activeOpacity={0.85} onPress={() => router.push('/screens/DeleteAccount')}>
                    <View style={[styles.iconBubble, { backgroundColor: 'rgba(255,75,75,0.10)' }]}>
                        <MaterialCommunityIcons name="trash-can-outline" size={22} color={RED} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.actionTitle, { color: RED }]}>Delete Account</Text>
                        <Text style={styles.actionDesc}>Permanently delete your account and all data</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={22} color={GRAY} />
                </TouchableOpacity>
            </View>

            {/* Important Information Card */}
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Important Information</Text>
                <View style={styles.infoRow}>
                    <Ionicons name="warning" size={18} color={YELLOW} style={{ marginRight: 10 }} />
                    <Text style={styles.infoText}>Disabling your account will hide your profile and suspend all activities</Text>
                </View>
                <View style={styles.infoRow}>
                    <Ionicons name="alert-circle" size={18} color={RED} style={{ marginRight: 10 }} />
                    <Text style={styles.infoText}>Deleting your account is permanent and cannot be undone</Text>
                </View>
                <View style={styles.infoRow}>
                    <Ionicons name="information-circle" size={18} color={GREEN} style={{ marginRight: 10 }} />
                    <Text style={styles.infoText}>Contact support if you need assistance with account management</Text>
                </View>
            </View>
        </View>
    );
} 