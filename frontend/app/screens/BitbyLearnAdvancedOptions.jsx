import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const BitbyLearnAdvancedOptions = () => {
  const router = useRouter();

  const learningOptions = [
    {
      id: 'advanced-futures',
      title: 'Advanced Use Of Futures',
      description: 'Master sophisticated futures trading strategies',
      icon: 'rocket-launch',
      color: '#FF6B6B'
    },
    {
      id: 'margin-trading',
      title: 'Margin Trading',
      description: 'Amplify returns with borrowed funds and advanced strategies',
      icon: 'chart-line',
      color: '#4ECDC4'
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
          <Text style={styles.welcomeTitle}>Welcome to BitbyLearn Advanced&apos;s Page</Text>
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
                if (option.id === 'advanced-futures') {
                  router.push('/screens/BitbyLearnAdvancedFutures');
                } else if (option.id === 'margin-trading') {
                  router.push('/screens/BitbyLearnMarginTrading');
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

export default BitbyLearnAdvancedOptions; 