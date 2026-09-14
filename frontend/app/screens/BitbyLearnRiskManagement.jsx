import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const BitbyLearnRiskManagement = () => {
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
            <MaterialCommunityIcons name="shield-check" size={32} color="#EF4444" />
          </View>
          <Text style={styles.mainTitle}>Risk Management</Text>
        </View>

        {/* Content Sections */}
        <View style={styles.contentContainer}>
          {/* Introduction */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Risk Management</Text>
            <Text style={styles.paragraph}>
              Risk management means keeping your money safe while using crypto in our app. Crypto prices can change fast, and you could lose money if you&apos;re not careful. As a beginner, you can use simple steps to lower risks and feel more confident while trading or holding crypto.
            </Text>
          </View>

          {/* First Rule */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>The First Rule</Text>
            <Text style={styles.paragraph}>
              The first rule is to only use money you can afford to lose. Crypto is exciting, but it&apos;s not like a bank account—prices can drop suddenly. For example, if you have $100 extra cash, use $10 for crypto, not your rent money. Our app&apos;s &quot;Buy Crypto&quot; section lets you set small amounts, like $5 or $10, to start safely.
            </Text>
          </View>

          {/* Choosing Safe Cryptocurrencies */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Choosing Safe Cryptocurrencies</Text>
            <Text style={styles.paragraph}>
              Another way to manage risk is to start with well-known cryptocurrencies, like Bitcoin (BTC) or Ethereum (ETH). These are less likely to lose all their value compared to smaller, unknown coins. You can find these in the &quot;Markets&quot; section, where popular coins are listed at the top.
            </Text>
          </View>

          {/* Diversification */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Diversification</Text>
            <Text style={styles.paragraph}>
              Don&apos;t put all your money in one crypto—this is called diversification. If you have $20, maybe buy $10 of Bitcoin and $10 of Ethereum. This way, if one coin&apos;s price drops, the other might still do okay. Our app&apos;s &quot;Wallet&quot; shows all your coins, so you can see your balance easily.
            </Text>
          </View>

          {/* Setting Limits */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Setting Limits</Text>
            <Text style={styles.paragraph}>
              Set limits on your trades. For example, decide you&apos;ll only spend $20 a month on crypto. Stick to this plan, even if prices are going up and you&apos;re excited. Our app lets you deposit small amounts so you don&apos;t overspend. You can also set &quot;Price Alerts&quot; to know when a coin&apos;s price changes, so you don&apos;t have to watch it all day.
            </Text>
          </View>

          {/* Account Protection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Protect Your Account</Text>
            <Text style={styles.paragraph}>
              Protect your account to avoid losing your crypto to hackers. Use the &quot;Security Settings&quot; in our app to turn on two-factor authentication (2FA). This means you&apos;ll need a code from your phone to log in, making your account safer. Also, never share your password or account details with anyone.
            </Text>
          </View>

          {/* Patience */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Be Patient</Text>
            <Text style={styles.paragraph}>
              Finally, be patient. Crypto prices can go up and down in hours. Don&apos;t panic if your $10 of Bitcoin drops to $8—it might go up later. Check your &quot;Wallet&quot; weekly, not hourly, to avoid stress. Our app has tools and guides to help you stay calm and make smart choices while keeping risks low.
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
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
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
    color: '#EF4444',
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
    backgroundColor: '#EF4444',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#EF4444',
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

export default BitbyLearnRiskManagement; 