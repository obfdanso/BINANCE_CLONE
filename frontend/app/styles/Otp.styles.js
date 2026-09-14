import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const BG = '#0A0F1E';
const CARD_BG = '#1A1F2E';
const BORDER = 'rgba(255,255,255,0.06)';
const GREEN = '#00C896';
const RED = '#FF4D4F';

const boxSize = width * 0.12;

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
    otpCard: {
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
    otpHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    otpTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 12,
    },
    emailContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: BG,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: BORDER,
    },
    emailText: {
        color: '#aaa',
        fontSize: 14,
        marginLeft: 8,
    },
    otpRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    otpInput: {
        width: boxSize,
        height: boxSize,
        borderRadius: 12,
        backgroundColor: BG,
        color: '#fff',
        fontSize: 24,
        textAlign: 'center',
        fontWeight: 'bold',
        borderWidth: 1,
        borderColor: BORDER,
    },
    otpInputFilled: {
        borderColor: GREEN,
        backgroundColor: 'rgba(0,200,150,0.1)',
    },
    errorText: {
        color: RED,
        fontSize: 13,
        textAlign: 'center',
        marginBottom: 16,
    },
    resendButton: {
        alignItems: 'center',
    },
    resendText: {
        color: GREEN,
        fontSize: 14,
        fontWeight: '600',
    },
    resendMsgCard: {
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
    resendMsgHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    resendMsgTitle: {
        color: GREEN,
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    resendMsg: {
        color: '#aaa',
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 16,
    },
    okButton: {
        backgroundColor: GREEN,
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignSelf: 'flex-end',
    },
    okButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    illustrationContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    illustration: {
        width: width * 0.4,
        height: width * 0.4,
        opacity: 0.3,
    },
}); 