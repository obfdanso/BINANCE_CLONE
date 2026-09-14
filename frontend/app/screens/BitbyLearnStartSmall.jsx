import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const BitbyLearnStartSmall = () => {
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
            <MaterialCommunityIcons name="trending-up" size={32} color="#00C896" />
          </View>
          <Text style={styles.mainTitle}>Start Small</Text>
        </View>

        {/* Content Sections */}
        <View style={styles.contentContainer}>
          {/* Introduction */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Start Small</Text>
            <Text style={styles.paragraph}>
              As a beginner in our app, the best way to start with cryptocurrencies is to start small. This means using only a little money to buy or trade crypto while you learn how it works. Crypto prices can go up and down quickly, so starting small keeps things safe and less stressful. For example, instead of spending $1,000, try $10 or $20 to get a feel for the app and the market.
            </Text>
          </View>

          {/* How to Use the App */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>How to Use Our App</Text>
            <Text style={styles.paragraph}>
              In our app, you can use the "Buy Crypto" section to start. This lets you turn regular money (like dollars or euros) into crypto, like Bitcoin or Ethereum, with just a few taps. You can use a credit card, bank account, or even apps like PayPal in the "P2P Trading" section, where you buy directly from other people. Start with a small amount, like $5, to see how it feels to own crypto.
            </Text>
          </View>

          {/* Why Start Small */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Why Start Small?</Text>
            <Text style={styles.paragraph}>
              It helps you learn without risking too much. If the price drops, you won't lose a lot, and if it goes up, you'll see how crypto can grow. Our app's "Wallet" section shows your crypto balance, so you can check what you own anytime. It's like checking your bank account, but for digital money.
            </Text>
          </View>

          {/* Exploring the App */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Exploring the App</Text>
            <Text style={styles.paragraph}>
              Starting small also gives you time to explore the app. Try looking at the "Markets" section to see how prices change. You might notice Bitcoin's price moves a lot in a day—that's normal! You can also use the "Binance Academy" section (or our app's learning hub) to watch short videos or read guides about crypto. These explain things like how to store crypto safely or what "market price" means.
            </Text>
          </View>

          {/* Practice and Confidence */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Practice and Build Confidence</Text>
            <Text style={styles.paragraph}>
              Don't feel pressured to do big trades right away. Many beginners make the mistake of spending too much too soon and get worried when prices drop. By starting small, you can practice using the app, like sending a tiny amount of crypto to your wallet or selling a small bit back to dollars. Our app makes this easy with clear buttons and instructions.
            </Text>
          </View>

          {/* Gift Cards and Gradual Increase */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Gift Cards and Gradual Growth</Text>
            <Text style={styles.paragraph}>
              If you're unsure, try the "Gift Card" section to add a small amount to your account using a Binance Gift Card. It's a simple way to start without linking a bank account. As you get comfortable, you can slowly increase your investment. Starting small builds confidence, and our app is designed to help you learn at your own pace while keeping your money safe.
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
    backgroundColor: 'rgba(0, 200, 150, 0.2)',
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
    color: '#00C896',
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
  warningSection: {
    backgroundColor: '#2A1A0A',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#FFA726',
  },
  warningIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 167, 38, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  warningTitle: {
    color: '#FFA726',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    lineHeight: 20,
  },
  warningText: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 12,
    textAlign: 'justify',
  },
  continueButton: {
    backgroundColor: '#00C896',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#00C896',
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

export default BitbyLearnStartSmall; 