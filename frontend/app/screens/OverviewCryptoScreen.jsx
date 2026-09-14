import React, { useState } from 'react';
import { usePortfolio } from '../../contexts/PortfolioContext';
import { useMarketData } from '../../contexts/MarketDataContext';
import { assetMeta, formatAssetAmount } from '../../services/assetMeta';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Pressable, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons, EvilIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import SendFundsModal from './SendFundsModal';
import AddFundsModal from './AddFundsModal';


const OverviewCryptoScreen = () => {
  const {
    holdings,
    totalValue: portfolioTotal,
    lastPrices,
    currency: portfolioCurrency,
    setCurrency: setPortfolioCurrency,
    loading: portfolioLoading,
    error: portfolioError,
    refresh: refreshPortfolio,
  } = usePortfolio();
  const { getCoin } = useMarketData();

  const [showValues, setShowValues] = useState(true);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(portfolioCurrency);
  const [showSendFundsModal, setShowSendFundsModal] = useState(false);
  const [showSettingsOverlay, setShowSettingsOverlay] = useState(false);
  const [hideAssetsUnder1USD, setHideAssetsUnder1USD] = useState(false);
  const [hideCoinDetails, setHideCoinDetails] = useState(false);
  const router = useRouter();

  /**
   * Holdings come from GET /api/assets/overview, which returns every asset the
   * account holds plus the price used to value it. The four hardcoded entries
   * that used to sit here described nobody's actual account.
   */


  const cryptoAssets = holdings.map((h) => {
    const meta = assetMeta(h.asset);
    const coin = getCoin(h.asset);
    const changePct = coin ? Number(coin.change24h) : 0;
    // Day-over-day move on the position, derived from the asset's 24h change.
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

  const filteredAssets = hideAssetsUnder1USD
    ? cryptoAssets.filter(asset => asset.usdValue >= 1.00)
    : cryptoAssets;

  const totalValue = formatAssetAmount(portfolioTotal);
  // lastPrices carries each asset's price in the selected currency, so the USD
  // figure is the total re-expressed via the selected currency's own price.
  const totalUSD = `$${formatAssetAmount(portfolioTotal * (Number(lastPrices[portfolioCurrency]) || 1))}`;

  // Utility function to mask a value with asterisks of the same length
  const maskValue = (value) => typeof value === 'string' ? value.replace(/./g, '*') : value;

  // Dropdown currencies
  const currencies = ['USD', 'GHS', 'USDT', 'BTC', 'ETH'];

  // Dropdown menu component
  const DropdownMenu = () => (
    <TouchableWithoutFeedback onPress={() => setDropdownVisible(false)}>
      <View style={{ position: 'absolute', top: 90, right: 30, zIndex: 10, backgroundColor: 'rgba(0,0,0,0.2)', width: '100%', height: '100%' }}>
        <View style={{ position: 'absolute', top: 0, right: 0, backgroundColor: '#23262F', borderRadius: 12, paddingVertical: 8, width: 160, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 8, elevation: 8 }}>
          {currencies.map((cur) => (
            <TouchableOpacity
              key={cur}
              style={{ paddingVertical: 12, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', backgroundColor: selectedCurrency === cur ? '#23262F' : 'transparent' }}
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
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {/* Header content removed */}
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <Text style={styles.tabActive}>Overview</Text>
        <TouchableOpacity onPress={() => router.replace('/screens/SpotSpotScreen')}>
          <Text style={styles.tabInactive}>Spot</Text>
        </TouchableOpacity>
        <Text style={styles.tabInactive} onPress={() => router.push('/screens/FundingScreen')}>Funding</Text>
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
                <MaterialCommunityIcons name="chart-line" size={22} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.headerIconBtn, { backgroundColor: 'transparent', marginLeft: 0 }]}
                onPress={() => router.push('/screens/BitbyLearnLvlScreen')}
              >
                <MaterialCommunityIcons name="clipboard-clock-outline" size={22} color="#fff" />
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
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.addFundsBtn} onPress={() => setShowDepositModal(true)}>
              <Text style={styles.addFundsText}>Add Funds</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryBtn} onPress={() => setShowSendFundsModal(true)}>
              <Text style={styles.secondaryBtnText}>Send</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryBtn} onPress={() => router.push('/screens/TransferFundsScreen')}>
              <Text style={styles.secondaryBtnText} numberOfLines={1} ellipsizeMode="tail">Transfer</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Deposit Modal */}
        <Modal
          visible={showDepositModal}
          animationType="slide"
          transparent
          onRequestClose={() => setShowDepositModal(false)}
        >
          <Pressable style={styles.modalOverlay} onPress={() => setShowDepositModal(false)}>
            <Pressable style={styles.depositModal} onPress={e => e.stopPropagation()}>
              <AddFundsModal />
            </Pressable>
          </Pressable>
        </Modal>

        {dropdownVisible && <DropdownMenu />}

        {/* Send Funds Modal */}
        {showSendFundsModal && (
          <Modal
            visible={showSendFundsModal}
            animationType="slide"
            transparent
            onRequestClose={() => setShowSendFundsModal(false)}
          >
            <Pressable style={styles.modalOverlay} onPress={() => setShowSendFundsModal(false)}>
              <Pressable style={styles.depositModal} onPress={e => e.stopPropagation()}>
                <SendFundsModal />
              </Pressable>
            </Pressable>
          </Modal>
        )}

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
                      <MaterialCommunityIcons name="check" size={16} color="#00C896" />
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
                      <MaterialCommunityIcons name="check" size={16} color="#00C896" />
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
              <Ionicons name="settings-outline" size={22} color="#888" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Currency Cards */}
        <View>
          {portfolioError ? (
            <TouchableOpacity
              onPress={() => refreshPortfolio()}
              style={{ backgroundColor: '#2A1F1F', borderColor: '#FF6B6B', borderWidth: 1, borderRadius: 12, padding: 16, margin: 16 }}
            >
              <Text style={{ color: '#FF6B6B', fontSize: 13 }}>{portfolioError}</Text>
              <Text style={{ color: '#888', fontSize: 12, marginTop: 4 }}>Tap to retry</Text>
            </TouchableOpacity>
          ) : portfolioLoading && filteredAssets.length === 0 ? (
            <View style={{ padding: 32, alignItems: 'center' }}>
              <ActivityIndicator color="#00C896" />
              <Text style={{ color: '#888', fontSize: 13, marginTop: 8 }}>Loading your assets...</Text>
            </View>
          ) : filteredAssets.length === 0 ? (
            <View style={{ padding: 32, alignItems: 'center' }}>
              <Text style={{ color: '#888', fontSize: 14 }}>No assets yet</Text>
              <Text style={{ color: '#666', fontSize: 12, marginTop: 4 }}>
                {hideAssetsUnder1USD ? 'Nothing above $1. Try turning off the filter.' : 'Deposit funds to get started.'}
              </Text>
            </View>
          ) : null}
          {filteredAssets.map((asset) => (
            <View key={asset.id} style={styles.cryptoCard}>
              <View style={styles.cryptoCardHeader}>
                <MaterialCommunityIcons name={asset.icon} size={24} color={asset.color} />
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

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.replace('/(tabs)/dashboard')}>
          <Ionicons name="home-outline" size={22} color="#888" />
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.replace('/(tabs)/market')}>
          <Ionicons name="trending-up-outline" size={22} color="#888" />
          <Text style={styles.navLabel}>Markets</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.replace('/(tabs)/trade')}>
          <Ionicons name="swap-horizontal" size={22} color="#888" />
          <Text style={styles.navLabel}>Trade</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.replace('/(tabs)/futures')}>
          <Ionicons name="time-outline" size={22} color="#888" />
          <Text style={styles.navLabel}>Futures</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, styles.navItemActive]}>
          <Ionicons name="wallet" size={22} color="#00C896" />
          <Text style={[styles.navLabel, styles.navLabelActive]}>Assets</Text>
        </TouchableOpacity>
      </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 18,
    backgroundColor: '#0A0F1E',
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
    backgroundColor: '#23262F',
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
  headerTabInactive: {
    color: '#888',
    fontSize: 18,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
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
    color: '#00C896',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 24,
    borderBottomWidth: 2,
    borderBottomColor: '#00C896',
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
    backgroundColor: '#23262F',
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
    color: '#FF4D4F',
    fontSize: 14,
    fontWeight: 'bold',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  addFundsBtn: {
    backgroundColor: '#00C896',
    borderRadius: 10,
    paddingVertical: 7,
    paddingHorizontal: 16,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
    shadowColor: '#00C896',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 3,
  },
  addFundsText: {
    color: '#181A20',
    fontWeight: 'bold',
    fontSize: 13,
    letterSpacing: 0.5,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  secondaryBtn: {
    backgroundColor: '#23262F',
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 8,
    flex: 1,
    marginLeft: 4,
    marginRight: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#00C896',
  },
  secondaryBtnText: {
    color: '#00C896',
    fontWeight: 'bold',
    fontSize: 12,
    letterSpacing: 0.5,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  cryptoTabsRow: {
    flexDirection: 'row',
    marginTop: 8,
    marginBottom: 8,
  },
  cryptoTabActive: {
    color: '#00C896',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 24,
    borderBottomWidth: 2,
    borderBottomColor: '#00C896',
    paddingBottom: 6,
  },
  cryptoTabInactive: {
    color: '#888',
    fontSize: 16,
    marginRight: 24,
    paddingBottom: 6,
  },
  cryptoCard: {
    backgroundColor: '#23262F',
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
    color: '#FF4D4F',
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
    backgroundColor: '#23262F',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#00C896',
    marginRight: 8,
  },
  earnBtnText: {
    color: '#00C896',
    fontWeight: 'bold',
    fontSize: 13,
    letterSpacing: 0.5,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  tradeBtn: {
    backgroundColor: '#00C896',
    borderRadius: 10,
    paddingVertical: 7,
    paddingHorizontal: 16,
    shadowColor: '#00C896',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 3,
  },
  tradeBtnText: {
    color: '#181A20',
    fontWeight: 'bold',
    fontSize: 13,
    letterSpacing: 0.5,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  bottomNav: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    backgroundColor: '#23262F',
    borderTopWidth: 1,
    borderTopColor: '#222',
    height: 64,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: 8,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navItemActive: {
    // highlight Assets
  },
  navLabel: {
    color: '#888',
    fontSize: 12,
    marginTop: 2,
  },
  navLabelActive: {
    color: '#00C896',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  depositModal: {
    backgroundColor: '#23262F',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 32,
    alignItems: 'stretch',
  },
  modalHandle: {
    alignSelf: 'center',
    width: 48,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#444',
    marginBottom: 18,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'left',
  },
  depositOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#23262F',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#333',
    padding: 18,
    marginBottom: 18,
  },
  depositIcon: {
    marginRight: 18,
  },
  depositTextBox: {
    flex: 1,
  },
  depositOptionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  depositOptionDesc: {
    color: '#888',
    fontSize: 13,
  },
  closeModalBtn: {
    marginTop: 8,
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 32,
    borderRadius: 8,
    backgroundColor: '#23262F',
    borderWidth: 1,
    borderColor: '#444',
  },
  closeModalText: {
    color: '#fff',
    fontSize: 16,
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
    backgroundColor: '#2A2D36',
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

export default OverviewCryptoScreen; 