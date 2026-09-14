import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import styles from '../styles/Settings.styles';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated';

export default function Settings() {
    const router = useRouter();
    const [rateModalVisible, setRateModalVisible] = useState(false);
    const [selectedRating, setSelectedRating] = useState(0);
    const [thankYouVisible, setThankYouVisible] = useState(false);
    const [logoutModalVisible, setLogoutModalVisible] = useState(false);

    // Infinite rotation animation for the description icon
    const rotate = useSharedValue(0);

    useEffect(() => {
        rotate.value = withRepeat(
            withTiming(360, { duration: 2000 }),
            -1, // infinite
            false // do not reverse
        );
    }, []);

    const animatedIconStyle = useAnimatedStyle(() => ({
        transform: [
            { rotate: `${rotate.value}deg` },
        ],
    }));

    const handleSubmitRating = () => {
        setRateModalVisible(false);
        setTimeout(() => setThankYouVisible(true), 300); // slight delay for smooth transition
    };

    const handleLogout = () => {
        setLogoutModalVisible(true);
    };
    const confirmLogout = () => {
        setLogoutModalVisible(false);
        // TODO: Implement actual logout logic
        // For now, show a feedback modal or navigate away
        Alert.alert(
            "Logout",
            "Are you sure you want to log out?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                { text: "OK", onPress: () => router.replace('/screens/SignUp') }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={20} color="#fff" />
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Description Box */}
                <View style={styles.descriptionBox}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Animated.View style={[styles.descriptionIcon, animatedIconStyle]}>
                            <MaterialIcons name="settings" size={22} color="#00C896" />
                        </Animated.View>
                        <View style={styles.descriptionTextContainer}>
                            <Text style={styles.descriptionTitle}>Settings</Text>
                            <Text style={styles.descriptionText}>Customize your app experience and preferences</Text>
                        </View>
                    </View>
                </View>

                {/* Appearance Section */}
                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>Appearance</Text>
                    <TouchableOpacity style={styles.sectionRow} activeOpacity={0.7}>
                        <View style={styles.sectionIconBubble}><Ionicons name="language" size={22} color="#00C896" /></View>
                        <View style={styles.sectionRowTextWrap}>
                            <Text style={styles.sectionRowTitle}>Language</Text>
                            <Text style={styles.sectionRowDesc}>English (US)</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={22} color="#aaa" />
                    </TouchableOpacity>
                </View>
                {/* Security Section */}
                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>Security</Text>
                    <TouchableOpacity style={styles.sectionRow} activeOpacity={0.7} onPress={() => router.push('/screens/ChangePassword')}>
                        <View style={styles.sectionIconBubble}><Ionicons name="lock-closed" size={22} color="#00C896" /></View>
                        <View style={styles.sectionRowTextWrap}>
                            <Text style={styles.sectionRowTitle}>Change Password</Text>
                            <Text style={styles.sectionRowDesc}>Update your account password</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={22} color="#aaa" />
                    </TouchableOpacity>
                </View>
                {/* About Section */}
                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>About</Text>
                    <View style={styles.sectionRow}>
                        <View style={styles.sectionIconBubble}><Ionicons name="information-circle" size={22} color="#00C896" /></View>
                        <View style={styles.sectionRowTextWrap}>
                            <Text style={styles.sectionRowTitle}>App Version</Text>
                            <Text style={styles.sectionRowDesc}>1.0.0</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.sectionRow} activeOpacity={0.7} onPress={() => setRateModalVisible(true)}>
                        <View style={styles.sectionIconBubble}><Ionicons name="star" size={22} color="#00C896" /></View>
                        <View style={styles.sectionRowTextWrap}>
                            <Text style={styles.sectionRowTitle}>Rate App</Text>
                            <Text style={styles.sectionRowDesc}>Share your feedback</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={22} color="#aaa" />
                    </TouchableOpacity>
                </View>
                {/* Account Actions Section */}
                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>Account Actions</Text>
                    <TouchableOpacity style={styles.sectionRow} activeOpacity={0.7} onPress={handleLogout}>
                        <View style={styles.sectionIconBubble}><Ionicons name="exit-outline" size={22} color="#FF6B6B" /></View>
                        <View style={styles.sectionRowTextWrap}>
                            <Text style={[styles.sectionRowTitle, { color: '#fff' }]}>Log Out</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                {/* Rate App Modal */}
                {rateModalVisible && (
                    <View style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, zIndex: 100, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(24,28,35,0.85)' }}>
                        <View style={{ backgroundColor: '#232834', borderRadius: 20, padding: 28, alignItems: 'center', width: 320, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.16, shadowRadius: 8, elevation: 8 }}>
                            <TouchableOpacity onPress={() => setRateModalVisible(false)} style={{ alignSelf: 'flex-end', marginBottom: 8 }}>
                                <Ionicons name="close" size={28} color="#aaa" />
                            </TouchableOpacity>
                            <Ionicons name="star" size={38} color="#00C896" style={{ marginBottom: 10 }} />
                            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 20, marginBottom: 6 }}>Rate Bitby</Text>
                            <Text style={{ color: '#aaa', fontSize: 15, textAlign: 'center', marginBottom: 18 }}>How would you rate your experience with our app?</Text>
                            <View style={{ flexDirection: 'row', marginBottom: 18 }}>
                                {[1, 2, 3, 4, 5].map(i => (
                                    <TouchableOpacity key={i} onPress={() => setSelectedRating(i)}>
                                        <Ionicons name={i <= selectedRating ? 'star' : 'star-outline'} size={32} color={i <= selectedRating ? '#00C896' : '#aaa'} style={{ marginHorizontal: 2 }} />
                                    </TouchableOpacity>
                                ))}
                            </View>
                            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', marginTop: 8 }}>
                                <TouchableOpacity
                                    style={{ flex: 1, backgroundColor: '#00C896', paddingVertical: 12, borderRadius: 12, alignItems: 'center', marginRight: 8 }}
                                    onPress={handleSubmitRating}
                                >
                                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Submit</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{ flex: 1, backgroundColor: '#232834', borderWidth: 1, borderColor: '#aaa', paddingVertical: 12, borderRadius: 12, alignItems: 'center', marginLeft: 8 }}
                                    onPress={() => setRateModalVisible(false)}
                                >
                                    <Text style={{ color: '#aaa', fontWeight: 'bold', fontSize: 16 }}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}
                {/* Thank You Modal */}
                {thankYouVisible && (
                    <View style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, zIndex: 101, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(24,28,35,0.85)' }}>
                        <View style={{ backgroundColor: '#232834', borderRadius: 20, padding: 32, alignItems: 'center', width: 320, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.16, shadowRadius: 8, elevation: 8 }}>
                            <Ionicons name="heart" size={44} color="#00C896" style={{ marginBottom: 14 }} />
                            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 22, marginBottom: 8 }}>Thank You!</Text>
                            <Text style={{ color: '#aaa', fontSize: 16, textAlign: 'center', marginBottom: 18 }}>We appreciate your feedback and support.</Text>
                            <TouchableOpacity
                                style={{ backgroundColor: '#00C896', paddingVertical: 12, paddingHorizontal: 32, borderRadius: 12, alignItems: 'center', marginTop: 8 }}
                                onPress={() => setThankYouVisible(false)}
                            >
                                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                {/* Log Out Modal */}
                {logoutModalVisible && (
                    <View style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, zIndex: 200, flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(24,28,35,0.85)' }}>
                        <View style={{ backgroundColor: '#232834', borderRadius: 20, padding: 32, alignItems: 'center', width: 320, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.16, shadowRadius: 8, elevation: 8 }}>
                            <Ionicons name="exit-outline" size={44} color="#00C896" style={{ marginBottom: 10 }} />
                            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 22, marginBottom: 8 }}>Log Out</Text>
                            <Text style={{ color: '#aaa', fontSize: 16, textAlign: 'center', marginBottom: 18 }}>Are you sure you want to log out of your account?</Text>
                            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', marginTop: 8 }}>
                                <TouchableOpacity
                                    style={{ flex: 1, backgroundColor: '#FF6B6B', paddingVertical: 12, borderRadius: 12, alignItems: 'center', marginRight: 8 }}
                                    onPress={confirmLogout}
                                >
                                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Log Out</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{ flex: 1, backgroundColor: '#232834', borderWidth: 1, borderColor: '#aaa', paddingVertical: 12, borderRadius: 12, alignItems: 'center', marginLeft: 8 }}
                                    onPress={() => setLogoutModalVisible(false)}
                                >
                                    <Text style={{ color: '#aaa', fontWeight: 'bold', fontSize: 16 }}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
} 