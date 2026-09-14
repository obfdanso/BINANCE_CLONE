import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import styles from '../styles/WalletSettings.styles';

const GREEN = '#00C896';

export default function WalletSettings() {
    const insets = useSafeAreaInsets();
    const router = useRouter();


    return (
        <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={20} color="#fff" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Description Box */}
                <View style={styles.descriptionBox}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={styles.descriptionIcon}>
                            <Ionicons name="wallet-outline" size={22} color={GREEN} />
                        </View>
                        <View style={styles.descriptionTextContainer}>
                            <Text style={styles.descriptionTitle}>Wallet Settings</Text>
                            <Text style={styles.descriptionText}>Manage your wallet security, preferences, and settings</Text>
                        </View>
                    </View>
                </View>

                {/* Security Section */}
                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>Security</Text>
                    <TouchableOpacity style={styles.sectionRow} activeOpacity={0.7} onPress={() => router.push('/screens/ChangePassword')}>
                        <View style={styles.sectionIconBubble}>
                            <Ionicons name="shield-checkmark-outline" size={22} color={GREEN} />
                        </View>
                        <View style={styles.sectionRowTextWrap}>
                            <Text style={styles.sectionRowTitle}>Change Password</Text>
                            <Text style={styles.sectionRowDesc}>Update your wallet password</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={22} color="#aaa" />
                    </TouchableOpacity>
                </View>

                {/* Preferences Section */}
                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>Preferences</Text>
                    <TouchableOpacity style={styles.sectionRow} activeOpacity={0.7}>
                        <View style={styles.sectionIconBubble}>
                            <Ionicons name="language-outline" size={22} color={GREEN} />
                        </View>
                        <View style={styles.sectionRowTextWrap}>
                            <Text style={styles.sectionRowTitle}>Language</Text>
                            <Text style={styles.sectionRowDesc}>English (US)</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={22} color="#aaa" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.sectionRow} activeOpacity={0.7}>
                        <View style={styles.sectionIconBubble}>
                            <Ionicons name="cash-outline" size={22} color={GREEN} />
                        </View>
                        <View style={styles.sectionRowTextWrap}>
                            <Text style={styles.sectionRowTitle}>Currency</Text>
                            <Text style={styles.sectionRowDesc}>GHS (Ghanaian Cedi)</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={22} color="#aaa" />
                    </TouchableOpacity>
                </View>

                {/* Wallet Management Section */}
                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>Wallet Management</Text>
                    <TouchableOpacity style={styles.sectionRow} activeOpacity={0.7} onPress={() => router.push('/screens/WalletInfo')}>
                        <View style={styles.sectionIconBubble}>
                            <Ionicons name="wallet-outline" size={22} color={GREEN} />
                        </View>
                        <View style={styles.sectionRowTextWrap}>
                            <Text style={styles.sectionRowTitle}>Wallet Info</Text>
                            <Text style={styles.sectionRowDesc}>View wallet details and address</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={22} color="#aaa" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.sectionRow} activeOpacity={0.7} onPress={() => router.push('/screens/DeleteWallet')}>
                        <View style={styles.sectionIconBubble}>
                            <Ionicons name="trash-outline" size={22} color="#FF6B6B" />
                        </View>
                        <View style={styles.sectionRowTextWrap}>
                            <Text style={[styles.sectionRowTitle, { color: '#FF6B6B' }]}>Delete Wallet</Text>
                            <Text style={styles.sectionRowDesc}>Permanently remove wallet</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={22} color="#aaa" />
                    </TouchableOpacity>
                </View>

                {/* Support Section */}
                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>Support</Text>
                    <TouchableOpacity style={styles.sectionRow} activeOpacity={0.7} onPress={() => router.push('/screens/HelpCenter')}>
                        <View style={styles.sectionIconBubble}>
                            <Ionicons name="help-circle-outline" size={22} color={GREEN} />
                        </View>
                        <View style={styles.sectionRowTextWrap}>
                            <Text style={styles.sectionRowTitle}>Help Center</Text>
                            <Text style={styles.sectionRowDesc}>Get help and support</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={22} color="#aaa" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.sectionRow} activeOpacity={0.7} onPress={() => router.push('/screens/TermsOfService')}>
                        <View style={styles.sectionIconBubble}>
                            <Ionicons name="document-text-outline" size={22} color={GREEN} />
                        </View>
                        <View style={styles.sectionRowTextWrap}>
                            <Text style={styles.sectionRowTitle}>Terms of Service</Text>
                            <Text style={styles.sectionRowDesc}>Read our terms and conditions</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={22} color="#aaa" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.sectionRow} activeOpacity={0.7} onPress={() => router.push('/screens/PrivacyPolicy')}>
                        <View style={styles.sectionIconBubble}>
                            <Ionicons name="shield-outline" size={22} color={GREEN} />
                        </View>
                        <View style={styles.sectionRowTextWrap}>
                            <Text style={styles.sectionRowTitle}>Privacy Policy</Text>
                            <Text style={styles.sectionRowDesc}>How we protect your data</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={22} color="#aaa" />
                    </TouchableOpacity>
                </View>

                {/* About Section */}
                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>About</Text>
                    <View style={styles.sectionRow}>
                        <View style={styles.sectionIconBubble}>
                            <Ionicons name="information-circle-outline" size={22} color={GREEN} />
                        </View>
                        <View style={styles.sectionRowTextWrap}>
                            <Text style={styles.sectionRowTitle}>App Version</Text>
                            <Text style={styles.sectionRowDesc}>Bitby Wallet v1.0.0</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
} 