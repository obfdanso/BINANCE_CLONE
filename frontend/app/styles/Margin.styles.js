import { StyleSheet, Platform, Dimensions } from 'react-native';

const BG = '#0A0F1E';
const CARD_BG = '#1A1F2E';
const BORDER = 'rgba(255,255,255,0.06)';
const GREEN = '#00C896';
const RED = '#FF4D4F';

const shadow = Platform.select({
    ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
    },
    android: {
        elevation: 4,
    },
});

const windowHeight = Dimensions.get('window').height;

export default StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: BG,
    },
    container: {
        flex: 1,
        paddingHorizontal: 16,
    },
    containerTablet: {
        paddingHorizontal: 24,
    },
    scrollContentTablet: {
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        paddingTop: 5,
        marginBottom: 8,
    },
    headerTablet: {
        paddingHorizontal: 32,
        paddingVertical: 20,
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
    headerTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    headerTitleTablet: {
        fontSize: 24,
    },
    transferButton: {
        backgroundColor: 'rgba(0,200,150,0.1)',
        borderRadius: 30,
        padding: 12,
        borderWidth: 1.5,
        borderColor: 'rgba(0,200,150,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    chartContainer: {
        backgroundColor: CARD_BG,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: BORDER,
        ...shadow,
    },
    chartContainerTablet: {
        padding: 24,
        marginBottom: 20,
    },
    chartHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    chartHeaderTablet: {
        marginBottom: 20,
    },
    pairSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    pairInfo: {
        flex: 1,
    },
    pairSymbol: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    pairSymbolTablet: {
        fontSize: 22,
    },
    pairPrice: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    pairPriceTablet: {
        fontSize: 20,
    },
    priceChangeContainer: {
        alignItems: 'flex-end',
    },
    priceChange: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    priceChangeTablet: {
        fontSize: 18,
    },
    priceChangeLabel: {
        color: '#aaa',
        fontSize: 12,
    },
    chartArea: {
        height: 80,
        marginBottom: 16,
        justifyContent: 'center',
    },
    chartAreaTablet: {
        height: 120,
        marginBottom: 20,
    },
    chartLine: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 40,
    },
    chartPoint: {
        width: 3,
        height: 3,
        backgroundColor: GREEN,
        borderRadius: 1.5,
    },
    priceStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    priceStatsTablet: {
        gap: 16,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statLabel: {
        color: '#aaa',
        fontSize: 12,
        marginBottom: 4,
    },
    statValue: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    marginTypeContainer: {
        flexDirection: 'row',
        backgroundColor: CARD_BG,
        borderRadius: 12,
        padding: 4,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: BORDER,
        ...shadow,
    },
    marginTypeContainerTablet: {
        padding: 6,
        marginBottom: 20,
    },
    marginTypeButton: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    marginTypeButtonActive: {
        backgroundColor: GREEN,
    },
    marginTypeText: {
        color: '#aaa',
        fontSize: 14,
        fontWeight: '600',
    },
    marginTypeTextActive: {
        color: '#fff',
    },
    accountContainer: {
        backgroundColor: CARD_BG,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: BORDER,
        ...shadow,
    },
    accountContainerTablet: {
        padding: 24,
        marginBottom: 20,
    },
    accountHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    refreshButton: {
        padding: 4,
    },
    accountGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    accountGridTablet: {
        gap: 16,
    },
    accountItem: {
        flex: 1,
        minWidth: '45%',
        backgroundColor: 'rgba(35,40,52,0.5)',
        borderRadius: 8,
        padding: 12,
        borderWidth: 1,
        borderColor: BORDER,
    },
    accountLabel: {
        color: '#aaa',
        fontSize: 12,
        marginBottom: 4,
    },
    accountValue: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    calculatorContainer: {
        backgroundColor: CARD_BG,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: BORDER,
        ...shadow,
    },
    calculatorContainerTablet: {
        padding: 24,
        marginBottom: 20,
    },
    calculatorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.06)',
    },
    calculatorLabel: {
        color: '#aaa',
        fontSize: 14,
    },
    calculatorValue: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    leverageButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,200,150,0.1)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(0,200,150,0.3)',
    },
    leverageValue: {
        color: GREEN,
        fontSize: 14,
        fontWeight: '600',
        marginRight: 4,
    },
    tradingContainer: {
        backgroundColor: CARD_BG,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: BORDER,
        ...shadow,
    },
    tradingContainerTablet: {
        padding: 24,
        marginBottom: 20,
    },
    orderTypeContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(35,40,52,0.5)',
        borderRadius: 8,
        padding: 4,
        marginBottom: 16,
    },
    orderTypeButton: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
        alignItems: 'center',
    },
    orderTypeButtonActive: {
        backgroundColor: GREEN,
    },
    orderTypeText: {
        color: '#aaa',
        fontSize: 14,
        fontWeight: '500',
    },
    orderTypeTextActive: {
        color: '#fff',
    },
    amountContainer: {
        marginBottom: 16,
    },
    amountLabel: {
        color: '#aaa',
        fontSize: 14,
        marginBottom: 8,
    },
    amountInput: {
        backgroundColor: 'rgba(35,40,52,0.5)',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 12,
        color: '#fff',
        fontSize: 16,
        borderWidth: 1,
        borderColor: BORDER,
    },
    riskContainer: {
        marginBottom: 16,
    },
    riskTitle: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 12,
    },
    riskRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    riskLabel: {
        color: '#aaa',
        fontSize: 14,
        flex: 1,
    },
    riskInput: {
        backgroundColor: 'rgba(35,40,52,0.5)',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        color: '#fff',
        fontSize: 14,
        borderWidth: 1,
        borderColor: BORDER,
        flex: 1,
        marginLeft: 12,
    },
    actionButtonsContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    actionButtonsContainerTablet: {
        gap: 16,
    },
    buyButton: {
        flex: 1,
        backgroundColor: GREEN,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        ...shadow,
    },
    buyButtonTablet: {
        paddingVertical: 20,
        borderRadius: 16,
    },
    buyButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    buyButtonTextTablet: {
        fontSize: 18,
    },
    sellButton: {
        flex: 1,
        backgroundColor: RED,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        ...shadow,
    },
    sellButtonTablet: {
        paddingVertical: 20,
        borderRadius: 16,
    },
    sellButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    sellButtonTextTablet: {
        fontSize: 18,
    },
    positionsContainer: {
        backgroundColor: CARD_BG,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: BORDER,
        ...shadow,
    },
    positionsContainerTablet: {
        padding: 24,
        marginBottom: 20,
    },
    positionsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    viewAllButton: {
        paddingVertical: 4,
        paddingHorizontal: 8,
    },
    viewAllText: {
        color: GREEN,
        fontSize: 14,
        fontWeight: '500',
    },
    noPositionsContainer: {
        alignItems: 'center',
        paddingVertical: 32,
    },
    noPositionsText: {
        color: '#666',
        fontSize: 16,
        fontWeight: '600',
        marginTop: 12,
        marginBottom: 4,
    },
    noPositionsSubtext: {
        color: '#666',
        fontSize: 14,
        textAlign: 'center',
    },
    tradesContainer: {
        backgroundColor: CARD_BG,
        borderRadius: 12,
        padding: 16,
        marginBottom: 32,
        borderWidth: 1,
        borderColor: BORDER,
        ...shadow,
    },
    tradesContainerTablet: {
        padding: 24,
        marginBottom: 40,
    },
    tradesList: {
        gap: 12,
    },
    tradeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 12,
        backgroundColor: 'rgba(35,40,52,0.5)',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: BORDER,
    },
    tradeInfo: {
        flex: 1,
    },
    tradePair: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 2,
    },
    tradeTime: {
        color: '#aaa',
        fontSize: 12,
    },
    tradeDetails: {
        alignItems: 'flex-end',
    },
    tradePrice: {
        color: GREEN,
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 2,
    },
    tradeAmount: {
        color: '#aaa',
        fontSize: 12,
    },
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    modalBlur: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: CARD_BG,
        borderRadius: 20,
        padding: 20,
        margin: 20,
        maxHeight: windowHeight * 0.7,
        width: '90%',
        borderWidth: 1,
        borderColor: BORDER,
        ...shadow,
    },
    modalContentTablet: {
        maxWidth: 600,
        width: '70%',
        padding: 32,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: BORDER,
    },
    modalTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    closeButton: {
        padding: 4,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    leverageList: {
        maxHeight: windowHeight * 0.5,
    },
    leverageItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginBottom: 8,
        backgroundColor: 'rgba(35,40,52,0.5)',
    },
    leverageItemActive: {
        backgroundColor: 'rgba(0,200,150,0.1)',
        borderWidth: 1,
        borderColor: 'rgba(0,200,150,0.3)',
    },
    leverageItemText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    leverageItemTextActive: {
        color: GREEN,
        fontWeight: '600',
    },
    pairList: {
        maxHeight: windowHeight * 0.5,
    },
    pairItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginBottom: 8,
        backgroundColor: 'rgba(35,40,52,0.5)',
    },
    pairItemActive: {
        backgroundColor: 'rgba(0,200,150,0.1)',
        borderWidth: 1,
        borderColor: 'rgba(0,200,150,0.3)',
    },
    pairItemInfo: {
        flex: 1,
    },
    pairItemSymbol: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    pairItemPrice: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    pairItemStats: {
        alignItems: 'flex-end',
        marginRight: 12,
    },
    pairItemChange: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 2,
    },
    positiveChange: {
        color: GREEN,
    },
    negativeChange: {
        color: RED,
    },
    pairItemVolume: {
        color: '#aaa',
        fontSize: 12,
    },
    transferOptions: {
        gap: 16,
    },
    transferOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
        backgroundColor: 'rgba(35,40,52,0.5)',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: BORDER,
    },
    transferOptionText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 12,
    },
    // Order Modal Styles
    orderForm: {
        gap: 20,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    orderInputContainer: {
        marginBottom: 16,
    },
    orderInputLabel: {
        color: '#aaa',
        fontSize: 14,
        marginBottom: 8,
        fontWeight: '500',
    },
    orderInput: {
        backgroundColor: 'rgba(35,40,52,0.5)',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        color: '#fff',
        fontSize: 16,
        borderWidth: 1,
        borderColor: BORDER,
    },
    orderSummary: {
        backgroundColor: 'rgba(35,40,52,0.3)',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: BORDER,
    },
    orderSummaryLabel: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    orderSummaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    orderSummaryText: {
        color: '#aaa',
        fontSize: 14,
    },
    orderSummaryValue: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    submitOrderButton: {
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        ...shadow,
    },
    submitOrderButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
}); 