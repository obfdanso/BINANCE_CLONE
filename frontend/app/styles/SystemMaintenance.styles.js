import { StyleSheet } from 'react-native';

const BG = '#0A0F1E';
const CARD_BG = '#1A1F2E';
const BORDER = 'rgba(255,255,255,0.06)';
const GREEN = '#00C896';
const INACTIVE_TAB = '#aaa';

export default StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: BG,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 8,
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
        borderRadius: 12,
        marginHorizontal: 16,
        marginBottom: 16,
        paddingVertical: 22,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: GREEN,
        alignItems: 'flex-start',
        minHeight: 70,
    },
    descriptionIconWrapper: {
        backgroundColor: '#232834',
        borderRadius: 16,
        padding: 7,
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    descriptionTitle: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 2,
    },
    descriptionText: {
        color: '#aaa',
        fontSize: 13,
    },
    sectionTitle: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 15,
        marginLeft: 20,
        marginBottom: 10,
    },
    detailCard: {
        backgroundColor: CARD_BG,
        borderRadius: 16,
        marginHorizontal: 16,
        marginBottom: 18,
        padding: 16,
        borderWidth: 1,
        borderColor: BORDER,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 4,
    },
    detailIcon: {
        backgroundColor: '#232834',
        borderRadius: 16,
        padding: 10,
        marginRight: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    detailTitle: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    detailDesc: {
        color: '#aaa',
        fontSize: 13,
        marginBottom: 6,
    },
    detailMetaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    detailMeta: {
        color: INACTIVE_TAB,
        fontSize: 12,
    },
    detailWarningRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    detailWarning: {
        color: GREEN,
        fontSize: 12,
        fontWeight: 'bold',
    },
    scheduledBadge: {
        backgroundColor: GREEN,
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 4,
        alignSelf: 'flex-start',
        marginLeft: 10,
    },
    scheduledText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
    },
}); 