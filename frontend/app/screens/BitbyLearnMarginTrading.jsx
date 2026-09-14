import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const BitbyLearnMarginTrading = () => {
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
            <MaterialCommunityIcons name="chart-line" size={32} color="#4ECDC4" />
          </View>
          <Text style={styles.mainTitle}>Margin Trading</Text>
        </View>

        {/* Content Sections */}
        <View style={styles.contentContainer}>
          {/* Introduction */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Margin Trading</Text>
            <Text style={styles.paragraph}>
              With over 5 years of trading experience, you can use our app&apos;s &quot;Margin Trading&quot; section to amplify returns by borrowing funds, employing advanced strategies like leveraged long/short positions or portfolio hedging. Margin trading lets you trade with more money than you have, but it requires precision to manage risks. Our app, like Binance, offers robust tools for advanced margin trading.
            </Text>
          </View>

          {/* Getting Started */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Getting Started with Margin Trading</Text>
            <Text style={styles.paragraph}>
              In the &quot;Margin Trading&quot; section, transfer funds from your &quot;Wallet&quot; to a margin account. Choose &quot;Cross Margin&quot; to share borrowed funds across trades or &quot;Isolated Margin&quot; to limit risk to one position. For example, with $2,000, use 10x leverage to control a $20,000 position in Ethereum (ETH). Select a trading pair like ETH/USDT and use the &quot;Advanced&quot; interface for detailed charts and order books.
            </Text>
          </View>

          {/* Advanced Strategies */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Advanced Margin Strategies</Text>
            <Text style={styles.paragraph}>
              Execute strategies like pair trading. If you believe Bitcoin (BTC) will outperform Binance Coin (BNB), go long on BTC/USDT and short BNB/USDT with 5x leverage each. Monitor correlations in the &quot;Markets&quot; section to confirm your thesis. Use the &quot;Order Book&quot; to spot liquidity for quick entries and exits, minimizing slippage.
            </Text>
          </View>

          {/* Hedging */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Hedging Spot Holdings</Text>
            <Text style={styles.paragraph}>
              Hedge spot holdings to protect your portfolio. If you own $10,000 in ETH in your &quot;Wallet,&quot; borrow funds to short ETH in &quot;Margin Trading&quot; to offset potential losses if prices drop. Adjust leverage dynamically based on market volatility, shown in the app&apos;s &quot;Markets&quot; charts. Use low leverage (3x-5x) in choppy markets to avoid liquidations.
            </Text>
          </View>

          {/* Automation */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Integrating Automation</Text>
            <Text style={styles.paragraph}>
              Integrate margin trading with our app&apos;s API for automation. Set up a bot to monitor price spreads and execute trades when conditions align, like buying BTC at a support level. Test with small amounts to avoid errors. Check &quot;Margin Levels&quot; in the app to ensure your account stays above the liquidation threshold.
            </Text>
          </View>

          {/* Risk Management */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Risk Management & Fees</Text>
            <Text style={styles.paragraph}>
              Pay attention to borrowing fees, updated daily in the &quot;Margin Trading&quot; section. Use &quot;Order History&quot; to track performance and optimize your strategy. Combine margin trades with stop-loss orders to limit losses, set via the app&apos;s order panel. With tools like real-time charts, API access, and portfolio tracking, our app empowers you to execute complex margin strategies effectively.
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
    backgroundColor: 'rgba(78, 205, 196, 0.2)',
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
    color: '#4ECDC4',
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
    backgroundColor: '#4ECDC4',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#4ECDC4',
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

export default BitbyLearnMarginTrading; 