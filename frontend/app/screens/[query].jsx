import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useMarketData } from '../../contexts/MarketDataContext';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from '../styles/[query].styles';

const GREEN = '#00C896';
const RED = '#FF4D4F';
const BORDER = 'rgba(255,255,255,0.06)';


export default function SearchResults() {
    const { coins: liveCoins, topGainers, topLosers, topByMarketCap } = useMarketData();

    const toRow = (coin) => ({
        name: `${coin.symbol}/USDT`,
        price: `$${coin.priceLabel}`,
        change: `${coin.change24h >= 0 ? '+' : ''}${Number(coin.change24h).toFixed(2)}%`,
    });

    const marketData = {
        Favorites: topByMarketCap.slice(0, 5).map(toRow),
        Hot: [...liveCoins].sort((a, b) => b.volume24hRaw - a.volume24hRaw).slice(0, 5).map(toRow),
        Gainers: topGainers.slice(0, 5).map(toRow),
        Losers: topLosers.slice(0, 5).map(toRow),
    };

    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { query } = useLocalSearchParams();
    const searchText = (typeof query === 'string' ? query : '').trim();
    const allCoins = [
        ...marketData.Favorites,
        ...marketData.Hot,
        ...marketData.Gainers,
        ...marketData.Losers,
    ];
    const filtered = searchText
        ? allCoins.filter((coin) => coin.name.toLowerCase().includes(searchText.toLowerCase()))
        : [];

    return (
        <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top }]}>
            {/* Header with back button */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <View style={styles.backButtonBubble}>
                        <Ionicons name="arrow-back" size={26} color="#aaa" />
                    </View>
                </TouchableOpacity>
            </View>
            {/* Description box */}
            <View style={styles.descriptionBox}>
                <Text style={styles.descriptionText}>Showing results for "{searchText}"</Text>
            </View>
            <ScrollView contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
                <View style={styles.resultsSection}>
                    <View style={styles.marketHeader}>
                        <Text style={styles.marketHeaderName}>Name</Text>
                        <Text style={styles.marketHeaderPrice}>Price</Text>
                        <Text style={styles.marketHeaderChange}>24h Chg%</Text>
                    </View>
                    {filtered.length === 0 ? (
                        <View style={{ padding: 32, alignItems: 'center' }}>
                            <Text style={{ color: '#aaa', fontSize: 16 }}>No coins found.</Text>
                        </View>
                    ) : (
                        filtered.map((item, idx) => (
                            <View key={item.name} style={[styles.marketRow, { borderBottomWidth: idx < filtered.length - 1 ? 1 : 0, borderBottomColor: BORDER }]}>
                                <Text style={styles.marketName}>{item.name}</Text>
                                <Text style={styles.marketPrice}>{item.price}</Text>
                                <View style={styles.marketChangeWrapper}>
                                    <View style={[styles.marketChange, { backgroundColor: item.change.startsWith('-') ? RED : GREEN }]}>
                                        <Text style={styles.marketChangeText}>{item.change}</Text>
                                    </View>
                                </View>
                            </View>
                        ))
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

