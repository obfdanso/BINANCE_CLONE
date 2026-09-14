import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const BitbyLearnOpeningFirstTrade = () => {
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
            <MaterialCommunityIcons name="play-circle" size={32} color="#10B981" />
          </View>
          <Text style={styles.mainTitle}>Open Your First Trade</Text>
        </View>

        {/* Content Sections */}
        <View style={styles.contentContainer}>
          {/* Introduction */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Open Your First Trade</Text>
            <Text style={styles.paragraph}>
              Opening your first trade in our app is exciting and easy! A trade is when you buy or sell cryptocurrency, like Bitcoin or Ethereum, using our app's tools. As a beginner, we'll guide you through the steps to make your first trade simple and safe, so you can start with confidence.
            </Text>
          </View>

          {/* Adding Money */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Step 1: Add Money to Your Account</Text>
            <Text style={styles.paragraph}>
              First, make sure you have money in your account. Go to the "Buy Crypto" section and choose "Deposit" to add money using a credit card, bank transfer, or even a Binance Gift Card. Start small, like $10, to keep things low-risk. This money goes to your app's "Wallet," where you can use it to trade.
            </Text>
          </View>

          {/* First Trade */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Step 2: Make Your First Trade</Text>
            <Text style={styles.paragraph}>
              Now, let's open a trade. Go to the "Buy Crypto" section and select "Convert." This is the easiest way to trade as a beginner. Choose a cryptocurrency, like Bitcoin (BTC), and enter how much you want to buy, like $10. The app shows you how much Bitcoin you'll get based on the current price. Tap "Confirm," and you've made your first trade! The Bitcoin goes to your "Wallet."
            </Text>
          </View>

          {/* Spot Trading */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Step 3: Try Spot Trading</Text>
            <Text style={styles.paragraph}>
              If you want to try another way, go to the "Spot Trading" section. This is like a marketplace where you can buy or sell crypto. Choose a coin, like Ethereum (ETH), and select "Market" to buy at the current price. Enter a small amount, like $5, and tap "Buy." It's that simple! The app shows you the price and confirms the trade instantly.
            </Text>
          </View>

          {/* Check Prices */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Step 4: Check Prices First</Text>
            <Text style={styles.paragraph}>
              Before trading, check the "Markets" section to see the price of your chosen coin. Prices change fast, so don't worry if it's different in a few minutes. For your first trade, stick to popular coins like Bitcoin or Ethereum—they're safer for beginners. You can read about them in our app's learning hub to understand why they're trusted.
            </Text>
          </View>

          {/* Take Your Time */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Step 5: Don't Rush</Text>
            <Text style={styles.paragraph}>
              Don't rush. If you're nervous, practice with a tiny amount, like $5, to see how it works. Our app's clear buttons and instructions make it easy to follow along. After your trade, check your "Wallet" to see your new crypto balance. You did it!
            </Text>
          </View>

          {/* Selling Later */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Step 6: Selling Your Crypto</Text>
            <Text style={styles.paragraph}>
              If you want to sell later, go back to "Convert" or "Spot Trading" and choose "Sell." The app will guide you to turn your crypto back into dollars or another currency. For now, enjoy your first trade and explore the app's features, like "Price Alerts," to learn more about crypto.
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
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
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
    color: '#10B981',
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
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#10B981',
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

export default BitbyLearnOpeningFirstTrade; 