import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, Animated, TextInput } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { usePayment } from '../../contexts/PaymentContext';
import styles from '../styles/PaymentMethods.styles';

const GREEN = '#00C896';

export default function PaymentMethods() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { mobileMoney, connectMobileMoney, disconnectMobileMoney } = usePayment();
    const [showModal, setShowModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedMobile, setSelectedMobile] = useState(null);
    const [mobileNumber, setMobileNumber] = useState('');
    const [mobileError, setMobileError] = useState('');
    const pulseAnim = useRef(new Animated.Value(0)).current;

    const handleMobilePress = (item) => {
        setSelectedMobile(item);
        setShowModal(true);
    };

    // Animate the payment icon
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    const handleModalYes = () => {
        if (selectedMobile && !selectedMobile.connected) {
            // If connecting, show details modal
            setShowModal(false);
            setShowDetailsModal(true);
        } else if (selectedMobile && selectedMobile.connected) {
            // If disconnecting, proceed directly
            disconnectMobileMoney(selectedMobile.id);
            setShowModal(false);
            setSelectedMobile(null);
        }
    };

    const handleModalNo = () => {
        setShowModal(false);
        setSelectedMobile(null);
    };

    const handleDetailsModalYes = () => {
        if (selectedMobile) {
            // Validate input length
            if (mobileNumber.length !== 10) {
                return; // Don't proceed if mobile number is not 10 digits
            }

            // Validate MTN prefix for mobile money
            if (!validateMobileNumber(mobileNumber)) {
                return; // Don't proceed if mobile number is not MTN
            }

            connectMobileMoney(selectedMobile.id, mobileNumber);
        }
        setShowDetailsModal(false);
        setSelectedMobile(null);
        setMobileNumber('');
        setMobileError('');
    };

    const validateMobileNumber = (number) => {
        const mtnPrefixes = ['024', '025', '054', '055', '059'];
        if (number.length >= 3) {
            const prefix = number.substring(0, 3);
            if (!mtnPrefixes.includes(prefix)) {
                setMobileError('This number is not MTN');
                return false;
            } else {
                setMobileError('');
                return true;
            }
        } else {
            setMobileError('');
            return true;
        }
    };

    const handleMobileNumberChange = (text) => {
        setMobileNumber(text);
        validateMobileNumber(text);
    };

    const handleDetailsModalNo = () => {
        setShowDetailsModal(false);
        setSelectedMobile(null);
        setMobileNumber('');
        setMobileError('');
    };

    return (
        <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top }]}>
            {/* Sticky Back Button */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={20} color="#fff" />
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
                {/* Description Box */}
                <View style={styles.descriptionBox}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Animated.View style={[styles.iconBubble, { marginRight: 18, transform: [{ scale: pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.15] }) }] }]}>
                            <MaterialIcons name="payment" size={28} color={GREEN} />
                        </Animated.View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.descriptionTitle}>Payment Methods</Text>
                            <Text style={styles.descriptionText}>Connect your mobile money for seamless transactions</Text>
                        </View>
                    </View>
                </View>

                {/* Content */}
                <View style={styles.infoCard}>
                    <Text style={styles.infoCardTitle}>Mobile Money Services</Text>
                    {mobileMoney.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.bankRow}
                            onPress={() => handleMobilePress(item)}
                        >
                            <View style={{ flex: 1 }}>
                                <Text style={styles.bankName}>{item.name}</Text>
                                <Text style={styles.bankDesc}>{item.desc}</Text>
                            </View>
                            {item.connected && (
                                <View style={styles.connectedBadge}>
                                    <Text style={styles.connectedText}>CONNECTED</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>

            {/* Confirmation Modal */}
            <Modal
                visible={showModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowModal(false)}
            >
                <BlurView intensity={30} tint="dark" style={styles.popupOverlay}>
                    <View style={styles.popupCard}>
                        <View style={styles.popupIconCircle}>
                            <MaterialIcons
                                name={selectedMobile?.connected ? "link-off" : "link"}
                                size={32}
                                color={GREEN}
                            />
                        </View>
                        <Text style={styles.popupTitle}>
                            {selectedMobile?.connected
                                ? `Disconnect ${selectedMobile?.name}?`
                                : `Connect ${selectedMobile?.name}?`
                            }
                        </Text>
                        <Text style={styles.popupSubtitle}>
                            {selectedMobile?.connected
                                ? "This will remove the connection to your account"
                                : "This will connect your account for transactions"
                            }
                        </Text>
                        <View style={styles.popupButtonContainer}>
                            <TouchableOpacity style={styles.popupButtonSecondary} onPress={handleModalNo}>
                                <Text style={styles.popupButtonTextSecondary}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.popupButtonPrimary} onPress={handleModalYes}>
                                <Text style={styles.popupButtonTextPrimary}>
                                    {selectedMobile?.connected ? 'Disconnect' : 'Connect'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </BlurView>
            </Modal>

            {/* Details Modal */}
            <Modal
                visible={showDetailsModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowDetailsModal(false)}
            >
                <BlurView intensity={30} tint="dark" style={styles.popupOverlay}>
                    <View style={styles.popupCard}>
                        <View style={styles.popupIconCircle}>
                            <MaterialIcons
                                name="account-circle"
                                size={32}
                                color={GREEN}
                            />
                        </View>
                        <Text style={styles.popupTitle}>
                            Enter Mobile Details
                        </Text>
                        <Text style={styles.popupSubtitle}>
                            Please provide your mobile number to connect {selectedMobile?.name}
                        </Text>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Mobile Number</Text>
                            <TextInput
                                style={[styles.textInput, mobileError ? styles.textInputError : null]}
                                value={mobileNumber}
                                onChangeText={handleMobileNumberChange}
                                placeholder="Enter 10-digit MTN number"
                                placeholderTextColor="#666"
                                keyboardType="phone-pad"
                                maxLength={10}
                            />
                            <Text style={styles.inputHint}>
                                {mobileNumber.length}/10 digits
                            </Text>
                            {mobileError ? (
                                <Text style={styles.errorText}>{mobileError}</Text>
                            ) : null}
                        </View>

                        <View style={styles.popupButtonContainer}>
                            <TouchableOpacity style={styles.popupButtonSecondary} onPress={handleDetailsModalNo}>
                                <Text style={styles.popupButtonTextSecondary}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.popupButtonPrimary,
                                    (mobileNumber.length !== 10 || mobileError !== '')
                                        ? styles.popupButtonPrimaryDisabled
                                        : null
                                ]}
                                onPress={handleDetailsModalYes}
                                disabled={
                                    (mobileNumber.length !== 10 || mobileError !== '')
                                }
                            >
                                <Text style={styles.popupButtonTextPrimary}>Connect</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </BlurView>
            </Modal>
        </SafeAreaView>
    );
} 