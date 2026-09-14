import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const BitbyLearnTradingPsychology = () => {
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
            <MaterialCommunityIcons name="brain" size={32} color="#10B981" />
          </View>
          <Text style={styles.mainTitle}>Trading Psychology</Text>
        </View>

        {/* Content Sections */}
        <View style={styles.contentContainer}>
          {/* Introduction */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Trading Psychology</Text>
            <Text style={styles.paragraph}>
              Trading psychology is about controlling your emotions and thoughts while trading in our app. With 1-2 years of experience, you've seen how crypto prices can make you excited, scared, or greedy. Managing these feelings helps you make smarter trades and avoid mistakes. Let's learn how to stay calm and focused.
            </Text>
          </View>

          {/* Emotional Trading */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Understanding Emotional Trading</Text>
            <Text style={styles.paragraph}>
              Crypto prices move fast, and it's easy to feel emotional. For example, if you buy $100 of Ethereum (ETH) in the "Spot Trading" section and it jumps to $120, you might want to buy more out of excitement. Or if it drops to $80, you might sell in panic. These are emotional trades, and they often lead to losses. Our app's tools can help you stay steady.
            </Text>
          </View>

          {/* Having a Plan */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Start with a Clear Plan</Text>
            <Text style={styles.paragraph}>
              Start by having a clear plan. In the "Markets" section, check charts and set a goal, like buying Bitcoin (BTC) at $35,000 and selling at $40,000. Stick to this plan, even if prices spike or crash. Use "Price Alerts" to get notified only when prices hit your target, so you don't check the app all day and get stressed.
            </Text>
          </View>

          {/* Taking Breaks */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Take Breaks When Needed</Text>
            <Text style={styles.paragraph}>
              Another tip is to take breaks. If you lose a trade in the "Futures Trading" section, don't jump into another trade to "win it back." Close the app, take a walk, or read a guide in our learning hub. This clears your mind. Check your "Order History" later to see what went wrong and learn from it.
            </Text>
          </View>

          {/* Managing Greed */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Managing Greed and Fear</Text>
            <Text style={styles.paragraph}>
              Greed is a big challenge. If a coin's price is soaring in the "Markets" section, you might want to risk more money. Instead, stick to your risk limit, like 1% of your account per trade. Our app's "Wallet" shows your balance, so you can see what you can afford. Similarly, don't panic-sell if prices drop—check the chart to see if it's a normal dip.
            </Text>
          </View>

          {/* Self-Coaching */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Talk to Yourself Like a Coach</Text>
            <Text style={styles.paragraph}>
              Talk to yourself like a coach. Before a trade, ask, "Is this part of my plan?" If not, wait. Use the app's "Notes" feature (if available) to write your trading goals and read them when you're emotional. Also, try small trades in "Spot Trading" to build confidence without big risks.
            </Text>
          </View>

          {/* Using App Tools */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Using App Tools for Focus</Text>
            <Text style={styles.paragraph}>
              Our app's simple design, with clear charts and alerts, helps you stay focused. Trading psychology takes practice, but by planning, taking breaks, and using the app's tools, you'll trade with a clear head and better results.
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

export default BitbyLearnTradingPsychology; 