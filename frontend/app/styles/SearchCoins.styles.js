import { StyleSheet } from 'react-native';

export const searchCoinsStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A0F1E',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    searchInput: {
        backgroundColor: '#181E2A',
        color: '#fff',
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        marginBottom: 24,
        marginTop: 20,
    },
    coinItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#181E2A',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
    },
    coinItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    coinIcon: {
        width: 28,
        height: 28,
        marginRight: 12,
        borderRadius: 14,
        backgroundColor: '#222',
    },
    coinName: {
        color: '#fff',
        fontSize: 16,
    },
    heartIcon: {
        size: 22,
    },
    heartIconFavourite: {
        color: '#00C896',
    },
    heartIconNotFavourite: {
        color: '#aaa',
    },
    emptyText: {
        color: '#aaa',
        textAlign: 'center',
        marginTop: 40,
    },
    doneButton: {
        alignSelf: 'center',
        marginTop: 20,
        backgroundColor: '#00C896',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 40,
    },
    doneButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
}); 