import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const BitbyLearnCryptocurrencies = () => {
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
            <MaterialCommunityIcons name="currency-btc" size={32} color="#F7931A" />
          </View>
          <Text style={styles.mainTitle}>About Cryptocurrencies</Text>
        </View>

        {/* Content Sections */}
        <View style={styles.contentContainer}>
          {/* Introduction */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Welcome to the world of cryptocurrencies!</Text>
            <Text style={styles.paragraph}>
              Cryptocurrencies, or &quot;crypto,&quot; are digital money that exist only online, not as physical coins or bills. They use special technology called blockchain to keep transactions safe and secure. Think of blockchain like a digital notebook that records every trade or transfer, and no one can change it once it&apos;s written.
            </Text>
            <Text style={styles.paragraph}>
              Bitcoin (BTC) and Ethereum (ETH) are the most popular cryptocurrencies, but there are thousands of others, like Binance Coin (BNB) or Dogecoin (DOGE).
            </Text>
          </View>

          {/* How Crypto Works */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>How Crypto Works</Text>
            <Text style={styles.paragraph}>
              Crypto is different from regular money because no bank or government controls it. Instead, it&apos;s run by computers all over the world. This makes it fast to send anywhere, but it can also be confusing at first.
            </Text>
            <Text style={styles.paragraph}>
              In our app, you can buy, sell, or hold crypto in a digital wallet, which is like a bank account for your crypto. You don&apos;t need to know everything right away—just start with the basics.
            </Text>
          </View>

          {/* Getting Started */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Getting Started</Text>
            <Text style={styles.paragraph}>
              Our app makes it easy to get started. You can buy crypto using regular money (like dollars or euros) through simple buttons like &quot;Buy Crypto.&quot; For example, you can spend $10 to get some Bitcoin.
            </Text>
            <Text style={styles.paragraph}>
              The price of crypto changes a lot, sometimes even in a day, because it depends on what people are willing to pay. This is called volatility, and it&apos;s normal in crypto.
            </Text>
          </View>

          {/* Why Use Crypto */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Why do people use crypto?</Text>
            <Text style={styles.paragraph}>
              Some use it to buy things online, others hold it hoping the price goes up, and some trade it to make money. In our app, you&apos;ll see sections like &quot;Markets&quot; to check prices and &quot;Wallet&quot; to store your crypto safely.
            </Text>
            <Text style={styles.paragraph}>
              We also have guides in the app to explain terms like &quot;wallet&quot; or &quot;exchange.&quot; Crypto can feel overwhelming, but you don&apos;t need to be an expert. Start slow, explore the app, and learn as you go!
            </Text>
          </View>

          {/* Safety Warning */}
          <View style={styles.warningSection}>
            <View style={styles.warningIconContainer}>
              <Ionicons name="shield-checkmark" size={24} color="#FFA726" />
            </View>
            <Text style={styles.warningTitle}>Important Safety Information</Text>
            <Text style={styles.warningText}>
              Be careful, though—crypto isn&apos;t like a savings account. Prices can drop fast, and you could lose money. Only use money you can afford to lose, like extra cash, not your rent or grocery money.
            </Text>
            <Text style={styles.warningText}>
              Our app has tools like &quot;Security Settings&quot; to protect your account with passwords and two-factor authentication (2FA), which adds an extra step to log in safely. Take your time to explore and ask questions using our help section. Crypto is exciting, and we&apos;re here to guide you every step of the way!
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
    backgroundColor: 'rgba(247, 147, 26, 0.2)',
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

export default BitbyLearnCryptocurrencies; 