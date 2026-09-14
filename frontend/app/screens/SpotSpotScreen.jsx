import React, { useState } from 'react';
import { usePortfolio } from '../../contexts/PortfolioContext';
import { useMarketData } from '../../contexts/MarketDataContext';
import { assetMeta, formatAssetAmount } from '../../services/assetMeta';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Pressable, TouchableWithoutFeedback } from 'react-native';
import { MaterialCommunityIcons, EvilIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import responsiveUtils from '../utils/responsive';

const { scale, iconSize, isTablet, getModalSize } = responsiveUtils;

const GREEN = '#00C896';
const RED = '#FF4D4F';
const BG = '#0A0F1E';
const CARD_BG = '#1A1F2E';


const SpotSpotScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [showValues, setShowValues] = useState(true);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(portfolioCurrency);
  const [showSettingsOverlay, setShowSettingsOverlay] = useState(false);
  const [hideAssetsUnder1USD, setHideAssetsUnder1USD] = useState(false);
  const [hideCoinDetails, setHideCoinDetails] = useState(false);

  // Mock values for each currency
  /**
   * Real holdings and the backend's own valuation, replacing a fixed table of
   * four assets whose amounts and P&L were written by hand.
   */
  const {
    holdings,
    totalValue: portfolioTotal,
    lastPrices,
    currency: portfolioCurrency,
    setCurrency: setPortfolioCurrency,
  } = usePortfolio();
  const { getCoin } = useMarketData();

  const cryptoAssets = holdings.map(h => {
    const meta = assetMeta(h.asset);
    const coin = getCoin(h.asset);
    const changePct = coin ? Number(coin.change24h) : 0;
    const pnlValue = (h.value * changePct) / 100;
    return {
      id: h.asset,
      name: h.asset,
      icon: meta.icon,
      color: meta.color,
      amount: formatAssetAmount(h.amount),
      usdValue: h.value,
      pnl: `${pnlValue >= 0 ? '+' : '-'}$${Math.abs(pnlValue).toFixed(2)} (${changePct >= 0 ? '+' : ''}${changePct.toFixed(2)}%)`,
      avgPrice: `$${formatAssetAmount(h.price)}`,
    };
  });

  // The "hide assets under $1" toggle filters this list.
  const filteredAssets = hideAssetsUnder1USD
    ? cryptoAssets.filter(asset => asset.usdValue >= 1.00)
    : cryptoAssets;

  const totalValue = formatAssetAmount(portfolioTotal);
  const totalUSD = `$${formatAssetAmount(portfolioTotal * (Number(lastPrices[portfolioCurrency]) || 1))}`;

  // Utility function to mask a value with asterisks of the same length
  const maskValue = (value) => typeof value === 'string' ? value.replace(/./g, '*') : value;

  // Dropdown currencies
  const currencies = ['BTC', 'ETH', 'BNB', 'USDT', 'USD'];

  // Dropdown menu component
  const DropdownMenu = () => (
    <TouchableWithoutFeedback onPress={() => setDropdownVisible(false)}>
      <View style={{ position: 'absolute', top: 90, right: 30, zIndex: 10, backgroundColor: 'rgba(0,0,0,0.2)', width: '100%', height: '100%' }}>
        <View style={{ position: 'absolute', top: 0, right: 0, backgroundColor: CARD_BG, borderRadius: 12, paddingVertical: 8, width: 160, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 8, elevation: 8 }}>
          {currencies.map((cur) => (
            <TouchableOpacity
              key={cur}
              style={{ paddingVertical: 12, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', backgroundColor: selectedCurrency === cur ? CARD_BG : 'transparent' }}
              onPress={() => {
                setSelectedCurrency(cur);
                setPortfolioCurrency(cur);
                setDropdownVisible(false);
              }}
              disabled={selectedCurrency === cur}
            >
              <Text style={{ color: selectedCurrency === cur ? '#fff' : '#aaa', fontWeight: selectedCurrency === cur ? 'bold' : 'normal', flex: 1 }}>{cur}</Text>
              {selectedCurrency === cur && <MaterialCommunityIcons name="check" size={18} color="#fff" />}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => { }} style={[styles.headerTab, styles.headerTabActiveTouch]}>
            <Text style={[styles.headerTabText, styles.headerTabActiveText]}>Exchange</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { }} style={styles.headerTab}>
            <Text style={styles.headerTabText}>Wallet</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity onPress={() => router.replace('/screens/OverviewCryptoScreen')}>
          <Text style={styles.tabInactive}>Overview</Text>
        </TouchableOpacity>
        <Text style={styles.tabActive}>Spot</Text>
        <TouchableOpacity onPress={() => router.push('/screens/FundingScreen')}>
          <Text style={styles.tabInactive}>Funding</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Total Value */}
        <View style={styles.totalValueBox}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.totalValueLabel}>Est. Total Value</Text>
              <TouchableOpacity onPress={() => setShowValues(v => !v)} style={{ marginLeft: 6 }}>
                <MaterialCommunityIcons name={showValues ? 'eye-outline' : 'eye-off-outline'} size={16} color="#888" />
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity style={[styles.headerIconBtn, { backgroundColor: 'transparent', marginLeft: 0, marginRight: 6 }]}>
                <MaterialCommunityIcons name="chart-line" size={iconSize.lg} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.headerIconBtn, { backgroundColor: 'transparent', marginLeft: 0 }]}
                onPress={() => router.push('/screens/BitbyLearnLvlScreen')}
              >
                <MaterialCommunityIcons name="clipboard-clock-outline" size={iconSize.lg} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.totalValueRow}>
            <Text style={styles.totalValue}>{showValues ? totalValue : maskValue(totalValue)}</Text>
            <TouchableOpacity onPress={() => setDropdownVisible(v => !v)}>
              <Text style={styles.totalValueBTC}> {selectedCurrency} <MaterialCommunityIcons name="chevron-down" size={16} color="#888" /></Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.totalValueUSD}>≈ {showValues ? totalUSD : maskValue(totalUSD)}</Text>
          <View style={styles.pnlRow}>
            <Text style={styles.pnlLabel}>Today&apos;s PNL</Text>
            <Text style={styles.pnlValue}>-$0.02502 (-1.13%)</Text>
          </View>
        </View>

        {dropdownVisible && <DropdownMenu />}

        {/* Settings Overlay */}
        {showSettingsOverlay && (
          <TouchableWithoutFeedback onPress={() => setShowSettingsOverlay(false)}>
            <View style={styles.settingsOverlay}>
              <Pressable style={styles.settingsPanel} onPress={e => e.stopPropagation()}>
                <View style={styles.settingsOption}>
                  <TouchableOpacity
                    style={styles.checkbox}
                    onPress={() => setHideAssetsUnder1USD(!hideAssetsUnder1USD)}
                  >
                    {hideAssetsUnder1USD && (
                      <MaterialCommunityIcons name="check" size={16} color={GREEN} />
                    )}
                  </TouchableOpacity>
                  <Text style={styles.settingsOptionText}>Hide assets {'<'}1 USD</Text>
                </View>
                <View style={styles.settingsOption}>
                  <TouchableOpacity
                    style={styles.checkbox}
                    onPress={() => setHideCoinDetails(!hideCoinDetails)}
                  >
                    {hideCoinDetails && (
                      <MaterialCommunityIcons name="check" size={16} color={GREEN} />
                    )}
                  </TouchableOpacity>
                  <Text style={styles.settingsOptionText}>Hide coin details</Text>
                </View>
              </Pressable>
            </View>
          </TouchableWithoutFeedback>
        )}

        {/* Crypto/Account Tabs */}
        <View style={styles.cryptoTabsRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <Text style={styles.cryptoTabActive}>Crypto</Text>
            <TouchableOpacity onPress={() => router.replace('/screens/OverviewAccountScreen')}>
              <Text style={styles.cryptoTabInactive}>Account</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
              style={[styles.headerIconBtn, { backgroundColor: 'transparent', marginLeft: 0, marginRight: 6 }]}
              onPress={() => router.push('/screens/OverviewCryptoSearchScreen')}
            >
              <EvilIcons name="search" size={26} color="#888" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.headerIconBtn, { backgroundColor: 'transparent', marginLeft: 0 }]}
              onPress={() => setShowSettingsOverlay(true)}
            >
              <Ionicons name="settings-outline" size={iconSize.lg} color="#888" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Currency Cards */}
        <View>
          {filteredAssets.map((asset) => (
            <View key={asset.id} style={styles.cryptoCard}>
              <View style={styles.cryptoCardHeader}>
                <MaterialCommunityIcons name={asset.icon} size={iconSize.xl} color={asset.color} />
                <Text style={styles.cryptoName}>{asset.name}</Text>
                <Text style={styles.cryptoAmount}>
                  {showValues ? asset.amount : maskValue(asset.amount)}
                </Text>
              </View>
              <Text style={styles.cryptoSubAmount}>
                {showValues
                  ? (asset.id === 'USDT' || asset.id === 'USD'
                    ? `$${asset.usdValue.toFixed(2)} USD`
                    : `${asset.btcValue} BTC`)
                  : maskValue(asset.id === 'USDT' || asset.id === 'USD'
                    ? `$${asset.usdValue.toFixed(2)} USD`
                    : `${asset.btcValue} BTC`)
                }
              </Text>
              <View style={styles.pnlRowCard}>
                <Text style={styles.pnlLabelCard}>Today&apos;s PNL</Text>
                <Text style={styles.pnlValueCard}>{asset.pnl}</Text>
              </View>
              <Text style={styles.cryptoAvgPrice}>Average Price</Text>
              <Text style={styles.cryptoAvgPriceValue}>
                {showValues ? asset.avgPrice : maskValue(asset.avgPrice)}
              </Text>
              <View style={styles.cryptoActionRow}>
                <TouchableOpacity style={styles.earnBtn} onPress={() => router.push('/screens/OverviewCryptoEarnScreen')}>
                  <Text style={styles.earnBtnText}>Earn</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tradeBtn}>
                  <Text style={styles.tradeBtnText}>Trade</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BG,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 18,
    backgroundColor: BG,
  },
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTab: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 6,
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTabActiveTouch: {
    backgroundColor: CARD_BG,
  },
  headerTabText: {
    color: '#888',
    fontSize: 15,
    fontWeight: '500',
  },
  headerTabActiveText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  headerIconBtn: {
    marginLeft: 10,
    padding: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 18,
    marginTop: 18,
    marginBottom: 8,
  },
  tabActive: {
    color: GREEN,
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 24,
    borderBottomWidth: 2,
    borderBottomColor: GREEN,
    paddingBottom: 6,
  },
  tabInactive: {
    color: '#888',
    fontSize: 16,
    marginRight: 24,
    paddingBottom: 6,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingBottom: 100,
  },
  totalValueBox: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    padding: 20,
    marginTop: 8,
    marginBottom: 18,
  },
  totalValueLabel: {
    color: '#888',
    fontSize: 14,
    marginBottom: 6,
  },
  totalValueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  totalValue: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  totalValueBTC: {
    color: '#888',
    fontSize: 16,
    marginLeft: 4,
    marginBottom: 2,
  },
  totalValueUSD: {
    color: '#888',
    fontSize: 16,
    marginTop: 2,
    marginBottom: 8,
  },
  pnlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  pnlLabel: {
    color: '#888',
    fontSize: 14,
    marginRight: 8,
  },
  pnlValue: {
    color: RED,
    fontSize: 14,
    fontWeight: 'bold',
  },
  cryptoTabsRow: {
    flexDirection: 'row',
    marginTop: 8,
    marginBottom: 8,
  },
  cryptoTabActive: {
    color: GREEN,
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 24,
    borderBottomWidth: 2,
    borderBottomColor: GREEN,
    paddingBottom: 6,
  },
  cryptoTabInactive: {
    color: '#888',
    fontSize: 16,
    marginRight: 24,
    paddingBottom: 6,
  },
  cryptoCard: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    padding: 20,
    marginBottom: 18,
  },
  cryptoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  cryptoName: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 8,
    marginRight: 8,
  },
  cryptoAmount: {
    color: '#fff',
    fontSize: 15,
    marginLeft: 'auto',
    fontWeight: 'bold',
  },
  cryptoSubAmount: {
    color: '#888',
    fontSize: 13,
    marginBottom: 4,
    marginLeft: 32,
  },
  pnlRowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
    marginLeft: 32,
  },
  pnlLabelCard: {
    color: '#888',
    fontSize: 14,
    marginRight: 8,
  },
  pnlValueCard: {
    color: RED,
    fontSize: 14,
    fontWeight: 'bold',
  },
  cryptoAvgPrice: {
    color: '#888',
    fontSize: 14,
    marginLeft: 32,
    marginTop: 2,
  },
  cryptoAvgPriceValue: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 32,
    marginBottom: 8,
  },
  cryptoActionRow: {
    flexDirection: 'row',
    marginTop: 8,
    marginLeft: 32,
  },
  earnBtn: {
    backgroundColor: CARD_BG,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: GREEN,
    marginRight: 8,
  },
  earnBtnText: {
    color: GREEN,
    fontWeight: 'bold',
    fontSize: 13,
    letterSpacing: 0.5,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  tradeBtn: {
    backgroundColor: GREEN,
    borderRadius: 10,
    paddingVertical: 7,
    paddingHorizontal: 16,
    shadowColor: GREEN,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 3,
  },
  tradeBtnText: {
    color: BG,
    fontWeight: 'bold',
    fontSize: 13,
    letterSpacing: 0.5,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  settingsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 1000,
  },
  settingsPanel: {
    position: 'absolute',
    top: 280,
    right: 20,
    backgroundColor: CARD_BG,
    borderRadius: 12,
    padding: 16,
    minWidth: 200,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  settingsOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#444',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingsOptionText: {
    color: '#fff',
    fontSize: 14,
    flex: 1,
  },
});

export default SpotSpotScreen; 