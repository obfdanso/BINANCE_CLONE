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
        paddingTop: 24,
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
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    infoIconBubble: {
        backgroundColor: '#232834',
        borderRadius: 16,
        padding: 10,
        marginRight: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    infoTextWrap: {
        flex: 1,
    },
    infoLabel: {
        color: INACTIVE_TAB,
        fontSize: 13,
        marginBottom: 2,
    },
    infoValue: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 15,
    },
    addressContainer: {
        marginBottom: 8,
    },
    addressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    addressTextWrap: {
        flex: 1,
    },
    addressValue: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 15,
        fontFamily: 'monospace',
    },
    eyeButton: {
        padding: 8,
        marginLeft: 8,
    },
    copyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 200, 150, 0.1)',
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: GREEN,
    },
    copyButtonText: {
        color: GREEN,
        fontWeight: '600',
        fontSize: 14,
        marginLeft: 8,
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 14,
    },
    actionIconBubble: {
        backgroundColor: '#232834',
        borderRadius: 16,
        padding: 10,
        marginRight: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionTextWrap: {
        flex: 1,
    },
    actionTitle: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 15,
    },
    actionDesc: {
        color: INACTIVE_TAB,
        fontSize: 13,
        marginTop: 2,
    },
}); 