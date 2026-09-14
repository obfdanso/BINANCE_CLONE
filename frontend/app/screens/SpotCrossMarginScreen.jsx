import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import responsiveUtils from '../utils/responsive';

const { scale, iconSize, isTablet, getModalSize } = responsiveUtils;

const GREEN = '#00C896';
const RED = '#FF4D4F';
const BG = '#0A0F1E';
const CARD_BG = '#1A1F2E';

const SpotCrossMarginScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [showValues, setShowValues] = useState(true);
  const [selectedCurrency] = useState('BTC');

  // Mock values for each currency
  const currencyData = {
    BTC: { value: '0.00001862', usd: '$2.18' },
    ETH: { value: '0.0005', usd: '$1.85' },
    BNB: { value: '0.01', usd: '$2.00' },
    USDT: { value: '2.18', usd: '$2.18' },
    USD: { value: '2.18', usd: '$2.18' },
  };

  // Utility function to mask a value with asterisks of the same length
  const maskValue = (value) => typeof value === 'string' ? value.replace(/./g, '*') : value;

  const totalValue = currencyData[selectedCurrency].value;
  const totalUSD = currencyData[selectedCurrency].usd;

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
        <TouchableOpacity onPress={() => router.replace('/screens/SpotSpotScreen')}>
          <Text style={styles.tabInactive}>Spot</Text>
        </TouchableOpacity>
        <Text style={styles.tabActive}>Cross Margin</Text>
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
            <Text style={styles.totalValueBTC}> {selectedCurrency}</Text>
          </View>
          <Text style={styles.totalValueUSD}>≈ {showValues ? totalUSD : maskValue(totalUSD)}</Text>
          <View style={styles.pnlRow}>
            <Text style={styles.pnlLabel}>Today&apos;s PNL</Text>
            <Text style={styles.pnlValue}>-$0.02502 (-1.13%)</Text>
          </View>
        </View>

        {/* Cross Margin Info */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <MaterialCommunityIcons name="shield-cross" size={iconSize.xl} color={GREEN} />
            <Text style={styles.infoTitle}>Cross Margin</Text>
          </View>
          <Text style={styles.infoDescription}>
            Cross margin allows you to use your entire account balance as margin for all positions.
            This provides maximum capital efficiency but higher risk.
          </Text>
          <View style={styles.infoStats}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Max Leverage</Text>
              <Text style={styles.statValue}>20x</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Margin Used</Text>
              <Text style={styles.statValue}>$300.00</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Available</Text>
              <Text style={styles.statValue}>$700.00</Text>
            </View>
          </View>
        </View>

        {/* Account Overview */}
        <Text style={styles.sectionTitle}>Account Overview</Text>
        <View style={styles.accountCard}>
          <View style={styles.accountRow}>
            <Text style={styles.accountLabel}>Total Equity</Text>
            <Text style={styles.accountValue}>$1,000.00</Text>
          </View>
          <View style={styles.accountRow}>
            <Text style={styles.accountLabel}>Total Debt</Text>
            <Text style={styles.accountValue}>$0.00</Text>
          </View>
          <View style={styles.accountRow}>
            <Text style={styles.accountLabel}>Margin Level</Text>
            <Text style={[styles.accountValue, { color: GREEN }]}>∞</Text>
          </View>
          <View style={styles.accountRow}>
            <Text style={styles.accountLabel}>Maintenance Margin</Text>
            <Text style={styles.accountValue}>$0.00</Text>
          </View>
        </View>

        {/* Active Positions */}
        <Text style={styles.sectionTitle}>Active Positions</Text>
        <View style={styles.positionCard}>
          <View style={styles.positionHeader}>
            <MaterialCommunityIcons name="bitcoin" size={iconSize.xl} color="#F7931A" />
            <View style={styles.positionInfo}>
              <Text style={styles.positionSymbol}>BTC/USDT</Text>
              <Text style={styles.positionType}>Long</Text>
            </View>
            <View style={styles.positionStats}>
              <Text style={styles.positionSize}>0.01 BTC</Text>
              <Text style={styles.positionValue}>$450.00</Text>
            </View>
          </View>
          <View style={styles.positionDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Entry Price</Text>
              <Text style={styles.detailValue}>$45,000.00</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Mark Price</Text>
              <Text style={styles.detailValue}>$45,123.45</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>P&L</Text>
              <Text style={[styles.detailValue, { color: GREEN }]}>+$1.23 (+0.27%)</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Leverage</Text>
              <Text style={styles.detailValue}>10x</Text>
            </View>
          </View>
          <View style={styles.positionActions}>
            <TouchableOpacity style={styles.actionBtn}>
              <Text style={styles.actionBtnText}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, styles.actionBtnSecondary]}>
              <Text style={styles.actionBtnTextSecondary}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickActionBtn}>
            <MaterialCommunityIcons name="plus" size={iconSize.lg} color={GREEN} />
            <Text style={styles.quickActionText}>New Position</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionBtn}>
            <MaterialCommunityIcons name="transfer" size={iconSize.lg} color={GREEN} />
            <Text style={styles.quickActionText}>Transfer</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionBtn}>
            <MaterialCommunityIcons name="history" size={iconSize.lg} color={GREEN} />
            <Text style={styles.quickActionText}>History</Text>
          </TouchableOpacity>
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
  infoCard: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    padding: 20,
    marginBottom: 18,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  infoDescription: {
    color: '#888',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  infoStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    color: '#888',
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  accountCard: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    padding: 20,
    marginBottom: 18,
  },
  accountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  accountLabel: {
    color: '#888',
    fontSize: 14,
  },
  accountValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  positionCard: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    padding: 20,
    marginBottom: 18,
  },
  positionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  positionInfo: {
    flex: 1,
    marginLeft: 12,
  },
  positionSymbol: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  positionType: {
    color: GREEN,
    fontSize: 12,
    fontWeight: 'bold',
  },
  positionStats: {
    alignItems: 'flex-end',
  },
  positionSize: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  positionValue: {
    color: '#888',
    fontSize: 12,
  },
  positionDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    color: '#888',
    fontSize: 14,
  },
  detailValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  positionActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionBtn: {
    backgroundColor: RED,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  actionBtnSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: GREEN,
    marginRight: 0,
    marginLeft: 8,
  },
  actionBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  actionBtnTextSecondary: {
    color: GREEN,
    fontSize: 14,
    fontWeight: 'bold',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  quickActionBtn: {
    backgroundColor: CARD_BG,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  quickActionText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
});

export default SpotCrossMarginScreen; 