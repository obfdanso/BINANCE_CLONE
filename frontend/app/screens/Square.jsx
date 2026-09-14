import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useState, useLayoutEffect, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useNavigation } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Square() {
  const [activeTab, setActiveTab] = useState('Discover');
  const router = useRouter();
  const navigation = useNavigation();
  const [currentStreak, setCurrentStreak] = useState(0);
  const [lastCompletedDate, setLastCompletedDate] = useState(null);

  // Load streak from storage on mount
  useEffect(() => {
    (async () => {
      const streak = await AsyncStorage.getItem('learningStreak');
      const lastDate = await AsyncStorage.getItem('lastCompletedDate');
      setCurrentStreak(streak ? parseInt(streak) : 0);
      setLastCompletedDate(lastDate);
    })();
  }, []);

  // Call this function whenever a lesson is completed in any course

  useLayoutEffect(() => {
    navigation.setOptions?.({ headerShown: false });
  }, [navigation]);




  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0A0F1E' }}>
      <View style={{ flex: 1, marginTop: 40 }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 20 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 15 }}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>Square</Text>
        </View>

        {/* Content Tabs */}
        <View style={{ flexDirection: 'row', marginBottom: 20, paddingHorizontal: 20 }}>
          {['Discover', 'News', 'Learn'].map(tab => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={{ flex: 1, alignItems: 'center' }}
            >
              <Text style={{ color: activeTab === tab ? '#fff' : '#6C6C7A', fontSize: 15, fontWeight: '500' }}>{tab}</Text>
              {activeTab === tab && <View style={{ height: 2, backgroundColor: '#00C896', marginTop: 4, borderRadius: 1, width: '100%' }} />}
            </TouchableOpacity>
          ))}
        </View>

        {/* Content */}
        <ScrollView style={{ flex: 1, paddingHorizontal: 20 }} showsVerticalScrollIndicator={false}>
          {activeTab === 'Discover' && (
            <View>
              <Text style={{ color: '#fff', fontSize: 18, marginTop: 60 }}>Discover Content</Text>
            </View>
          )}

          {activeTab === 'News' && (
            <View>
              <Text style={{ color: '#fff', fontSize: 18, marginTop: 60 }}>News Content</Text>
            </View>
          )}

          {activeTab === 'Learn' && (
            <View>
              <Text style={{ color: '#fff', fontSize: 18, marginTop: 60 }}>Learning Content</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
