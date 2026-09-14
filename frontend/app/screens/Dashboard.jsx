import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialIcons, Feather, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useNotifications } from '../../contexts/NotificationsContext';
import { useWallet } from '../../contexts/WalletContext';
import { usePortfolio } from '../../contexts/PortfolioContext';
import { useMarketData } from '../../contexts/MarketDataContext';

import responsiveUtils from '../utils/responsive';

const { scale, iconSize, isTablet, getModalSize } = responsiveUtils;
import styles from '../styles/Dashboard.styles';

const GREEN = '#00C896';
const RED = '#FF4D4F';
const PILL_BG = '#232834';
const INACTIVE_TAB = '#aaa';

export default function Dashboard() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { notifications } = useNotifications();
    const { walletCreated, walletName } = useWallet();
    const {
        setCurrency: setPortfolioCurrency,
        totalValue,
        holdings,
        loading: portfolioLoading,
        getBalance,
    } = usePortfolio();
    const { coins: liveCoins, topGainers, topLosers, topByMarketCap } = useMarketData();

    // The old onboarding gate read a local "hasFirstDeposit" flag, which says
    // nothing about the signed-in account. Real holdings decide this now.
    const hasFunds = holdings.length > 0 || totalValue > 0;
    const [activeTab, setActiveTab] = useState('Exchange');
    const [marketTab, setMarketTab] = useState('Favorites');
    const [marketSubTab, setMarketSubTab] = useState('All');
    const [searchModalVisible, setSearchModalVisible] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [showBalanceDropdown, setShowBalanceDropdown] = useState(false);
    const [selectedCurrency, setSelectedCurrency] = useState('GHS');



    // Calculate unread notifications count
    const unreadCount = notifications.filter(notification => !notification.read).length;

    /**
     * The backend values the whole portfolio for us against current market
     * prices, so the fixed conversion table that used to live here (1 GHS =
     * 0.0000012 BTC and friends) is gone - those rates were invented and went
     * stale the moment they were written.
     */
    const formatTotal = (value, code) => {
        const n = Number(value) || 0;
        switch (code) {
            case 'BTC': return `${n.toFixed(8)} BTC`;
            case 'ETH': return `${n.toFixed(6)} ETH`;
            case 'USDT': return `${n.toFixed(2)} USDT`;
            case 'GHS': return `₵${n.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
            default: return `$${n.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
        }
    };

    const getBalanceDisplay = () => {
        if (portfolioLoading && !totalValue) return 'Loading...';
        return formatTotal(totalValue, selectedCurrency);
    };

    /**
     * Market rows come from the shared live feed. The screen renders
     * { name, price, change } strings, so the API shape is mapped once here.
     */
    const toRow = (coin) => ({
        name: `${coin.symbol}/USDT`,
        symbol: coin.symbol,
        price: `$${coin.priceLabel}`,
        change: `${coin.change24h >= 0 ? '+' : ''}${Number(coin.change24h).toFixed(2)}%`,
        image: coin.image,
    });

    const marketData = {
        // "Favorites" previously listed three fixed pairs; the largest coins by
        // market cap are a sensible stand-in until per-user favourites are stored.
        Favorites: topByMarketCap.slice(0, 5).map(toRow),
        Hot: [...liveCoins]
            .sort((a, b) => b.volume24hRaw - a.volume24hRaw)
            .slice(0, 5)
            .map(toRow),
        Gainers: topGainers.slice(0, 5).map(toRow),
        Losers: topLosers.slice(0, 5).map(toRow),
    };

    // Search runs over the full live list rather than a fixed table of 20.
    const allCoins = liveCoins.map(toRow);

    const filteredCoins = searchText.trim() === '' ? [] : allCoins.filter(coin =>
        coin.name.toLowerCase().includes(searchText.toLowerCase())
    );

    const mainTabs = ['Favorites', 'Hot', 'Gainers', 'Losers'];

    const handleSearch = () => {
        // Handle search functionality
        console.log('Searching for:', searchText);
    };

    const openSearchModal = () => setSearchModalVisible(true);
    const closeSearchModal = () => {
        setSearchModalVisible(false);
        setSearchText('');
    };



    // Handle tab switching
    const handleTabSwitch = (tab) => {
        setActiveTab(tab);
    };

    const stickyHeaderStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backgroundColor: '#0A0F1E',
        paddingTop: insets.top + 10,
    };

    return (
        <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top + 10 }]}>
            {/* Sticky Header */}
            <View style={stickyHeaderStyle}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 24, paddingBottom: 8 }}>
                    {/* Profile icon on the left with bubble */}
                    <TouchableOpacity
                        onPress={() => router.push('/screens/Profile')}
                        style={{
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
                        }}
                    >
                        <Ionicons name="person" size={20} color="#aaa" />
                    </TouchableOpacity>
                    {/* Centered Exchange/Wallet pill toggle */}
                    <View style={{ flexDirection: 'row', backgroundColor: '#1A1F2E', borderRadius: 16, padding: 2 }}>
                        <TouchableOpacity
                            style={{ backgroundColor: activeTab === 'Exchange' ? '#232834' : 'transparent', borderRadius: 14, paddingHorizontal: 18, paddingVertical: 6, marginRight: 2 }}
                            onPress={() => handleTabSwitch('Exchange')}
                        >
                            <Text style={{ color: activeTab === 'Exchange' ? '#fff' : INACTIVE_TAB, fontWeight: 'bold', fontSize: 15 }}>Exchange</Text>
                            {activeTab === 'Exchange' && (
                                <View style={{ alignSelf: 'center', width: 16, height: 2, backgroundColor: GREEN, marginTop: 2, borderRadius: 1 }} />
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ backgroundColor: activeTab === 'Wallet' ? '#232834' : 'transparent', borderRadius: 14, paddingHorizontal: 18, paddingVertical: 6 }}
                            onPress={() => handleTabSwitch('Wallet')}
                        >
                            <Text style={{ color: activeTab === 'Wallet' ? '#fff' : INACTIVE_TAB, fontWeight: 'bold', fontSize: 15 }}>Wallet</Text>
                            {activeTab === 'Wallet' && (
                                <View style={{ alignSelf: 'center', width: 16, height: 2, backgroundColor: GREEN, marginTop: 2, borderRadius: 1 }} />
                            )}
                        </TouchableOpacity>
                    </View>
                    {/* Notification bell with unread count and bubble */}
                    <TouchableOpacity
                        onPress={() => router.push('/screens/Notifications')}
                        style={{
                            position: 'relative',
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
                        }}
                    >
                        <Ionicons name="notifications-outline" size={20} style={{ color: '#fff' }} />
                        {unreadCount > 0 && (
                            <View style={{
                                position: 'absolute',
                                top: -2,
                                right: -2,
                                backgroundColor: '#FF6B6B',
                                borderRadius: 10,
                                minWidth: 18,
                                height: 18,
                                borderWidth: 2,
                                borderColor: '#0A0F1E',
                                alignItems: 'center',
                                justifyContent: 'center',
                                paddingHorizontal: 4
                            }}>
                                <Text style={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}>
                                    {unreadCount > 99 ? '99+' : unreadCount}
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView
                contentContainerStyle={{ paddingBottom: 32, minHeight: '100%', paddingTop: 72 }}
                showsVerticalScrollIndicator={false}
                scrollEnabled={!searchModalVisible}
            >

                {activeTab === 'Exchange' ? (
                    <>
                        {/* Search Bar */}
                        <TouchableOpacity activeOpacity={1} onPress={openSearchModal} style={{ marginBottom: 16, marginTop: 8 }}>
                            <View style={{ backgroundColor: '#1A1F2E', borderRadius: 16, marginHorizontal: 16, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, height: 48, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' }}>
                                <Text style={{ color: '#aaa', fontWeight: 'bold', fontSize: 16, flex: 1 }}>Search coins</Text>
                                <Feather name="search" size={22} style={{ color: '#aaa' }} />
                            </View>
                        </TouchableOpacity>

                        {/* Search Modal Overlay */}
                        {searchModalVisible && (
                            <View style={styles.modalOverlay}>
                                <View style={styles.modalContentFullWidth}>
                                    {/* Close button */}
                                    <TouchableOpacity onPress={closeSearchModal} style={styles.closeButton}>
                                        <Ionicons name="close" size={28} color="#aaa" />
                                    </TouchableOpacity>
                                    {/* Search input */}
                                    <View style={styles.searchInputWrapper}>
                                        <TextInput
                                            style={{ color: '#fff', fontWeight: 'bold', fontSize: 16, flex: 1, backgroundColor: 'transparent' }}
                                            placeholder="Search"
                                            placeholderTextColor="#aaa"
                                            value={searchText}
                                            onChangeText={setSearchText}
                                            autoFocus
                                        />
                                        <Feather name="search" size={22} style={{ color: '#aaa' }} />
                                    </View>
                                    {/* Results */}
                                    <View style={styles.resultsSection}>
                                        <View style={styles.marketHeader}>
                                            <Text style={styles.marketHeaderName}>Name</Text>
                                            <Text style={styles.marketHeaderPrice}>Price</Text>
                                            <Text style={styles.marketHeaderChange}>24h Chg%</Text>
                                        </View>
                                        {searchText.trim() === '' ? (
                                            <View style={{ padding: 32, alignItems: 'center' }}>
                                                <Text style={{ color: '#aaa', fontSize: 16 }}>Type to search coins...</Text>
                                            </View>
                                        ) : filteredCoins.length === 0 ? (
                                            <View style={{ padding: 32, alignItems: 'center' }}>
                                                <Text style={{ color: '#aaa', fontSize: 16 }}>No coins found.</Text>
                                            </View>
                                        ) : (
                                            <ScrollView style={{ maxHeight: '70%' }}>
                                                {filteredCoins.map((item, idx) => (
                                                    <TouchableOpacity
                                                        key={item.name + '-' + idx}
                                                        style={[styles.marketRow, { borderBottomWidth: idx < filteredCoins.length - 1 ? 1 : 0, borderBottomColor: 'rgba(255,255,255,0.06)' }]}
                                                        onPress={() => {
                                                            router.push({
                                                                pathname: '/screens/TradingView',
                                                                params: {
                                                                    symbol: item.name,
                                                                    price: item.price,
                                                                    change: item.change
                                                                }
                                                            });
                                                            closeSearchModal();
                                                        }}
                                                        activeOpacity={0.7}
                                                    >
                                                        <Text style={styles.marketName}>{item.name}</Text>
                                                        <Text style={styles.marketPrice}>{item.price}</Text>
                                                        <View style={styles.marketChangeWrapper}>
                                                            <View style={[styles.marketChange, { backgroundColor: item.change.startsWith('-') ? RED : GREEN }]}>
                                                                <Text style={styles.marketChangeText}>{item.change}</Text>
                                                            </View>
                                                        </View>
                                                    </TouchableOpacity>
                                                ))}
                                            </ScrollView>
                                        )}
                                    </View>
                                </View>
                            </View>
                        )}

                        {/* Onboarding Task or Balance Display */}
                        <View style={{ backgroundColor: '#1A1F2E', borderRadius: 16, marginHorizontal: 16, marginBottom: 16, flexDirection: 'row', alignItems: 'center', padding: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' }}>
                            <View style={{ flex: 1 }}>
                                {hasFunds ? (
                                    <>
                                        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Total Balance</Text>
                                        <TouchableOpacity
                                            style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}
                                            onPress={() => setShowBalanceDropdown(!showBalanceDropdown)}
                                            activeOpacity={0.7}
                                        >
                                            <Text style={{ color: GREEN, fontSize: 20, fontWeight: 'bold', marginRight: 8 }}>
                                                {getBalanceDisplay()}
                                            </Text>
                                            <Ionicons
                                                name={showBalanceDropdown ? "chevron-up" : "chevron-down"}
                                                size={16}
                                                color={GREEN}
                                            />
                                        </TouchableOpacity>

                                        {/* Currency Dropdown */}
                                        {showBalanceDropdown && (
                                            <View style={{
                                                backgroundColor: '#232834',
                                                borderRadius: 12,
                                                marginTop: 8,
                                                padding: 8,
                                                borderWidth: 1,
                                                borderColor: 'rgba(255,255,255,0.08)',
                                                shadowColor: '#000',
                                                shadowOffset: { width: 0, height: 2 },
                                                shadowOpacity: 0.16,
                                                shadowRadius: 8,
                                                elevation: 4,
                                            }}>
                                                {['GHS', 'BTC', 'ETH', 'USDT'].map((currency) => (
                                                    <TouchableOpacity
                                                        key={currency}
                                                        style={{
                                                            flexDirection: 'row',
                                                            alignItems: 'center',
                                                            justifyContent: 'space-between',
                                                            paddingVertical: 8,
                                                            paddingHorizontal: 12,
                                                            borderRadius: 8,
                                                            backgroundColor: selectedCurrency === currency ? 'rgba(0,200,150,0.1)' : 'transparent',
                                                        }}
                                                        onPress={() => {
                                                            setSelectedCurrency(currency);
                                                            setPortfolioCurrency(currency);
                                                            setShowBalanceDropdown(false);
                                                        }}
                                                        activeOpacity={0.7}
                                                    >
                                                        <Text style={{
                                                            color: selectedCurrency === currency ? GREEN : '#fff',
                                                            fontWeight: selectedCurrency === currency ? 'bold' : 'normal',
                                                            fontSize: 14
                                                        }}>
                                                            {currency}
                                                        </Text>
                                                        <Text style={{
                                                            color: selectedCurrency === currency ? GREEN : '#aaa',
                                                            fontSize: 12
                                                        }}>
                                                            {formatTotal(getBalance(currency), currency)}
                                                        </Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </View>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Onboarding Task</Text>
                                        <Text style={{ color: '#aaa', fontSize: 13, marginTop: 2 }}>Buy or Deposit Your First Crypto</Text>
                                    </>
                                )}
                            </View>
                            <TouchableOpacity
                                style={{ backgroundColor: GREEN, borderRadius: 10, paddingHorizontal: 22, paddingVertical: 10, marginLeft: 12 }}
                                onPress={() => router.push('/screens/AddFunds')}
                            >
                                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 15 }}>Add Funds</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Announcements */}
                        <View style={{ backgroundColor: '#1A1F2E', borderRadius: 16, marginHorizontal: 16, marginBottom: 18, padding: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                                <MaterialCommunityIcons name="bullhorn-outline" size={22} color={GREEN} style={{ marginRight: 8 }} />
                                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16, flex: 1 }}>Announcements</Text>
                            </View>
                            {/* Announcement Item 1 */}
                            <TouchableOpacity onPress={() => router.push('/screens/HotLaunches')} style={{ backgroundColor: PILL_BG, borderRadius: 12, flexDirection: 'row', alignItems: 'center', padding: 12, marginBottom: 10 }} activeOpacity={0.85}>
                                <View style={{ backgroundColor: '#1A1F2E', borderRadius: 16, padding: 8, marginRight: 12 }}>
                                    <FontAwesome5 name="rocket" size={18} color={GREEN} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 15 }}>Hot Launches</Text>
                                    <Text style={{ color: '#aaa', fontSize: 13 }}>New tokens launching this week</Text>
                                    <Text style={{ color: '#555', fontSize: 11, marginTop: 2 }}>2 hours ago</Text>
                                </View>
                            </TouchableOpacity>
                            {/* Announcement Item 2 */}
                            <TouchableOpacity onPress={() => router.push('/screens/SystemMaintenance')} style={{ backgroundColor: PILL_BG, borderRadius: 12, flexDirection: 'row', alignItems: 'center', padding: 12 }} activeOpacity={0.85}>
                                <View style={{ backgroundColor: '#1A1F2E', borderRadius: 16, padding: 8, marginRight: 12 }}>
                                    <FontAwesome5 name="tools" size={18} color={GREEN} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 15 }}>System Maintenance</Text>
                                    <Text style={{ color: '#aaa', fontSize: 13 }}>Scheduled maintenance on 31st July, 2025</Text>
                                    <Text style={{ color: '#555', fontSize: 11, marginTop: 2 }}>1 hour ago</Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                        {/* Quick Actions */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 16, marginBottom: 18 }}>
                            {[
                                { icon: 'users', label: 'P2P', iconType: 'Feather', onPress: () => router.push('/screens/P2P') },
                                { icon: 'trending-up', label: 'Earn', iconType: 'MaterialIcons', onPress: () => router.push('/screens/Earn') },
                                { icon: 'download', label: 'Deposit', iconType: 'Feather', onPress: () => router.push('/screens/Deposit') },
                                { icon: 'repeat', label: 'Convert', iconType: 'Feather', onPress: () => router.push('/screens/Convert') },
                            ].map((item, idx) => (
                                <TouchableOpacity key={idx} style={{ alignItems: 'center', flex: 1 }} onPress={item.onPress} activeOpacity={0.7}>
                                    <View style={{ backgroundColor: '#1A1F2E', borderRadius: 32, padding: 16, marginBottom: 6, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' }}>
                                        {item.iconType === 'MaterialIcons' ? (
                                            <MaterialIcons name={item.icon} size={iconSize.lg} style={{ color: GREEN }} />
                                        ) : (
                                            <Feather name={item.icon} size={iconSize.lg} style={{ color: GREEN }} />
                                        )}
                                    </View>
                                    <Text style={[styles.quickActionLabel, item.label === 'P2P' && { color: '#fff' }]}>{item.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Market List Section */}
                        <View style={styles.marketSection}>
                            {/* Tabs */}
                            <View style={styles.marketTabs}>
                                {mainTabs.map((tab) => (
                                    <TouchableOpacity key={tab} style={styles.marketTab} onPress={() => setMarketTab(tab)}>
                                        <View style={[styles.marketTabBubble, { backgroundColor: marketTab === tab ? PILL_BG : 'rgba(35,40,52,0.3)' }]}>
                                            <Text style={[styles.marketTabText, marketTab === tab ? styles.marketTabTextActive : styles.marketTabTextInactive]}>{tab}</Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                            {/* Sub-tabs */}
                            <View style={styles.subTabs}>
                                {(marketTab === 'Hot' ? ['Cryptos', 'Futures'] : ['All', 'Spot']).map((tab, idx) => (
                                    <TouchableOpacity key={tab} style={styles.subTab} onPress={() => setMarketSubTab(tab)}>
                                        <View style={[styles.subTabBubble, { backgroundColor: marketSubTab === tab ? PILL_BG : 'rgba(35,40,52,0.3)' }]}>
                                            <Text style={[styles.subTabText, marketSubTab === tab ? styles.subTabTextActive : styles.subTabTextInactive]}>{tab}</Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                            {/* Market List Header */}
                            <View style={styles.marketHeader}>
                                <Text style={styles.marketHeaderName}>Name</Text>
                                <Text style={styles.marketHeaderPrice}>Price</Text>
                                <Text style={styles.marketHeaderChange}>24h Chg%</Text>
                            </View>
                            {/* Market List Items */}
                            {marketData[marketTab].map((item, idx) => (
                                <TouchableOpacity
                                    key={item.name}
                                    style={[styles.marketRow, { borderBottomWidth: idx < marketData[marketTab].length - 1 ? 1 : 0, borderBottomColor: 'rgba(255,255,255,0.06)' }]}
                                    onPress={() => router.push({
                                        pathname: '/screens/TradingView',
                                        params: {
                                            symbol: item.name,
                                            price: item.price,
                                            change: item.change
                                        }
                                    })}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.marketName}>{item.name}</Text>
                                    <Text style={styles.marketPrice}>{item.price}</Text>
                                    <View style={styles.marketChangeWrapper}>
                                        <View style={[styles.marketChange, { backgroundColor: item.change.startsWith('-') ? RED : GREEN }]}>
                                            <Text style={styles.marketChangeText}>{item.change}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </>
                ) : (
                    /* Wallet Tab Content */
                    <>
                        {walletCreated ? (
                            /* Existing Wallet Content */
                            <>
                                {/* Wallet Welcome Section */}
                                <View style={styles.walletWelcomeSection}>
                                    <View style={styles.walletIconContainer}>
                                        <Ionicons name="wallet-outline" size={iconSize['3xl']} color={GREEN} />
                                    </View>
                                    <Text style={styles.walletWelcomeTitle}>Welcome back to {walletName}</Text>
                                    <Text style={styles.walletWelcomeSubtitle}>
                                        Your secure Bitby wallet is ready to use. Manage your cryptocurrencies and digital assets with ease.
                                    </Text>
                                </View>

                                {/* Wallet Actions */}
                                <View style={styles.createWalletCard}>
                                    <View style={styles.createWalletHeader}>
                                        <Ionicons name="wallet-outline" size={iconSize.lg} color={GREEN} />
                                        <Text style={styles.createWalletTitle}>Wallet Dashboard</Text>
                                    </View>
                                    <Text style={styles.createWalletDescription}>
                                        Access your wallet dashboard to view balances, send transactions, and manage your assets.
                                    </Text>
                                    <TouchableOpacity
                                        style={styles.createWalletButton}
                                        activeOpacity={0.8}
                                        onPress={() => router.push('/screens/WalletDashboard')}
                                    >
                                        <Text style={styles.createWalletButtonText}>Open Wallet</Text>
                                        <Ionicons name="arrow-forward" size={iconSize.md} color="#fff" />
                                    </TouchableOpacity>
                                </View>

                                {/* Quick Actions */}
                                <View style={styles.walletFeaturesSection}>
                                    <Text style={styles.walletFeaturesTitle}>Quick Actions</Text>
                                    <View style={styles.walletFeaturesGrid}>
                                        {[
                                            { icon: 'download-outline', title: 'Deposit', description: 'Add funds to your wallet' },
                                            { icon: 'arrow-up-outline', title: 'Send', description: 'Send crypto to others' },
                                            { icon: 'swap-horizontal-outline', title: 'Trade', description: 'Exchange cryptocurrencies' },
                                            { icon: 'settings-outline', title: 'Settings', description: 'Manage wallet settings' },
                                        ].map((feature, idx) => (
                                            <View key={idx} style={styles.walletFeatureItem}>
                                                <View style={styles.walletFeatureIcon}>
                                                    <Ionicons name={feature.icon} size={iconSize.lg} color={GREEN} />
                                                </View>
                                                <Text style={styles.walletFeatureTitle}>{feature.title}</Text>
                                                <Text style={styles.walletFeatureDescription}>{feature.description}</Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            </>
                        ) : (
                            /* Create Wallet Content */
                            <>
                                {/* Wallet Welcome Section */}
                                <View style={styles.walletWelcomeSection}>
                                    <View style={styles.walletIconContainer}>
                                        <Ionicons name="wallet-outline" size={iconSize['3xl']} color={GREEN} />
                                    </View>
                                    <Text style={styles.walletWelcomeTitle}>Welcome to Bitby Wallet</Text>
                                    <Text style={styles.walletWelcomeSubtitle}>
                                        Your secure, decentralized wallet for managing cryptocurrencies and digital assets.
                                        Store, send, and receive crypto with enterprise-grade security.
                                    </Text>
                                </View>

                                {/* Create Wallet Card */}
                                <View style={styles.createWalletCard}>
                                    <View style={styles.createWalletHeader}>
                                        <Ionicons name="shield-checkmark-outline" size={iconSize.lg} color={GREEN} />
                                        <Text style={styles.createWalletTitle}>Get Started</Text>
                                    </View>
                                    <Text style={styles.createWalletDescription}>
                                        Create your first wallet to start managing your digital assets securely.
                                        Your private keys are encrypted and stored locally on your device.
                                    </Text>
                                    <TouchableOpacity
                                        style={styles.createWalletButton}
                                        activeOpacity={0.8}
                                        onPress={() => router.push('/screens/CreateWallet')}
                                    >
                                        <Text style={styles.createWalletButtonText}>Create Wallet</Text>
                                        <Ionicons name="arrow-forward" size={iconSize.md} color="#fff" />
                                    </TouchableOpacity>
                                </View>

                                {/* Wallet Features */}
                                <View style={styles.walletFeaturesSection}>
                                    <Text style={styles.walletFeaturesTitle}>Why Choose Bitby Wallet?</Text>
                                    <View style={styles.walletFeaturesGrid}>
                                        {[
                                            { icon: 'shield-outline', title: 'Secure', description: 'Military-grade encryption' },
                                            { icon: 'flash-outline', title: 'Fast', description: 'Instant transactions' },
                                            { icon: 'globe-outline', title: 'Global', description: 'Support for 100+ coins' },
                                            { icon: 'lock-closed-outline', title: 'Private', description: 'Your keys, your crypto' },
                                        ].map((feature, idx) => (
                                            <View key={idx} style={styles.walletFeatureItem}>
                                                <View style={styles.walletFeatureIcon}>
                                                    <Ionicons name={feature.icon} size={iconSize.lg} color={GREEN} />
                                                </View>
                                                <Text style={styles.walletFeatureTitle}>{feature.title}</Text>
                                                <Text style={styles.walletFeatureDescription}>{feature.description}</Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            </>
                        )}
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
} 