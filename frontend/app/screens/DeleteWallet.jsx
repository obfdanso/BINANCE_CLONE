import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useWallet } from '../../contexts/WalletContext';
import { BlurView } from 'expo-blur';
import styles from '../styles/DeleteWallet.styles';

const GREEN = '#00C896';
const RED = '#FF6B6B';

export default function DeleteWallet() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { walletName, clearWallet } = useWallet();
    const [isConfirming, setIsConfirming] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);

    const handleDeleteWallet = async () => {
        if (!isConfirming) {
            setIsConfirming(true);
            return;
        }

        try {
            await clearWallet();
            setShowSuccessModal(true);
        } catch {
            setShowErrorModal(true);
            setIsConfirming(false);
        }
    };

    const handleCancel = () => {
        if (isConfirming) {
            setIsConfirming(false);
        } else {
            router.back();
        }
    };

    return (
        <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleCancel} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={20} color="#fff" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Warning Box */}
                <View style={styles.warningBox}>
                    <View style={styles.warningIconContainer}>
                        <Ionicons name="warning-outline" size={32} color={RED} />
                    </View>
                    <Text style={styles.warningTitle}>Delete Wallet</Text>
                    <Text style={styles.warningText}>
                        This action will permanently delete your wallet and all associated data. This cannot be undone.
                    </Text>
                </View>

                {/* Instructions Section */}
                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>Before You Delete</Text>

                    <View style={styles.instructionRow}>
                        <View style={styles.instructionIcon}>
                            <Ionicons name="checkmark-circle-outline" size={20} color={GREEN} />
                        </View>
                        <View style={styles.instructionText}>
                            <Text style={styles.instructionTitle}>Backup Your Wallet</Text>
                            <Text style={styles.instructionDesc}>Make sure you have backed up your private keys or seed phrase</Text>
                        </View>
                    </View>

                    <View style={styles.instructionRow}>
                        <View style={styles.instructionIcon}>
                            <Ionicons name="checkmark-circle-outline" size={20} color={GREEN} />
                        </View>
                        <View style={styles.instructionText}>
                            <Text style={styles.instructionTitle}>Transfer Assets</Text>
                            <Text style={styles.instructionDesc}>Move all your cryptocurrencies to another wallet</Text>
                        </View>
                    </View>

                    <View style={styles.instructionRow}>
                        <View style={styles.instructionIcon}>
                            <Ionicons name="checkmark-circle-outline" size={20} color={GREEN} />
                        </View>
                        <View style={styles.instructionText}>
                            <Text style={styles.instructionTitle}>Confirm Deletion</Text>
                            <Text style={styles.instructionDesc}>Double-check that you want to delete this wallet</Text>
                        </View>
                    </View>
                </View>

                {/* What Will Be Deleted Section */}
                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>What Will Be Deleted</Text>

                    <View style={styles.deleteItemRow}>
                        <View style={styles.deleteItemIcon}>
                            <Ionicons name="wallet-outline" size={20} color={RED} />
                        </View>
                        <View style={styles.deleteItemText}>
                            <Text style={styles.deleteItemTitle}>Wallet Data</Text>
                            <Text style={styles.deleteItemDesc}>All wallet information and settings</Text>
                        </View>
                    </View>

                    <View style={styles.deleteItemRow}>
                        <View style={styles.deleteItemIcon}>
                            <Ionicons name="key-outline" size={20} color={RED} />
                        </View>
                        <View style={styles.deleteItemText}>
                            <Text style={styles.deleteItemTitle}>Private Keys</Text>
                            <Text style={styles.deleteItemDesc}>Access to your cryptocurrency addresses</Text>
                        </View>
                    </View>

                    <View style={styles.deleteItemRow}>
                        <View style={styles.deleteItemIcon}>
                            <Ionicons name="swap-horizontal-outline" size={20} color={RED} />
                        </View>
                        <View style={styles.deleteItemText}>
                            <Text style={styles.deleteItemTitle}>Transaction History</Text>
                            <Text style={styles.deleteItemDesc}>All transaction records and history</Text>
                        </View>
                    </View>

                    <View style={styles.deleteItemRow}>
                        <View style={styles.deleteItemIcon}>
                            <Ionicons name="settings-outline" size={20} color={RED} />
                        </View>
                        <View style={styles.deleteItemText}>
                            <Text style={styles.deleteItemTitle}>Wallet Settings</Text>
                            <Text style={styles.deleteItemDesc}>All preferences and configurations</Text>
                        </View>
                    </View>
                </View>

                {/* Confirmation Section */}
                {isConfirming && (
                    <View style={styles.sectionCard}>
                        <Text style={styles.sectionTitle}>Final Confirmation</Text>

                        <View style={styles.confirmationBox}>
                            <Ionicons name="alert-circle-outline" size={24} color={RED} />
                            <Text style={styles.confirmationText}>
                                Are you absolutely sure you want to delete your wallet &quot;{walletName}&quot;? This action cannot be undone.
                            </Text>
                        </View>
                    </View>
                )}

                {/* Action Buttons */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.deleteButton, isConfirming && styles.confirmDeleteButton]}
                        onPress={handleDeleteWallet}
                        activeOpacity={0.8}
                    >
                        <Ionicons
                            name={isConfirming ? "trash" : "trash-outline"}
                            size={20}
                            color="#fff"
                        />
                        <Text style={styles.deleteButtonText}>
                            {isConfirming ? 'Confirm Delete' : 'Delete Wallet'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Success Modal */}
            {showSuccessModal && (
                <Modal
                    transparent={true}
                    visible={showSuccessModal}
                    animationType="fade"
                >
                    <BlurView intensity={30} tint="dark" style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <View style={styles.modalIconContainer}>
                                    <Ionicons name="checkmark-circle" size={44} color={GREEN} />
                                </View>
                                <Text style={styles.modalTitle}>Wallet Deleted</Text>
                                <Text style={styles.modalText}>
                                    Your wallet has been successfully deleted. You will be redirected to the main screen.
                                </Text>
                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={() => {
                                        setShowSuccessModal(false);
                                        router.push('/(tabs)');
                                    }}
                                >
                                    <Text style={styles.modalButtonText}>OK</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </BlurView>
                </Modal>
            )}

            {/* Error Modal */}
            {showErrorModal && (
                <Modal
                    transparent={true}
                    visible={showErrorModal}
                    animationType="fade"
                >
                    <BlurView intensity={30} tint="dark" style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <View style={styles.modalIconContainer}>
                                    <Ionicons name="alert-circle" size={44} color={RED} />
                                </View>
                                <Text style={styles.modalTitle}>Error</Text>
                                <Text style={styles.modalText}>
                                    Failed to delete wallet. Please try again.
                                </Text>
                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={() => setShowErrorModal(false)}
                                >
                                    <Text style={styles.modalButtonText}>OK</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </BlurView>
                </Modal>
            )}
        </SafeAreaView>
    );
} 