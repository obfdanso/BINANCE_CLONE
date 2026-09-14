import { StyleSheet } from 'react-native';

const BG = '#0A0F1E';
const CARD_BG = '#1A1F2E';
const BORDER = 'rgba(255,255,255,0.06)';
const GREEN = '#00C896';

export default StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: BG,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 8,
        paddingTop: 24,
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
    descriptionBox: {
        backgroundColor: CARD_BG,
        borderRadius: 16,
        marginHorizontal: 16,
        marginBottom: 18,
        padding: 18,
        borderWidth: 1,
        borderColor: GREEN,
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
        marginRight: 12,
    },
    descriptionTitle: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 17,
    },
    descriptionText: {
        color: '#aaa',
        fontSize: 13,
        marginTop: 2,
    },
    infoCard: {
        backgroundColor: CARD_BG,
        borderRadius: 16,
        marginHorizontal: 16,
        marginBottom: 18,
        padding: 16,
        borderWidth: 1,
        borderColor: BORDER,
    },
    infoCardTitle: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 16,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    infoLabel: {
        color: '#aaa',
        fontSize: 13,
        marginBottom: 4,
    },
    infoValue: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 15,
    },
    infoInput: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 15,
        borderBottomWidth: 1,
        borderBottomColor: BORDER,
        paddingVertical: 2,
    },
}); 