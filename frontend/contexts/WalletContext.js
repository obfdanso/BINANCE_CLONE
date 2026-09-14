import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WalletContext = createContext();

export const useWallet = () => {
    const context = useContext(WalletContext);
    if (!context) {
        throw new Error('useWallet must be used within a WalletProvider');
    }
    return context;
};

export const WalletProvider = ({ children }) => {
    const [walletCreated, setWalletCreated] = useState(false);
    const [walletName, setWalletName] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [assets, setAssets] = useState([]);

    // Load wallet status from storage on app start
    useEffect(() => {
        loadWalletStatus();
    }, []);

    const loadWalletStatus = async () => {
        try {
            const walletData = await AsyncStorage.getItem('bitbyWallet');
            if (walletData) {
                const parsedData = JSON.parse(walletData);
                setWalletCreated(parsedData.created || false);
                setWalletName(parsedData.name || '');
                setBalance(parsedData.balance || 0);
                setTransactions(parsedData.transactions || []);
                setAssets(parsedData.assets || []);
            }
        } catch (error) {
            console.log('Error loading wallet status:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const createWallet = async (name, password) => {
        try {
            const walletData = {
                created: true,
                name: name,
                createdAt: new Date().toISOString(),
                // In a real app, you would encrypt and store the password securely
                // For now, we'll just store the creation status
            };

            await AsyncStorage.setItem('bitbyWallet', JSON.stringify(walletData));
            setWalletCreated(true);
            setWalletName(name);
            return true;
        } catch (error) {
            console.log('Error creating wallet:', error);
            return false;
        }
    };

    const clearWallet = async () => {
        try {
            await AsyncStorage.removeItem('bitbyWallet');
            setWalletCreated(false);
            setWalletName('');
            setBalance(0);
        } catch (error) {
            console.log('Error clearing wallet:', error);
        }
    };

    const updateBalance = async (amount) => {
        try {
            const newBalance = balance + amount;
            setBalance(newBalance);

            // Update stored wallet data
            const walletData = await AsyncStorage.getItem('bitbyWallet');
            if (walletData) {
                const parsedData = JSON.parse(walletData);
                const updatedData = {
                    ...parsedData,
                    balance: newBalance
                };
                await AsyncStorage.setItem('bitbyWallet', JSON.stringify(updatedData));
            }
        } catch (error) {
            console.log('Error updating balance:', error);
        }
    };

    const addTransaction = async (transaction) => {
        try {
            const newTransaction = {
                id: Date.now().toString(),
                timestamp: new Date().toISOString(),
                ...transaction
            };

            const updatedTransactions = [newTransaction, ...transactions];
            setTransactions(updatedTransactions);

            // Update stored wallet data
            const walletData = await AsyncStorage.getItem('bitbyWallet');
            if (walletData) {
                const parsedData = JSON.parse(walletData);
                const updatedData = {
                    ...parsedData,
                    transactions: updatedTransactions
                };
                await AsyncStorage.setItem('bitbyWallet', JSON.stringify(updatedData));
            }
        } catch (error) {
            console.log('Error adding transaction:', error);
        }
    };

    const updateAssets = async (asset) => {
        try {
            const existingAssetIndex = assets.findIndex(a => a.symbol === asset.symbol);
            let updatedAssets;

            if (existingAssetIndex >= 0) {
                // Update existing asset
                updatedAssets = [...assets];
                updatedAssets[existingAssetIndex] = {
                    ...updatedAssets[existingAssetIndex],
                    amount: updatedAssets[existingAssetIndex].amount + asset.amount
                };
            } else {
                // Add new asset
                updatedAssets = [...assets, asset];
            }

            setAssets(updatedAssets);

            // Update stored wallet data
            const walletData = await AsyncStorage.getItem('bitbyWallet');
            if (walletData) {
                const parsedData = JSON.parse(walletData);
                const updatedData = {
                    ...parsedData,
                    assets: updatedAssets
                };
                await AsyncStorage.setItem('bitbyWallet', JSON.stringify(updatedData));
            }
        } catch (error) {
            console.log('Error updating assets:', error);
        }
    };

    const value = {
        walletCreated,
        walletName,
        isLoading,
        balance,
        transactions,
        assets,
        createWallet,
        clearWallet,
        updateBalance,
        addTransaction,
        updateAssets,
    };

    return (
        <WalletContext.Provider value={value}>
            {children}
        </WalletContext.Provider>
    );
}; 