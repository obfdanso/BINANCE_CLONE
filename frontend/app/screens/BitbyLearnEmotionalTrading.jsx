import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const BitbyLearnEmotionalTrading = () => {
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
            <MaterialCommunityIcons name="heart-pulse" size={32} color="#8B5CF6" />
          </View>
          <Text style={styles.mainTitle}>Emotional Trading</Text>
        </View>

        {/* Content Sections */}
        <View style={styles.contentContainer}>
          {/* Introduction */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Emotional Trading</Text>
            <Text style={styles.paragraph}>
              Emotional trading is when you buy or sell crypto because of feelings, like excitement or fear, instead of a plan. As a beginner in our app, it's easy to get emotional because crypto prices move fast. Learning to stay calm helps you make better choices and avoid mistakes.
            </Text>
          </View>

          {/* Example Scenario */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Understanding Emotional Decisions</Text>
            <Text style={styles.paragraph}>
              Imagine you buy $10 of Bitcoin in our app's "Buy Crypto" section. The price jumps to $12, and you're excited to buy more. Or it drops to $8, and you're scared to lose money, so you sell quickly. These are emotional decisions, and they can lead to losses. Our app is designed to help you stay steady.
            </Text>
          </View>

          {/* Following a Plan */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Follow a Simple Plan</Text>
            <Text style={styles.paragraph}>
              To avoid emotional trading, follow a simple plan. For example, decide to buy $10 of Ethereum every month and hold it, no matter what the price does. This is called a strategy, and you can set it up in the "Buy Crypto" section. Stick to your plan, even if prices are going up or down fast.
            </Text>
          </View>

          {/* Avoiding Constant Checking */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Avoid Constant Price Checking</Text>
            <Text style={styles.paragraph}>
              Another tip is to avoid checking prices all the time. Constantly looking at the "Markets" section can make you nervous if prices drop or greedy if they rise. Instead, check your "Wallet" once a week. Our app also has "Price Alerts" you can set to notify you only when a price hits a certain level, so you don't need to watch constantly.
            </Text>
          </View>

          {/* Taking Breaks */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Take Breaks When Emotional</Text>
            <Text style={styles.paragraph}>
              When you feel emotional, take a break. If Bitcoin's price crashes and you're worried, don't sell right away. Step away, read a guide in our app's learning hub, or take a walk. Prices often recover, and our app's charts in the "Markets" section can show you how prices change over time, not just one day.
            </Text>
          </View>

          {/* Self-Talk */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Talk to Yourself Like a Friend</Text>
            <Text style={styles.paragraph}>
              Talk to yourself like a friend. Ask, "Would I tell a friend to sell everything because the price dropped?" Probably not. Use our app's "Order History" to see your past trades and remind yourself why you bought the crypto. This helps you stay calm and focused.
            </Text>
          </View>

          {/* Learning from Mistakes */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Learn from Small Mistakes</Text>
            <Text style={styles.paragraph}>
              Finally, learn from small mistakes. If you buy $5 of a coin and lose $1 because you sold too soon, that's okay—it's a lesson. Our app's simple design, with clear buttons and guides, helps you stay in control. By avoiding emotional trading, you'll make smarter choices and enjoy crypto more.
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

export default BitbyLearnEmotionalTrading; 