import React, { useState } from 'react';
import { useUser } from '../../contexts/UserContext';
import * as ImagePicker from 'expo-image-picker';
import { View, Text, TouchableOpacity, ScrollView, Modal, TextInput, Image } from 'react-native';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from '../styles/Profile.styles';

const GREEN = '#00C896';
const INACTIVE_TAB = '#aaa';

export default function Profile() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const [tab, setTab] = useState('Account');
    const [photoModalVisible, setPhotoModalVisible] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const { username, setUsername } = useUser();
    const [editUsername, setEditUsername] = useState(false);
    const [usernameInput, setUsernameInput] = useState(username);

    // Generate default avatar based on username
    const generateDefaultAvatar = (name) => {
        const colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
            '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
            '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2'
        ];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const initials = name ? name.substring(0, 2).toUpperCase() : 'U';
        return { color: randomColor, initials };
    };

    const defaultAvatar = generateDefaultAvatar(username);

    const pickImage = async () => {
        setPhotoModalVisible(false);
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });
        if (!result.canceled && result.assets && result.assets[0]?.uri) {
            setProfileImage(result.assets[0].uri);
        }
    };

    const takePhoto = async () => {
        setPhotoModalVisible(false);
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) return;
        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });
        if (!result.canceled && result.assets && result.assets[0]?.uri) {
            setProfileImage(result.assets[0].uri);
        }
    };



    const handleUsernameSave = () => {
        setUsername(usernameInput);
        setEditUsername(false);
    };

    return (
        <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top }]}>
            {/* Sticky Back Button */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={20} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.settingsButton} onPress={() => router.push('/screens/Settings')}>
                    <Ionicons name="settings-sharp" size={26} color="#aaa" />
                </TouchableOpacity>
            </View>
            {/* Tabs (pill toggle style, exact match with Dashboard) */}
            <View style={styles.pillToggleContainer}>
                <TouchableOpacity
                    style={[styles.pillToggleButton, tab === 'Account' ? styles.pillToggleButtonActive : styles.pillToggleButtonInactive, { marginRight: 2 }]}
                    onPress={() => setTab('Account')}
                >
                    <View style={{ alignItems: 'center' }}>
                        <Text style={[styles.pillToggleText, tab === 'Account' ? styles.pillToggleTextActive : styles.pillToggleTextInactive]}>Account</Text>
                        {tab === 'Account' && (
                            <View style={styles.pillToggleUnderline} />
                        )}
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.pillToggleButton, tab === 'Security' ? styles.pillToggleButtonActive : styles.pillToggleButtonInactive]}
                    onPress={() => setTab('Security')}
                >
                    <View style={{ alignItems: 'center' }}>
                        <Text style={[styles.pillToggleText, tab === 'Security' ? styles.pillToggleTextActive : styles.pillToggleTextInactive]}>Security</Text>
                        {tab === 'Security' && (
                            <View style={styles.pillToggleUnderline} />
                        )}
                    </View>
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
                {/* Profile Info (centered) */}
                <View style={styles.profileInfoCentered}>
                    <TouchableOpacity style={styles.profilePicWrapper} onPress={() => setPhotoModalVisible(true)} activeOpacity={0.85}>
                        {profileImage ? (
                            <>
                                <View style={styles.profilePicImageWrapper}>
                                    <Image source={{ uri: profileImage }} style={styles.profilePicImage} />
                                    <View style={styles.cameraIconOverlay}>
                                        <Ionicons name="camera" size={16} color="#fff" />
                                    </View>
                                </View>
                            </>
                        ) : (
                            <View style={[styles.defaultAvatarContainer, { backgroundColor: defaultAvatar.color }]}>
                                <Text style={styles.defaultAvatarText}>{defaultAvatar.initials}</Text>
                                <View style={styles.cameraIconOverlay}>
                                    <Ionicons name="camera" size={16} color="#fff" />
                                </View>
                            </View>
                        )}
                    </TouchableOpacity>
                    <View style={styles.profileInfoRow}>
                        <View style={styles.profileInfo}>
                            {editUsername ? (
                                <TextInput
                                    style={[styles.profileName, styles.profileNameInput]}
                                    value={usernameInput}
                                    onChangeText={setUsernameInput}
                                    onBlur={handleUsernameSave}
                                    autoFocus
                                    placeholderTextColor="#aaa"
                                />
                            ) : (
                                <Text style={styles.profileName}>{username}</Text>
                            )}
                        </View>
                        <TouchableOpacity style={styles.editButton} onPress={() => setEditUsername(!editUsername)}>
                            <Text style={styles.editButtonText}>{editUsername ? 'Save' : 'Edit'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {tab === 'Account' ? (
                    <>
                        {/* Account Section */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Account</Text>
                            <TouchableOpacity style={styles.sectionRow} onPress={() => router.push('/screens/PersonalInformation')}>
                                <View style={styles.iconBubble}>
                                    <Ionicons name="person-outline" size={24} color={GREEN} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.sectionRowTitle}>Personal Information</Text>
                                    <Text style={styles.sectionRowDesc}>Update your personal details</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={22} color={INACTIVE_TAB} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.sectionRow} onPress={() => router.push('/screens/PaymentMethods')}>
                                <View style={styles.iconBubble}>
                                    <MaterialIcons name="payment" size={24} color={GREEN} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.sectionRowTitle}>Payment Methods</Text>
                                    <Text style={styles.sectionRowDesc}>Manage your payment options</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={22} color={INACTIVE_TAB} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.sectionRow} onPress={() => router.push('/screens/ManageAccounts')}>
                                <View style={styles.iconBubble}>
                                    <MaterialCommunityIcons name="account-multiple-outline" size={24} color={GREEN} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.sectionRowTitle}>Manage Accounts</Text>
                                    <Text style={styles.sectionRowDesc}>Link and manage accounts</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={22} color={INACTIVE_TAB} />
                            </TouchableOpacity>
                        </View>

                        {/* Support Section */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Support</Text>
                            <TouchableOpacity style={styles.sectionRow} onPress={() => router.push('/screens/HelpCenter')}>
                                <View style={styles.iconBubble}>
                                    <Ionicons name="help-circle-outline" size={24} color={GREEN} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.sectionRowTitle}>Help Center</Text>
                                    <Text style={styles.sectionRowDesc}>Get help and support</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={22} color={INACTIVE_TAB} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.sectionRow} onPress={() => router.push('/screens/TermsOfService')}>
                                <View style={styles.iconBubble}>
                                    <MaterialIcons name="description" size={24} color={GREEN} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.sectionRowTitle}>Terms of Service</Text>
                                    <Text style={styles.sectionRowDesc}>Read our terms and conditions</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={22} color={INACTIVE_TAB} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.sectionRow} onPress={() => router.push('/screens/PrivacyPolicy')}>
                                <View style={styles.iconBubble}>
                                    <MaterialCommunityIcons name="shield-check-outline" size={24} color={GREEN} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.sectionRowTitle}>Privacy Policy</Text>
                                    <Text style={styles.sectionRowDesc}>How we protect your data</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={22} color={INACTIVE_TAB} />
                            </TouchableOpacity>
                        </View>
                    </>
                ) : (
                    <>
                        {/* Security Section */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Security</Text>
                            <TouchableOpacity style={styles.sectionRow} onPress={() => router.push('/screens/ChangePassword')}>
                                <View style={styles.iconBubble}>
                                    <Ionicons name="key-outline" size={24} color={GREEN} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.sectionRowTitle}>Change Password</Text>
                                    <Text style={styles.sectionRowDesc}>Update your password</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={22} color={INACTIVE_TAB} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.sectionRow} onPress={() => router.push('/screens/DeviceManagement')}>
                                <View style={styles.iconBubble}>
                                    <Ionicons name="phone-portrait-outline" size={24} color={GREEN} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.sectionRowTitle}>Device Management</Text>
                                    <Text style={styles.sectionRowDesc}>Manage your devices</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={22} color={INACTIVE_TAB} />
                            </TouchableOpacity>
                        </View>
                    </>
                )}
            </ScrollView>
            {/* Photo Modal */}
            <Modal
                visible={photoModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setPhotoModalVisible(false)}
            >
                <TouchableOpacity style={styles.popupOverlay} activeOpacity={1} onPress={() => setPhotoModalVisible(false)}>
                    <View style={styles.popupCard}>
                        <Text style={styles.popupTitle}>Change Profile Photo</Text>
                        <TouchableOpacity style={styles.popupButton} onPress={pickImage}>
                            <Ionicons name="images-outline" size={22} color={GREEN} style={{ marginRight: 8 }} />
                            <Text style={styles.popupButtonText}>Choose Photo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.popupButton} onPress={takePhoto}>
                            <Ionicons name="camera-outline" size={22} color={GREEN} style={{ marginRight: 8 }} />
                            <Text style={styles.popupButtonText}>Take Photo</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>

        </SafeAreaView>
    );
} 