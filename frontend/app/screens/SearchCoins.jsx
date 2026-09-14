import { View, Text, TouchableOpacity, TextInput, FlatList, SafeAreaView, Image } from 'react-native';
import { useState, useLayoutEffect } from 'react';
import { useMarketData } from '../../contexts/MarketDataContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams, useNavigation } from 'expo-router';


export default function SearchCoins() {
    const router = useRouter();
    const navigation = useNavigation();
    const params = useLocalSearchParams();
    const initialFavourites = params.favourites ? JSON.parse(params.favourites) : [];
    // Coins come from the shared live feed rather than a fixed table of
    // twenty with prices frozen at whatever they were when it was written.
    const { coins, loading: coinsLoading } = useMarketData();
    const allCoins = coins.map(c => ({
        name: c.name,
        symbol: c.symbol,
        icon: c.image,
        price: c.price,
    }));

    const [search, setSearch] = useState('');
    const [favourites, setFavourites] = useState(initialFavourites);

    useLayoutEffect(() => {
        navigation.setOptions?.({ headerShown: false });
    }, [navigation]);

    const filteredCoins = allCoins.filter(
        coin => coin.name.toLowerCase().includes(search.toLowerCase())
    );

    const toggleFavourite = (coin) => {
        if (favourites.includes(coin.name)) {
            setFavourites(favourites.filter(f => f !== coin.name));
        } else {
            setFavourites([...favourites, coin.name]);
        }
    };

    const handleDone = () => {
        router.replace({ pathname: '/(tabs)/market', params: { favourites: JSON.stringify(favourites) } });
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#0A0F1E' }}>
            <View style={{ flex: 1, padding: 20 }}>
                <TextInput
                    style={{ backgroundColor: '#181E2A', color: '#fff', borderRadius: 10, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, marginBottom: 24, marginTop: 20 }}
                    placeholder="Search coins..."
                    placeholderTextColor="#aaa"
                    value={search}
                    onChangeText={setSearch}
                    autoFocus
                />
                <FlatList
                    data={filteredCoins}
                    keyExtractor={item => item.name}
                    renderItem={({ item }) => {
                        const isFav = favourites.includes(item.name);
                        return (
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#181E2A', borderRadius: 8, padding: 16, marginBottom: 12 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Image source={{ uri: item.icon }} style={{ width: 28, height: 28, marginRight: 12, borderRadius: 14, backgroundColor: '#222' }} />
                                    <Text style={{ color: '#fff', fontSize: 16 }}>{item.name}</Text>
                                </View>
                                <TouchableOpacity onPress={() => toggleFavourite(item)}>
                                    <Ionicons name={isFav ? 'heart' : 'heart-outline'} size={22} color={isFav ? '#00C896' : '#aaa'} />
                                </TouchableOpacity>
                            </View>
                        );
                    }}
                    ListEmptyComponent={<Text style={{ color: '#aaa', textAlign: 'center', marginTop: 40 }}>No coins found</Text>}
                />
                <TouchableOpacity onPress={handleDone} style={{ alignSelf: 'center', marginTop: 20, backgroundColor: '#00C896', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 40 }}>
                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Done</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
} 