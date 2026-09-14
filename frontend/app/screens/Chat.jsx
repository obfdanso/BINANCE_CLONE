import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Animated, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/Chat.styles';



export default function Chat() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const params = useLocalSearchParams();
    const scrollViewRef = useRef();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [showDealButton, setShowDealButton] = useState(false);
    const [dealType, setDealType] = useState(''); // 'buy' or 'sell'
    const [showQuickReplies, setShowQuickReplies] = useState(true);
    const [messageStatus, setMessageStatus] = useState({}); // 'sent', 'delivered', 'read'
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
    const dealButtonOpacity = useRef(new Animated.Value(0)).current;
    const dealButtonScale = useRef(new Animated.Value(0.8)).current;

    const { trader, traderId, rating, orders, online } = params;

    // Generate unique message ID
    const generateMessageId = () => {
        const id = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        return id;
    };

    // Chat persistence functions
    const getChatKey = () => `chat_${trader}_${traderId}`;

    const saveMessages = async (messages) => {
        try {
            const chatData = {
                messages,
                lastUpdated: Date.now(),
                trader,
                traderId
            };
            await AsyncStorage.setItem(getChatKey(), JSON.stringify(chatData));
        } catch (error) {
            console.error('Error saving messages:', error);
        }
    };

    const loadMessages = async () => {
        try {
            const chatData = await AsyncStorage.getItem(getChatKey());
            if (chatData) {
                const parsed = JSON.parse(chatData);
                const oneHourAgo = Date.now() - (60 * 60 * 1000); // 1 hour in milliseconds

                // Check if messages are older than 1 hour
                if (parsed.lastUpdated < oneHourAgo) {
                    // Clear old messages
                    await AsyncStorage.removeItem(getChatKey());
                    return [];
                }

                return parsed.messages || [];
            }
        } catch (error) {
            console.error('Error loading messages:', error);
        }
        return [];
    };

    const cleanupOldChats = async () => {
        try {
            const keys = await AsyncStorage.getAllKeys();
            const chatKeys = keys.filter(key => key.startsWith('chat_'));

            for (const key of chatKeys) {
                const chatData = await AsyncStorage.getItem(key);
                if (chatData) {
                    const parsed = JSON.parse(chatData);
                    const oneHourAgo = Date.now() - (60 * 60 * 1000);

                    if (parsed.lastUpdated < oneHourAgo) {
                        await AsyncStorage.removeItem(key);
                    }
                }
            }
        } catch (error) {
            console.error('Error cleaning up old chats:', error);
        }
    };

    // Quick reply options
    const quickReplies = [
        "What's the current price?",
        "What payment methods do you accept?",
        "What are the trading limits?",
        "How does the process work?",
        "How fast do you respond?",
        "I want to buy BTC",
        "I want to buy ETH",
        "I want to buy USDT",
        "I want to buy BNB",
        "I want to buy SOL",
        "I want to sell BTC",
        "I want to sell ETH",
        "I want to sell USDT",
        "I want to sell BNB",
        "I want to sell SOL"
    ];

    // Enhanced bot responses based on user messages
    const botResponses = {
        greetings: [
            "Hey there! 👋 Nice to meet you! I'm here to help with your trade. What's on your mind?",
            "Hi! 😊 Thanks for reaching out. I'm ready to assist with your transaction. What can I help you with?",
            "Hello! Great to connect with you! I'm here to make your trading experience smooth. What do you need?",
            "Hey! 👋 Welcome! I'm here to help you with your crypto trading. How can I assist you today?",
            "Hi there! 😊 Ready to help you with your trade. What would you like to know?"
        ],
        price: [
            "The current price is $1.00 per USDT. This is the best rate I can offer right now. Market's been stable! 📈",
            "I'm offering $1.00 per USDT. That's competitive with current market rates. Ready to trade? 💰",
            "Price is $1.00 per USDT. I always try to give fair rates to my customers. What do you think? 🤝",
            "Current rate is $1.00 per USDT. Can't really budge on that, but I'm happy to walk you through the process! 💯"
        ],
        payment: [
            "I accept GHS Mobile Money, GHS Bank Transfer, and other local payment methods. Which works best for you? 💳",
            "You can use GHS Mobile Money, Bank Transfer, or other local options. I'm pretty flexible! 📱",
            "I accept all the payment methods listed. GHS Mobile Money is usually the fastest. What's your preference? 🏦",
            "Payment options include GHS Mobile Money and Bank Transfer. All are secure and reliable! 🔒"
        ],
        limit: [
            "Trading limits are 100-50,000 GHS. This keeps things secure for both of us. What amount were you thinking? 🛡️",
            "Limits are 100-50,000 GHS. Pretty standard range that covers most trades. Fits your needs? 📊",
            "I can trade between 100-50,000 GHS. Just make sure your amount fits in that range! ✅",
            "Limits: 100-50,000 GHS. Set for everyone's safety. What amount do you have in mind? 💰"
        ],
        process: [
            "Super simple! Here's the process: 1) You place order, 2) I confirm, 3) You send payment, 4) I release crypto. Easy! 🚀",
            "It's straightforward: order → payment → crypto release. I'll guide you through each step! 📋",
            "Process: order → confirm → payment → release. I'll be here to help every step! 🎯",
            "Simple 4-step process: order, confirm, pay, release. Ready to get started? ⚡"
        ],
        buy: [
            "Awesome! 🎉 Ready to help you buy crypto. Click the button below to complete your purchase! 💰",
            "Perfect! Let's get your crypto purchase done! Click that button to finalize your buy order! 🚀",
            "Excellent choice! I'm ready to help you buy crypto. Click the button below to proceed! 💯",
            "Great! 🎉 Let's get your crypto purchase completed. Click the button below! 🎯"
        ],
        sell: [
            "Great! 🎉 Ready to help you sell your crypto. Click the button below to complete your sale! 💰",
            "Perfect! Let's get your crypto sale done! Click that button to finalize your sell order! 🚀",
            "Excellent choice! I'm ready to help you sell crypto. Click the button below to proceed! 💯",
            "Awesome! 🎉 Let's get your crypto sale completed. Click the button below! 🎯"
        ],
        time: [
            "I usually respond within 5-10 minutes during trading hours. I'm online now though, so I'm here for you! ⚡",
            "I try to get back within 5-10 minutes. Right now I'm here and ready to help! 🕐",
            "Pretty responsive - usually 5-10 minutes during trading hours. I'm online now, so fire away! 💬",
            "I respond quickly, usually within 5-10 minutes. And I'm online right now! 🎯"
        ],
        default: [
            "I want to make sure I understand. Could you give me a bit more detail? 🤔",
            "I'm here to help, but I want to get your question right. Can you clarify? 💭",
            "I want to give you the best help possible. Could you explain that a bit more? 🤝",
            "Let me make sure I understand correctly. Can you provide more details? 💡"
        ]
    };

    // Load messages from storage and cleanup old chats
    useEffect(() => {
        const initializeChat = async () => {
            // Clean up old chats first
            await cleanupOldChats();

            // Load messages for current trader
            const savedMessages = await loadMessages();
            setMessages(savedMessages);
        };

        initializeChat();
    }, [trader, traderId]);

    // Keyboard event listeners
    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            setIsKeyboardVisible(true);
        });
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setIsKeyboardVisible(false);
        });

        return () => {
            keyboardDidShowListener?.remove();
            keyboardDidHideListener?.remove();
        };
    }, []);

    const getBotResponse = (userMessage) => {
        const lowerMessage = userMessage.toLowerCase();

        // Check for buy-related keywords for all coins
        if (lowerMessage.includes('buy') || lowerMessage.includes('purchase') ||
            (lowerMessage.includes('want') && lowerMessage.includes('buy')) ||
            (lowerMessage.includes('get') && (lowerMessage.includes('usdt') || lowerMessage.includes('btc') || lowerMessage.includes('eth') || lowerMessage.includes('bnb') || lowerMessage.includes('sol'))) ||
            (lowerMessage.includes('want') && (lowerMessage.includes('usdt') || lowerMessage.includes('btc') || lowerMessage.includes('eth') || lowerMessage.includes('bnb') || lowerMessage.includes('sol'))) ||
            (lowerMessage.includes('need') && (lowerMessage.includes('usdt') || lowerMessage.includes('btc') || lowerMessage.includes('eth') || lowerMessage.includes('bnb') || lowerMessage.includes('sol')))) {
            setDealType('buy');
            setShowDealButton(true);
            // Animate the deal button appearance
            Animated.parallel([
                Animated.timing(dealButtonOpacity, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(dealButtonScale, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                })
            ]).start();
            return botResponses.buy[Math.floor(Math.random() * botResponses.buy.length)];
        }

        // Check for sell-related keywords for all coins
        if (lowerMessage.includes('sell') || lowerMessage.includes('exchange') ||
            (lowerMessage.includes('want') && lowerMessage.includes('sell')) ||
            (lowerMessage.includes('convert') && (lowerMessage.includes('usdt') || lowerMessage.includes('btc') || lowerMessage.includes('eth') || lowerMessage.includes('bnb') || lowerMessage.includes('sol'))) ||
            (lowerMessage.includes('trade') && (lowerMessage.includes('usdt') || lowerMessage.includes('btc') || lowerMessage.includes('eth') || lowerMessage.includes('bnb') || lowerMessage.includes('sol'))) ||
            (lowerMessage.includes('cash') && lowerMessage.includes('out'))) {
            setDealType('sell');
            setShowDealButton(true);
            // Animate the deal button appearance
            Animated.parallel([
                Animated.timing(dealButtonOpacity, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(dealButtonScale, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                })
            ]).start();
            return botResponses.sell[Math.floor(Math.random() * botResponses.sell.length)];
        }

        // Check for general transaction keywords (ask for clarification)
        if (lowerMessage.includes('deal') || lowerMessage.includes('transaction') || lowerMessage.includes('complete') ||
            lowerMessage.includes('proceed') || lowerMessage.includes('start') || lowerMessage.includes('ready') ||
            lowerMessage.includes('go ahead') || lowerMessage.includes('let\'s do it') || lowerMessage.includes('sure') ||
            lowerMessage.includes('order')) {
            return "I'd be happy to help! Are you looking to buy or sell crypto? I support BTC, ETH, USDT, BNB, and SOL. Just let me know which one you prefer!";
        } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey') || lowerMessage.includes('sup') ||
            lowerMessage.includes('good morning') || lowerMessage.includes('good afternoon') || lowerMessage.includes('good evening') ||
            lowerMessage.includes('my name is') || lowerMessage.includes('i am') || lowerMessage.includes('i\'m') ||
            lowerMessage.includes('this is') || lowerMessage.includes('call me')) {
            // Send the initial greeting message
            const greetingMessage = {
                id: generateMessageId(),
                text: `Hey there! 👋 I'm ${trader}. Great to meet you! I'm here to help make your trading experience smooth and easy. What can I help you with today?`,
                sender: 'bot',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            const updatedMessages = [...messages, greetingMessage];
            setMessages(updatedMessages);
            saveMessages(updatedMessages); // Save to storage
            return botResponses.greetings[Math.floor(Math.random() * botResponses.greetings.length)];
        } else if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('rate') || lowerMessage.includes('how much')) {
            return botResponses.price[Math.floor(Math.random() * botResponses.price.length)];
        } else if (lowerMessage.includes('payment') || lowerMessage.includes('pay') || lowerMessage.includes('method') || lowerMessage.includes('how to pay')) {
            return botResponses.payment[Math.floor(Math.random() * botResponses.payment.length)];
        } else if (lowerMessage.includes('limit') || lowerMessage.includes('minimum') || lowerMessage.includes('maximum') || lowerMessage.includes('range')) {
            return botResponses.limit[Math.floor(Math.random() * botResponses.limit.length)];
        } else if (lowerMessage.includes('process') || lowerMessage.includes('how') || lowerMessage.includes('step') || lowerMessage.includes('work')) {
            return botResponses.process[Math.floor(Math.random() * botResponses.process.length)];
        } else if (lowerMessage.includes('time') || lowerMessage.includes('when') || lowerMessage.includes('fast') || lowerMessage.includes('quick')) {
            return botResponses.time[Math.floor(Math.random() * botResponses.time.length)];
        } else {
            return botResponses.default[Math.floor(Math.random() * botResponses.default.length)];
        }
    };

    const sendMessage = (customMessage = null) => {
        const messageToSend = customMessage || message.trim();
        if (!messageToSend) return;

        const userMessage = {
            id: generateMessageId(),
            text: messageToSend,
            sender: 'user',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'sent'
        };

        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        saveMessages(newMessages); // Save to storage
        setMessage('');
        setIsTyping(true);
        setShowQuickReplies(false); // Hide quick replies after first user message

        // Update message status to delivered after 1 second
        setTimeout(() => {
            setMessageStatus(prev => ({ ...prev, [userMessage.id]: 'delivered' }));
        }, 1000);

        // Update message status to read after 2 seconds
        setTimeout(() => {
            setMessageStatus(prev => ({ ...prev, [userMessage.id]: 'read' }));
        }, 2000);

        // Simulate bot typing delay with more realistic timing
        const typingDelay = 2000 + Math.random() * 4000; // 2-6 seconds for more human-like feel
        setTimeout(() => {
            const botResponse = {
                id: generateMessageId(),
                text: getBotResponse(userMessage.text),
                sender: 'bot',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            const updatedMessages = [...newMessages, botResponse];
            setMessages(updatedMessages);
            saveMessages(updatedMessages); // Save to storage
            setIsTyping(false);
        }, typingDelay);
    };

    const handleQuickReply = (reply) => {
        sendMessage(reply);
    };

    const scrollToBottom = () => {
        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    const handleDealButton = () => {
        // Navigate to appropriate screen based on deal type
        const screenPath = dealType === 'sell' ? '/screens/P2PSell' : '/screens/P2PBuy';

        router.push({
            pathname: screenPath,
            params: {
                trader: trader,
                price: '$1.00', // Default price, you can pass actual price from P2P screen
                limit: '100-50,000', // Default limit
                payment: 'GHS Bank Transfer', // Updated to GHS
                fromChat: 'true', // Flag to indicate coming from chat
                supportedCoins: 'BTC,ETH,USDT,BNB,SOL' // List of supported coins
            }
        });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>

                <View style={styles.headerInfo}>
                    <View style={styles.traderInfo}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>{trader?.charAt(0)}</Text>
                        </View>
                        <View style={styles.traderDetails}>
                            <Text style={styles.traderName}>{trader}</Text>
                            <View style={styles.traderStats}>
                                <Text style={styles.rating}>⭐ {rating}</Text>
                                <Text style={styles.orders}>{orders} orders</Text>
                                {online && <View style={styles.onlineIndicator} />}
                            </View>
                        </View>
                    </View>
                </View>
            </View>

            {/* Description Box - Hidden when keyboard is visible */}
            {!isKeyboardVisible && (
                <View style={styles.descriptionBox}>
                    <View style={styles.descriptionContent}>
                        <Ionicons name="chatbubbles" size={20} color="#00C896" style={styles.descriptionIcon} />
                        <Text style={styles.descriptionText}>
                            Chat with {trader} about your trade. Ask questions about payment methods, limits, or the trading process. Messages are saved for 1 hour and will automatically disappear after that time for security reasons.
                        </Text>
                    </View>
                </View>
            )}

            {/* Messages */}
            <KeyboardAvoidingView
                style={styles.messagesContainer}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <ScrollView
                    ref={scrollViewRef}
                    style={styles.messagesList}
                    showsVerticalScrollIndicator={false}
                >
                    {messages.map((msg) => (
                        <View key={msg.id} style={[
                            styles.messageContainer,
                            msg.sender === 'user' ? styles.userMessage : styles.botMessage
                        ]}>
                            <View style={[
                                styles.messageBubble,
                                msg.sender === 'user' ? styles.userBubble : styles.botBubble
                            ]}>
                                <Text style={[
                                    styles.messageText,
                                    msg.sender === 'user' ? styles.userText : styles.botText
                                ]}>
                                    {msg.text}
                                </Text>
                                <View style={styles.messageFooter}>
                                    <Text style={styles.timestamp}>{msg.timestamp}</Text>
                                    {msg.sender === 'user' && (
                                        <View style={styles.messageStatus}>
                                            {messageStatus[msg.id] === 'read' ? (
                                                <Ionicons name="checkmark-done" size={12} color="#00C896" />
                                            ) : messageStatus[msg.id] === 'delivered' ? (
                                                <Ionicons name="checkmark-done" size={12} color="#666" />
                                            ) : (
                                                <Ionicons name="checkmark" size={12} color="#666" />
                                            )}
                                        </View>
                                    )}
                                </View>
                            </View>
                        </View>
                    ))}

                    {isTyping && (
                        <View key="typing-indicator" style={[styles.messageContainer, styles.botMessage]}>
                            <View style={[styles.messageBubble, styles.botBubble]}>
                                <View style={styles.typingIndicator}>
                                    <View style={styles.typingDot} />
                                    <View style={styles.typingDot} />
                                    <View style={styles.typingDot} />
                                </View>
                            </View>
                        </View>
                    )}
                </ScrollView>

                {/* Deal Button */}
                {showDealButton && (
                    <Animated.View
                        key="deal-button"
                        style={[
                            styles.dealButtonContainer,
                            {
                                opacity: dealButtonOpacity,
                                transform: [{ scale: dealButtonScale }]
                            }
                        ]}
                    >
                        <TouchableOpacity
                            style={styles.dealButton}
                            onPress={handleDealButton}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="card" size={20} color="#fff" style={styles.dealButtonIcon} />
                            <Text style={styles.dealButtonText}>
                                {dealType === 'sell' ? 'Sell Crypto' : 'Buy Crypto'}
                            </Text>
                            <Ionicons name="arrow-forward" size={16} color="#fff" style={styles.dealButtonArrow} />
                        </TouchableOpacity>
                    </Animated.View>
                )}

                {/* Quick Replies */}
                {showQuickReplies && (messages.length === 0 || (messages.length === 1 && messages[0].sender === 'bot')) && (
                    <View style={styles.quickRepliesContainer}>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.quickRepliesScroll}
                        >
                            {quickReplies.map((reply, index) => (
                                <TouchableOpacity
                                    key={`quick-reply-${reply}-${index}`}
                                    style={styles.quickReplyButton}
                                    onPress={() => handleQuickReply(reply)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.quickReplyText}>{reply}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                )}

                {/* Input */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Type your message..."
                        placeholderTextColor="#666"
                        value={message}
                        onChangeText={setMessage}
                        multiline
                        maxLength={500}
                    />
                    <TouchableOpacity
                        style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
                        onPress={() => sendMessage()}
                        disabled={!message.trim()}
                    >
                        <Ionicons
                            name="send"
                            size={20}
                            color={message.trim() ? '#fff' : '#666'}
                        />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
} 