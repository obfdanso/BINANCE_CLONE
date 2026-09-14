import { StyleSheet } from 'react-native';

const BG = '#0A0F1E';
const CARD_BG = '#1A1F2E';
const BORDER = 'rgba(255,255,255,0.06)';
const GREEN = '#00C896';
const RED = '#FF6B6B';
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
    warningBox: {
        backgroundColor: 'rgba(255, 107, 107, 0.1)',
        borderRadius: 12,
        marginHorizontal: 16,
        marginBottom: 16,
        paddingVertical: 24,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 107, 107, 0.3)',
        alignItems: 'center',
    },
    warningIconContainer: {
        marginBottom: 12,
    },
    warningTitle: {
        color: RED,
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 8,
        textAlign: 'center',
    },
    warningText: {
        color: '#fff',
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
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
    instructionRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    instructionIcon: {
        marginRight: 12,
        marginTop: 2,
    },
    instructionText: {
        flex: 1,
    },
    instructionTitle: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 15,
        marginBottom: 2,
    },
    instructionDesc: {
        color: INACTIVE_TAB,
        fontSize: 13,
        lineHeight: 18,
    },
    deleteItemRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    deleteItemIcon: {
        marginRight: 12,
        marginTop: 2,
    },
    deleteItemText: {
        flex: 1,
    },
    deleteItemTitle: {
        color: RED,
        fontWeight: '600',
        fontSize: 15,
        marginBottom: 2,
    },
    deleteItemDesc: {
        color: INACTIVE_TAB,
        fontSize: 13,
        lineHeight: 18,
    },
    confirmationBox: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: 'rgba(255, 107, 107, 0.1)',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 107, 107, 0.3)',
    },
    confirmationText: {
        color: '#fff',
        fontSize: 14,
        lineHeight: 20,
        marginLeft: 12,
        flex: 1,
    },
    buttonContainer: {
        paddingHorizontal: 16,
        marginTop: 8,
    },
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 107, 107, 0.2)',
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderWidth: 1,
        borderColor: RED,
        marginBottom: 12,
    },
    confirmDeleteButton: {
        backgroundColor: RED,
    },
    deleteButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: 8,
    },
    cancelButton: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderWidth: 1,
        borderColor: INACTIVE_TAB,
    },
    cancelButtonText: {
        color: INACTIVE_TAB,
        fontWeight: '600',
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: 'rgba(24,28,35,0.85)',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#232834',
        borderRadius: 20,
        padding: 32,
        alignItems: 'center',
        width: 320,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.16,
        shadowRadius: 8,
        elevation: 8,
    },
    modalIconContainer: {
        marginBottom: 16,
    },
    modalTitle: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 22,
        marginBottom: 8,
        textAlign: 'center',
    },
    modalText: {
        color: '#aaa',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 22,
    },
    modalButton: {
        backgroundColor: GREEN,
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 12,
        alignItems: 'center',
        minWidth: 120,
    },
    modalButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
}); 