import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const BitbyLearnIntermediateStrategies = () => {
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
            <MaterialCommunityIcons name="chart-candlestick" size={32} color="#8B5CF6" />
          </View>
          <Text style={styles.mainTitle}>Intermediate Trading Strategies</Text>
        </View>

        {/* Content Sections */}
        <View style={styles.contentContainer}>
          {/* Introduction */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Intermediate Trading Strategies</Text>
            <Text style={styles.paragraph}>
              As an intermediate trader, you can use smarter strategies in our app to improve your trades. These include Technical Analysis, Market Analysis, Risk Management, and Copy Trading. With 1-2 years of experience, you're ready to use these tools to make better decisions. Let's explore how to use them in our app.
            </Text>
          </View>

          {/* Technical Analysis */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Technical Analysis</Text>
            <Text style={styles.paragraph}>
              Technical Analysis means using charts to predict price movements. In the "Markets" section, select a coin like Bitcoin (BTC) and view its chart. Look at simple indicators like Moving Averages (lines showing average prices over time). If the price is above the 50-day moving average, it might keep rising. Try the "Classic" view for easier charts. Set "Price Alerts" to know when prices cross key levels, like $40,000 for Bitcoin. Practice spotting patterns, like prices bouncing back after hitting a low point (support).
            </Text>
          </View>

          {/* Market Analysis */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Market Analysis</Text>
            <Text style={styles.paragraph}>
              Market Analysis is about understanding what affects prices. Check the app's news section or learning hub for updates, like new laws or big companies buying crypto. For example, if a company supports Ethereum (ETH), its price might rise. Also, look at trading volume in the "Markets" section—high volume means more people are trading, which can signal a trend. Combine this with technical analysis to decide when to buy or sell.
            </Text>
          </View>

          {/* Risk Management */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Risk Management</Text>
            <Text style={styles.paragraph}>
              Risk Management keeps your money safe. Never risk more than 1-2% of your account on one trade. For example, if you have $1,000 in your "Wallet," risk only $10-$20 per trade. Use stop-loss orders in the "Spot Trading" or "Futures Trading" sections to automatically sell if a price drops too low (e.g., sell Bitcoin if it falls to $35,000). Diversify by trading two or three coins, like BTC and ETH, to spread risk. Check your "Order History" to review losses and adjust.
            </Text>
          </View>

          {/* Copy Trading */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Copy Trading</Text>
            <Text style={styles.paragraph}>
              Copy Trading lets you follow experienced traders. In our app's "Copy Trading" section (if available, similar to Binance), you can see top traders' strategies and copy their trades with a small amount, like $50. This is great for learning while trading. Choose traders with consistent profits and low-risk styles, shown in their performance stats.
            </Text>
          </View>

          {/* Using Strategies Together */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Using Strategies Together</Text>
            <Text style={styles.paragraph}>
              Use these strategies together. For example, use technical analysis to find a good buy price, market analysis to confirm the coin's potential, risk management to limit losses, and copy trading to learn from pros. Practice in the "Spot Trading" section with small amounts, and use the app's tools to stay organized and confident.
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
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
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
    color: '#8B5CF6',
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
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#8B5CF6',
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

export default BitbyLearnIntermediateStrategies; 