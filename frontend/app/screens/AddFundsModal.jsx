import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const AddFundsModal = () => {
  return (
    <View style={styles.container}>
      <View style={styles.modalHandle} />
      <Text style={styles.modalTitle}>Select Deposit Method</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.depositOption}>
          <MaterialCommunityIcons name="download" size={28} color="#00C896" style={styles.depositIcon} />
          <View style={styles.depositTextBox}>
            <Text style={styles.depositOptionTitle}>On-Chain Deposit</Text>
            <Text style={styles.depositOptionDesc}>Deposit Crypto from other exchanges/wallets to Bitby</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.depositOption}>
          <MaterialCommunityIcons name="credit-card-outline" size={28} color="#00C896" style={styles.depositIcon} />
          <View style={styles.depositTextBox}>
            <Text style={styles.depositOptionTitle}>Receive Via Bitby Pay</Text>
            <Text style={styles.depositOptionDesc}>Receive crypto from other Bitby users</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.depositOption}>
          <MaterialCommunityIcons name="account-group-outline" size={28} color="#00C896" style={styles.depositIcon} />
          <View style={styles.depositTextBox}>
            <Text style={styles.depositOptionTitle}>P2P Trading</Text>
            <Text style={styles.depositOptionDesc}>Buy directly from users. Competitive pricing. Local payments.</Text>
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
    marginBottom: 15,
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

export default AddFundsModal; 