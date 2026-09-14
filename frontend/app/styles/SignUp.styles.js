import { StyleSheet } from 'react-native';


const BG = '#0A0F1E';
const CARD_BG = '#1A1F2E';
const BORDER = 'rgba(255,255,255,0.06)';
const GREEN = '#00C896';
const RED = '#FF4D4F';

export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: BG,
    },
    scrollContent: {
        paddingBottom: 32,
        minHeight: '100%',
        paddingHorizontal: 16,
    },
    welcomeSection: {
        alignItems: 'center',
        paddingTop: 40,
        paddingBottom: 32,
    },
    avatarContainer: {
        backgroundColor: CARD_BG,
        borderRadius: 50,
        padding: 12,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: BORDER,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    title: {
        color: '#fff',
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        color: '#aaa',
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 22,
        paddingHorizontal: 20,
    },
    formCard: {
        backgroundColor: CARD_BG,
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: BORDER,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    formHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    formTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 12,
    },
    inputContainer: {
        marginBottom: 16,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: BG,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderWidth: 1,
        borderColor: BORDER,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        color: '#fff',
        fontSize: 16,
        backgroundColor: 'transparent',
    },
    eyeIcon: {
        padding: 4,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    checkbox: {
        marginRight: 12,
    },
    checkboxBox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#aaa',
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxBoxActive: {
        backgroundColor: GREEN,
        borderColor: GREEN,
    },
    checkboxLabel: {
        color: '#aaa',
        fontSize: 14,
        flex: 1,
    },
    signUpButton: {
        backgroundColor: GREEN,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        shadowColor: GREEN,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    signUpButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 8,
    },
    socialCard: {
        backgroundColor: CARD_BG,
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: BORDER,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    dividerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: BORDER,
    },
    orWith: {
        color: '#aaa',
        marginHorizontal: 16,
        fontSize: 14,
        fontWeight: '500',
    },
    socialButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: GREEN,
        borderRadius: 12,
        paddingVertical: 14,
        backgroundColor: 'transparent',
    },
    socialButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 12,
    },
    bottomRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
    },
    bottomText: {
        color: '#aaa',
        fontSize: 15,
    },
    bottomLink: {
        color: GREEN,
        fontSize: 15,
        fontWeight: 'bold',
    },
    errorText: {
        color: RED,
        fontSize: 13,
        marginTop: 6,
        marginLeft: 4,
    },
}); 