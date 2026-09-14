import { StyleSheet } from 'react-native';

const GREEN = '#00C896';
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

    // Confirmation Card
    confirmationCard: {
        backgroundColor: '#1A1F2E',
        borderRadius: 16,
        padding: 24,
        marginBottom: 20,
        alignItems: 'center',
    },
    confirmationHeader: {
        alignItems: 'center',
    },
    confirmationIcon: {
        marginBottom: 16,
    },
    confirmationTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
        textAlign: 'center',
    },
    confirmationSubtitle: {
        fontSize: 14,
        color: '#aaa',
        textAlign: 'center',
        lineHeight: 20,
    },

    // Details Card
    detailsCard: {
        backgroundColor: '#1A1F2E',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 16,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    detailLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    detailLabel: {
        fontSize: 14,
        color: '#aaa',
        marginLeft: 8,
    },
    detailValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#fff',
    },
    divider: {
        height: 1,
        backgroundColor: '#333',
        marginVertical: 16,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    totalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: GREEN,
    },

    // Notice Card
    noticeCard: {
        backgroundColor: '#1A1F2E',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        borderLeftWidth: 4,
        borderLeftColor: BLUE,
    },
    noticeHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    noticeTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        marginLeft: 8,
    },
    noticeText: {
        fontSize: 14,
        color: '#aaa',
        lineHeight: 20,
    },

    // Confirm Button
    confirmButtonContainer: {
        marginBottom: 30,
    },
    confirmButton: {
        backgroundColor: GREEN,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    confirmButtonProcessing: {
        backgroundColor: '#333',
    },
    confirmButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    processingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    spinner: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#fff',
        borderTopColor: 'transparent',
        marginRight: 8,
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