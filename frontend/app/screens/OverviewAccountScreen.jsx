import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Pressable, TouchableWithoutFeedback } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AddFundsModal from './AddFundsModal';
import SendFundsModal from './SendFundsModal';

const OverviewAccountScreen = () => {
  const [showValues, setShowValues] = useState(true);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showSettingsOverlay, setShowSettingsOverlay] = useState(false);
  const [hideAssetsUnder1USD, setHideAssetsUnder1USD] = useState(false);
  const [hideCoinDetails, setHideCoinDetails] = useState(false);
  const router = useRouter();
  const totalBTC = '0.00001862';
  const totalUSD = '$2.18';

  // Utility function to mask a value with asterisks of the same length
  const maskValue = (value) => typeof value === 'string' ? value.replace(/./g, '*') : value;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={[styles.headerTab, styles.headerTabActiveTouch]}>
            <Text style={[styles.headerTabText, styles.headerTabActiveText]}>Exchange</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerTab}>
            <Text style={styles.headerTabText}>Wallet</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity onPress={() => router.push('/screens/OverviewCryptoScreen')}>
          <Text style={styles.tabActive}>Overview</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.replace('/screens/SpotSpotScreen')}>
          <Text style={styles.tabInactive}>Spot</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/screens/FundingScreen')}>
          <Text style={styles.tabInactive}>Funding</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Total Value (copied from OverviewCryptoScreen) */}
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
              <TouchableOpacity style={[styles.headerIconBtn, { backgroundColor: 'transparent', marginLeft: 0 }]}>
                <MaterialCommunityIcons name="clipboard-clock-outline" size={22} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.totalValueRow}>
            <Text style={styles.totalValue}>{showValues ? totalBTC : maskValue(totalBTC)}</Text>
            <Text style={styles.totalValueBTC}> BTC <MaterialCommunityIcons name="chevron-down" size={16} color="#888" /></Text>
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
            <TouchableOpacity style={styles.secondaryBtn} onPress={() => setShowSendModal(true)}>
              <Text style={styles.secondaryBtnText}>Send</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryBtn}>
              <Text style={styles.secondaryBtnText} numberOfLines={1} ellipsizeMode="tail">Transfer</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Crypto/Account Tabs */}
        <View style={styles.cryptoTabsRow}>
          <TouchableOpacity onPress={() => router.replace('/screens/OverviewCryptoScreen')}>
            <Text style={styles.cryptoTabInactive}>Crypto</Text>
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <TouchableOpacity>
              <Text style={styles.cryptoTabActive}>Account</Text>
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 'auto' }}>
              <TouchableOpacity
                style={[styles.headerIconBtn, { backgroundColor: 'transparent', marginLeft: 0 }]}
                onPress={() => setShowSettingsOverlay(true)}
              >
                <Ionicons name="settings-outline" size={22} color="#888" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Account Balances */}
        <View style={styles.accountCard}>
          <View style={styles.accountRow}>
            <Text style={styles.accountLabel}>Spot</Text>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.accountValue}>0.00001834 BTC</Text>
              <Text style={styles.accountValueSub}>$2.13</Text>
            </View>
          </View>
          <View style={styles.accountRow}>
            <Text style={styles.accountLabel}>Funding</Text>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.accountValue}>0.00000036 BTC</Text>
              <Text style={styles.accountValueSub}>$0.04186958</Text>
            </View>
          </View>
        </View>
      </ScrollView>

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

      {/* Send Modal */}
      <Modal
        visible={showSendModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowSendModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowSendModal(false)}>
          <Pressable style={styles.depositModal} onPress={e => e.stopPropagation()}>
            <SendFundsModal />
          </Pressable>
        </Pressable>
      </Modal>

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

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home-outline" size={22} color="#888" />
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="stats-chart-outline" size={22} color="#888" />
          <Text style={styles.navLabel}>Markets</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="swap-horizontal" size={22} color="#888" />
          <Text style={styles.navLabel}>Trade</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
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
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 18,
    marginTop: 18,
    marginBottom: 8,
  },
  tabActive: {
    color: '#fff',
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
  cryptoTabsRow: {
    flexDirection: 'row',
    marginTop: 8,
    marginBottom: 8,
    alignItems: 'center',
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
  headerIconBtn: {
    marginLeft: 10,
    padding: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  accountCard: {
    backgroundColor: '#23262F',
    borderRadius: 16,
    padding: 20,
    marginTop: 8,
    marginBottom: 18,
  },
  accountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  accountLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  accountValue: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  accountValueSub: {
    color: '#888',
    fontSize: 12,
    marginTop: 2,
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
  navItemActive: {},
  navLabel: {
    color: '#888',
    fontSize: 12,
    marginTop: 2,
  },
  navLabelActive: {
    color: '#00C896',
    fontWeight: 'bold',
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
    fontSize: 15,
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

export default OverviewAccountScreen; 