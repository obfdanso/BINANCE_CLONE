import React, { useState } from 'react';
import { usePortfolio } from '../../contexts/PortfolioContext';
import { useMarketData } from '../../contexts/MarketDataContext';
import { assetMeta, formatAssetAmount } from '../../services/assetMeta';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const OverviewCryptoSearchScreen = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const { holdings } = usePortfolio();
  const { getCoin } = useMarketData();

  // Real holdings; the day's move comes from the live feed rather than a
  // fixed pnl string.
  const cryptoAssets = holdings.map(h => {
    const meta = assetMeta(h.asset);
    const coin = getCoin(h.asset);
    const changePct = coin ? Number(coin.change24h) : 0;
    const pnlValue = (h.value * changePct) / 100;
    return {
      symbol: h.asset,
      name: meta.name,
      icon: meta.icon,
      color: meta.color,
      amount: formatAssetAmount(h.amount),
      btcValue: `$${h.value.toFixed(2)}`,
      pnl: `${pnlValue >= 0 ? '+' : '-'}$${Math.abs(pnlValue).toFixed(2)} (${changePct >= 0 ? '+' : ''}${changePct.toFixed(2)}%)`,
      avgPrice: `$${formatAssetAmount(h.price)}`,
    };
  });

  const filteredAssets = cryptoAssets.filter(asset =>
    asset.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAssetPress = (asset) => {
    // Handle asset selection - could navigate to detail screen
    console.log(`Selected ${asset.symbol}`);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search Assets</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search cryptocurrencies..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus={true}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#888" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Results */}
      <ScrollView style={styles.resultsList} showsVerticalScrollIndicator={false}>
        {filteredAssets.length > 0 ? (
          filteredAssets.map((asset, index) => (
            <TouchableOpacity
              key={asset.symbol}
              style={styles.assetCard}
              onPress={() => handleAssetPress(asset)}
            >
              <View style={styles.assetHeader}>
                <MaterialCommunityIcons
                  name={asset.icon}
                  size={24}
                  color={asset.color}
                  style={styles.assetIcon}
                />
                <View style={styles.assetInfo}>
                  <Text style={styles.assetSymbol}>{asset.symbol}</Text>
                  <Text style={styles.assetName}>{asset.name}</Text>
                </View>
                <Text style={styles.assetAmount}>{asset.amount}</Text>
              </View>
              <View style={styles.assetDetails}>
                <Text style={styles.assetBTC}>{asset.btcValue}</Text>
                <Text style={styles.assetPNL}>{asset.pnl}</Text>
              </View>
              <Text style={styles.assetAvgPrice}>Avg: {asset.avgPrice}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.noResults}>
            <MaterialCommunityIcons name="magnify" size={48} color="#888" />
            <Text style={styles.noResultsText}>No assets found</Text>
            <Text style={styles.noResultsSubtext}>Try searching for a different cryptocurrency</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0F1E',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 48,
    paddingBottom: 18,
    paddingHorizontal: 18,
    backgroundColor: '#0A0F1E',
  },
  backBtn: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
  },
  searchContainer: {
    paddingHorizontal: 18,
    marginBottom: 16,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#23262F',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  resultsList: {
    flex: 1,
    paddingHorizontal: 18,
  },
  assetCard: {
    backgroundColor: '#23262F',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  assetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  assetIcon: {
    marginRight: 12,
  },
  assetInfo: {
    flex: 1,
  },
  assetSymbol: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  assetName: {
    color: '#888',
    fontSize: 13,
  },
  assetAmount: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  assetDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  assetBTC: {
    color: '#888',
    fontSize: 13,
  },
  assetPNL: {
    color: '#FF4D4F',
    fontSize: 13,
    fontWeight: 'bold',
  },
  assetAvgPrice: {
    color: '#888',
    fontSize: 12,
  },
  noResults: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  noResultsText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  noResultsSubtext: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default OverviewCryptoSearchScreen; 