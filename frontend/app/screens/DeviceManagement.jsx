import React, { useRef, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Animated, ScrollView, Modal } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from '../styles/DeviceManagement.styles';

const GREEN = '#00C896';
const RED = '#FF6B6B';
const GRAY = '#aaa';

const INITIAL_DEVICES = [
    { name: 'iPhone 15 Pro', location: 'Accra, Ghana', last: '2 minutes ago', current: true, type: 'phone-portrait-outline' },
    { name: 'Samsung Galaxy S24', location: 'Tema, Ghana', last: '1 week ago', current: false, type: 'phone-portrait-outline' },
];

export default function DeviceManagement() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const pulseAnim = useRef(new Animated.Value(0)).current;
    const [devices, setDevices] = useState(INITIAL_DEVICES);
    const [showModal, setShowModal] = useState(false);
    const [deviceToLogout, setDeviceToLogout] = useState(null);
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
            ])
        ).start();
    }, []);
    const handleLogout = (device) => {
        setDeviceToLogout(device);
        setShowModal(true);
    };
    const confirmLogout = () => {
        setDevices(devices.filter(d => d.name !== deviceToLogout.name));
        setShowModal(false);
        setDeviceToLogout(null);
    };
    return (
        <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={20} color="#fff" />
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
                {/* Description Card */}
                <View style={styles.descriptionBox}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Animated.View style={[styles.descriptionIconWrapper, { marginRight: 18, transform: [{ scale: pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.15] }) }] }]}>
                            <Ionicons name="location" size={28} color={GREEN} />
                        </Animated.View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.descriptionTitle}>Device Management</Text>
                            <Text style={styles.descriptionText}>Manage your logged-in devices and their locations</Text>
                        </View>
                    </View>
                </View>
                {/* Logged In Devices Card */}
                <View style={styles.card}>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                        <Text style={styles.sectionTitle}>Logged In Devices</Text>
                        <Text style={styles.deviceCount}>{devices.length} devices</Text>
                    </View>
                    {devices.map((d, idx) => (
                        <View key={d.name} style={[styles.deviceRow, d.current && styles.deviceRowCurrent]}>
                            <View style={styles.deviceIconBubble}>
                                <Ionicons name={d.type} size={22} color={GREEN} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.deviceName}>{d.name} {d.current && <Text style={styles.currentBadge}>Current</Text>}</Text>
                                <Text style={styles.deviceLocation}>{d.location}</Text>
                                <Text style={styles.deviceLast}>Last active: {d.last}</Text>
                            </View>
                            {!d.current && (
                                <TouchableOpacity style={styles.logoutButton} onPress={() => handleLogout(d)}>
                                    <MaterialCommunityIcons name="logout" size={22} color={RED} />
                                </TouchableOpacity>
                            )}
                        </View>
                    ))}
                </View>
                {/* Security Tips Card */}
                <View style={styles.card}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                        <Ionicons name="information-circle" size={20} color={GREEN} style={{ marginRight: 10 }} />
                        <Text style={styles.sectionTitle}>Security Tips</Text>
                    </View>
                    <Text style={styles.tipsText}>• Regularly review and logout from devices you no longer use</Text>
                    <Text style={styles.tipsText}>• For best security, enable two-factor authentication</Text>
                </View>
            </ScrollView>
            {/* Logout Confirmation Modal */}
            <Modal
                visible={showModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowModal(false)}
            >
                <TouchableOpacity style={styles.popupOverlay} activeOpacity={1} onPress={() => setShowModal(false)}>
                    <View style={styles.popupCard}>
                        <Text style={styles.popupTitle}>Log out device?</Text>
                        <Text style={styles.popupDesc}>Are you sure you want to log out {deviceToLogout?.name}?</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 18 }}>
                            <TouchableOpacity style={[styles.popupButton, { marginRight: 10 }]} onPress={confirmLogout}>
                                <Text style={styles.popupButtonText}>Yes</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.popupButton} onPress={() => setShowModal(false)}>
                                <Text style={[styles.popupButtonText, { color: GRAY }]}>No</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>
        </SafeAreaView>
    );
}

