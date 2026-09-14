import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const BitbyLearnTradingMode = () => {
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
            <MaterialCommunityIcons name="target" size={32} color="#3B82F6" />
          </View>
          <Text style={styles.mainTitle}>Choose Your Trading Mode</Text>
        </View>

        {/* Content Sections */}
        <View style={styles.contentContainer}>
          {/* Introduction */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Choose Your Trading Mode</Text>
            <Text style={styles.paragraph}>
              As an intermediate trader with 1-2 years of experience, you're ready to explore more advanced trading modes in our app, like Margin Trading and Futures Trading. These modes let you trade with more money than you have, but they come with higher risks. Let's break them down so you can choose what works for you, using our app's features.
            </Text>
          </View>

          {/* Margin Trading */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Margin Trading</Text>
            <Text style={styles.paragraph}>
              Margin Trading lets you borrow money from the app to trade bigger amounts. For example, if you have $100, you might borrow $200 more to trade with $300 total. This is called leverage, and our app offers low-leverage options like 3x (three times your money). Go to the "Margin Trading" section, transfer funds from your "Wallet," and choose a coin like Bitcoin (BTC). You can buy or sell, but you'll pay a small fee for borrowing. If the price moves your way, you make more profit, but if it goes against you, losses are bigger too. Start with low leverage to stay safe.
            </Text>
          </View>

          {/* Futures Trading */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Futures Trading</Text>
            <Text style={styles.paragraph}>
              Futures Trading is about betting on a coin's future price. In our app's "Futures Trading" section, you can choose "Cross" (sharing funds across trades) or "Isolated" (using funds for one trade only) margin modes. For example, with $100, you can use 3x leverage to control a $300 position in Ethereum (ETH). You pick if the price will go up (long) or down (short). If you're right, you earn more; if wrong, you lose more. Futures have daily fees, so check the "Funding Rate" in the app. Use the "Classic" futures interface for simpler controls.
            </Text>
          </View>

          {/* Which Should You Choose */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Which Should You Choose?</Text>
            <Text style={styles.paragraph}>
              Margin Trading is good for holding trades a few days, while Futures Trading suits quick trades based on price predictions. Try Futures with low leverage first, as it's more flexible. Go to "Futures Trading," start with a small amount like $50, and use the app's "Calculator" to see potential profits or losses. Both modes are riskier than spot trading, so only use money you can afford to lose.
            </Text>
          </View>

          {/* Getting Started */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Getting Started</Text>
            <Text style={styles.paragraph}>
              Our app makes it easy with clear buttons in the "Margin" or "Futures" sections. Check the "Markets" section for price trends before trading, and use "Order History" to track your trades. Read guides in our learning hub (like Binance Academy) to learn more about leverage. Start small, practice, and choose the mode that fits your style!
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
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
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
    color: '#3B82F6',
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
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#3B82F6',
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

export default BitbyLearnTradingMode; 