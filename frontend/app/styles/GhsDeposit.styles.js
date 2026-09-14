import { StyleSheet } from 'react-native';

const GREEN = '#00C896';
const RED = '#FF4D4F';
const BLUE = '#1890FF';

export default StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#0A0E1A',
    },
    contentWrapper: {
        flex: 1,
        backgroundColor: '#0A0E1A',
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },

    // Header Styles
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        paddingTop: 24,
        backgroundColor: '#0A0E1A',
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
    headerCenter: {
        flex: 1,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    headerRight: {
        width: 40,
        alignItems: 'flex-end',
    },
    notificationButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#1A1F2E',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    notificationBadge: {
        position: 'absolute',
        top: -2,
        right: -2,
        backgroundColor: RED,
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    notificationBadgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },

    // Description Card
    descriptionCard: {
        backgroundColor: '#1A1F2E',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        borderLeftWidth: 4,
        borderLeftColor: BLUE,
    },
    descriptionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    descriptionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        marginLeft: 8,
    },
    descriptionText: {
        fontSize: 14,
        color: '#aaa',
        lineHeight: 20,
    },

    // Amount Input
    amountCard: {
        backgroundColor: '#1A1F2E',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
    },
    amountLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 15,
    },
    amountInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#232834',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 10,
    },
    currencySymbol: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginRight: 8,
    },
    amountInput: {
        flex: 1,
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        padding: 0,
    },
    amountHint: {
        fontSize: 12,
        color: '#666',
        fontStyle: 'italic',
    },

    // Payment Method Selection
    paymentMethodCard: {
        backgroundColor: '#1A1F2E',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 15,
    },
    paymentMethodItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#232834',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedPaymentMethod: {
        borderColor: GREEN,
        backgroundColor: '#1A2E1A',
    },
    paymentMethodLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    paymentIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    paymentMethodInfo: {
        flex: 1,
    },
    paymentMethodName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 2,
    },
    paymentMethodDesc: {
        fontSize: 12,
        color: '#aaa',
    },
    paymentMethodRight: {
        alignItems: 'flex-end',
        marginRight: 12,
    },
    paymentFee: {
        fontSize: 12,
        color: '#666',
        marginBottom: 2,
    },
    paymentTime: {
        fontSize: 12,
        color: '#666',
    },
    selectedIndicator: {
        position: 'absolute',
        top: 12,
        right: 12,
    },

    // Proceed Button
    proceedButtonContainer: {
        marginBottom: 30,
    },
    proceedButton: {
        backgroundColor: GREEN,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    proceedButtonDisabled: {
        backgroundColor: '#333',
    },
    proceedButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    proceedButtonTextDisabled: {
        color: '#666',
    },

    // Modal Styles
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    modalContent: {
        backgroundColor: '#1A1F2E',
        borderRadius: 20,
        padding: 24,
        width: '100%',
        maxWidth: 350,
        alignItems: 'center',
    },
    modalHeader: {
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 10,
        textAlign: 'center',
    },
    confirmDetails: {
        width: '100%',
        marginBottom: 20,
    },
    confirmRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    confirmLabel: {
        fontSize: 14,
        color: '#aaa',
    },
    confirmValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#fff',
    },
    modalButtons: {
        flexDirection: 'row',
        width: '100%',
        gap: 12,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: '#333',
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    confirmButton: {
        flex: 1,
        backgroundColor: GREEN,
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: 'center',
    },
    confirmButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    successMessage: {
        fontSize: 14,
        color: '#aaa',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 20,
    },
    successButton: {
        backgroundColor: GREEN,
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 30,
        alignItems: 'center',
    },
    successButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
}); 