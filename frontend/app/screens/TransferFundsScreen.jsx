import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Modal } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCoinContext } from '../context/CoinContext';
import responsiveUtils from '../utils/responsive';

const { scale, iconSize, isTablet, getModalSize } = responsiveUtils;

const GREEN = '#00C896';
const RED = '#FF4D4F';
const BG = '#0A0F1E';
const CARD_BG = '#1A1F2E';

const TransferFundsScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { selectedCoin } = useCoinContext();
  const [fromAccount, setFromAccount] = useState('Funding');
  const [toAccount, setToAccount] = useState('Spot');
  const [amount, setAmount] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSwap = () => {
    setFromAccount(toAccount);
    setToAccount(fromAccount);
  };

  const isAmountValid = () => {
    const numAmount = parseFloat(amount);
    return !isNaN(numAmount) && numAmount > 10.41;
  };

  const handleConfirmTransfer = () => {
    setShowConfirmation(true);
  };

  const handleTransferConfirmed = () => {
    setShowConfirmation(false);
    setShowSuccess(true);
    // Here you would typically make the actual transfer API call
  };

  const handleSuccessDismiss = () => {
    setShowSuccess(false);
    router.replace('/screens/OverviewCryptoScreen');
  };

  const handleCancelTransfer = () => {
    setShowConfirmation(false);
  };

  const handleMaxAmount = () => {
    setAmount(selectedCoin.balance);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.replace('/screens/OverviewCryptoScreen')}>
          <Ionicons name="arrow-back" size={iconSize.lg} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transfer</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Transfer Box */}
        <View style={styles.transferBox}>
          <View style={styles.transferRow}>
            <Text style={styles.transferLabel}>From</Text>
            <Text style={styles.transferValue}>{fromAccount}</Text>
            <Ionicons name="chevron-forward" size={iconSize.md} color="#888" style={{ marginLeft: 4 }} />
          </View>
          <View style={styles.transferRow}>
            <Text style={styles.transferLabel}>To</Text>
            <Text style={styles.transferValue}>{toAccount}</Text>
            <Ionicons name="chevron-forward" size={iconSize.md} color="#888" style={{ marginLeft: 4 }} />
          </View>
          <TouchableOpacity style={styles.swapBtn} onPress={handleSwap}>
            <MaterialCommunityIcons name="swap-vertical" size={iconSize.lg} color={GREEN} />
          </TouchableOpacity>
        </View>

        {/* Coin Selection */}
        <Text style={styles.sectionLabel}>Coin</Text>
        <TouchableOpacity style={styles.coinBox} onPress={() => router.push('/screens/SelectCoinScreen')}>
          <MaterialCommunityIcons
            name={selectedCoin.icon}
            size={iconSize.xl}
            color={selectedCoin.color}
            style={{ marginRight: 10 }}
          />
          <Text style={styles.coinSymbol}>{selectedCoin.symbol}</Text>
          <Text style={styles.coinName}>{selectedCoin.name}</Text>
          <Ionicons name="chevron-forward" size={iconSize.md} color="#888" style={{ marginLeft: 'auto' }} />
        </TouchableOpacity>

        {/* Amount Input */}
        <Text style={styles.sectionLabel}>Amount</Text>
        <View style={styles.amountBox}>
          <TextInput
            style={styles.amountInput}
            placeholder="Minimum 0.00000001"
            placeholderTextColor="#888"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
          <Text style={styles.amountCoin}>{selectedCoin.symbol}</Text>
          <TouchableOpacity onPress={handleMaxAmount}>
            <Text style={styles.maxBtn}>Max</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.availableText}>Available {selectedCoin.balance} {selectedCoin.symbol}</Text>

        {/* Confirm Button */}
        <TouchableOpacity
          style={[styles.confirmBtn, isAmountValid() && styles.confirmBtnActive]}
          disabled={!isAmountValid()}
          onPress={handleConfirmTransfer}
        >
          <Text style={[styles.confirmBtnText, isAmountValid() && styles.confirmBtnTextActive]}>
            Confirm Transfer
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmation}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCancelTransfer}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmationModal}>
            <View style={styles.modalHeader}>
              <MaterialCommunityIcons name="exclamation" size={iconSize['3xl']} color={RED} />
              <Text style={styles.modalTitle}>Confirm Transfer</Text>
              <Text style={styles.modalSubtitle}>
                Are you sure you want to transfer {amount} USDT from {fromAccount} to {toAccount}?
              </Text>
            </View>

            <View style={styles.modalContent}>
              <View style={styles.transferDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>From:</Text>
                  <Text style={styles.detailValue}>{fromAccount}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>To:</Text>
                  <Text style={styles.detailValue}>{toAccount}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Amount:</Text>
                  <Text style={styles.detailValue}>{amount} {selectedCoin.symbol}</Text>
                </View>
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={handleCancelTransfer}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmModalBtn} onPress={handleTransferConfirmed}>
                <Text style={styles.confirmModalBtnText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal
        visible={showSuccess}
        transparent={true}
        animationType="fade"
        onRequestClose={handleSuccessDismiss}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.successModal}>
            <View style={styles.successHeader}>
              <MaterialCommunityIcons name="check-circle" size={iconSize['3xl']} color={GREEN} />
              <Text style={styles.successTitle}>Transfer Successful!</Text>
              <Text style={styles.successSubtitle}>
                Your transfer has been completed successfully.
              </Text>
            </View>
            <TouchableOpacity style={styles.successBtn} onPress={handleSuccessDismiss}>
              <Text style={styles.successBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BG,
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: BG,
    paddingTop: 32,
    paddingBottom: 64,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 48,
    paddingBottom: 18,
    paddingHorizontal: 18,
    backgroundColor: BG,
  },
  backBtn: {
    padding: 8,
    marginRight: 8,
    marginLeft: 2,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.1)',
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
  transferBox: {
    backgroundColor: CARD_BG,
    borderRadius: 18,
    padding: 18,
    marginHorizontal: 18,
    marginBottom: 24,
    marginTop: 8,
    position: 'relative',
  },
  transferRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  transferLabel: {
    color: '#888',
    fontSize: 15,
    marginRight: 12,
    width: 40,
  },
  transferValue: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 8,
  },
  swapBtn: {
    position: 'absolute',
    right: 18,
    top: 32,
    backgroundColor: CARD_BG,
    borderRadius: 16,
    padding: 6,
    borderWidth: 1,
    borderColor: CARD_BG,
    elevation: 2,
  },
  sectionLabel: {
    color: '#888',
    fontSize: 15,
    marginLeft: 18,
    marginBottom: 6,
    marginTop: 2,
  },
  coinBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CARD_BG,
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 18,
    marginBottom: 24,
  },
  coinSymbol: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 6,
  },
  coinName: {
    color: '#888',
    fontSize: 13,
  },
  amountBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CARD_BG,
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 18,
    marginBottom: 8,
  },
  amountInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  amountCoin: {
    color: '#888',
    fontSize: 16,
    marginRight: 12,
  },
  maxBtn: {
    color: GREEN,
    fontSize: 14,
    fontWeight: 'bold',
  },
  availableText: {
    color: '#888',
    fontSize: 13,
    marginLeft: 18,
    marginBottom: 24,
  },
  confirmBtn: {
    backgroundColor: 'rgba(0,200,150,0.3)',
    borderRadius: 12,
    paddingVertical: 16,
    marginHorizontal: 18,
    alignItems: 'center',
  },
  confirmBtnActive: {
    backgroundColor: GREEN,
  },
  confirmBtnText: {
    color: 'rgba(0,200,150,0.7)',
    fontWeight: 'bold',
    fontSize: 16,
  },
  confirmBtnTextActive: {
    color: '#0A0F1E',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmationModal: {
    backgroundColor: CARD_BG,
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 20,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  modalSubtitle: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  modalContent: {
    marginBottom: 24,
  },
  transferDetails: {
    backgroundColor: BG,
    borderRadius: 12,
    padding: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 2,
    borderColor: RED,
  },
  cancelBtnText: {
    color: RED,
    fontWeight: 'bold',
    fontSize: 16,
  },
  confirmModalBtn: {
    flex: 1,
    backgroundColor: GREEN,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginLeft: 8,
  },
  confirmModalBtnText: {
    color: BG,
    fontWeight: 'bold',
    fontSize: 16,
  },
  successModal: {
    backgroundColor: CARD_BG,
    borderRadius: 20,
    padding: 32,
    marginHorizontal: 20,
    maxWidth: 400,
    width: '100%',
    alignItems: 'center',
  },
  successHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  successTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 12,
  },
  successSubtitle: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  successBtn: {
    backgroundColor: GREEN,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    width: '100%',
  },
  successBtnText: {
    color: BG,
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default TransferFundsScreen; 