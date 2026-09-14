import React, { useState } from 'react';
import { usePortfolio } from '../../contexts/PortfolioContext';
import { assetMeta, formatAssetAmount } from '../../services/assetMeta';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCoinContext } from '../context/CoinContext';

const SelectCoinScreen = () => {
  const router = useRouter();
  const { selectedCoin, updateSelectedCoin } = useCoinContext();
  const [searchQuery, setSearchQuery] = useState('');

  // The picker lists what the account actually holds, priced by the backend,
  // instead of a fixed set with balances baked in.
  const { holdings } = usePortfolio();

  const coins = holdings.map(h => {
    const meta = assetMeta(h.asset);
    return {
      symbol: h.asset,
      name: meta.name,
      balance: formatAssetAmount(h.amount),
      usdValue: `$${h.value.toFixed(2)}`,
      icon: meta.icon,
      color: meta.color,
    };
  });

  const filteredCoins = coins.filter(coin =>
    coin.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    coin.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCoinSelect = (coin) => {
    // Update the selected coin in context
    updateSelectedCoin(coin);
    // Navigate back to transfer screen
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Coin</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search Coins"
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Coin List Header */}
      <View style={styles.listHeader}>
        <Text style={styles.listHeaderText}>Coin List</Text>
        <TouchableOpacity style={styles.sortBtn}>
          <MaterialCommunityIcons name="sort-alphabetical-descending" size={20} color="#888" />
        </TouchableOpacity>
      </View>

      {/* Coin List */}
      <ScrollView style={styles.coinList} showsVerticalScrollIndicator={false}>
        {filteredCoins.map((coin, index) => (
          <TouchableOpacity
            key={coin.symbol}
            style={styles.coinItem}
            onPress={() => handleCoinSelect(coin)}
          >
            <MaterialCommunityIcons
              name={coin.icon}
              size={28}
              color={coin.color}
              style={styles.coinIcon}
            />
            <View style={styles.coinInfo}>
              <Text style={styles.coinSymbol}>{coin.symbol}</Text>
              <Text style={styles.coinName}>{coin.name}</Text>
            </View>
            <View style={styles.coinBalance}>
              <Text style={styles.balanceAmount}>{coin.balance}</Text>
              <Text style={styles.balanceUSD}>{coin.usdValue}</Text>
            </View>
          </TouchableOpacity>
        ))}
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
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginBottom: 12,
  },
  listHeaderText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sortBtn: {
    padding: 4,
  },
  coinList: {
    flex: 1,
    paddingHorizontal: 18,
  },
  coinItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#23262F',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  coinIcon: {
    marginRight: 12,
  },
  coinInfo: {
    flex: 1,
  },
  coinSymbol: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 2,
  },
  coinName: {
    color: '#888',
    fontSize: 13,
  },
  coinBalance: {
    alignItems: 'flex-end',
  },
  balanceAmount: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 2,
  },
  balanceUSD: {
    color: '#888',
    fontSize: 12,
  },
});

export default SelectCoinScreen; 