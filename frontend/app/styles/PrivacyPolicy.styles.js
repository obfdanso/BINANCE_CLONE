import { StyleSheet } from 'react-native';

const BG = '#0A0F1E';
const CARD_BG = '#1A1F2E';
const BORDER = 'rgba(255,255,255,0.06)';

export default StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: BG,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingHorizontal: 20,
        paddingTop: 24,
        marginBottom: 8,
    },
    backButton: {
        backgroundColor: 'rgba(35,40,52,0.95)',
        borderRadius: 30,
        padding: 12,
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.08)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.16,
        shadowRadius: 8,
        elevation: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    topCard: {
        backgroundColor: CARD_BG,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        marginHorizontal: 16,
        marginBottom: 18,
        borderWidth: 1,
        borderColor: BORDER,
    },
    iconBubble: {
        backgroundColor: 'rgba(35,40,52,0.95)',
        borderRadius: 30,
        padding: 12,
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.08)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.16,
        shadowRadius: 8,
        elevation: 4,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 18,
    },
    topCardTitle: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 2,
    },
    topCardDesc: {
        color: '#aaa',
        fontSize: 14,
    },
    sectionCard: {
        backgroundColor: CARD_BG,
        borderRadius: 16,
        padding: 20,
        marginHorizontal: 16,
        marginBottom: 18,
        borderWidth: 1,
        borderColor: BORDER,
    },
    sectionTitle: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 8,
    },
    sectionText: {
        color: '#aaa',
        fontSize: 15,
        lineHeight: 22,
    },
}); 