import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AddFundsModal from './AddFundsModal';
import SendFundsModal from './SendFundsModal';

const FundingScreen = () => {
  const [showValues, setShowValues] = useState(true);
  const [hideSmallAssets, setHideSmallAssets] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const router = useRouter();

  // Example values
  const totalBTC = '0.00000036';
  const totalUSD = '$0.04186958';
  const pnl = '+$0.00(+0.00%)';
  const usdtAmount = '0.04186958';
  const usdtBTC = '0.00000036';
  const available = '0.04186958';
  const freeze = '0.00';

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
        <Text style={styles.tabInactive} onPress={() => router.push('/screens/OverviewCryptoScreen')}>Overview</Text>
        <Text style={styles.tabInactive} onPress={() => router.replace('/screens/SpotSpotScreen')}>Spot</Text>
        <Text style={styles.tabActive}>Funding</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Total Value */}
        <View style={styles.totalValueBox}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <Text style={styles.totalValueLabel}>Est. Total Value <TouchableOpacity onPress={() => setShowValues(v => !v)}><MaterialCommunityIcons name={showValues ? 'eye-outline' : 'eye-off-outline'} size={16} color="#888" /></TouchableOpacity></Text>
            <TouchableOpacity style={[styles.headerIconBtn, { backgroundColor: 'transparent' }]}>
              <MaterialCommunityIcons name="clipboard-clock-outline" size={22} color="#fff" />
            </TouchableOpacity>
          </View>
          <View style={styles.totalValueRow}>
            <Text style={styles.totalValue}>{!hideSmallAssets ? totalBTC : maskValue(totalBTC)}</Text>
            <Text style={styles.totalValueBTC}> BTC <MaterialCommunityIcons name="chevron-down" size={16} color="#888" /></Text>
          </View>
          <Text style={styles.totalValueUSD}>≈ {!hideSmallAssets ? totalUSD : maskValue(totalUSD)}</Text>
          <View style={styles.pnlRow}>
            <Text style={styles.pnlLabel}>Today&apos;s PNL</Text>
            <Text style={styles.pnlValue}>{pnl}</Text>
          </View>
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.addFundsBtn} onPress={() => setShowDepositModal(true)}>
              <Text style={styles.addFundsText}>Add Funds</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryBtn} onPress={() => setShowSendModal(true)}>
              <Text style={styles.secondaryBtnText}>Send</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryBtn} onPress={() => router.replace('/screens/TransferFundsScreen')}>
              <Text style={styles.secondaryBtnText} numberOfLines={1} ellipsizeMode="tail">Transfer</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Balances Section */}
        <Text style={styles.balancesTitle}>Balances</Text>
        <View style={styles.balancesRow}>
          <TouchableOpacity style={styles.checkbox} onPress={() => setHideSmallAssets(v => !v)}>
            <View style={[styles.checkboxBox, hideSmallAssets && styles.checkboxBoxChecked]}>
              {hideSmallAssets && <MaterialCommunityIcons name="check" size={16} color="#00C896" />}
            </View>
            <Text style={styles.checkboxLabel}>Hide assets &lt;1 USD</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <MaterialCommunityIcons name="magnify" size={22} color="#888" />
          </TouchableOpacity>
        </View>

        {/* USDT Asset Row */}
        <View style={styles.assetRow}>
          <MaterialCommunityIcons name="currency-usdt" size={28} color="#00C896" style={{ marginRight: 10 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.assetSymbol}>USDT</Text>
            <Text style={styles.assetName}>TetherUS</Text>
            <Text style={styles.assetBTC}>{usdtBTC}</Text>
            <View style={styles.assetDetailsRow}>
              <Text style={styles.assetDetail}>Available <Text style={styles.assetDetailValue}>{!hideSmallAssets ? available : maskValue(available)}</Text></Text>
              <Text style={styles.assetDetail}>Freeze <Text style={styles.assetDetailValue}>{!hideSmallAssets ? freeze : maskValue(freeze)}</Text></Text>
            </View>
          </View>
          <Text style={styles.assetAmount}>{!hideSmallAssets ? usdtAmount : maskValue(usdtAmount)}</Text>
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
    color: '#00C896',
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
  balancesTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 8,
    marginBottom: 10,
  },
  balancesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#888',
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  checkboxBoxChecked: {
    borderColor: '#00C896',
    backgroundColor: '#0A0F1E',
  },
  checkboxLabel: {
    color: '#888',
    fontSize: 15,
  },
  assetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#23262F',
    borderRadius: 12,
    padding: 14,
    marginBottom: 18,
  },
  assetSymbol: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  assetName: {
    color: '#888',
    fontSize: 13,
  },
  assetBTC: {
    color: '#888',
    fontSize: 12,
    marginBottom: 2,
  },
  assetDetailsRow: {
    flexDirection: 'row',
    marginTop: 2,
  },
  assetDetail: {
    color: '#888',
    fontSize: 12,
    marginRight: 12,
  },
  assetDetailValue: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  assetAmount: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 12,
  },
  headerIconBtn: {
    marginLeft: 10,
    padding: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.04)',
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
});

export default FundingScreen; 