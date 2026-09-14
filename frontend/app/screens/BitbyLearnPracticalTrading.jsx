import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const BitbyLearnPracticalTrading = () => {
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
            <MaterialCommunityIcons name="handshake" size={32} color="#F59E0B" />
          </View>
          <Text style={styles.mainTitle}>Practical Trading</Text>
        </View>

        {/* Content Sections */}
        <View style={styles.contentContainer}>
          {/* Introduction */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Practical Trading</Text>
            <Text style={styles.paragraph}>
              Practical trading means using our app&apos;s tools to make real trades with confidence, building on your 1-2 years of experience. As an intermediate trader, you&apos;re ready to trade actively, use charts, and manage risks in a hands-on way. Let&apos;s walk through how to trade practically in our app, similar to Binance.
            </Text>
          </View>

          {/* Spot Trading */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Start with Spot Trading</Text>
            <Text style={styles.paragraph}>
              Start in the &quot;Spot Trading&quot; section, which is great for intermediate traders. Choose a coin like Bitcoin (BTC) or Ethereum (ETH). Look at the &quot;Markets&quot; section for a simple chart. Check the 50-day Moving Average—if the price is above it, it might be a good time to buy. For example, if Bitcoin is at $36,000 and above the average, enter a market order to buy $50 worth. Tap &quot;Buy&quot; to complete the trade.
            </Text>
          </View>

          {/* Limit Orders */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Try Limit Orders for Control</Text>
            <Text style={styles.paragraph}>
              Try limit orders for more control. In &quot;Spot Trading,&quot; set a buy price, like $35,000 for Bitcoin. If the price drops to that level, the app automatically buys for you. This is practical because you don&apos;t need to watch the market all day. Set a sell limit order too, like $40,000, to lock in profits if the price rises.
            </Text>
          </View>

          {/* Futures Trading */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experiment with Futures Trading</Text>
            <Text style={styles.paragraph}>
              Experiment with &quot;Futures Trading&quot; for short-term bets. Use low leverage, like 3x, to control a bigger position with less money. For example, with $100, you can trade $300 of Ethereum. Choose &quot;Isolated&quot; margin to limit risk to that trade. Use the app&apos;s &quot;Calculator&quot; to see potential profits or losses before trading. Check the &quot;Funding Rate&quot; to understand fees.
            </Text>
          </View>

          {/* Price Alerts */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Use Price Alerts for Updates</Text>
            <Text style={styles.paragraph}>
              Use &quot;Price Alerts&quot; to stay updated without stress. Set an alert for when Ethereum hits $2,500 to buy or $3,000 to sell. This keeps your trading practical and planned. Also, check the &quot;Order History&quot; section to review your trades—see what worked and what didn&apos;t to improve your skills.
            </Text>
          </View>

          {/* Diversification */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Diversify Your Trades</Text>
            <Text style={styles.paragraph}>
              Diversify your trades. Instead of putting all your money in one coin, split $200 between Bitcoin and Ethereum. This reduces risk if one coin&apos;s price drops. Your &quot;Wallet&quot; shows all your coins and their values, making it easy to track.
            </Text>
          </View>

          {/* Consistent Steps */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Small, Consistent Steps</Text>
            <Text style={styles.paragraph}>
              Practical trading means small, consistent steps. Use the app&apos;s learning hub to read about indicators or strategies, and practice with small amounts in &quot;Spot Trading&quot; or &quot;Futures Trading.&quot; Our app&apos;s clear interface, with charts and order options, makes trading straightforward. Trade regularly, review results, and keep learning!
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

export default BitbyLearnPracticalTrading; 