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
        paddingHorizontal: 10,
        paddingTop: 8,
        paddingBottom: 2,
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
        padding: 12,
        borderWidth: 1,
        borderColor: BORDER,
        alignItems: 'center',
    },
    descriptionText: {
        color: '#aaa',
        fontSize: 15,
        textAlign: 'center',
    },
    resultsSection: {
        backgroundColor: CARD_BG,
        borderRadius: 16,
        marginHorizontal: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: BORDER,
    },
    marketHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    marketHeaderName: {
        color: '#aaa',
        fontSize: 13,
        flex: 1,
        textAlign: 'left',
        paddingLeft: 8,
    },
    marketHeaderPrice: {
        color: '#aaa',
        fontSize: 13,
        flex: 1,
        textAlign: 'center',
    },
    marketHeaderChange: {
        color: '#aaa',
        fontSize: 13,
        flex: 1,
        textAlign: 'right',
    },
    marketRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    marketName: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 15,
        flex: 1,
        textAlign: 'left',
        paddingLeft: 8,
    },
    marketPrice: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 15,
        flex: 1,
        textAlign: 'center',
    },
    marketChangeWrapper: {
        flex: 1,
        alignItems: 'flex-end',
    },
    marketChange: {
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 3,
    },
    marketChangeText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 13,
    },
}); 