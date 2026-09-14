import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useNotifications } from '../../contexts/NotificationsContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/Earn.styles';

const GREEN = '#00C896';
const YELLOW = '#FAAD14';

export default function Earn() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { addNotification } = useNotifications();
    const [activeTab, setActiveTab] = useState('Simple Earn');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showProductModal, setShowProductModal] = useState(false);
    const [showSubscribeModal, setShowSubscribeModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showUnsubscribeModal, setShowUnsubscribeModal] = useState(false);
    const [productToSubscribe, setProductToSubscribe] = useState(null);
    const [productToUnsubscribe, setProductToUnsubscribe] = useState(null);
    const [subscribedProducts, setSubscribedProducts] = useState(new Set());

    // Load saved subscriptions on component mount
    useEffect(() => {
        loadSavedSubscriptions();
    }, []);

    const loadSavedSubscriptions = async () => {
        try {
            const savedSubscriptions = await AsyncStorage.getItem('earnSubscriptions');
            if (savedSubscriptions) {
                const subscriptionsArray = JSON.parse(savedSubscriptions);
                setSubscribedProducts(new Set(subscriptionsArray));
            }
        } catch (error) {
            console.log('Error loading saved subscriptions:', error);
        }
    };

    const saveSubscriptions = async (subscriptions) => {
        try {
            const subscriptionsArray = Array.from(subscriptions);
            await AsyncStorage.setItem('earnSubscriptions', JSON.stringify(subscriptionsArray));
        } catch (error) {
            console.log('Error saving subscriptions:', error);
        }
    };

    // Animation values
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        const pulseAnimation = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.1,
                    duration: 2000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 2000,
                    useNativeDriver: true,
                }),
            ])
        );
        pulseAnimation.start();
    }, []);

    const tabs = ['Simple Earn', 'Staking', 'Launchpool'];

    const earnProducts = {
        'Simple Earn': [
            {
                id: 1,
                coin: 'USDT',
                name: 'USDT Flexible',
                apy: '3.50%',
                minAmount: '10 USDT',
                maxAmount: '100,000 USDT',
                duration: 'Flexible',
                type: 'Flexible',
                status: 'Available',
                totalStaked: '2.5M USDT',
                icon: '💎',
                color: GREEN,
            },
            {
                id: 2,
                coin: 'BTC',
                name: 'BTC Flexible',
                apy: '2.80%',
                minAmount: '0.001 BTC',
                maxAmount: '50 BTC',
                duration: 'Flexible',
                type: 'Flexible',
                status: 'Available',
                totalStaked: '1.2K BTC',
                icon: 'bitcoin',
                color: '#F7931A',
            },
            {
                id: 3,
                coin: 'ETH',
                name: 'ETH Flexible',
                apy: '3.20%',
                minAmount: '0.01 ETH',
                maxAmount: '1,000 ETH',
                duration: 'Flexible',
                type: 'Flexible',
                status: 'Available',
                totalStaked: '15K ETH',
                icon: 'ethereum',
                color: '#627EEA',
            },
        ],
        'Staking': [
            {
                id: 4,
                coin: 'BNB',
                name: 'BNB Staking',
                apy: '8.50%',
                minAmount: '0.1 BNB',
                maxAmount: '10,000 BNB',
                duration: '30 days',
                type: 'Locked',
                status: 'Available',
                totalStaked: '500K BNB',
                icon: '🟡',
                color: '#F3BA2F',
            },
            {
                id: 5,
                coin: 'SOL',
                name: 'SOL Staking',
                apy: '6.80%',
                minAmount: '1 SOL',
                maxAmount: '100,000 SOL',
                duration: '7 days',
                type: 'Locked',
                status: 'Available',
                totalStaked: '25K SOL',
                icon: '☀️',
                color: '#14F195',
            },
        ],
        'Launchpool': [
            {
                id: 7,
                coin: 'NEW',
                name: 'NEW Token Launchpool',
                apy: '25.00%',
                minAmount: '10 USDT',
                maxAmount: '50,000 USDT',
                duration: '7 days',
                type: 'Launchpool',
                status: 'Active',
                totalStaked: '1M USDT',
                icon: '🚀',
                color: YELLOW,
            },
        ],
    };

    const handleProductPress = (product) => {
        setSelectedProduct(product);
        setShowProductModal(true);
    };

    const handleSubscribePress = (product) => {
        const isSubscribed = subscribedProducts.has(product.id);

        if (isSubscribed) {
            // Show unsubscribe confirmation modal
            setProductToUnsubscribe(product);
            setShowUnsubscribeModal(true);
        } else {
            // Show subscribe confirmation modal
            setProductToSubscribe(product);
            setShowSubscribeModal(true);
        }
    };

    const handleUnsubscribe = async (product) => {
        const newSubscriptions = new Set(subscribedProducts);
        newSubscriptions.delete(product.id);
        setSubscribedProducts(newSubscriptions);
        await saveSubscriptions(newSubscriptions);

        addNotification({
            title: `Unsubscribed from ${product.name}`,
            desc: `You have unsubscribed from ${product.name}`,
            time: 'Just now',
            icon: 'close-circle',
        });
    };

    const handleConfirmUnsubscribe = async () => {
        setShowUnsubscribeModal(false);

        // Perform unsubscribe
        await handleUnsubscribe(productToUnsubscribe);
        setProductToUnsubscribe(null);
    };

    const handleConfirmSubscribe = async () => {
        setShowSubscribeModal(false);
        setShowSuccessModal(true);

        // Add to subscribed products
        const newSubscriptions = new Set(subscribedProducts);
        newSubscriptions.add(productToSubscribe.id);
        setSubscribedProducts(newSubscriptions);
        await saveSubscriptions(newSubscriptions);

        // Add notification to the notification system
        const notification = {
            title: `Subscribed to ${productToSubscribe.name}`,
            desc: `You have successfully subscribed to ${productToSubscribe.name} with ${productToSubscribe.apy} APY`,
            time: 'Just now',
            icon: 'checkmark-circle',
        };

        // Add the notification to the notification system
        addNotification(notification);
    };

    const handleSuccessClose = () => {
        setShowSuccessModal(false);
        setProductToSubscribe(null);
    };

    const handleSubscribe = () => {
        // Handle subscription logic
        setShowProductModal(false);
        setSelectedProduct(null);
    };

    return (
        <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
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
                                transform: [{ scale: pulseAnim }],
                            }
                        ]}
                    >
                        <MaterialIcons name="trending-up" size={24} color={GREEN} />
                    </Animated.View>
                    <Text style={styles.descriptionText}>
                        Earn passive income on your crypto assets with flexible and locked staking options
                    </Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Tabs */}
                <View style={styles.tabsContainer}>
                    {tabs.map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            style={[styles.tab, activeTab === tab && styles.activeTab]}
                            onPress={() => setActiveTab(tab)}
                        >
                            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Products List */}
                <View style={styles.productsContainer}>
                    {earnProducts[activeTab].map((product) => {
                        const isSubscribed = subscribedProducts.has(product.id);
                        return (
                            <View
                                key={product.id}
                                style={styles.productCard}
                            >
                                <View style={styles.productHeader}>
                                    <View style={styles.productIconContainer}>
                                        {product.icon === 'bitcoin' ? (
                                            <FontAwesome5 name="bitcoin" size={20} color={product.color} />
                                        ) : product.icon === 'ethereum' ? (
                                            <FontAwesome5 name="ethereum" size={20} color={product.color} />
                                        ) : (
                                            <Text style={styles.productIcon}>{product.icon}</Text>
                                        )}
                                    </View>
                                    <View style={styles.productInfo}>
                                        <Text style={styles.productName}>{product.name}</Text>
                                        <Text style={styles.productCoin}>{product.coin}</Text>
                                    </View>
                                    <View style={styles.productApy}>
                                        <Text style={styles.apyLabel}>APY</Text>
                                        <Text style={[styles.apyValue, { color: product.color }]}>{product.apy}</Text>
                                    </View>
                                </View>

                                <View style={styles.productDetails}>
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>Min Amount:</Text>
                                        <Text style={styles.detailValue}>{product.minAmount}</Text>
                                    </View>
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>Duration:</Text>
                                        <Text style={styles.detailValue}>{product.duration}</Text>
                                    </View>
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>Type:</Text>
                                        <Text style={styles.detailValue}>{product.type}</Text>
                                    </View>
                                </View>

                                <View style={styles.productFooter}>
                                    <View style={styles.statusContainer}>
                                        <View style={[styles.statusDot, { backgroundColor: GREEN }]} />
                                        <Text style={styles.statusText}>{product.status}</Text>
                                    </View>
                                    <TouchableOpacity
                                        style={[
                                            styles.subscribeButton,
                                            isSubscribed && styles.unsubscribeButton
                                        ]}
                                        onPress={() => handleSubscribePress(product)}
                                        activeOpacity={0.8}
                                    >
                                        <Text style={[
                                            styles.subscribeButtonText,
                                            isSubscribed && styles.unsubscribeButtonText
                                        ]}>
                                            {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        );
                    })}
                </View>

                {/* My Positions Section */}
                <View style={styles.positionsSection}>
                    <Text style={styles.sectionTitle}>My Positions</Text>
                    <View style={styles.positionsCard}>
                        <View style={styles.positionHeader}>
                            <Text style={styles.positionTitle}>Total Earnings</Text>
                            <Text style={styles.positionValue}>$0.00</Text>
                        </View>
                        <View style={styles.positionStats}>
                            <View style={styles.statItem}>
                                <Text style={styles.statLabel}>Active Products</Text>
                                <Text style={styles.statValue}>{subscribedProducts.size}</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statLabel}>Total Staked</Text>
                                <Text style={styles.statValue}>$0.00</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Product Detail Modal */}
            {showProductModal && selectedProduct && (
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{selectedProduct.name}</Text>
                            <TouchableOpacity onPress={() => setShowProductModal(false)}>
                                <Ionicons name="close" size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.modalBody}>
                            <View style={styles.modalProductInfo}>
                                <View style={styles.modalIconContainer}>
                                    {selectedProduct.icon === 'bitcoin' ? (
                                        <FontAwesome5 name="bitcoin" size={24} color={selectedProduct.color} />
                                    ) : selectedProduct.icon === 'ethereum' ? (
                                        <FontAwesome5 name="ethereum" size={24} color={selectedProduct.color} />
                                    ) : (
                                        <Text style={styles.modalProductIcon}>{selectedProduct.icon}</Text>
                                    )}
                                </View>
                                <View>
                                    <Text style={styles.modalProductName}>{selectedProduct.name}</Text>
                                    <Text style={styles.modalProductCoin}>{selectedProduct.coin}</Text>
                                </View>
                            </View>

                            <View style={styles.modalDetails}>
                                <View style={styles.modalDetailRow}>
                                    <Text style={styles.modalDetailLabel}>APY</Text>
                                    <Text style={[styles.modalDetailValue, { color: selectedProduct.color }]}>
                                        {selectedProduct.apy}
                                    </Text>
                                </View>
                                <View style={styles.modalDetailRow}>
                                    <Text style={styles.modalDetailLabel}>Min Amount</Text>
                                    <Text style={styles.modalDetailValue}>{selectedProduct.minAmount}</Text>
                                </View>
                                <View style={styles.modalDetailRow}>
                                    <Text style={styles.modalDetailLabel}>Max Amount</Text>
                                    <Text style={styles.modalDetailValue}>{selectedProduct.maxAmount}</Text>
                                </View>
                                <View style={styles.modalDetailRow}>
                                    <Text style={styles.modalDetailLabel}>Duration</Text>
                                    <Text style={styles.modalDetailValue}>{selectedProduct.duration}</Text>
                                </View>
                                <View style={styles.modalDetailRow}>
                                    <Text style={styles.modalDetailLabel}>Total Staked</Text>
                                    <Text style={styles.modalDetailValue}>{selectedProduct.totalStaked}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.modalFooter}>
                            <TouchableOpacity style={styles.modalSubscribeButton} onPress={handleSubscribe}>
                                <Text style={styles.modalSubscribeButtonText}>Subscribe Now</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}

            {/* Subscribe Confirmation Modal */}
            {showSubscribeModal && productToSubscribe && (
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Confirm Subscription</Text>
                            <TouchableOpacity onPress={() => setShowSubscribeModal(false)}>
                                <Ionicons name="close" size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.modalBody}>
                            <View style={styles.modalProductInfo}>
                                <View style={styles.modalIconContainer}>
                                    {productToSubscribe.icon === 'bitcoin' ? (
                                        <FontAwesome5 name="bitcoin" size={24} color={productToSubscribe.color} />
                                    ) : productToSubscribe.icon === 'ethereum' ? (
                                        <FontAwesome5 name="ethereum" size={24} color={productToSubscribe.color} />
                                    ) : (
                                        <Text style={styles.modalProductIcon}>{productToSubscribe.icon}</Text>
                                    )}
                                </View>
                                <View>
                                    <Text style={styles.modalProductName}>{productToSubscribe.name}</Text>
                                    <Text style={styles.modalProductCoin}>{productToSubscribe.coin}</Text>
                                </View>
                            </View>

                            <View style={styles.modalDetails}>
                                <View style={styles.modalDetailRow}>
                                    <Text style={styles.modalDetailLabel}>APY</Text>
                                    <Text style={[styles.modalDetailValue, { color: productToSubscribe.color }]}>
                                        {productToSubscribe.apy}
                                    </Text>
                                </View>
                                <View style={styles.modalDetailRow}>
                                    <Text style={styles.modalDetailLabel}>Min Amount</Text>
                                    <Text style={styles.modalDetailValue}>{productToSubscribe.minAmount}</Text>
                                </View>
                                <View style={styles.modalDetailRow}>
                                    <Text style={styles.modalDetailLabel}>Duration</Text>
                                    <Text style={styles.modalDetailValue}>{productToSubscribe.duration}</Text>
                                </View>
                            </View>

                            <Text style={styles.confirmationText}>
                                Are you sure you want to subscribe to {productToSubscribe.name}? You can start earning {productToSubscribe.apy} APY immediately.
                            </Text>
                        </View>

                        <View style={styles.modalFooter}>
                            <View style={styles.modalButtonRow}>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.cancelButton]}
                                    onPress={() => setShowSubscribeModal(false)}
                                >
                                    <Text style={styles.cancelButtonText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.confirmButton]}
                                    onPress={handleConfirmSubscribe}
                                >
                                    <Text style={styles.confirmButtonText}>Confirm</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            )}

            {/* Success Modal */}
            {showSuccessModal && productToSubscribe && (
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.successIconContainer}>
                            <Ionicons name="checkmark-circle" size={60} color={GREEN} />
                        </View>
                        <Text style={styles.successTitle}>Subscription Successful!</Text>
                        <Text style={styles.successMessage}>
                            You have successfully subscribed to {productToSubscribe.name} and will start earning {productToSubscribe.apy} APY.
                        </Text>
                        <TouchableOpacity
                            style={styles.successButton}
                            onPress={handleSuccessClose}
                        >
                            <Text style={styles.successButtonText}>Continue</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {/* Unsubscribe Confirmation Modal */}
            {showUnsubscribeModal && productToUnsubscribe && (
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Confirm Unsubscription</Text>
                            <TouchableOpacity onPress={() => setShowUnsubscribeModal(false)}>
                                <Ionicons name="close" size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.modalBody}>
                            <View style={styles.modalProductInfo}>
                                <View style={styles.modalIconContainer}>
                                    {productToUnsubscribe.icon === 'bitcoin' ? (
                                        <FontAwesome5 name="bitcoin" size={24} color={productToUnsubscribe.color} />
                                    ) : productToUnsubscribe.icon === 'ethereum' ? (
                                        <FontAwesome5 name="ethereum" size={24} color={productToUnsubscribe.color} />
                                    ) : (
                                        <Text style={styles.modalProductIcon}>{productToUnsubscribe.icon}</Text>
                                    )}
                                </View>
                                <View>
                                    <Text style={styles.modalProductName}>{productToUnsubscribe.name}</Text>
                                    <Text style={styles.modalProductCoin}>{productToUnsubscribe.coin}</Text>
                                </View>
                            </View>

                            <View style={styles.modalDetails}>
                                <View style={styles.modalDetailRow}>
                                    <Text style={styles.modalDetailLabel}>APY</Text>
                                    <Text style={[styles.modalDetailValue, { color: productToUnsubscribe.color }]}>
                                        {productToUnsubscribe.apy}
                                    </Text>
                                </View>
                                <View style={styles.modalDetailRow}>
                                    <Text style={styles.modalDetailLabel}>Min Amount</Text>
                                    <Text style={styles.modalDetailValue}>{productToUnsubscribe.minAmount}</Text>
                                </View>
                                <View style={styles.modalDetailRow}>
                                    <Text style={styles.modalDetailLabel}>Duration</Text>
                                    <Text style={styles.modalDetailValue}>{productToUnsubscribe.duration}</Text>
                                </View>
                            </View>

                            <Text style={styles.confirmationText}>
                                Are you sure you want to unsubscribe from {productToUnsubscribe.name}? You will stop earning {productToUnsubscribe.apy} APY.
                            </Text>
                        </View>

                        <View style={styles.modalFooter}>
                            <View style={styles.modalButtonRow}>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.cancelButton]}
                                    onPress={() => setShowUnsubscribeModal(false)}
                                >
                                    <Text style={styles.cancelButtonText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.confirmButton]}
                                    onPress={handleConfirmUnsubscribe}
                                >
                                    <Text style={styles.confirmButtonText}>Confirm</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
}