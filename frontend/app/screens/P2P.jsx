import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getActiveListings } from '../../services/p2pService';
import { View, Text, ScrollView, TouchableOpacity, Animated, ActivityIndicator } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { useUser } from '../../contexts/UserContext';
import styles from '../styles/P2P.styles';

const GREEN = '#00C896';
const RED = '#FF4D4F';

export default function P2P() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { balance, hasFirstDeposit } = useUser();
    const [activeTab, setActiveTab] = useState('Buy');
    const [selectedCrypto, setSelectedCrypto] = useState('USDT');
    const [selectedFiat] = useState('GHS');
    const [showCryptoDropdown, setShowCryptoDropdown] = useState(false);
    const [showNoAssetsModal, setShowNoAssetsModal] = useState(false);
    const [listings, setListings] = useState([]);
    const [listingsLoading, setListingsLoading] = useState(true);
    const [listingsError, setListingsError] = useState('');

    // Animation values
    const iconScale = useRef(new Animated.Value(1)).current;
    const iconRotation = useRef(new Animated.Value(0)).current;
    const iconOpacity = useRef(new Animated.Value(0)).current;
    const cryptoDropdownOpacity = useRef(new Animated.Value(0)).current;
    const cryptoDropdownScale = useRef(new Animated.Value(0.95)).current;

    const cryptoOptions = ['USDT', 'BTC', 'ETH', 'BNB', 'SOL'];

    // Check if user has assets to sell
    const hasAssets = hasFirstDeposit && balance > 0;

    // Handle sell button press
    const handleSellPress = () => {
        if (!hasAssets) {
            setShowNoAssetsModal(true);
        } else {
            setActiveTab('Sell');
        }
    };

    // Animation sequence for the P2P icon
    useEffect(() => {
        const startAnimation = () => {
            // Fade in animation
            Animated.timing(iconOpacity, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }).start();

            // Scale and rotation animation
            Animated.sequence([
                Animated.parallel([
                    Animated.timing(iconScale, {
                        toValue: 1.2,
                        duration: 600,
                        useNativeDriver: true,
                    }),
                    Animated.timing(iconRotation, {
                        toValue: 1,
                        duration: 600,
                        useNativeDriver: true,
                    }),
                ]),
                Animated.timing(iconScale, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                // Start continuous animation after initial animation completes
                startContinuousAnimation();
            });
        };

        // Start animation immediately
        startAnimation();
    }, []);

    // Animate crypto dropdown
    useEffect(() => {
        if (showCryptoDropdown) {
            Animated.parallel([
                Animated.timing(cryptoDropdownOpacity, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(cryptoDropdownScale, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(cryptoDropdownOpacity, {
                    toValue: 0,
                    duration: 150,
                    useNativeDriver: true,
                }),
                Animated.timing(cryptoDropdownScale, {
                    toValue: 0.95,
                    duration: 150,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [showCryptoDropdown]);

    // Continuous animation function
    const startContinuousAnimation = () => {
        const continuousAnimation = () => {
            Animated.sequence([
                // Subtle scale up
                Animated.timing(iconScale, {
                    toValue: 1.08,
                    duration: 1500,
                    useNativeDriver: true,
                }),
                // Subtle scale down
                Animated.timing(iconScale, {
                    toValue: 1,
                    duration: 1500,
                    useNativeDriver: true,
                }),
                // Small rotation
                Animated.timing(iconRotation, {
                    toValue: iconRotation._value + 0.1,
                    duration: 2000,
                    useNativeDriver: true,
                }),
            ]).start(() => continuousAnimation());
        };

        continuousAnimation();
    };

    /**
     * Listings come from GET /api/p2p/listings.
     *
     * The card UI was built around fields the backend does not track - a
     * seller rating, a completed-order count and an online flag. Those are
     * left out rather than filled with invented numbers; the fields the API
     * does provide are mapped straight through.
     */
    const loadListings = useCallback(async () => {
        setListingsLoading(true);
        try {
            const data = await getActiveListings();
            setListings(Array.isArray(data) ? data : []);
            setListingsError('');
        } catch (error) {
            setListingsError(error.message || 'Could not load offers.');
        } finally {
            setListingsLoading(false);
        }
    }, []);

    useEffect(() => { loadListings(); }, [loadListings]);

    const p2pOrders = listings
        .filter(listing => !selectedCrypto || listing.assetSymbol === selectedCrypto)
        .map(listing => ({
            id: listing.id,
            user: listing.sellerUsername || 'Unknown seller',
            price: Number(listing.pricePerUnit) || 0,
            amount: Number(listing.amount) || 0,
            asset: listing.assetSymbol,
            currency: listing.currency || selectedFiat,
            limit: `${listing.currency || selectedFiat} ${(Number(listing.amount) || 0).toLocaleString()}`,
            payment: `${listing.currency || selectedFiat} Mobile Money`,
            status: listing.status,
        }));


    const backButtonStyle = {
        backgroundColor: 'rgba(35,40,52,0.95)',
        borderRadius: 30,
        padding: 12,
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.08)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.16,
        shadowRadius: 8,
        elevation: 4,
        alignItems: 'center',
        justifyContent: 'center',
    };

    const spin = iconRotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top + 10 }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={backButtonStyle}>
                    <Ionicons name="arrow-back" size={20} color="#fff" />
                </TouchableOpacity>
                <View style={{ flex: 1 }} />
            </View>

            {/* Description Box */}
            <View style={styles.descriptionBox}>
                <View style={styles.descriptionContent}>
                    <Animated.View
                        style={[
                            styles.descriptionIconContainer,
                            {
                                opacity: iconOpacity,
                                transform: [
                                    { scale: iconScale },
                                    { rotate: spin }
                                ],
                            }
                        ]}
                    >
                        <Feather name="users" size={24} color={GREEN} />
                    </Animated.View>
                    <Text style={styles.descriptionText}>
                        Trade cryptocurrencies directly with other users using your preferred payment method
                    </Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Buy/Sell Toggle */}
                <View style={styles.toggleContainer}>
                    <TouchableOpacity
                        style={[styles.toggleButton, activeTab === 'Buy' && styles.toggleButtonActive]}
                        onPress={() => setActiveTab('Buy')}
                    >
                        <Text style={[styles.toggleText, activeTab === 'Buy' && styles.toggleTextActive]}>Buy</Text>
                        {activeTab === 'Buy' && <View style={styles.greenBar} />}
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.toggleButton,
                            activeTab === 'Sell' && styles.toggleButtonActive,
                            !hasAssets && styles.toggleButtonDisabled,
                            { marginRight: 0 }
                        ]}
                        onPress={handleSellPress}
                        disabled={!hasAssets}
                    >
                        <Text style={[
                            styles.toggleText,
                            activeTab === 'Sell' && styles.toggleTextActive,
                            !hasAssets && styles.toggleTextDisabled
                        ]}>Sell</Text>
                        {activeTab === 'Sell' && <View style={styles.greenBar} />}
                    </TouchableOpacity>
                </View>

                {/* Crypto/Fiat Selection */}
                <View style={styles.selectionContainer}>
                    <View style={styles.selectionRow}>
                        <Text style={styles.selectionLabel}>I want to {activeTab.toLowerCase()}</Text>
                        <TouchableOpacity
                            style={styles.selectionButton}
                            onPress={() => {
                                setShowCryptoDropdown(!showCryptoDropdown);
                            }}
                        >
                            <Text style={styles.selectionButtonText}>{selectedCrypto}</Text>
                            <Ionicons
                                name={showCryptoDropdown ? "chevron-up" : "chevron-down"}
                                size={16}
                                color="#aaa"
                            />
                        </TouchableOpacity>
                    </View>
                    {showCryptoDropdown && (
                        <Animated.View
                            style={[
                                styles.dropdownContainer,
                                {
                                    opacity: cryptoDropdownOpacity,
                                    transform: [{ scale: cryptoDropdownScale }],
                                }
                            ]}
                        >
                            {cryptoOptions.map((crypto) => (
                                <TouchableOpacity
                                    key={crypto}
                                    style={[
                                        styles.dropdownItem,
                                        selectedCrypto === crypto && styles.dropdownItemActive
                                    ]}
                                    onPress={() => {
                                        setSelectedCrypto(crypto);
                                        setShowCryptoDropdown(false);
                                    }}
                                    activeOpacity={0.7}
                                >
                                    <Text style={[
                                        styles.dropdownItemText,
                                        selectedCrypto === crypto && styles.dropdownItemTextActive
                                    ]}>
                                        {crypto}
                                    </Text>
                                    {selectedCrypto === crypto && (
                                        <Ionicons name="checkmark" size={16} color={GREEN} />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </Animated.View>
                    )}
                    <View style={styles.selectionRow}>
                        <Text style={styles.selectionLabel}>Payment</Text>
                        <View style={styles.selectionButton}>
                            <Text style={styles.selectionButtonText}>GHS</Text>
                        </View>
                    </View>
                </View>







                {/* Orders List */}
                <View style={styles.ordersContainer}>
                    <View style={styles.ordersHeader}>
                        <Text style={styles.sectionTitle}>Available Orders</Text>
                    </View>

                    {listingsError ? (
                        <TouchableOpacity onPress={loadListings} style={{ backgroundColor: '#2A1F1F', borderColor: '#FF6B6B', borderWidth: 1, borderRadius: 12, padding: 16, margin: 16 }}>
                            <Text style={{ color: '#FF6B6B', fontSize: 13 }}>{listingsError}</Text>
                            <Text style={{ color: '#888', fontSize: 12, marginTop: 4 }}>Tap to retry</Text>
                        </TouchableOpacity>
                    ) : listingsLoading ? (
                        <View style={{ padding: 32, alignItems: 'center' }}>
                            <ActivityIndicator color="#00C896" />
                            <Text style={{ color: '#888', fontSize: 13, marginTop: 8 }}>Loading offers...</Text>
                        </View>
                    ) : p2pOrders.length === 0 ? (
                        <View style={{ padding: 32, alignItems: 'center' }}>
                            <Text style={{ color: '#888', fontSize: 14 }}>No {selectedCrypto} offers yet</Text>
                            <Text style={{ color: '#666', fontSize: 12, marginTop: 4, textAlign: 'center' }}>
                                Nobody has posted a listing for this asset.
                            </Text>
                        </View>
                    ) : null}
                    {p2pOrders.map((order, index) => (
                        <TouchableOpacity key={order.id} style={styles.orderCard} activeOpacity={0.7}>
                            <View style={styles.orderHeader}>
                                <View style={styles.userInfo}>
                                    <View style={styles.userAvatar}>
                                        <Text style={styles.userInitial}>{order.user.charAt(0)}</Text>
                                    </View>
                                    <View style={styles.userDetails}>
                                        <Text style={styles.userName}>{order.user}</Text>
                                        <View style={styles.userStats}>
                                            <Text style={styles.userOrders}>
                                                {order.amount.toLocaleString()} {order.asset} available
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.orderStatus}>
                                    <Text style={styles.onlineText}>{order.status}</Text>
                                </View>
                            </View>

                            <View style={styles.orderDetails}>
                                <View style={styles.orderRow}>
                                    <Text style={styles.orderLabel}>Price:</Text>
                                    <Text style={styles.orderValue}>{order.currency} {order.price.toLocaleString()}</Text>
                                </View>
                                <View style={styles.orderRow}>
                                    <Text style={styles.orderLabel}>Limit:</Text>
                                    <Text style={styles.orderValue}>{order.limit}</Text>
                                </View>
                                <View style={styles.orderRow}>
                                    <Text style={styles.orderLabel}>Payment:</Text>
                                    <Text style={styles.orderValue}>{order.payment}</Text>
                                </View>
                            </View>

                            <View style={styles.orderActions}>
                                <TouchableOpacity
                                    style={styles.chatButton}
                                    onPress={() => {
                                        router.push({
                                            pathname: '/screens/Chat',
                                            params: {
                                                trader: order.user,
                                                traderId: order.id,
                                                asset: order.asset,
                                                price: order.price
                                            }
                                        });
                                    }}
                                >
                                    <Ionicons name="chatbubble-outline" size={16} color="#aaa" />
                                    <Text style={styles.chatButtonText}>Chat</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.actionButton, activeTab === 'Buy' ? styles.buyButton : styles.sellButton]}
                                    onPress={() => {
                                        if (activeTab === 'Buy') {
                                            router.push({
                                                pathname: '/screens/P2PBuy',
                                                params: {
                                                    listingId: order.id,
                                                    trader: order.user,
                                                    price: order.price,
                                                    limit: order.limit,
                                                    payment: order.payment,
                                                    available: order.amount,
                                                    selectedCrypto: order.asset || selectedCrypto,
                                                }
                                            });
                                        } else if (activeTab === 'Sell') {
                                            router.push({
                                                pathname: '/screens/P2PSell',
                                                params: {
                                                    listingId: order.id,
                                                    trader: order.user,
                                                    price: order.price,
                                                    limit: order.limit,
                                                    payment: order.payment,
                                                    available: order.amount,
                                                    selectedCrypto: order.asset || selectedCrypto,
                                                }
                                            });
                                        }
                                    }}
                                >
                                    <Text style={styles.actionButtonText}>{activeTab}</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>

            {/* No Assets Modal */}
            {showNoAssetsModal && (
                <View style={styles.modalOverlay}>
                    <BlurView intensity={30} tint="dark" style={styles.modalBlur}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalIcon}>
                                <Ionicons name="wallet-outline" size={48} color={RED} />
                            </View>
                            <Text style={styles.modalTitle}>No Available Assets</Text>
                            <Text style={styles.modalText}>
                                You don't have any assets to sell. Please deposit or buy some cryptocurrencies first to start selling on P2P.
                            </Text>
                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={styles.modalButtonSecondary}
                                    onPress={() => setShowNoAssetsModal(false)}
                                >
                                    <Text style={styles.modalButtonSecondaryText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.modalButtonPrimary}
                                    onPress={() => {
                                        setShowNoAssetsModal(false);
                                        router.push('/screens/Deposit');
                                    }}
                                >
                                    <Text style={styles.modalButtonPrimaryText}>Add Funds</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </BlurView>
                </View>
            )}
        </SafeAreaView>
    );
} 