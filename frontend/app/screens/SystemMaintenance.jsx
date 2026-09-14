import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from '../styles/SystemMaintenance.styles';

const GREEN = '#00C896';

const details = [
    {
        icon: <MaterialCommunityIcons name="flash" size={26} color={GREEN} />,
        title: 'Trading Engine Upgrade',
        status: 'Scheduled',
        desc: "We're upgrading our trading engine to improve performance and reduce latency",
        duration: '2 hours',
        warning: 'Trading will be temporarily suspended',
    },
    {
        icon: <FontAwesome5 name="lock" size={22} color={GREEN} />,
        title: 'Security Enhancement',
        status: 'Scheduled',
        desc: 'Implementing new security protocols to protect user accounts',
        duration: '1 hour',
        warning: 'Login and withdrawal functions affected',
    },
    {
        icon: <FontAwesome5 name="database" size={22} color={GREEN} />,
        title: 'Database Optimization',
        status: 'Scheduled',
        desc: 'Optimizing database performance for faster transactions',
        duration: '1 hour',
        warning: 'Some features may be temporarily unavailable',
    },
];

export default function SystemMaintenance() {
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
            {/* Sticky Back Button */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={20} color="#fff" />
                </TouchableOpacity>
            </View>
            {/* Description Box */}
            <View style={styles.descriptionBox}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Animated.View style={[styles.descriptionIconWrapper, { marginRight: 18, transform: [{ scale: pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.15] }) }] }]}>
                        <MaterialCommunityIcons name="tools" size={28} color={GREEN} />
                    </Animated.View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.descriptionTitle}>System Maintenance</Text>
                        <Text style={styles.descriptionText}>Scheduled maintenance on 31st July, 2025 from 2:00 AM to 6:00 AM GMT</Text>
                    </View>
                </View>
            </View>
            <ScrollView contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
                <Text style={styles.sectionTitle}>Maintenance Details</Text>
                {details.map((item, idx) => (
                    <View key={item.title} style={styles.detailCard}>
                        <View style={styles.detailRow}>
                            <View style={styles.detailIcon}>{item.icon}</View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.detailTitle}>{item.title}</Text>
                                <Text style={styles.detailDesc}>{item.desc}</Text>
                                <View style={styles.detailMetaRow}>
                                    <MaterialCommunityIcons name="clock-outline" size={16} color="#aaa" style={{ marginRight: 4 }} />
                                    <Text style={styles.detailMeta}>Duration: {item.duration}</Text>
                                </View>
                                <View style={styles.detailWarningRow}>
                                    <MaterialCommunityIcons name="alert-circle-outline" size={16} color={GREEN} style={{ marginRight: 4 }} />
                                    <Text style={styles.detailWarning}>{item.warning}</Text>
                                </View>
                            </View>
                            <View style={styles.scheduledBadge}><Text style={styles.scheduledText}>Scheduled</Text></View>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

