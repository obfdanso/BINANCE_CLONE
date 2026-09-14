import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Animated } from 'react-native';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUser } from '../../contexts/UserContext';
import styles from '../styles/PersonalInformation.styles';

const GREEN = '#00C896';
const INACTIVE_TAB = '#aaa';

export default function PersonalInformation() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { username, setUsername, fullName, setFullName, phone, setPhone, email, setEmail } = useUser();
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
            <ScrollView contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
                {/* Description Card */}
                <View style={styles.descriptionBox}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Animated.View style={[styles.iconBubble, { marginRight: 18, transform: [{ scale: pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.15] }) }] }]}>
                            <MaterialIcons name="person" size={28} color={GREEN} />
                        </Animated.View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.descriptionTitle}>Personal Information</Text>
                            <Text style={styles.descriptionText}>Manage your personal details and account information</Text>
                        </View>
                    </View>
                </View>

                {/* Account Information Card */}
                <View style={styles.infoCard}>
                    <Text style={styles.infoCardTitle}>Account Information</Text>
                    <View style={styles.infoRow}>
                        <View style={styles.iconBubble}>
                            <MaterialIcons name="person" size={22} color={GREEN} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.infoLabel}>Username</Text>
                            <TextInput
                                style={styles.infoInput}
                                value={username}
                                onChangeText={setUsername}
                                placeholder="Username"
                                placeholderTextColor={INACTIVE_TAB}
                                autoCapitalize="none"
                            />
                        </View>
                    </View>
                    <View style={styles.infoRow}>
                        <View style={styles.iconBubble}>
                            <MaterialCommunityIcons name="shield-check-outline" size={22} color={GREEN} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.infoLabel}>Account Status</Text>
                            <Text style={styles.infoValue}>Active</Text>
                        </View>
                    </View>

                </View>

                {/* Basic Information Card */}
                <View style={styles.infoCard}>
                    <Text style={styles.infoCardTitle}>Basic Information</Text>
                    <View style={styles.infoRow}>
                        <View style={styles.iconBubble}>
                            <MaterialIcons name="person" size={22} color={GREEN} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.infoLabel}>Full Name</Text>
                            <TextInput
                                style={styles.infoInput}
                                value={fullName}
                                onChangeText={setFullName}
                                placeholder="Full Name"
                                placeholderTextColor={INACTIVE_TAB}
                            />
                        </View>
                    </View>
                    <View style={styles.infoRow}>
                        <View style={styles.iconBubble}>
                            <Ionicons name="call-outline" size={22} color={GREEN} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.infoLabel}>Phone Number</Text>
                            <TextInput
                                style={styles.infoInput}
                                value={phone}
                                onChangeText={setPhone}
                                placeholder="Phone Number"
                                placeholderTextColor={INACTIVE_TAB}
                                keyboardType="phone-pad"
                            />
                        </View>
                    </View>
                    <View style={styles.infoRow}>
                        <View style={styles.iconBubble}>
                            <Ionicons name="mail-outline" size={22} color={GREEN} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.infoLabel}>Email Address</Text>
                            <TextInput
                                style={styles.infoInput}
                                value={email}
                                onChangeText={setEmail}
                                placeholder="Email Address"
                                placeholderTextColor={INACTIVE_TAB}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
} 