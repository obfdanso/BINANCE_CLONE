import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const BitbyLearnDevelopStrategy = () => {
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
            <MaterialCommunityIcons name="chart-line" size={32} color="#6366F1" />
          </View>
          <Text style={styles.mainTitle}>Develop a Strategy</Text>
        </View>

        {/* Content Sections */}
        <View style={styles.contentContainer}>
          {/* Introduction */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Develop a Strategy</Text>
            <Text style={styles.paragraph}>
              A strategy is like a plan for how you'll use crypto in our app. As a beginner, you don't need a complicated plan, but having a simple one helps you stay focused and avoid mistakes. Crypto can be exciting, but without a strategy, you might buy or sell at the wrong time and lose money. Let's make a basic plan that's easy to follow.
            </Text>
          </View>

          {/* First Steps */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>First Steps</Text>
            <Text style={styles.paragraph}>
              First, decide why you're using crypto. Do you want to hold it for a long time, hoping the price goes up? This is called "buy and hold," and it's great for beginners. Or do you want to trade, buying low and selling high to make small profits? In our app, you can do both. For now, let's focus on "buy and hold" since it's simpler.
            </Text>
          </View>

          {/* Choosing Cryptocurrencies */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Choosing Cryptocurrencies</Text>
            <Text style={styles.paragraph}>
              Start by picking one or two cryptocurrencies, like Bitcoin (BTC) or Ethereum (ETH). These are popular and less risky than smaller coins. Use the "Buy Crypto" section to purchase a small amount, like $10 of Bitcoin. Your strategy could be to hold it in your app's "Wallet" for a few months and check the price weekly in the "Markets" section.
            </Text>
          </View>

          {/* Setting a Budget */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Setting a Budget</Text>
            <Text style={styles.paragraph}>
              Next, set a budget. Only use money you can afford to lose, like extra cash, not money for bills. For example, decide to spend $20 a month on crypto. This keeps your strategy safe. Our app lets you set this up easily by limiting how much you deposit or buy.
            </Text>
          </View>

          {/* Learning Strategy */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Learning Strategy</Text>
            <Text style={styles.paragraph}>
              Another part of your strategy is learning. Spend a little time each week in our app's learning hub (like Binance Academy) to understand crypto better. Learn one new thing at a time, like what a "market order" is or how to read a price chart. This builds your confidence without overwhelming you.
            </Text>
          </View>

          {/* Sticking to Your Plan */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Stick to Your Plan</Text>
            <Text style={styles.paragraph}>
              Stick to your plan. Don't buy more just because prices are going up fast—that's called chasing the market and can lead to losses. Our app has tools like "Price Alerts" to notify you when a crypto hits a certain price, so you can stick to your strategy without checking all day.
            </Text>
          </View>

          {/* Growing Your Strategy */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Growing Your Strategy</Text>
            <Text style={styles.paragraph}>
              Your strategy can grow as you learn. For now, keep it simple: buy a small amount, hold it, learn a bit each week, and don't spend more than you planned. Our app's easy design, with clear buttons and guides, helps you follow your strategy without stress. Write down your plan in a notebook or in the app's notes section to stay on track.
            </Text>
          </View>

          {/* Trading Basics Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Trading Basics/Fundamental Analysis</Text>
            <Text style={styles.paragraph}>
              Trading in our app means buying and selling cryptocurrencies to make money or grow your crypto. As a beginner, you'll start with trading basics, which are simple ways to buy and sell. You'll also learn about fundamental analysis, which is a way to decide if a cryptocurrency is worth buying by looking at its value and purpose.
            </Text>
          </View>

          {/* Trading Basics */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Trading Basics</Text>
            <Text style={styles.paragraph}>
              Let's start with trading basics. In our app, the "Buy Crypto" section lets you buy crypto with regular money, like dollars. You can use the "Convert" feature to swap $10 into Bitcoin instantly at the current price—this is called a market order. Another option is a limit order, where you set a price you want to buy or sell at, and the trade happens when the price matches. You can try this in the "Spot Trading" section, which is like a marketplace for crypto.
            </Text>
          </View>

          {/* Timing and Charts */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Timing and Charts</Text>
            <Text style={styles.paragraph}>
              Trading is about timing. You might buy Bitcoin when its price is low and sell when it's high. Our app's "Markets" section shows price charts to help you see trends. Don't worry about complex charts yet—just look at whether the price is going up or down over a day or week.
            </Text>
          </View>

          {/* Fundamental Analysis */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Fundamental Analysis</Text>
            <Text style={styles.paragraph}>
              Now, let's talk about fundamental analysis. This means checking if a cryptocurrency is a good choice before buying. Ask simple questions: What does this crypto do? Is it popular? For example, Bitcoin is known as digital gold and is widely trusted. Ethereum powers apps like games or finance tools, so it's valuable too. You can read about coins in our app's learning hub or news section to understand their purpose.
            </Text>
          </View>

          {/* Research and Trust */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Research and Trust</Text>
            <Text style={styles.paragraph}>
              Look at the team behind the crypto. Is it made by trusted people? Check the app's coin info page for details. Also, see if the crypto is used a lot—Bitcoin and Ethereum are in many wallets, which is a good sign. Avoid coins with no clear use or that sound too good to be true.
            </Text>
          </View>

          {/* Using App Features */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Using App Features</Text>
            <Text style={styles.paragraph}>
              Our app makes this easy. Use the "Markets" section to see which coins are popular (high trading volume means more people use it). Start with well-known coins to keep things simple. Don't worry about numbers or math yet—just focus on understanding what the crypto does.
            </Text>
          </View>

          {/* Putting It All Together */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Putting It All Together</Text>
            <Text style={styles.paragraph}>
              Trading basics and fundamental analysis go together. For example, you might decide Bitcoin is a good buy because it's trusted (fundamental analysis), then use the "Buy Crypto" button to purchase $5 worth (trading basics). Practice small trades and check the app's guides to learn more. This builds your skills safely!
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
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
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
    color: '#6366F1',
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
    backgroundColor: '#6366F1',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#6366F1',
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

export default BitbyLearnDevelopStrategy; 