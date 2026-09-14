import { StyleSheet } from 'react-native';
import responsiveUtils from '../utils/responsive';

const {
    scale,
    verticalScale,
    horizontalScale,
    fontSize,
    spacing,
    padding,
    borderRadius,
    iconSize,
    buttonSize,
    cardSize,
    getDeviceType,
    isTablet,
    getModalSize,
    getPlatformShadow
} = responsiveUtils;

const BG = '#0A0F1E';
const CARD_BG = '#1A1F2E';
const BORDER = 'rgba(255,255,255,0.06)';
const PILL_BG = '#232834';
const ACTIVE_TAB = '#00C896';
const INACTIVE_TAB = '#aaa';
const GREEN = '#00C896';
const RED = '#FF4D4F';
const WHITE = '#FFFFFF';
const TEXT_PRIMARY = '#FFFFFF';
const TEXT_SECONDARY = '#CCCCCC';

const shadow = getPlatformShadow();

export const FuturesStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BG,
    },
    navigationTabs: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: CARD_BG,
        borderRadius: borderRadius.lg,
        padding: 2,
        borderWidth: 1,
        borderColor: BORDER,
    },
    navTab: {
        backgroundColor: 'transparent',
        borderRadius: borderRadius.md,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        marginRight: 2,
    },
    navTabActive: {
        backgroundColor: PILL_BG,
    },
    navTabText: {
        fontSize: fontSize.base,
        fontWeight: 'bold',
        color: INACTIVE_TAB,
        textAlign: 'center',
    },
    navTabTextActive: {
        color: WHITE,
    },
    activeIndicator: {
        alignSelf: 'center',
        width: 16,
        height: 2,
        backgroundColor: ACTIVE_TAB,
        marginTop: 2,
        borderRadius: 1,
    },
    menuIcon: {
        marginLeft: 'auto',
        padding: scale(4),
        borderRadius: borderRadius.sm,
    },
    tradingPairSection: {
        backgroundColor: CARD_BG,
        marginHorizontal: spacing.md,
        marginTop: spacing.sm,
        borderRadius: borderRadius.xl,
        borderWidth: 1,
        borderColor: BORDER,
        ...shadow,
    },
    tradingPairInfo: {
        padding: padding.lg,
        borderRadius: borderRadius.xl,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        backgroundColor: 'rgba(255,255,255,0.02)',
    },
    tradingPairText: {
        fontSize: fontSize.lg,
        fontWeight: '600',
        color: TEXT_PRIMARY,
        marginBottom: spacing.xs,
    },
    priceChange: {
        fontSize: fontSize.base,
        fontWeight: '500',
        marginBottom: spacing.xs,
    },
    fundingInfo: {
        fontSize: fontSize.sm,
        color: TEXT_SECONDARY,
        marginBottom: 2,
    },
    mainContent: {
        flex: 1,
        flexDirection: 'row',
    },
    orderBookSection: {
        flex: 1,
        backgroundColor: CARD_BG,
        borderRightWidth: 1,
        borderRightColor: BORDER,
    },
    orderBookHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: horizontalScale(15),
        paddingVertical: verticalScale(10),
        borderBottomWidth: 1,
        borderBottomColor: BORDER,
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    orderBookTitle: {
        fontSize: fontSize.base,
        fontWeight: '500',
        color: TEXT_SECONDARY,
    },
    orderBookContent: {
        flex: 1,
    },
    sellOrders: {
        paddingHorizontal: horizontalScale(15),
        paddingVertical: verticalScale(10),
    },
    orderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: scale(3),
        borderRadius: borderRadius.sm,
    },
    sellOrderRow: {
        backgroundColor: 'rgba(255, 77, 79, 0.1)',
    },
    buyOrderRow: {
        backgroundColor: 'rgba(0, 200, 150, 0.1)',
    },
    orderPrice: {
        fontSize: fontSize.base,
        fontWeight: '500',
    },
    sellPrice: {
        color: RED,
    },
    buyPrice: {
        color: GREEN,
    },
    orderAmount: {
        fontSize: fontSize.base,
        color: TEXT_SECONDARY,
    },
    currentPrice: {
        alignItems: 'center',
        paddingVertical: padding.md,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
        backgroundColor: 'rgba(255,255,255,0.03)',
        marginVertical: spacing.xs,
    },
    currentPriceText: {
        fontSize: fontSize.xl,
        fontWeight: 'bold',
        color: TEXT_PRIMARY,
        marginBottom: 2,
    },
    currentPriceSubtext: {
        fontSize: fontSize.sm,
        color: TEXT_SECONDARY,
    },
    buyOrders: {
        paddingHorizontal: horizontalScale(15),
        paddingVertical: verticalScale(10),
    },
    orderBookFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: horizontalScale(15),
        paddingVertical: verticalScale(10),
        borderTopWidth: 1,
        borderTopColor: BORDER,
        backgroundColor: 'rgba(0,0,0,0.05)',
    },
    precisionSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: scale(8),
        paddingVertical: scale(4),
        borderRadius: borderRadius.sm,
        backgroundColor: PILL_BG,
    },
    precisionText: {
        fontSize: fontSize.base,
        color: TEXT_SECONDARY,
        marginRight: scale(5),
    },
    orderFormSection: {
        flex: 1,
        backgroundColor: CARD_BG,
        paddingHorizontal: horizontalScale(15),
    },
    leverageSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.md,
        paddingHorizontal: spacing.sm,
    },
    leverageButton: {
        flex: 1,
        backgroundColor: PILL_BG,
        borderRadius: borderRadius.md,
        paddingVertical: padding.sm,
        paddingHorizontal: padding.md,
        marginHorizontal: spacing.xs,
        borderWidth: 1,
        borderColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        ...shadow,
    },
    leverageButtonActive: {
        backgroundColor: ACTIVE_TAB,
        borderColor: ACTIVE_TAB,
        transform: [{ scale: 1.05 }],
    },
    leverageButtonText: {
        fontSize: fontSize.sm,
        fontWeight: '600',
        color: TEXT_SECONDARY,
    },
    leverageButtonTextActive: {
        color: WHITE,
        fontWeight: 'bold',
    },
    availableBalance: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: verticalScale(15),
        paddingVertical: verticalScale(10),
        borderBottomWidth: 1,
        borderBottomColor: BORDER,
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: borderRadius.sm,
        paddingHorizontal: horizontalScale(10),
    },
    availableText: {
        fontSize: fontSize.base,
        color: TEXT_SECONDARY,
    },
    availableAmount: {
        fontSize: fontSize.base,
        fontWeight: '500',
        color: TEXT_PRIMARY,
    },
    orderTypeSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: verticalScale(15),
    },
    orderTypeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: horizontalScale(12),
        paddingVertical: verticalScale(8),
        borderRadius: borderRadius.xl,
        backgroundColor: PILL_BG,
        marginRight: scale(10),
        borderWidth: 1,
        borderColor: BORDER,
    },
    orderTypeText: {
        fontSize: fontSize.base,
        fontWeight: '500',
        color: TEXT_SECONDARY,
        marginRight: scale(5),
    },
    inputSection: {
        marginBottom: verticalScale(15),
    },
    inputLabel: {
        fontSize: fontSize.sm,
        color: TEXT_SECONDARY,
        marginBottom: spacing.xs,
        fontWeight: '500',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: PILL_BG,
        borderRadius: borderRadius.md,
        paddingHorizontal: padding.sm,
        borderWidth: 1,
        borderColor: BORDER,
        ...shadow,
    },
    inputField: {
        flex: 1,
        color: TEXT_PRIMARY,
        fontSize: fontSize.base,
        fontWeight: '500',
        paddingVertical: padding.sm,
        textAlign: 'center',
    },
    inputButton: {
        backgroundColor: ACTIVE_TAB,
        paddingHorizontal: padding.sm,
        paddingVertical: padding.xs,
        borderRadius: borderRadius.sm,
        marginLeft: spacing.xs,
    },
    inputButtonText: {
        color: WHITE,
        fontSize: fontSize.sm,
        fontWeight: '600',
    },
    sliderContainer: {
        marginVertical: spacing.md,
        paddingHorizontal: spacing.md,
    },
    slider: {
        height: 4,
        backgroundColor: PILL_BG,
        borderRadius: borderRadius.full,
        position: 'relative',
        borderWidth: 1,
        borderColor: BORDER,
    },
    sliderThumb: {
        width: 20,
        height: 20,
        backgroundColor: ACTIVE_TAB,
        borderRadius: borderRadius.full,
        borderWidth: 2,
        borderColor: WHITE,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    radioSection: {
        flexDirection: 'row',
        marginBottom: verticalScale(15),
    },
    radioButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: scale(20),
    },
    radioCircle: {
        width: scale(16),
        height: scale(16),
        borderRadius: scale(8),
        borderWidth: 2,
        borderColor: BORDER,
        marginRight: scale(8),
    },
    radioCircleSelected: {
        borderColor: ACTIVE_TAB,
        backgroundColor: ACTIVE_TAB,
    },
    radioText: {
        fontSize: fontSize.base,
        color: TEXT_SECONDARY,
    },
    gtcSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: verticalScale(15),
        paddingHorizontal: horizontalScale(8),
        paddingVertical: verticalScale(6),
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: borderRadius.sm,
    },
    gtcText: {
        fontSize: fontSize.base,
        color: TEXT_SECONDARY,
        marginRight: scale(5),
    },
    maxCostSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: verticalScale(15),
    },
    maxCostItem: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: verticalScale(8),
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: borderRadius.sm,
        marginHorizontal: scale(2),
    },
    maxCostLabel: {
        fontSize: fontSize.sm,
        color: TEXT_SECONDARY,
        marginBottom: scale(2),
        fontWeight: '500',
    },
    maxCostValue: {
        fontSize: fontSize.base,
        fontWeight: '500',
        color: TEXT_PRIMARY,
    },
    actionButtons: {
        marginBottom: verticalScale(15),
    },
    buyButton: {
        backgroundColor: ACTIVE_TAB,
        paddingVertical: verticalScale(15),
        borderRadius: borderRadius.md,
        alignItems: 'center',
        marginBottom: verticalScale(10),
        ...shadow,
        borderWidth: 1,
        borderColor: ACTIVE_TAB,
    },
    sellButton: {
        backgroundColor: RED,
        paddingVertical: verticalScale(15),
        borderRadius: borderRadius.md,
        alignItems: 'center',
        ...shadow,
        borderWidth: 1,
        borderColor: RED,
    },
    actionButtonText: {
        fontSize: fontSize.lg,
        fontWeight: '600',
        color: TEXT_PRIMARY,
    },

    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
    },
    modalContent: {
        backgroundColor: CARD_BG,
        borderRadius: borderRadius.md,
        width: '100%',
        maxHeight: '80%',
        borderWidth: 1,
        borderColor: BORDER,
        ...shadow,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: padding.lg,
        borderBottomWidth: 1,
        borderBottomColor: BORDER,
    },
    modalTitle: {
        fontSize: fontSize.lg,
        fontWeight: '600',
        color: TEXT_PRIMARY,
    },
    modalScroll: {
        maxHeight: 400,
    },
    coinOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: padding.lg,
        borderBottomWidth: 1,
        borderBottomColor: BORDER,
    },
    coinOptionSelected: {
        backgroundColor: PILL_BG,
        borderLeftWidth: 3,
        borderLeftColor: ACTIVE_TAB,
    },
    coinInfo: {
        flex: 1,
    },
    coinSymbol: {
        fontSize: fontSize.lg,
        fontWeight: '600',
        color: TEXT_PRIMARY,
        marginBottom: 2,
    },
    coinName: {
        fontSize: fontSize.base,
        color: TEXT_SECONDARY,
    },
    coinPrice: {
        alignItems: 'flex-end',
    },
    coinPriceText: {
        fontSize: fontSize.lg,
        fontWeight: '600',
        color: TEXT_PRIMARY,
        marginBottom: 2,
    },
    coinChange: {
        fontSize: fontSize.base,
        fontWeight: '500',
    },
}); 