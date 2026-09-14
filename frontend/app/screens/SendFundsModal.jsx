import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const SendFundsModal = () => {
  return (
    <View style={styles.container}>
      <View style={styles.modalHandle} />
      <Text style={styles.modalTitle}>Select Withdraw Method</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.depositOption}>
          <MaterialCommunityIcons name="credit-card-outline" size={28} color="#00C896" style={styles.depositIcon} />
          <View style={styles.depositTextBox}>
            <Text style={styles.depositOptionTitle}>Send to Bitby users</Text>
            <Text style={styles.depositOptionDesc}>Bitby internal transfer, send via Email/Phone/ID</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.depositOption}>
          <MaterialCommunityIcons name="upload" size={28} color="#00C896" style={styles.depositIcon} />
          <View style={styles.depositTextBox}>
            <Text style={styles.depositOptionTitle}>On-Chain Withdraw</Text>
            <Text style={styles.depositOptionDesc}>Withdraw Crypto from Bitby to other exchanges/wallets</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.depositOption}>
          <MaterialCommunityIcons name="account-group-outline" size={28} color="#00C896" style={styles.depositIcon} />
          <View style={styles.depositTextBox}>
            <Text style={styles.depositOptionTitle}>P2P Trading</Text>
            <Text style={styles.depositOptionDesc}>Sell directly to users. Competitive pricing. Local payments.</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#23262F',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 6,
    alignItems: 'stretch',
   
  },
  modalHandle: {
    alignSelf: 'center',
    width: 48,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#444',
    marginBottom: 8,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
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
    marginBottom: 12,
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
});

export default SendFundsModal; 