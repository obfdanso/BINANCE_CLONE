import React, { useRef, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Animated, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import styles from '../styles/DeleteAccount.styles';

const BG = '#0A0F1E';
const RED = '#FF6B6B';
const GRAY = '#aaa';

const REASONS = [
    'Privacy concerns',
    'Switching to another platform',
    'No longer interested in trading',
    'Account security issues',
    'Other',
];

const DELETE_LIST = [
    'All transaction history',
    'Account balance and assets',
    'Personal information',
    'Trading preferences',
];

export default function DeleteAccount() {
    const router = useRouter();
    const pulseAnim = useRef(new Animated.Value(0)).current;
    const [selected, setSelected] = useState(null);
    const [confirmOther, setConfirmOther] = useState('');
    const [confirmDelete, setConfirmDelete] = useState('');
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
            ])
        ).start();
    }, []);
    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: BG }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
        >
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={20} color="#fff" />
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
                {/* Description Card */}
                <View style={styles.descriptionBox}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Animated.View style={[styles.descriptionIconWrapper, { marginRight: 18, transform: [{ scale: pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.15] }) }] }]}>
                            <MaterialCommunityIcons name="trash-can-outline" size={22} color={RED} />
                        </Animated.View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.descriptionTitle}>Delete Account</Text>
                            <Text style={styles.descriptionText}>This action cannot be undone. All your data will be permanently deleted.</Text>
                        </View>
                    </View>
                </View>
                {/* Permanent Deletion Warning */}
                <View style={styles.deleteCard}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                        <Ionicons name="warning" size={20} color={RED} style={{ marginRight: 10 }} />
                        <Text style={styles.deleteTitle}>Permanent Deletion</Text>
                    </View>
                    <Text style={styles.deleteDesc}>Deleting your account will permanently remove all your data including:</Text>
                    {DELETE_LIST.map(item => (
                        <View key={item} style={styles.deleteRow}>
                            <Ionicons name="close-circle" size={18} color={RED} style={{ marginRight: 10 }} />
                            <Text style={styles.deleteItem}>{item}</Text>
                        </View>
                    ))}
                </View>
                {/* Reasons Card */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Why are you deleting your account?</Text>
                    <Text style={styles.sectionDesc}>Please select a reason to help us improve our service</Text>
                    {REASONS.map((reason, idx) => (
                        <TouchableOpacity
                            key={reason}
                            style={[styles.radioRow, selected === idx && styles.radioRowSelected]}
                            onPress={() => setSelected(idx)}
                            activeOpacity={0.85}
                        >
                            <View style={[styles.radioOuter, selected === idx && styles.radioOuterSelected]}>
                                {selected === idx && <View style={styles.radioInner} />}
                            </View>
                            <Text style={styles.radioText}>{reason}</Text>
                        </TouchableOpacity>
                    ))}
                    {selected === REASONS.length - 1 && (
                        <View style={{ marginBottom: 8 }}>
                            <TextInput
                                style={[styles.input, styles.inputOther]}
                                value={confirmOther}
                                onChangeText={text => {
                                    if (text.length <= 250) setConfirmOther(text);
                                }}
                                placeholder="Please specify your reason"
                                placeholderTextColor={GRAY}
                                autoCapitalize="sentences"
                                multiline
                                numberOfLines={4}
                                maxLength={250}
                            />
                            <Text style={styles.charCount}>{confirmOther.length} / 250</Text>
                        </View>
                    )}
                </View>
                {/* Confirm Delete Card */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Confirm Account Deletion</Text>
                    <Text style={styles.sectionDesc}>Type "delete" to confirm you want to permanently delete your account</Text>
                    <TextInput
                        style={styles.input}
                        value={confirmDelete}
                        onChangeText={setConfirmDelete}
                        placeholder="Type 'delete'"
                        placeholderTextColor={GRAY}
                        autoCapitalize="none"
                    />
                    <TouchableOpacity
                        style={[styles.deleteButton, confirmDelete.trim().toLowerCase() !== 'delete' && { opacity: 0.5 }]}
                        disabled={confirmDelete.trim().toLowerCase() !== 'delete'}
                    >
                        <Text style={styles.deleteButtonText}>Delete</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

