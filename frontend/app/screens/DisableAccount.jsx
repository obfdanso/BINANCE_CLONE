import React, { useRef, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Animated, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import styles from '../styles/DisableAccount.styles';

const BG = '#0A0F1E';
const YELLOW = '#FFC300';
const GRAY = '#aaa';

const REASONS = [
    'Taking a break from trading',
    'Privacy concerns',
    'Switching to another platform',
    'Financial reasons',
    'Technical issues',
    'Other',
];

export default function DisableAccount() {
    const router = useRouter();
    const pulseAnim = useRef(new Animated.Value(0)).current;
    const [selected, setSelected] = useState(null);
    const [confirm, setConfirm] = useState('');
    const [confirmOther, setConfirmOther] = useState('');
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
                            <Ionicons name="pause" size={22} color={YELLOW} />
                        </Animated.View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.descriptionTitle}>Disable Account</Text>
                            <Text style={styles.descriptionText}>Your account will be temporarily disabled and hidden from other users</Text>
                        </View>
                    </View>
                </View>
                {/* Reasons Card */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Why are you disabling your account?</Text>
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
                {/* Confirm Disable Card */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Confirm Account Disable</Text>
                    <Text style={styles.sectionDesc}>Type &quot;disable&quot; to confirm you want to disable your account</Text>
                    <TextInput
                        style={styles.input}
                        value={confirm}
                        onChangeText={setConfirm}
                        placeholder="Type 'disable'"
                        placeholderTextColor={GRAY}
                        autoCapitalize="none"
                    />
                    <TouchableOpacity
                        style={[styles.disableButton, confirm.trim().toLowerCase() !== 'disable' && { opacity: 0.5 }]}
                        disabled={confirm.trim().toLowerCase() !== 'disable'}
                    >
                        <Text style={styles.disableButtonText}>Disable Account</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

