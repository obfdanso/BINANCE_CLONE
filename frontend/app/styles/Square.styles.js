import { StyleSheet } from 'react-native';

export const squareStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A0F1E',
    },
    content: {
        flex: 1,
        marginTop: 40,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    backButton: {
        marginRight: 15,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    tabsContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
    },
    tabText: {
        fontSize: 15,
        fontWeight: '500',
    },
    tabTextActive: {
        color: '#fff',
    },
    tabTextInactive: {
        color: '#6C6C7A',
    },
    tabIndicator: {
        height: 2,
        backgroundColor: '#00C896',
        marginTop: 4,
        borderRadius: 1,
        width: '100%',
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 20,
    },
    card: {
        backgroundColor: '#181E2A',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    cardTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    newsItem: {
        marginBottom: 16,
    },
    newsImage: {
        width: 80,
        height: 60,
        borderRadius: 8,
        marginRight: 12,
    },
    newsContent: {
        flex: 1,
    },
    newsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    newsCategory: {
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    newsCategoryText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '500',
    },
    newsTime: {
        color: '#aaa',
        fontSize: 12,
    },
    newsTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 6,
        lineHeight: 22,
    },
    newsDescription: {
        color: '#aaa',
        fontSize: 14,
        lineHeight: 20,
    },
    coinItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    coinLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    coinIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: 12,
    },
    coinInfo: {
        flex: 1,
    },
    coinName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    coinSymbol: {
        color: '#aaa',
        fontSize: 12,
    },
    coinRight: {
        alignItems: 'flex-end',
    },
    coinPrice: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    coinChange: {
        fontSize: 12,
    },
    coinChangePositive: {
        color: '#00C896',
    },
    coinChangeNegative: {
        color: '#FF6B6B',
    },
    progressBar: {
        height: 8,
        backgroundColor: '#2A2F3A',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#00C896',
        borderRadius: 4,
    },
    progressText: {
        color: '#aaa',
        fontSize: 12,
        marginTop: 8,
        textAlign: 'center',
    },
    courseGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    courseCard: {
        backgroundColor: '#2A2F3A',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        minWidth: '45%',
    },
    courseHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    courseIcon: {
        marginRight: 8,
    },
    courseTitle: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    courseSubtitle: {
        color: '#aaa',
        fontSize: 12,
    },
    courseImage: {
        width: 80,
        height: 60,
        borderRadius: 8,
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    featuredNews: {
        backgroundColor: '#181E2A',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    featuredImage: {
        width: '100%',
        height: 180,
        borderRadius: 8,
        marginBottom: 12,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    statsLabel: {
        color: '#aaa',
        fontSize: 14,
    },
    statsValue: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    statsValuePositive: {
        color: '#00C896',
    },
    statsValueNegative: {
        color: '#FF6B6B',
    },
}); 