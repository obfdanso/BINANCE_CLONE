import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const BitbyLearnBeginnerOptions = () => {
  const router = useRouter();

  const learningOptions = [
    {
      id: 'cryptocurrencies',
      title: 'Cryptocurrencies. What are they?',
      description: 'Learn the basics of digital currencies',
      icon: 'currency-btc',
      color: '#F7931A'
    },
    {
      id: 'start-small',
      title: 'Start Small',
      description: 'Begin your crypto journey with small investments',
      icon: 'trending-up',
      color: '#00C896'
    },
    {
      id: 'develop-strategy',
      title: 'Develop a Strategy',
      description: 'Create a plan for your crypto journey',
      icon: 'chart-line',
      color: '#6366F1'
    },
    {
      id: 'risk-management',
      title: 'Risk Management',
      description: 'Keep your money safe while using crypto',
      icon: 'shield-check',
      color: '#EF4444'
    },
    {
      id: 'emotional-trading',
      title: 'Emotional Trading',
      description: 'Stay calm and make smart trading decisions',
      icon: 'heart-pulse',
      color: '#8B5CF6'
    },
    {
      id: 'opening-first-trade',
      title: 'Opening Your First Trade',
      description: 'Learn how to make your first crypto trade',
      icon: 'play-circle',
      color: '#10B981'
    },
    {
      id: 'monitor-trades',
      title: 'Monitor Trades',
      description: 'Track your crypto investments effectively',
      icon: 'eye',
      color: '#F59E0B'
    }
  ];

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
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Welcome to BitbyLearn Beginner's Page</Text>
          <Text style={styles.welcomeSubtitle}>Select an option to continue:</Text>
        </View>

        {/* Learning Options */}
        <View style={styles.optionsContainer}>
          {learningOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.optionCard}
              onPress={() => {
                // Handle option selection - you can add navigation logic here
                console.log(`Selected: ${option.title}`);
                if (option.id === 'cryptocurrencies') {
                  router.push('/screens/BitbyLearnCryptocurrencies');
                } else if (option.id === 'start-small') {
                  router.push('/screens/BitbyLearnStartSmall');
                } else if (option.id === 'develop-strategy') {
                  router.push('/screens/BitbyLearnDevelopStrategy');
                } else if (option.id === 'risk-management') {
                  router.push('/screens/BitbyLearnRiskManagement');
                } else if (option.id === 'emotional-trading') {
                  router.push('/screens/BitbyLearnEmotionalTrading');
                } else if (option.id === 'opening-first-trade') {
                  router.push('/screens/BitbyLearnOpeningFirstTrade');
                } else if (option.id === 'monitor-trades') {
                  router.push('/screens/BitbyLearnMonitorTrades');
                }
              }}
            >
              <View style={styles.optionIconContainer}>
                <MaterialCommunityIcons
                  name={option.icon}
                  size={28}
                  color={option.color}
                />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>{option.title}</Text>
                <Text style={styles.optionDescription}>{option.description}</Text>
              </View>
              <View style={styles.optionArrow}>
                <Ionicons name="chevron-forward" size={20} color="#888" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
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
    marginLeft: 5,
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
  welcomeSection: {
    marginBottom: 32,
    paddingTop: 16,
  },
  welcomeTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
  },
  optionsContainer: {
    gap: 16,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#23262F',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  optionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  optionDescription: {
    color: '#888',
    fontSize: 14,
  },
  optionArrow: {
    marginLeft: 12,
  },
});

export default BitbyLearnBeginnerOptions; 