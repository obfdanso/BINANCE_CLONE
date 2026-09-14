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
        paddingTop: 70,
        paddingBottom: 8,
    },
    backButton: {
        backgroundColor: 'rgba(35,40,52,0.95)',
        borderRadius: 30,
        padding: 12,
        borderWidth: 1.5,
        borderColor: BORDER,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.16,
        shadowRadius: 8,
        elevation: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },

    scrollContent: {
        paddingBottom: 32,
        minHeight: '100%',
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
    descriptionIcon: {
        backgroundColor: '#232834',
        borderRadius: 16,
        padding: 7,
        marginRight: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    descriptionTextContainer: {
        flex: 1,
        minWidth: 0,
    },
    descriptionTitle: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 2,
    },
    descriptionText: {
        color: INACTIVE_TAB,
        fontSize: 13,
    },
    sectionCard: {
        backgroundColor: CARD_BG,
        borderRadius: 16,
        marginHorizontal: 16,
        marginBottom: 18,
        padding: 16,
        borderWidth: 1,
        borderColor: BORDER,
    },
    sectionTitle: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 12,
    },
    sectionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 14,
    },
    sectionIconBubble: {
        backgroundColor: '#232834',
        borderRadius: 16,
        padding: 10,
        marginRight: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sectionRowTextWrap: {
        flex: 1,
    },
    sectionRowTitle: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 15,
    },
    sectionRowDesc: {
        color: INACTIVE_TAB,
        fontSize: 13,
        marginTop: 2,
    },
}); 