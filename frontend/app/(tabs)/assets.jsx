import React, { useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';

export default function Assets() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to OverviewCryptoScreen when assets tab is accessed
        router.replace('/screens/OverviewCryptoScreen');
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" translucent />

            {/* Description Box */}
            <View style={styles.descriptionContainer}>
                <BlurView intensity={30} tint="light" style={styles.descriptionBox}>
                    <Text style={styles.descriptionTitle}>Assets</Text>
                    <Text style={styles.descriptionText}>
                        View your portfolio balance, transaction history, and manage all your cryptocurrency holdings in one place.
                    </Text>
                </BlurView>
            </View>

            {/* Loading Content */}
            <View style={styles.content}>
                <Text style={styles.title}>Loading Assets...</Text>
                <Text style={styles.subtitle}>Redirecting to your portfolio</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A0F1E',
    },
    descriptionContainer: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
    },
    descriptionBox: {
        borderRadius: 12,
        padding: 16,
        overflow: 'hidden',
    },
    descriptionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    descriptionText: {
        fontSize: 14,
        color: '#CCCCCC',
        lineHeight: 20,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#CCCCCC',
    },
}); 