import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useWallet } from '../../contexts/WalletContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/WalletInfo.styles';

const GREEN = '#00C896';

export default function WalletInfo() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { walletName, walletCreated } = useWallet();
    const [isAddressVisible, setIsAddressVisible] = useState(false);
    const [walletCreationDate, setWalletCreationDate] = useState(null);

    // Load wallet creation date from AsyncStorage
    React.useEffect(() => {
        const loadWalletData = async () => {
            try {
                const walletData = await AsyncStorage.getItem('bitbyWallet');
                if (walletData) {
                    const parsedData = JSON.parse(walletData);
                    setWalletCreationDate(parsedData.createdAt);
                }
            } catch (error) {
                console.log('Error loading wallet data:', error);
            }
        };
        loadWalletData();
    }, []);

    // Mock wallet data - in a real app, this would come from the wallet context or API
    const walletData = {
        name: walletName || 'Bitby Wallet',
        address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
        type: 'HD Wallet',
        network: 'Ethereum',
        createdAt: walletCreationDate,
    };

    const copyToClipboard = (text, label) => {
        // In a real app, you would use Clipboard API
        Alert.alert('Copied!', `${label} has been copied to clipboard`);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatAddress = (address) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

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
                            <Text style={styles.descriptionTitle}>Wallet Information</Text>
                            <Text style={styles.descriptionText}>View your wallet details and address information</Text>
                        </View>
                    </View>
                </View>

                {/* Wallet Details Section */}
                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>Wallet Details</Text>

                    <View style={styles.infoRow}>
                        <View style={styles.infoIconBubble}>
                            <Ionicons name="person-outline" size={20} color={GREEN} />
                        </View>
                        <View style={styles.infoTextWrap}>
                            <Text style={styles.infoLabel}>Wallet Name</Text>
                            <Text style={styles.infoValue}>{walletData.name}</Text>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <View style={styles.infoIconBubble}>
                            <Ionicons name="key-outline" size={20} color={GREEN} />
                        </View>
                        <View style={styles.infoTextWrap}>
                            <Text style={styles.infoLabel}>Wallet Type</Text>
                            <Text style={styles.infoValue}>{walletData.type}</Text>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <View style={styles.infoIconBubble}>
                            <Ionicons name="globe-outline" size={20} color={GREEN} />
                        </View>
                        <View style={styles.infoTextWrap}>
                            <Text style={styles.infoLabel}>Network</Text>
                            <Text style={styles.infoValue}>{walletData.network}</Text>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <View style={styles.infoIconBubble}>
                            <Ionicons name="calendar-outline" size={20} color={GREEN} />
                        </View>
                        <View style={styles.infoTextWrap}>
                            <Text style={styles.infoLabel}>Created</Text>
                            <Text style={styles.infoValue}>{formatDate(walletData.createdAt)}</Text>
                        </View>
                    </View>
                </View>

                {/* Address Section */}
                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>Wallet Address</Text>

                    <View style={styles.addressContainer}>
                        <View style={styles.addressRow}>
                            <View style={styles.infoIconBubble}>
                                <Ionicons name="location-outline" size={20} color={GREEN} />
                            </View>
                            <View style={styles.addressTextWrap}>
                                <Text style={styles.infoLabel}>Public Address</Text>
                                <Text style={styles.addressValue}>
                                    {isAddressVisible ? walletData.address : formatAddress(walletData.address)}
                                </Text>
                            </View>
                            <TouchableOpacity
                                style={styles.eyeButton}
                                onPress={() => setIsAddressVisible(!isAddressVisible)}
                            >
                                <Ionicons
                                    name={isAddressVisible ? "eye-off-outline" : "eye-outline"}
                                    size={20}
                                    color="#666"
                                />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={styles.copyButton}
                            onPress={() => copyToClipboard(walletData.address, 'Wallet address')}
                        >
                            <Ionicons name="copy-outline" size={18} color={GREEN} />
                            <Text style={styles.copyButtonText}>Copy Address</Text>
                        </TouchableOpacity>
                    </View>
                </View>


            </ScrollView>
        </SafeAreaView>
    );
} 