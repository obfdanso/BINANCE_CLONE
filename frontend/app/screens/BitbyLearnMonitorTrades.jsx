import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const BitbyLearnMonitorTrades = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>BitbyLearn</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Title Section */}
        <View style={styles.titleSection}>
          <View style={styles.titleIconContainer}>
            <MaterialCommunityIcons name="eye" size={32} color="#F59E0B" />
          </View>
          <Text style={styles.mainTitle}>Monitor Trades</Text>
        </View>

        {/* Content Sections */}
        <View style={styles.contentContainer}>
          {/* Introduction */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Monitor Trades</Text>
            <Text style={styles.paragraph}>
              Monitoring trades means checking on the cryptocurrencies you've bought or sold in our app to see how they're doing. As a beginner, you don't need to watch your trades all day, but keeping an eye on them helps you learn and stay in control. Our app makes this easy with simple tools and clear displays.
            </Text>
          </View>

          {/* Checking Your Wallet */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Check Your Wallet</Text>
            <Text style={styles.paragraph}>
              After you make a trade, like buying $10 of Bitcoin in the "Buy Crypto" section, your crypto goes to your "Wallet." Go to the "Wallet" section to see your balance. It shows how much Bitcoin you own and its current value in dollars. For example, if Bitcoin's price goes up, your $10 might now be worth $11. If it goes down, it might be $9. This is normal in crypto.
            </Text>
          </View>

          {/* Frequency of Checking */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>How Often to Check</Text>
            <Text style={styles.paragraph}>
              Check your trades once or twice a week, not every hour. Prices change a lot, and watching too often can make you worried or excited, leading to bad choices. Our app's "Markets" section shows price charts for your coins. Look at the simple chart to see if the price is going up or down over a week. Don't stress about small changes.
            </Text>
          </View>

          {/* Price Alerts */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Set Price Alerts</Text>
            <Text style={styles.paragraph}>
              You can set "Price Alerts" in the app to get a notification if a coin's price hits a certain level. For example, set an alert if Bitcoin goes above $40,000 or below $30,000. This way, you don't have to check constantly. The app sends a message to your phone, so you can relax and check only when needed.
            </Text>
          </View>

          {/* Order History */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Use Order History</Text>
            <Text style={styles.paragraph}>
              The "Order History" section is another great tool. It shows all your past trades, like when you bought $10 of Ethereum or sold $5 of Bitcoin. This helps you remember what you did and see if your trades are working out. For example, you might notice you bought Bitcoin at $35,000, and now it's $36,000—nice job!
            </Text>
          </View>

          {/* Long-term vs Trading */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Holding vs Trading</Text>
            <Text style={styles.paragraph}>
              If you're holding crypto for a long time, monitoring is simple—just check your "Wallet" weekly to see your balance. If you're trading more, use the "Spot Trading" section to see live prices and decide if you want to buy or sell more. Our app's clear design makes it easy to find these sections.
            </Text>
          </View>

          {/* Stay Calm */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Don't Panic</Text>
            <Text style={styles.paragraph}>
              Don't panic if prices drop. Crypto is up and down, and small losses are part of learning. Use our app's learning hub to read tips on staying calm and monitoring smartly. By checking your trades regularly but not obsessively, you'll learn how crypto works and feel more confident.
            </Text>
          </View>
        </View>

        {/* Continue Button */}
        <TouchableOpacity style={styles.continueButton}>
          <Text style={styles.continueButtonText}>Continue Learning</Text>
        </TouchableOpacity>
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
    paddingTop: 55,
    paddingHorizontal: 18,
    paddingBottom: 16,
    backgroundColor: '#0A0F1E',
  },
  backButton: {
    padding: 8,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginLeft: 10,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerRight: {
    width: 40,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingBottom: 32,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 32,
    paddingTop: 16,
  },
  titleIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  mainTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 32,
  },
  contentContainer: {
    gap: 24,
  },
  section: {
    backgroundColor: '#23262F',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  sectionTitle: {
    color: '#F59E0B',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    lineHeight: 20,
    textDecorationLine: 'underline',
  },
  paragraph: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 12,
    textAlign: 'justify',
  },
  continueButton: {
    backgroundColor: '#F59E0B',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  continueButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});

export default BitbyLearnMonitorTrades; 