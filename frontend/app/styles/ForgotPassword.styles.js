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
    backButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 10,
        backgroundColor: CARD_BG,
        borderRadius: 20,
        padding: 8,
        borderWidth: 1,
        borderColor: BORDER,
    },
    welcomeSection: {
        alignItems: 'center',
        paddingTop: 60,
        paddingBottom: 32,
    },
    iconContainer: {
        backgroundColor: CARD_BG,
        borderRadius: 50,
        padding: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: BORDER,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
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
        marginBottom: 20,
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
    errorText: {
        color: RED,
        fontSize: 13,
        marginTop: 6,
        marginLeft: 4,
    },
    submitButton: {
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
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 8,
    },
    disabledButton: {
        backgroundColor: '#333',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    disabledButtonText: {
        color: '#666',
    },

    backToSignInCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
    },
    backToSignInText: {
        color: '#aaa',
        fontSize: 15,
    },
    backToSignInLink: {
        color: GREEN,
        fontSize: 15,
        fontWeight: 'bold',
    },
}); 