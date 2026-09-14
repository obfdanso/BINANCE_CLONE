import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserContext = createContext();

export function UserProvider({ children }) {
    const [username, setUsername] = useState('user1234');
    const [fullName, setFullName] = useState('John Doe');
    const [phone, setPhone] = useState('+233 59 234 7667');
    const [email, setEmail] = useState('user@gmail.com');
    const [hasFirstDeposit, setHasFirstDeposit] = useState(false);
    const [balance, setBalance] = useState(0);

    // Load user data from AsyncStorage on mount
    useEffect(() => {
        const loadUserData = async () => {
            try {
                const userData = await AsyncStorage.getItem('userData');
                if (userData) {
                    const parsed = JSON.parse(userData);
                    setHasFirstDeposit(parsed.hasFirstDeposit || false);
                    setBalance(parsed.balance || 0);
                }
            } catch (error) {
                console.error('Error loading user data:', error);
            }
        };
        loadUserData();
    }, []);

    // Save user data to AsyncStorage whenever it changes
    const saveUserData = async (newData) => {
        try {
            const currentData = await AsyncStorage.getItem('userData');
            const existingData = currentData ? JSON.parse(currentData) : {};
            const updatedData = { ...existingData, ...newData };
            await AsyncStorage.setItem('userData', JSON.stringify(updatedData));
        } catch (error) {
            console.error('Error saving user data:', error);
        }
    };

    const updateFirstDeposit = (amount) => {
        setHasFirstDeposit(true);
        setBalance(amount);
        saveUserData({ hasFirstDeposit: true, balance: amount });
    };

    const updateBalance = (newBalance) => {
        setBalance(newBalance);
        saveUserData({ balance: newBalance });
    };

    return (
        <UserContext.Provider value={{
            username, setUsername,
            fullName, setFullName,
            phone, setPhone,
            email, setEmail,
            hasFirstDeposit,
            balance,
            updateFirstDeposit,
            updateBalance
        }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}

export default UserProvider; 