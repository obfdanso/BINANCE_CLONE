import { StyleSheet, Platform } from 'react-native';

const BG = '#0A0F1E';
const CARD_BG = '#1A1F2E';
const BORDER = 'rgba(255,255,255,0.06)';
const GREEN = '#00C896';
const LIGHT_GRAY = '#aaa';

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

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BG,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        paddingTop: 24,
        borderBottomWidth: 1,
        borderBottomColor: BORDER,
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
        marginRight: 16,
    },
    headerInfo: {
        flex: 1,
    },
    traderInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: GREEN,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    avatarText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    traderDetails: {
        flex: 1,
    },
    traderName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    traderStats: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rating: {
        color: LIGHT_GRAY,
        fontSize: 12,
        marginRight: 8,
    },
    orders: {
        color: LIGHT_GRAY,
        fontSize: 12,
        marginRight: 8,
    },
    onlineIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: GREEN,
    },
    descriptionBox: {
        backgroundColor: CARD_BG,
        margin: 20,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: GREEN,
        ...shadow,
    },
    descriptionContent: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    descriptionIcon: {
        marginRight: 12,
        marginTop: 2,
    },
    descriptionText: {
        color: LIGHT_GRAY,
        fontSize: 14,
        lineHeight: 20,
        flex: 1,
    },
    messagesContainer: {
        flex: 1,
        marginHorizontal: 20,
    },
    messagesList: {
        flex: 1,
    },
    messageContainer: {
        marginVertical: 6,
        flexDirection: 'row',
        paddingHorizontal: 4,
    },
    userMessage: {
        justifyContent: 'flex-end',
        marginLeft: 60,
    },
    botMessage: {
        justifyContent: 'flex-start',
        marginRight: 60,
    },
    messageBubble: {
        maxWidth: '75%',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 20,
        ...shadow,
    },
    userBubble: {
        backgroundColor: GREEN,
        borderBottomRightRadius: 6,
        shadowColor: GREEN,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    botBubble: {
        backgroundColor: CARD_BG,
        borderWidth: 1,
        borderColor: BORDER,
        borderBottomLeftRadius: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    messageText: {
        fontSize: 16,
        lineHeight: 22,
        marginBottom: 4,
        fontWeight: '400',
    },
    userText: {
        color: '#fff',
        fontWeight: '500',
    },
    botText: {
        color: '#fff',
        fontWeight: '400',
    },
    timestamp: {
        fontSize: 11,
        color: LIGHT_GRAY,
        opacity: 0.7,
        fontWeight: '400',
    },
    messageFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 6,
        paddingTop: 2,
    },
    messageStatus: {
        marginLeft: 6,
        opacity: 0.8,
    },
    typingIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 4,
    },
    typingDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: LIGHT_GRAY,
        marginRight: 6,
        opacity: 0.5,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingVertical: 16,
        paddingHorizontal: 4,
        borderTopWidth: 1,
        borderTopColor: BORDER,
    },
    textInput: {
        flex: 1,
        backgroundColor: CARD_BG,
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 12,
        paddingTop: 12,
        paddingBottom: 12,
        color: '#fff',
        fontSize: 15,
        borderWidth: 1,
        borderColor: BORDER,
        marginRight: 12,
        maxHeight: 100,
        minHeight: 44,
    },
    sendButton: {
        backgroundColor: GREEN,
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        ...shadow,
    },
    sendButtonDisabled: {
        backgroundColor: CARD_BG,
        borderWidth: 1,
        borderColor: BORDER,
    },
    dealButtonContainer: {
        paddingHorizontal: 4,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: BORDER,
    },
    dealButton: {
        backgroundColor: GREEN,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 12,
        ...shadow,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    dealButtonIcon: {
        marginRight: 8,
    },
    dealButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        flex: 1,
        textAlign: 'center',
    },
    dealButtonArrow: {
        marginLeft: 8,
    },
    // Quick Replies Styles
    quickRepliesContainer: {
        paddingVertical: 12,
        paddingHorizontal: 4,
        borderTopWidth: 1,
        borderTopColor: BORDER,
    },
    quickRepliesScroll: {
        paddingHorizontal: 4,
    },
    quickReplyButton: {
        backgroundColor: CARD_BG,
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginRight: 8,
        borderWidth: 1,
        borderColor: BORDER,
        ...shadow,
    },
    quickReplyText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '500',
    },
}); 