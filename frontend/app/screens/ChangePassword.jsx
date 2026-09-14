import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import styles from '../styles/ChangePassword.styles';
import { View as RNView } from 'react-native';

export default function ChangePassword() {
    const router = useRouter();
    const [current, setCurrent] = useState('');
    const [newPass, setNewPass] = useState('');
    const [confirm, setConfirm] = useState('');
    const [loading, setLoading] = useState(false);
    const [successModal, setSuccessModal] = useState(false);
    const [errorModal, setErrorModal] = useState({ visible: false, message: '' });

    const handleSubmit = () => {
        if (!current || !newPass || !confirm) {
            setErrorModal({ visible: true, message: 'Please fill in all fields.' });
            return;
        }
        if (newPass !== confirm) {
            setErrorModal({ visible: true, message: 'New passwords do not match.' });
            return;
        }
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSuccessModal(true);
        }, 1200);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={20} color="#fff" />
                </TouchableOpacity>
            </View>
            <View style={[styles.sectionCard, { marginTop: 24 }]}>
                <Text style={styles.sectionTitle}>Change Password</Text>
                <Text style={[styles.sectionRowDesc, { marginBottom: 18 }]}>Follow the instructions below to change your password. Make sure your new password is strong and not used elsewhere.</Text>
                <TextInput
                    style={[styles.sectionRowDesc, { backgroundColor: 'rgba(35,40,52,0.95)', color: '#fff', borderRadius: 10, padding: 12, marginBottom: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' }]}
                    placeholder="Current Password"
                    placeholderTextColor="#aaa"
                    secureTextEntry
                    value={current}
                    onChangeText={setCurrent}
                />
                <TextInput
                    style={[styles.sectionRowDesc, { backgroundColor: 'rgba(35,40,52,0.95)', color: '#fff', borderRadius: 10, padding: 12, marginBottom: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' }]}
                    placeholder="New Password"
                    placeholderTextColor="#aaa"
                    secureTextEntry
                    value={newPass}
                    onChangeText={setNewPass}
                />
                <TextInput
                    style={[styles.sectionRowDesc, { backgroundColor: 'rgba(35,40,52,0.95)', color: '#fff', borderRadius: 10, padding: 12, marginBottom: 18, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' }]}
                    placeholder="Confirm New Password"
                    placeholderTextColor="#aaa"
                    secureTextEntry
                    value={confirm}
                    onChangeText={setConfirm}
                />
                <TouchableOpacity
                    style={{ backgroundColor: '#00C896', borderRadius: 12, paddingVertical: 14, alignItems: 'center', justifyContent: 'center', marginTop: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.16, shadowRadius: 8, elevation: 4 }}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>{loading ? 'Submitting...' : 'Submit'}</Text>
                </TouchableOpacity>
            </View>
            {/* Success Modal */}
            {successModal && (
                <RNView style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, zIndex: 200, flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(24,28,35,0.85)' }}>
                    <View style={{ backgroundColor: '#232834', borderRadius: 20, padding: 32, alignItems: 'center', width: 320, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.16, shadowRadius: 8, elevation: 8 }}>
                        <Ionicons name="checkmark-circle" size={44} color="#00C896" style={{ marginBottom: 14 }} />
                        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 22, marginBottom: 8 }}>Password Changed</Text>
                        <Text style={{ color: '#aaa', fontSize: 16, textAlign: 'center', marginBottom: 18 }}>Your password has been successfully updated.</Text>
                        <TouchableOpacity
                            style={{ backgroundColor: '#00C896', paddingVertical: 12, paddingHorizontal: 32, borderRadius: 12, alignItems: 'center', marginTop: 8 }}
                            onPress={() => { setSuccessModal(false); router.back(); }}
                        >
                            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </RNView>
            )}
            {/* Error Modal */}
            {errorModal.visible && (
                <RNView style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, zIndex: 200, flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(24,28,35,0.85)' }}>
                    <View style={{ backgroundColor: '#232834', borderRadius: 20, padding: 32, alignItems: 'center', width: 320, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.16, shadowRadius: 8, elevation: 8 }}>
                        <Ionicons name="close-circle" size={44} color="#FF6B6B" style={{ marginBottom: 14 }} />
                        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 22, marginBottom: 8 }}>Error</Text>
                        <Text style={{ color: '#aaa', fontSize: 16, textAlign: 'center', marginBottom: 18 }}>{errorModal.message}</Text>
                        <TouchableOpacity
                            style={{ backgroundColor: '#FF6B6B', paddingVertical: 12, paddingHorizontal: 32, borderRadius: 12, alignItems: 'center', marginTop: 8 }}
                            onPress={() => setErrorModal({ visible: false, message: '' })}
                        >
                            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </RNView>
            )}
        </SafeAreaView>
    );
} 