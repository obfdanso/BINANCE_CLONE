import React, { createContext, useContext, useState } from 'react';

const CoinContext = createContext();

export const useCoinContext = () => {
  const context = useContext(CoinContext);
  if (!context) {
    throw new Error('useCoinContext must be used within a CoinProvider');
  }
  return context;
};

export const CoinProvider = ({ children }) => {
  const [selectedCoin, setSelectedCoin] = useState({
    symbol: 'USDT',
    name: 'TetherUS',
    balance: '0.04186958',
    usdValue: '$0.041869',
    icon: 'currency-usdt',
    color: '#00C896'
  });

  const updateSelectedCoin = (coin) => {
    setSelectedCoin(coin);
  };

  return (
    <CoinContext.Provider value={{ selectedCoin, updateSelectedCoin }}>
      {children}
    </CoinContext.Provider>
  );
};

export default CoinProvider; 