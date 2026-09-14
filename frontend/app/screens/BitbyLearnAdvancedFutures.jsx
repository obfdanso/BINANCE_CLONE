import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const BitbyLearnAdvancedFutures = () => {
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
            <MaterialCommunityIcons name="rocket-launch" size={32} color="#FF6B6B" />
          </View>
          <Text style={styles.mainTitle}>Advanced Usage of Futures</Text>
        </View>

        {/* Content Sections */}
        <View style={styles.contentContainer}>
          {/* Introduction */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Advanced Usage of Futures</Text>
            <Text style={styles.paragraph}>
              As an advanced trader with over 5 years of experience, you can leverage our app&apos;s &quot;Futures Trading&quot; section to execute sophisticated strategies with high leverage, maximizing profits while managing risks. Futures trading involves betting on a cryptocurrency&apos;s future price, using leverage to amplify your position. Our app, similar to Binance, offers powerful tools to support your advanced approach.
            </Text>
          </View>

          {/* Getting Started */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Getting Started with Advanced Futures</Text>
            <Text style={styles.paragraph}>
              Start in the &quot;Futures Trading&quot; section and choose between &quot;Cross&quot; or &quot;Isolated&quot; margin modes. Cross margin shares funds across positions for flexibility, while Isolated limits risk to one trade. For example, with $1,000, use 10x leverage to control a $10,000 Bitcoin (BTC) position. Select &quot;USD-M Futures&quot; for stablecoin-based contracts and use the &quot;Advanced&quot; interface for detailed charts and order books.
            </Text>
          </View>

          {/* Advanced Strategies */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Advanced Trading Strategies</Text>
            <Text style={styles.paragraph}>
              Use advanced strategies like scalping or swing trading. For scalping, make quick trades (e.g., $100 on Ethereum (ETH) with 20x leverage) to capture small price moves, like $50 gains in an hour. Check the &quot;Order Book&quot; to spot tight bid-ask spreads for fast entries and exits. For swing trading, hold positions for days, using the app&apos;s &quot;Price Alerts&quot; to track key levels, like BTC at $60,000. Use the &quot;Calculator&quot; to estimate profits and funding fees, which are charged every 8 hours.
            </Text>
          </View>

          {/* Automated Trading */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Integrating Automated Trading</Text>
            <Text style={styles.paragraph}>
              Integrate automated trading via our app&apos;s API. Connect a bot to execute high-frequency trades based on your strategy, like buying ETH when it crosses the 20-day EMA. Test your bot with small amounts in &quot;Futures Trading&quot; to ensure accuracy. Monitor funding rates in the app to avoid high costs during volatile markets.
            </Text>
          </View>

          {/* Hedging */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Hedging Your Portfolio</Text>
            <Text style={styles.paragraph}>
              Hedge your portfolio to reduce risk. If you hold $10,000 in BTC in your &quot;Wallet,&quot; open a short futures position with 5x leverage to profit if prices fall. Use the &quot;Portfolio Management&quot; section to balance spot and futures positions. Check &quot;Order History&quot; to analyze trade performance and refine strategies.
            </Text>
          </View>

          {/* Risk Management */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Advanced Risk Management</Text>
            <Text style={styles.paragraph}>
              Our app&apos;s real-time charts, with indicators like Bollinger Bands or MACD, help you time entries and exits. Advanced futures trading is high-risk, so use only 1-2% of your capital per trade. With tools like API access, detailed order books, and customizable alerts, our app supports your complex futures strategies for maximum efficiency.
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
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
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
    color: '#FF6B6B',
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
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#FF6B6B',
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

export default BitbyLearnAdvancedFutures; 