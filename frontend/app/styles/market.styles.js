import { StyleSheet } from 'react-native';

export const marketStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A0F1E',
    },
    content: {
        flex: 1,
        marginTop: 40,
    },
    headerContainer: {
        paddingHorizontal: 10,
        paddingTop: 10,
    },
    marketsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    marketsTitle: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#181E2A',
        borderRadius: 10,
        paddingHorizontal: 12,
        height: 52,
        marginBottom: 32,
        width: '95%',
        alignSelf: 'center',
    },
    searchIcon: {
        marginRight: 8,
    },
    searchText: {
        color: '#aaa',
        fontSize: 15,
    },
    subTabsContainer: {
        flexDirection: 'row',
        marginBottom: 18,
        justifyContent: 'space-between',
        marginTop: 10,
    },
    subTab: {
        flex: 1,
        alignItems: 'center',
    },
    subTabText: {
        fontSize: 15,
        fontWeight: '500',
    },
    subTabTextActive: {
        color: '#fff',
    },
    subTabTextInactive: {
        color: '#6C6C7A',
    },
    subTabIndicator: {
        height: 2,
        backgroundColor: '#00C896',
        marginTop: 4,
        borderRadius: 1,
        width: '100%',
    },
    marketTabsContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        justifyContent: 'space-between',
    },
    marketTab: {
        flex: 1,
        alignItems: 'center',
    },
    marketTabText: {
        fontSize: 14,
        fontWeight: '500',
    },
    marketTabTextActive: {
        color: '#00C896',
    },
    marketTabTextInactive: {
        color: '#6C6C7A',
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 20,
    },
    emptyStateContainer: {
        alignItems: 'center',
        marginTop: 60,
    },
    emptyStateIcon: {
        marginBottom: 24,
    },
    emptyStateTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '500',
        marginBottom: 10,
    },
    emptyStateText: {
        color: '#aaa',
        fontSize: 14,
        textAlign: 'center',
        width: 220,
    },
    favouritesContainer: {
        marginTop: 40,
        width: '100%',
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    favouriteItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#181E2A',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 5,
        // Add subtle gradient effect
        position: 'relative',
        overflow: 'hidden',
    },
    favouriteItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    coinIcon: {
        width: 44,
        height: 44,
        marginRight: 16,
        borderRadius: 22,
        backgroundColor: '#2A2F3E',
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.1)',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    coinInfo: {
        flex: 1,
    },
    coinName: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 4,
        letterSpacing: 0.5,
    },
    coinSymbol: {
        color: '#6C6C7A',
        fontSize: 14,
        fontWeight: '500',
        letterSpacing: 0.3,
    },
    favouriteItemRight: {
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        height: 44,
    },
    priceContainer: {
        alignItems: 'flex-end',
        marginBottom: 8,
    },
    priceText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: 'bold',
        marginBottom: 2,
        letterSpacing: 0.5,
    },
    changeText: {
        fontSize: 14,
        fontWeight: '600',
        letterSpacing: 0.3,
    },
    removeButton: {
        padding: 10,
        borderRadius: 22,
        backgroundColor: 'rgba(0,200,150,0.15)',
        borderWidth: 1,
        borderColor: 'rgba(0,200,150,0.3)',
        shadowColor: '#00C896',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    marketSection: {
        flex: 1,
    },
    marketHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    marketTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    marketSubtitle: {
        color: '#aaa',
        fontSize: 14,
    },
    marketCard: {
        backgroundColor: '#181E2A',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#2A2F3E',
    },
    marketCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    marketCardLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    marketCardIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#2A2F3E',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    marketCardIconText: {
        color: '#00C896',
        fontSize: 16,
        fontWeight: 'bold',
    },
    marketCardInfo: {
        flex: 1,
    },
    marketCardName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    marketCardSymbol: {
        color: '#aaa',
        fontSize: 12,
    },
    marketCardChange: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    marketCardChangePositive: {
        color: '#00C896',
    },
    marketCardChangeNegative: {
        color: '#FF6B6B',
    },
    marketCardPrice: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    marketCardDetails: {
        alignItems: 'flex-end',
    },
    marketCardDetail: {
        color: '#aaa',
        fontSize: 12,
    },
    marketCardRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    marketCardStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    marketCardStat: {
        color: '#aaa',
        fontSize: 12,
    },
    optionCardIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    optionCardIconCall: {
        backgroundColor: '#00C896',
    },
    optionCardIconPut: {
        backgroundColor: '#FF6B6B',
    },
    optionCardIconText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    optionExpiry: {
        color: '#666',
        fontSize: 11,
        marginTop: 4,
    },
    squareText: {
        color: '#fff',
        fontSize: 18,
        marginTop: 60,
    },
}); 