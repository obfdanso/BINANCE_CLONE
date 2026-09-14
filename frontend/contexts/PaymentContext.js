import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PaymentContext = createContext();

export const usePayment = () => {
    const context = useContext(PaymentContext);
    if (!context) {
        throw new Error('usePayment must be used within a PaymentProvider');
    }
    return context;
};

export const PaymentProvider = ({ children }) => {
    const [mobileMoney, setMobileMoney] = useState([
        { id: 1, name: 'MTN Mobile Money', desc: 'Connected', connected: true, number: '+233 59 234 7667' },
    ]);

    // Load saved payment data on app start
    useEffect(() => {
        loadPaymentData();
    }, []);

    const loadPaymentData = async () => {
        try {
            const savedData = await AsyncStorage.getItem('mobileMoneyData');
            if (savedData) {
                const parsedData = JSON.parse(savedData);
                setMobileMoney(parsedData);
            }
        } catch (error) {
            console.error('Error loading payment data:', error);
        }
    };

    const savePaymentData = async (data) => {
        try {
            await AsyncStorage.setItem('mobileMoneyData', JSON.stringify(data));
        } catch (error) {
            console.error('Error saving payment data:', error);
        }
    };

    const connectMobileMoney = (id, number) => {
        const updatedMobileMoney = mobileMoney.map(mobile =>
            mobile.id === id
                ? { ...mobile, connected: true, desc: 'Connected', number }
                : mobile
        );
        setMobileMoney(updatedMobileMoney);
        savePaymentData(updatedMobileMoney);
    };

    const disconnectMobileMoney = (id) => {
        const updatedMobileMoney = mobileMoney.map(mobile =>
            mobile.id === id
                ? { ...mobile, connected: false, desc: 'Not connected', number: '' }
                : mobile
        );
        setMobileMoney(updatedMobileMoney);
        savePaymentData(updatedMobileMoney);
    };

    const getConnectedMobileMoney = () => {
        return mobileMoney.filter(mobile => mobile.connected);
    };

    const isMobileMoneyConnected = (id) => {
        const mobile = mobileMoney.find(m => m.id === id);
        return mobile ? mobile.connected : false;
    };

    const value = {
        mobileMoney,
        connectMobileMoney,
        disconnectMobileMoney,
        getConnectedMobileMoney,
        isMobileMoneyConnected,
    };

    return (
        <PaymentContext.Provider value={value}>
            {children}
        </PaymentContext.Provider>
    );
}; 