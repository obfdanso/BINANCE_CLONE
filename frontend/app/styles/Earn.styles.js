import { StyleSheet, Dimensions } from 'react-native';

const BG = '#0A0F1E';
const CARD_BG = '#1A1F2E';
const BORDER = 'rgba(255,255,255,0.06)';
const GREEN = '#00C896';
const RED = '#FF4D4F';

const windowWidth = Dimensions.get('window').width;

export default StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: BG,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 8,
        paddingTop: 10,
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
        margin: 16,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: GREEN,
    },
    descriptionContent: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    descriptionIconContainer: {
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
    descriptionText: {
        color: '#aaa',
        fontSize: 14,
        lineHeight: 20,
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 32,
    },
    tabsContainer: {
        flexDirection: 'row',
        backgroundColor: CARD_BG,
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 16,
        padding: 2,
    },
    tab: {
        flex: 1,
        paddingVertical: 6,
        paddingHorizontal: 18,
        borderRadius: 14,
        alignItems: 'center',
        marginRight: 2,
    },
    activeTab: {
        backgroundColor: '#232834',
    },
    tabText: {
        color: '#aaa',
        fontSize: 13,
        fontWeight: '500',
    },
    activeTabText: {
        color: '#fff',
        fontWeight: '600',
    },
    productsContainer: {
        paddingHorizontal: 16,
    },
    productCard: {
        backgroundColor: CARD_BG,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: BORDER,
    },
    productHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    productIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#232834',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    productIcon: {
        fontSize: 20,
    },
    productInfo: {
        flex: 1,
    },
    productName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    productCoin: {
        color: '#aaa',
        fontSize: 13,
    },
    productApy: {
        alignItems: 'flex-end',
    },
    apyLabel: {
        color: '#aaa',
        fontSize: 11,
        marginBottom: 2,
    },
    apyValue: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    productDetails: {
        marginBottom: 12,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    detailLabel: {
        color: '#aaa',
        fontSize: 12,
    },
    detailValue: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '500',
    },
    productFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    statusText: {
        color: GREEN,
        fontSize: 12,
        fontWeight: '500',
    },
    subscribeButton: {
        backgroundColor: GREEN,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    subscribeButtonText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '600',
    },
    unsubscribeButton: {
        backgroundColor: RED,
    },
    unsubscribeButtonText: {
        color: '#fff',
    },
    positionsSection: {
        marginTop: 24,
        paddingHorizontal: 16,
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    positionsCard: {
        backgroundColor: CARD_BG,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: BORDER,
    },
    positionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    positionTitle: {
        color: '#aaa',
        fontSize: 14,
    },
    positionValue: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    positionStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statItem: {
        alignItems: 'center',
    },
    statLabel: {
        color: '#aaa',
        fontSize: 12,
        marginBottom: 4,
    },
    statValue: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    modalContent: {
        backgroundColor: CARD_BG,
        borderRadius: 20,
        padding: 20,
        margin: 20,
        maxWidth: windowWidth - 40,
        borderWidth: 1,
        borderColor: BORDER,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalBody: {
        marginBottom: 20,
    },
    modalProductInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#232834',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    modalProductIcon: {
        fontSize: 24,
    },
    modalProductName: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    modalProductCoin: {
        color: '#aaa',
        fontSize: 14,
    },
    modalDetails: {
        backgroundColor: '#232834',
        borderRadius: 12,
        padding: 16,
    },
    modalDetailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    modalDetailLabel: {
        color: '#aaa',
        fontSize: 14,
    },
    modalDetailValue: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    modalFooter: {
        alignItems: 'center',
    },
    modalSubscribeButton: {
        backgroundColor: GREEN,
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderRadius: 25,
        width: '100%',
        alignItems: 'center',
    },
    modalSubscribeButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    confirmationText: {
        color: '#aaa',
        fontSize: 14,
        lineHeight: 20,
        textAlign: 'center',
        marginTop: 16,
        paddingHorizontal: 8,
    },
    modalButtonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 25,
        alignItems: 'center',
        marginHorizontal: 4,
    },
    cancelButton: {
        backgroundColor: '#232834',
        borderWidth: 1,
        borderColor: BORDER,
    },
    confirmButton: {
        backgroundColor: GREEN,
    },
    cancelButtonText: {
        color: '#aaa',
        fontSize: 16,
        fontWeight: '600',
    },
    confirmButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    successIconContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    successTitle: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 12,
    },
    successMessage: {
        color: '#aaa',
        fontSize: 16,
        lineHeight: 22,
        textAlign: 'center',
        marginBottom: 24,
        paddingHorizontal: 8,
    },
    successButton: {
        backgroundColor: GREEN,
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 25,
        alignItems: 'center',
        alignSelf: 'center',
        minWidth: 120,
    },
    successButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
}); 