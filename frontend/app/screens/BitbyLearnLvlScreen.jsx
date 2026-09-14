import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';


const BitbyLearnLvlScreen = () => {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const router = useRouter();

  const experienceLevels = [
    {
      id: 'beginner',
      title: 'Beginner',
      description: 'No trading experience',
      icon: 'school-outline',
      color: '#00C896',
      bgColor: '#0A1F1A',
      borderColor: '#00C896',
      features: [
        'Learn the basics of crypto',
        'Start with simple trades',
        'Guided tutorials available'
      ]
    },
    {
      id: 'intermediate',
      title: 'Intermediate',
      description: '1-2 years experience',
      icon: 'trending-up',
      color: '#FFA726',
      bgColor: '#1A1A0A',
      borderColor: '#FFA726',
      features: [
        'Advanced trading strategies',
        'Risk management tools',
        'Portfolio optimization'
      ]
    },
    {
      id: 'advanced',
      title: 'Advanced',
      description: '3+ years experience',
      icon: 'rocket-launch',
      color: '#FF6B6B',
      bgColor: '#1A0A0A',
      borderColor: '#FF6B6B',
      features: [
        'Professional trading tools',
        'Advanced analytics',
        'Custom strategies'
      ]
    }
  ];

  const handleLevelSelect = (level) => {
    setSelectedLevel(level.id);
    // You can add navigation logic here
    // router.push('/screens/NextScreen');
  };

  const handleContinue = () => {
    if (selectedLevel) {
      // Navigate to next screen with selected level
      console.log('Selected level:', selectedLevel);
      if (selectedLevel === 'beginner') {
        router.push('/screens/BitbyLearnBeginnerOptions');
      } else if (selectedLevel === 'intermediate') {
        router.push('/screens/BitbyLearnIntermediateOptions');
      } else if (selectedLevel === 'advanced') {
        router.push('/screens/BitbyLearnAdvancedOptions');
      }
      // Add other level navigation logic here
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Your Experience Level</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Description */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionTitle}>Choose Your Trading Experience</Text>
          <Text style={styles.descriptionText}>
            We&apos;ll customize your learning journey based on your experience level
          </Text>
        </View>

        {/* Experience Level Cards */}
        <View style={styles.cardsContainer}>
          {experienceLevels.map((level) => (
            <TouchableOpacity
              key={level.id}
              style={[
                styles.levelCard,
                {
                  backgroundColor: level.bgColor,
                  borderColor: selectedLevel === level.id ? level.borderColor : '#333',
                  borderWidth: selectedLevel === level.id ? 2 : 1,
                }
              ]}
              onPress={() => handleLevelSelect(level)}
              activeOpacity={0.8}
            >
              {/* Icon */}
              <View style={[styles.iconContainer, { backgroundColor: level.color + '20' }]}>
                <MaterialCommunityIcons name={level.icon} size={32} color={level.color} />
              </View>

              {/* Content */}
              <View style={styles.cardContent}>
                <Text style={styles.levelTitle}>{level.title}</Text>
                <Text style={styles.levelDescription}>{level.description}</Text>
                
                {/* Features */}
                <View style={styles.featuresContainer}>
                  {level.features.map((feature, index) => (
                    <View key={index} style={styles.featureItem}>
                      <MaterialCommunityIcons 
                        name="check-circle" 
                        size={16} 
                        color={level.color} 
                        style={styles.featureIcon}
                      />
                      <Text style={styles.featureText}>{feature}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Selection Indicator */}
              {selectedLevel === level.id && (
                <View style={[styles.selectionIndicator, { backgroundColor: level.color }]}>
                  <Ionicons name="checkmark" size={16} color="#000" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={[
            styles.continueButton,
            { backgroundColor: selectedLevel ? '#00C896' : '#333' }
          ]}
          onPress={handleContinue}
          disabled={!selectedLevel}
        >
          <Text style={[
            styles.continueButtonText,
            { color: selectedLevel ? '#000' : '#666' }
          ]}>
            Continue
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  scrollContent: {
    padding: 20,
  },
  descriptionContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  descriptionTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  descriptionText: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  cardsContainer: {
    marginBottom: 30,
  },
  levelCard: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333',
    position: 'relative',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  cardContent: {
    flex: 1,
  },
  levelTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  levelDescription: {
    color: '#888',
    fontSize: 14,
    marginBottom: 16,
  },
  featuresContainer: {
    marginTop: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureIcon: {
    marginRight: 8,
  },
  featureText: {
    color: '#ccc',
    fontSize: 14,
    flex: 1,
  },
  selectionIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButton: {
    backgroundColor: '#333',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BitbyLearnLvlScreen; 