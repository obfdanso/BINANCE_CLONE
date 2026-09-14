import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const OverviewCryptoEarnScreen = () => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('lowRisk');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const products = [
    {
      symbol: 'ETH',
      name: 'Ethereum',
      icon: 'ethereum',
      color: '#627EEA',
      apr: '1.3%',
      risk: 'lowRisk'
    },
    {
      symbol: 'SOL',
      name: 'Solana',
      icon: 'currency-brl',
      color: '#9945FF',
      apr: '1.8%~5.1%',
      risk: 'lowRisk'
    },
    {
      symbol: 'USDT',
      name: 'TetherUS',
      icon: 'currency-usdt',
      color: '#26A17B',
      apr: '11.74%',
      risk: 'lowRisk'
    },
    {
      symbol: 'BNB',
      name: 'Binance Coin',
      icon: 'currency-brl',
      color: '#F3BA2F',
      apr: '0.16%~0.32%',
      risk: 'lowRisk'
    },
    {
      symbol: 'XRP',
      name: 'Ripple',
      icon: 'currency-cny',
      color: '#23292F',
      apr: '0.44%',
      risk: 'lowRisk'
    },
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      icon: 'bitcoin',
      color: '#F7931A',
      apr: '2.5%~4.2%',
      risk: 'highYield'
    },
    {
      symbol: 'ADA',
      name: 'Cardano',
      icon: 'currency-cny',
      color: '#0033AD',
      apr: '3.8%~6.1%',
      risk: 'highYield'
    }
  ];

  const filteredProducts = products.filter(product =>
    product.risk === selectedTab &&
    (searchQuery === '' ||
      product.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSubscribe = (product) => {
    // Handle subscription logic here
    console.log(`Subscribing to ${product.symbol}`);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Earn</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIcon} onPress={() => setShowSearch(!showSearch)}>
            <Ionicons name="search" size={22} color={showSearch ? "#00C896" : "#888"} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="help-circle-outline" size={22} color="#888" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Input */}
      {showSearch && (
        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search products..."
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
      )}

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'lowRisk' && styles.tabActive]}
          onPress={() => setSelectedTab('lowRisk')}
        >
          <Text style={[styles.tabText, selectedTab === 'lowRisk' && styles.tabTextActive]}>
            Low Risk
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'highYield' && styles.tabActive]}
          onPress={() => setSelectedTab('highYield')}
        >
          <Text style={[styles.tabText, selectedTab === 'highYield' && styles.tabTextActive]}>
            High Yield
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterIcon}>
          <MaterialCommunityIcons name="filter-variant" size={20} color="#888" />
        </TouchableOpacity>
      </View>

      {/* Product List Header */}
      <View style={styles.listHeader}>
        <Text style={styles.headerLabel}>Product</Text>
        <Text style={[styles.headerLabel, styles.headerLabelCenter]}>Est. APR</Text>
      </View>

      {/* Product List */}
      <ScrollView style={styles.productList} showsVerticalScrollIndicator={true}>
        {filteredProducts.map((product, index) => (
          <View key={product.symbol} style={styles.productRow}>
            <View style={styles.productInfo}>
              <MaterialCommunityIcons
                name={product.icon}
                size={24}
                color={product.color}
                style={styles.productIcon}
              />
              <Text style={styles.productSymbol}>{product.symbol}</Text>
            </View>
            <View style={styles.productRight}>
              <Text style={styles.productAPR}>{product.apr}</Text>
              <TouchableOpacity
                style={styles.subscribeBtn}
                onPress={() => handleSubscribe(product)}
              >
                <Text style={styles.subscribeBtnText}>Subscribe</Text>
              </TouchableOpacity>
            </View>
          </View>
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    padding: 8,
    marginLeft: 8,
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
  tabs: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginBottom: 16,
  },
  tab: {
    marginRight: 24,
    paddingBottom: 8,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#00C896',
  },
  tabText: {
    color: '#888',
    fontSize: 16,
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  filterIcon: {
    marginLeft: 'auto',
    padding: 4,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#23262F',
  },
  headerLabel: {
    color: '#888',
    fontSize: 14,
    fontWeight: '500',
  },
  headerLabelCenter: {
    textAlign: 'right',
    flex: 1,
  },
  productList: {
    flex: 1,
    paddingHorizontal: 18,
  },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#23262F',
  },
  productInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  productIcon: {
    marginRight: 12,
  },
  productSymbol: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  productRight: {
    alignItems: 'flex-end',
    flex: 1,
  },
  productAPR: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'right',
  },
  subscribeBtn: {
    backgroundColor: '#00C896',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  subscribeBtnText: {
    color: '#181A20',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default OverviewCryptoEarnScreen; 