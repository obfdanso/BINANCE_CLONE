import { View, Text, TouchableOpacity, SafeAreaView, Image, ActivityIndicator } from 'react-native';
import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useMarketData } from '../../contexts/MarketDataContext';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams, useNavigation } from 'expo-router';
import { marketStyles } from '../styles/market.styles';

const COIN_ICONS = {
  'Bitcoin': 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
  'Ethereum': 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
  'Solana': 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
  'Cardano': 'https://assets.coingecko.com/coins/images/975/large/cardano.png',
  'Dogecoin': 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png',
  'Polkadot': 'https://assets.coingecko.com/coins/images/12171/large/polkadot.png',
  'Avalanche': 'https://assets.coingecko.com/coins/images/12559/large/coin-round-red.png',
  'XRP': 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png',
  'Litecoin': 'https://assets.coingecko.com/coins/images/2/large/litecoin.png',
  'Polygon': 'https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png',
  'Shiba Inu': 'https://assets.coingecko.com/coins/images/11939/large/shiba.png',
  'Uniswap': 'https://assets.coingecko.com/coins/images/12504/large/uniswap-uni.png',
  'Chainlink': 'https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png',
  'Tron': 'https://assets.coingecko.com/coins/images/1094/large/tron-logo.png',
  'Cosmos': 'https://assets.coingecko.com/coins/images/1481/large/cosmos_hub.png',
  'Aptos': 'https://assets.coingecko.com/coins/images/26455/large/aptos_round.png',
  'Arbitrum': 'https://assets.coingecko.com/coins/images/16547/large/photo_2023-03-29_21.47.00.jpeg',
  'Optimism': 'https://assets.coingecko.com/coins/images/25244/large/Optimism.png',
  'Sui': 'https://assets.coingecko.com/coins/images/26375/large/sui_asset.jpeg',
  'Toncoin': 'https://assets.coingecko.com/coins/images/17980/large/ton_symbol.png',
  'Pepe': 'https://assets.coingecko.com/coins/images/29850/large/pepe-token.jpeg',
  'Fantom': 'https://assets.coingecko.com/coins/images/4001/large/Fantom.png',
  'Stellar': 'https://assets.coingecko.com/coins/images/100/large/Stellar_symbol_black_RGB.png',
  'VeChain': 'https://assets.coingecko.com/coins/images/1167/large/VET_Token_Icon.png',
  'Maker': 'https://assets.coingecko.com/coins/images/1364/large/Mark_Maker.png',
  'Aave': 'https://assets.coingecko.com/coins/images/12645/large/AAVE.png',
  'The Graph': 'https://assets.coingecko.com/coins/images/13397/large/Graph_Token.png',
  'Lido DAO': 'https://assets.coingecko.com/coins/images/13573/large/Lido_DAO.png',
  'Synthetix': 'https://assets.coingecko.com/coins/images/3406/large/SNX.png',
  'Curve DAO': 'https://assets.coingecko.com/coins/images/12124/large/Curve.png',
};

// Comprehensive market data
const MARKET_DATA = {
  crypto: [
    { symbol: 'BTCUSDT', name: 'Bitcoin', price: 65000, change24h: 2.5, volume24h: '2.5B', marketCap: '1.2T', volume: 1250000 },
    { symbol: 'ETHUSDT', name: 'Ethereum', price: 3200, change24h: -1.2, volume24h: '1.8B', marketCap: '385B', volume: 890000 },
    { symbol: 'BNBUSDT', name: 'BNB', price: 580, change24h: 0.8, volume24h: '890M', marketCap: '89B', volume: 450000 },
    { symbol: 'SOLUSDT', name: 'Solana', price: 145, change24h: 5.2, volume24h: '1.2B', marketCap: '65B', volume: 680000 },
    { symbol: 'ADAUSDT', name: 'Cardano', price: 0.45, change24h: 3.1, volume24h: '450M', marketCap: '16B', volume: 220000 },
    { symbol: 'XRPUSDT', name: 'XRP', price: 0.52, change24h: -0.8, volume24h: '380M', marketCap: '28B', volume: 180000 },
    { symbol: 'DOTUSDT', name: 'Polkadot', price: 9.0, change24h: 1.5, volume24h: '220M', marketCap: '11B', volume: 95000 },
    { symbol: 'DOGEUSDT', name: 'Dogecoin', price: 0.085, change24h: 4.2, volume24h: '320M', marketCap: '12B', volume: 150000 },
    { symbol: 'MATICUSDT', name: 'Polygon', price: 0.75, change24h: 2.8, volume24h: '280M', marketCap: '7.2B', volume: 120000 },
    { symbol: 'LINKUSDT', name: 'Chainlink', price: 7.0, change24h: -1.8, volume24h: '180M', marketCap: '4.1B', volume: 85000 },
  ],
  spot: [
    { symbol: 'BTCUSDT', name: 'Bitcoin', price: 65000, change24h: 2.5, volume24h: '2.5B', lastPrice: 65000, high24h: 65500, low24h: 64500 },
    { symbol: 'ETHUSDT', name: 'Ethereum', price: 3200, change24h: -1.2, volume24h: '1.8B', lastPrice: 3200, high24h: 3250, low24h: 3180 },
    { symbol: 'BNBUSDT', name: 'BNB', price: 580, change24h: 0.8, volume24h: '890M', lastPrice: 580, high24h: 585, low24h: 575 },
    { symbol: 'SOLUSDT', name: 'Solana', price: 145, change24h: 5.2, volume24h: '1.2B', lastPrice: 145, high24h: 148, low24h: 142 },
    { symbol: 'ADAUSDT', name: 'Cardano', price: 0.45, change24h: 3.1, volume24h: '450M', lastPrice: 0.45, high24h: 0.46, low24h: 0.44 },
  ],
  futures: [
    { symbol: 'BTCUSDT', name: 'Bitcoin Perpetual', price: 65000, change24h: 2.5, volume24h: '8.2B', fundingRate: 0.01, openInterest: '2.1B', longShortRatio: 1.2 },
    { symbol: 'ETHUSDT', name: 'Ethereum Perpetual', price: 3200, change24h: -1.2, volume24h: '5.8B', fundingRate: -0.005, openInterest: '1.8B', longShortRatio: 0.95 },
    { symbol: 'BNBUSDT', name: 'BNB Perpetual', price: 580, change24h: 0.8, volume24h: '2.1B', fundingRate: 0.008, openInterest: '450M', longShortRatio: 1.15 },
    { symbol: 'SOLUSDT', name: 'Solana Perpetual', price: 145, change24h: 5.2, volume24h: '3.2B', fundingRate: 0.015, openInterest: '680M', longShortRatio: 1.35 },
    { symbol: 'ADAUSDT', name: 'Cardano Perpetual', price: 0.45, change24h: 3.1, volume24h: '890M', fundingRate: 0.006, openInterest: '180M', longShortRatio: 1.08 },
  ],
  margin: [
    { symbol: 'BTCUSDT', name: 'Bitcoin', price: 65000, change24h: 2.5, volume24h: '1.2B', marginRatio: 0.85, availableBalance: 125000, borrowedAmount: 25000 },
    { symbol: 'ETHUSDT', name: 'Ethereum', price: 3200, change24h: -1.2, volume24h: '890M', marginRatio: 0.92, availableBalance: 45000, borrowedAmount: 12000 },
    { symbol: 'BNBUSDT', name: 'BNB', price: 580, change24h: 0.8, volume24h: '450M', marginRatio: 0.78, availableBalance: 22000, borrowedAmount: 8000 },
    { symbol: 'SOLUSDT', name: 'Solana', price: 145, change24h: 5.2, volume24h: '680M', marginRatio: 0.95, availableBalance: 18000, borrowedAmount: 5000 },
    { symbol: 'ADAUSDT', name: 'Cardano', price: 0.45, change24h: 3.1, volume24h: '220M', marginRatio: 0.88, availableBalance: 8500, borrowedAmount: 3000 },
  ],
  options: [
    { symbol: 'BTC-30JUN24-65000-C', name: 'BTC Call 65000', price: 0.025, change24h: 15.2, volume24h: '45M', strikePrice: 65000, expiry: '30 JUN 2024', type: 'Call', delta: 0.65, gamma: 0.002 },
    { symbol: 'BTC-30JUN24-65000-P', name: 'BTC Put 65000', price: 0.018, change24h: -8.5, volume24h: '32M', strikePrice: 65000, expiry: '30 JUN 2024', type: 'Put', delta: -0.35, gamma: 0.002 },
    { symbol: 'ETH-30JUN24-3200-C', name: 'ETH Call 3200', price: 0.085, change24h: 12.8, volume24h: '28M', strikePrice: 3200, expiry: '30 JUN 2024', type: 'Call', delta: 0.58, gamma: 0.003 },
    { symbol: 'ETH-30JUN24-3200-P', name: 'ETH Put 3200', price: 0.062, change24h: -5.2, volume24h: '22M', strikePrice: 3200, expiry: '30 JUN 2024', type: 'Put', delta: -0.42, gamma: 0.003 },
    { symbol: 'BNB-30JUN24-580-C', name: 'BNB Call 580', price: 0.045, change24h: 9.6, volume24h: '15M', strikePrice: 580, expiry: '30 JUN 2024', type: 'Call', delta: 0.52, gamma: 0.004 },
  ]
};

// Market Scenarios - 10 different market conditions
const MARKET_SCENARIOS = [
  // Scenario 0: Bull Market
  {
    name: "Bull Market",
    crypto: [
      { symbol: 'BTCUSDT', name: 'Bitcoin', price: 72000, change24h: 8.5, volume24h: '3.2B', marketCap: '1.4T', volume: 1600000 },
      { symbol: 'ETHUSDT', name: 'Ethereum', price: 3800, change24h: 12.2, volume24h: '2.5B', marketCap: '456B', volume: 1200000 },
      { symbol: 'BNBUSDT', name: 'BNB', price: 680, change24h: 6.8, volume24h: '1.2B', marketCap: '102B', volume: 580000 },
      { symbol: 'SOLUSDT', name: 'Solana', price: 180, change24h: 15.5, volume24h: '1.8B', marketCap: '81B', volume: 950000 },
      { symbol: 'ADAUSDT', name: 'Cardano', price: 0.68, change24h: 9.2, volume24h: '680M', marketCap: '24B', volume: 320000 },
    ],
    spot: [
      { symbol: 'BTCUSDT', name: 'Bitcoin', price: 72000, change24h: 8.5, volume24h: '3.2B', lastPrice: 72000, high24h: 72500, low24h: 71500 },
      { symbol: 'ETHUSDT', name: 'Ethereum', price: 3800, change24h: 12.2, volume24h: '2.5B', lastPrice: 3800, high24h: 3850, low24h: 3780 },
      { symbol: 'BNBUSDT', name: 'BNB', price: 680, change24h: 6.8, volume24h: '1.2B', lastPrice: 680, high24h: 685, low24h: 675 },
      { symbol: 'SOLUSDT', name: 'Solana', price: 180, change24h: 15.5, volume24h: '1.8B', lastPrice: 180, high24h: 185, low24h: 178 },
      { symbol: 'ADAUSDT', name: 'Cardano', price: 0.68, change24h: 9.2, volume24h: '680M', lastPrice: 0.68, high24h: 0.69, low24h: 0.67 },
    ],
    futures: [
      { symbol: 'BTCUSDT', name: 'Bitcoin Perpetual', price: 72000, change24h: 8.5, volume24h: '12.5B', fundingRate: 0.025, openInterest: '3.2B', longShortRatio: 1.8 },
      { symbol: 'ETHUSDT', name: 'Ethereum Perpetual', price: 3800, change24h: 12.2, volume24h: '8.8B', fundingRate: 0.032, openInterest: '2.5B', longShortRatio: 1.9 },
      { symbol: 'BNBUSDT', name: 'BNB Perpetual', price: 680, change24h: 6.8, volume24h: '3.2B', fundingRate: 0.018, openInterest: '680M', longShortRatio: 1.6 },
      { symbol: 'SOLUSDT', name: 'Solana Perpetual', price: 180, change24h: 15.5, volume24h: '4.8B', fundingRate: 0.045, openInterest: '1.2B', longShortRatio: 2.1 },
      { symbol: 'ADAUSDT', name: 'Cardano Perpetual', price: 0.68, change24h: 9.2, volume24h: '1.4B', fundingRate: 0.022, openInterest: '320M', longShortRatio: 1.7 },
    ],
    margin: [
      { symbol: 'BTCUSDT', name: 'Bitcoin', price: 72000, change24h: 8.5, volume24h: '1.8B', marginRatio: 0.92, availableBalance: 180000, borrowedAmount: 15000 },
      { symbol: 'ETHUSDT', name: 'Ethereum', price: 3800, change24h: 12.2, volume24h: '1.2B', marginRatio: 0.95, availableBalance: 68000, borrowedAmount: 8000 },
      { symbol: 'BNBUSDT', name: 'BNB', price: 680, change24h: 6.8, volume24h: '680M', marginRatio: 0.88, availableBalance: 32000, borrowedAmount: 6000 },
      { symbol: 'SOLUSDT', name: 'Solana', price: 180, change24h: 15.5, volume24h: '950M', marginRatio: 0.97, availableBalance: 28000, borrowedAmount: 3000 },
      { symbol: 'ADAUSDT', name: 'Cardano', price: 0.68, change24h: 9.2, volume24h: '320M', marginRatio: 0.91, availableBalance: 12000, borrowedAmount: 2000 },
    ],
    options: [
      { symbol: 'BTC-30JUN24-72000-C', name: 'BTC Call 72000', price: 0.085, change24h: 45.2, volume24h: '85M', strikePrice: 72000, expiry: '30 JUN 2024', type: 'Call', delta: 0.75, gamma: 0.001 },
      { symbol: 'BTC-30JUN24-72000-P', name: 'BTC Put 72000', price: 0.025, change24h: -25.5, volume24h: '52M', strikePrice: 72000, expiry: '30 JUN 2024', type: 'Put', delta: -0.25, gamma: 0.001 },
      { symbol: 'ETH-30JUN24-3800-C', name: 'ETH Call 3800', price: 0.185, change24h: 38.8, volume24h: '48M', strikePrice: 3800, expiry: '30 JUN 2024', type: 'Call', delta: 0.78, gamma: 0.002 },
      { symbol: 'ETH-30JUN24-3800-P', name: 'ETH Put 3800', price: 0.085, change24h: -18.2, volume24h: '32M', strikePrice: 3800, expiry: '30 JUN 2024', type: 'Put', delta: -0.22, gamma: 0.002 },
      { symbol: 'SOL-30JUN24-180-C', name: 'SOL Call 180', price: 0.125, change24h: 52.5, volume24h: '22M', strikePrice: 180, expiry: '30 JUN 2024', type: 'Call', delta: 0.65, gamma: 0.004 },
    ]
  },

  // Scenario 1: Bear Market
  {
    name: "Bear Market",
    crypto: [
      { symbol: 'BTCUSDT', name: 'Bitcoin', price: 42000, change24h: -12.5, volume24h: '4.8B', marketCap: '820B', volume: 2400000 },
      { symbol: 'ETHUSDT', name: 'Ethereum', price: 2200, change24h: -18.2, volume24h: '3.2B', marketCap: '264B', volume: 1600000 },
      { symbol: 'BNBUSDT', name: 'BNB', price: 380, change24h: -8.8, volume24h: '1.8B', marketCap: '57B', volume: 900000 },
      { symbol: 'SOLUSDT', name: 'Solana', price: 85, change24h: -25.5, volume24h: '2.2B', marketCap: '38B', volume: 1100000 },
      { symbol: 'ADAUSDT', name: 'Cardano', price: 0.28, change24h: -15.2, volume24h: '680M', marketCap: '9.8B', volume: 340000 },
    ],
    spot: [
      { symbol: 'BTCUSDT', name: 'Bitcoin', price: 42000, change24h: -12.5, volume24h: '4.8B', lastPrice: 42000, high24h: 42500, low24h: 41500 },
      { symbol: 'ETHUSDT', name: 'Ethereum', price: 2200, change24h: -18.2, volume24h: '3.2B', lastPrice: 2200, high24h: 2250, low24h: 2180 },
      { symbol: 'BNBUSDT', name: 'BNB', price: 380, change24h: -8.8, volume24h: '1.8B', lastPrice: 380, high24h: 385, low24h: 375 },
      { symbol: 'SOLUSDT', name: 'Solana', price: 85, change24h: -25.5, volume24h: '2.2B', lastPrice: 85, high24h: 88, low24h: 82 },
      { symbol: 'ADAUSDT', name: 'Cardano', price: 0.28, change24h: -15.2, volume24h: '680M', lastPrice: 0.28, high24h: 0.29, low24h: 0.27 },
    ],
    futures: [
      { symbol: 'BTCUSDT', name: 'Bitcoin Perpetual', price: 42000, change24h: -12.5, volume24h: '15.2B', fundingRate: -0.045, openInterest: '4.8B', longShortRatio: 0.4 },
      { symbol: 'ETHUSDT', name: 'Ethereum Perpetual', price: 2200, change24h: -18.2, volume24h: '10.8B', fundingRate: -0.062, openInterest: '3.2B', longShortRatio: 0.3 },
      { symbol: 'BNBUSDT', name: 'BNB Perpetual', price: 380, change24h: -8.8, volume24h: '4.2B', fundingRate: -0.028, openInterest: '1.8B', longShortRatio: 0.6 },
      { symbol: 'SOLUSDT', name: 'Solana Perpetual', price: 85, change24h: -25.5, volume24h: '6.8B', fundingRate: -0.085, openInterest: '2.2B', longShortRatio: 0.2 },
      { symbol: 'ADAUSDT', name: 'Cardano Perpetual', price: 0.28, change24h: -15.2, volume24h: '2.4B', fundingRate: -0.042, openInterest: '680M', longShortRatio: 0.5 },
    ],
    margin: [
      { symbol: 'BTCUSDT', name: 'Bitcoin', price: 42000, change24h: -12.5, volume24h: '2.8B', marginRatio: 0.65, availableBalance: 85000, borrowedAmount: 45000 },
      { symbol: 'ETHUSDT', name: 'Ethereum', price: 2200, change24h: -18.2, volume24h: '1.8B', marginRatio: 0.58, availableBalance: 32000, borrowedAmount: 28000 },
      { symbol: 'BNBUSDT', name: 'BNB', price: 380, change24h: -8.8, volume24h: '980M', marginRatio: 0.72, availableBalance: 18000, borrowedAmount: 12000 },
      { symbol: 'SOLUSDT', name: 'Solana', price: 85, change24h: -25.5, volume24h: '1.4B', marginRatio: 0.45, availableBalance: 12000, borrowedAmount: 18000 },
      { symbol: 'ADAUSDT', name: 'Cardano', price: 0.28, change24h: -15.2, volume24h: '520M', marginRatio: 0.68, availableBalance: 6800, borrowedAmount: 6200 },
    ],
    options: [
      { symbol: 'BTC-30JUN24-42000-C', name: 'BTC Call 42000', price: 0.015, change24h: -65.2, volume24h: '25M', strikePrice: 42000, expiry: '30 JUN 2024', type: 'Call', delta: 0.25, gamma: 0.003 },
      { symbol: 'BTC-30JUN24-42000-P', name: 'BTC Put 42000', price: 0.085, change24h: 125.5, volume24h: '85M', strikePrice: 42000, expiry: '30 JUN 2024', type: 'Put', delta: -0.75, gamma: 0.003 },
      { symbol: 'ETH-30JUN24-2200-C', name: 'ETH Call 2200', price: 0.025, change24h: -78.8, volume24h: '18M', strikePrice: 2200, expiry: '30 JUN 2024', type: 'Call', delta: 0.22, gamma: 0.004 },
      { symbol: 'ETH-30JUN24-2200-P', name: 'ETH Put 2200', price: 0.125, change24h: 148.2, volume24h: '62M', strikePrice: 2200, expiry: '30 JUN 2024', type: 'Put', delta: -0.78, gamma: 0.004 },
      { symbol: 'SOL-30JUN24-85-C', name: 'SOL Call 85', price: 0.015, change24h: -85.5, volume24h: '8M', strikePrice: 85, expiry: '30 JUN 2024', type: 'Call', delta: 0.15, gamma: 0.008 },
    ]
  },
  // Add more scenarios here as needed
  {
    name: "Alt Season",
    crypto: [{ symbol: 'BTCUSDT', name: 'Bitcoin', price: 62000, change24h: 2.5, volume24h: '2.2B', marketCap: '1.2T', volume: 1100000 }],
    spot: [{ symbol: 'BTCUSDT', name: 'Bitcoin', price: 62000, change24h: 2.5, volume24h: '2.2B', lastPrice: 62000, high24h: 62500, low24h: 61500 }],
    futures: [{ symbol: 'BTCUSDT', name: 'Bitcoin Perpetual', price: 62000, change24h: 2.5, volume24h: '8.2B', fundingRate: 0.015, openInterest: '2.8B', longShortRatio: 1.4 }],
    margin: [{ symbol: 'BTCUSDT', name: 'Bitcoin', price: 62000, change24h: 2.5, volume24h: '1.2B', marginRatio: 0.88, availableBalance: 150000, borrowedAmount: 20000 }],
    options: [{ symbol: 'BTC-30JUN24-62000-C', name: 'BTC Call 62000', price: 0.065, change24h: 25.2, volume24h: '65M', strikePrice: 62000, expiry: '30 JUN 2024', type: 'Call', delta: 0.68, gamma: 0.001 }]
  },
  {
    name: "DeFi Boom",
    crypto: [{ symbol: 'BTCUSDT', name: 'Bitcoin', price: 59000, change24h: 1.8, volume24h: '1.9B', marketCap: '1.1T', volume: 950000 }],
    spot: [{ symbol: 'BTCUSDT', name: 'Bitcoin', price: 59000, change24h: 1.8, volume24h: '1.9B', lastPrice: 59000, high24h: 59200, low24h: 58800 }],
    futures: [{ symbol: 'BTCUSDT', name: 'Bitcoin Perpetual', price: 59000, change24h: 1.8, volume24h: '6.9B', fundingRate: 0.008, openInterest: '2.4B', longShortRatio: 1.2 }],
    margin: [{ symbol: 'BTCUSDT', name: 'Bitcoin', price: 59000, change24h: 1.8, volume24h: '980M', marginRatio: 0.86, availableBalance: 120000, borrowedAmount: 25000 }],
    options: [{ symbol: 'BTC-30JUN24-59000-C', name: 'BTC Call 59000', price: 0.055, change24h: 15.2, volume24h: '55M', strikePrice: 59000, expiry: '30 JUN 2024', type: 'Call', delta: 0.62, gamma: 0.002 }]
  },
  {
    name: "NFT Craze",
    crypto: [{ symbol: 'BTCUSDT', name: 'Bitcoin', price: 61000, change24h: 3.2, volume24h: '2.1B', marketCap: '1.2T', volume: 1050000 }],
    spot: [{ symbol: 'BTCUSDT', name: 'Bitcoin', price: 61000, change24h: 3.2, volume24h: '2.1B', lastPrice: 61000, high24h: 61200, low24h: 60800 }],
    futures: [{ symbol: 'BTCUSDT', name: 'Bitcoin Perpetual', price: 61000, change24h: 3.2, volume24h: '7.1B', fundingRate: 0.012, openInterest: '2.6B', longShortRatio: 1.3 }],
    margin: [{ symbol: 'BTCUSDT', name: 'Bitcoin', price: 61000, change24h: 3.2, volume24h: '1.1B', marginRatio: 0.87, availableBalance: 130000, borrowedAmount: 22000 }],
    options: [{ symbol: 'BTC-30JUN24-61000-C', name: 'BTC Call 61000', price: 0.075, change24h: 22.2, volume24h: '75M', strikePrice: 61000, expiry: '30 JUN 2024', type: 'Call', delta: 0.65, gamma: 0.001 }]
  },
  {
    name: "Layer 2 Season",
    crypto: [{ symbol: 'BTCUSDT', name: 'Bitcoin', price: 60000, change24h: 2.1, volume24h: '2.0B', marketCap: '1.2T', volume: 1000000 }],
    spot: [{ symbol: 'BTCUSDT', name: 'Bitcoin', price: 60000, change24h: 2.1, volume24h: '2.0B', lastPrice: 60000, high24h: 60100, low24h: 59900 }],
    futures: [{ symbol: 'BTCUSDT', name: 'Bitcoin Perpetual', price: 60000, change24h: 2.1, volume24h: '7.0B', fundingRate: 0.010, openInterest: '2.5B', longShortRatio: 1.25 }],
    margin: [{ symbol: 'BTCUSDT', name: 'Bitcoin', price: 60000, change24h: 2.1, volume24h: '1.0B', marginRatio: 0.86, availableBalance: 125000, borrowedAmount: 23000 }],
    options: [{ symbol: 'BTC-30JUN24-60000-C', name: 'BTC Call 60000', price: 0.065, change24h: 18.2, volume24h: '65M', strikePrice: 60000, expiry: '30 JUN 2024', type: 'Call', delta: 0.63, gamma: 0.002 }]
  },
  {
    name: "Meme Rally",
    crypto: [{ symbol: 'BTCUSDT', name: 'Bitcoin', price: 58000, change24h: 1.5, volume24h: '1.8B', marketCap: '1.1T', volume: 900000 }],
    spot: [{ symbol: 'BTCUSDT', name: 'Bitcoin', price: 58000, change24h: 1.5, volume24h: '1.8B', lastPrice: 58000, high24h: 58100, low24h: 57900 }],
    futures: [{ symbol: 'BTCUSDT', name: 'Bitcoin Perpetual', price: 58000, change24h: 1.5, volume24h: '6.8B', fundingRate: 0.006, openInterest: '2.3B', longShortRatio: 1.15 }],
    margin: [{ symbol: 'BTCUSDT', name: 'Bitcoin', price: 58000, change24h: 1.5, volume24h: '980M', marginRatio: 0.85, availableBalance: 120000, borrowedAmount: 24000 }],
    options: [{ symbol: 'BTC-30JUN24-58000-C', name: 'BTC Call 58000', price: 0.055, change24h: 12.2, volume24h: '55M', strikePrice: 58000, expiry: '30 JUN 2024', type: 'Call', delta: 0.60, gamma: 0.002 }]
  },
  {
    name: "Institutional",
    crypto: [{ symbol: 'BTCUSDT', name: 'Bitcoin', price: 75000, change24h: 15.5, volume24h: '5.2B', marketCap: '1.5T', volume: 2600000 }],
    spot: [{ symbol: 'BTCUSDT', name: 'Bitcoin', price: 75000, change24h: 15.5, volume24h: '5.2B', lastPrice: 75000, high24h: 75500, low24h: 74500 }],
    futures: [{ symbol: 'BTCUSDT', name: 'Bitcoin Perpetual', price: 75000, change24h: 15.5, volume24h: '15.2B', fundingRate: 0.085, openInterest: '5.8B', longShortRatio: 2.8 }],
    margin: [{ symbol: 'BTCUSDT', name: 'Bitcoin', price: 75000, change24h: 15.5, volume24h: '2.8B', marginRatio: 0.98, availableBalance: 250000, borrowedAmount: 5000 }],
    options: [{ symbol: 'BTC-30JUN24-75000-C', name: 'BTC Call 75000', price: 0.185, change24h: 125.2, volume24h: '185M', strikePrice: 75000, expiry: '30 JUN 2024', type: 'Call', delta: 0.85, gamma: 0.0005 }]
  },
];

export default function Market() {
  const [activeSubTab, setActiveSubTab] = useState('Favourites');
  const [activeMarketTab, setActiveMarketTab] = useState('Spot');
  const [favourites, setFavourites] = useState([]);
  const [marketScenario] = useState(0);
  const router = useRouter();
  const params = useLocalSearchParams();
  const navigation = useNavigation();
  const favRef = useRef(favourites);
  const { coins: liveCoins, loading: marketLoading, error: marketError, refresh: refreshMarket } = useMarketData();


  /**
   * Crypto and Spot are backed by the live /api/v1/market feed.
   *
   * Futures, Margin and Options have no backend equivalent yet, so those tabs
   * still read their static tables. They are flagged with isPlaceholder so the
   * UI can say so rather than presenting invented numbers as real.
   */
  const getMarketDataWithChange = (fallbackData) => {
    const tab = activeMarketTab.toLowerCase();

    if ((tab === 'crypto' || tab === 'spot') && liveCoins.length > 0) {
      return liveCoins.slice(0, 25).map(coin => ({
        ...coin,
        lastPrice: coin.price,
        isPlaceholder: false,
      }));
    }

    const base = fallbackData && fallbackData.length > 0
      ? fallbackData
      : (MARKET_DATA[tab] || MARKET_DATA.crypto);

    return base.map(item => ({
      ...item,
      price: item.price || 0,
      high24h: item.high24h || item.price || 0,
      low24h: item.low24h || item.price || 0,
      lastPrice: item.lastPrice || item.price || 0,
      availableBalance: item.availableBalance || 0,
      borrowedAmount: item.borrowedAmount || 0,
      marginRatio: item.marginRatio || 0,
      fundingRate: item.fundingRate || 0,
      strikePrice: item.strikePrice || 0,
      delta: item.delta || 0,
      gamma: item.gamma || 0,
      isPlaceholder: true,
    }));
  };

  const safeFormatNumber = (value, decimals = 0) => {
    if (value === undefined || value === null || isNaN(value)) {
      return '0';
    }
    try {
      return typeof value === 'number' ? value.toLocaleString() : String(value);
    } catch {
      return '0';
    }
  };

  const safeFormatDecimal = (value, decimals = 2) => {
    if (value === undefined || value === null || isNaN(value)) {
      return '0';
    }
    try {
      return typeof value === 'number' ? value.toFixed(decimals) : String(value);
    } catch {
      return '0';
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions?.({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    favRef.current = favourites;
  }, [favourites]);

  useEffect(() => {
    if (params.favourites) {
      try {
        const favs = JSON.parse(params.favourites);
        if (Array.isArray(favs) && JSON.stringify(favs) !== JSON.stringify(favRef.current)) {
          setFavourites(favs);
        }
      } catch { }
    }
  }, [params.favourites]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0A0F1E' }}>
      <View style={{ flex: 1, marginTop: 40 }}>
        <View style={{ paddingHorizontal: activeSubTab === 'Markets' ? 0 : 10, paddingTop: 10 }}>
          {activeSubTab === 'Favourites' && (
            <TouchableOpacity
              onPress={() => router.push({ pathname: '/screens/SearchCoins', params: { favourites: JSON.stringify(favRef.current) } })}
              activeOpacity={1}
              style={{ marginBottom: 32, marginTop: 16 }}
            >
              <View style={{ backgroundColor: '#1A1F2E', borderRadius: 16, marginHorizontal: 16, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, height: 48, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' }}>
                <Text style={{ color: '#aaa', fontWeight: 'bold', fontSize: 16, flex: 1 }}>Search coins</Text>
                <Feather name="search" size={22} style={{ color: '#aaa' }} />
              </View>
            </TouchableOpacity>
          )}

          {activeSubTab === 'Markets' && (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingHorizontal: 20 }}>
              <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>Markets</Text>
            </View>
          )}

          <View style={{ flexDirection: 'row', marginBottom: 18, justifyContent: 'space-between', marginTop: 10 }}>
            {['Favourites', 'Markets'].map(tab => (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveSubTab(tab)}
                style={{ flex: 1, alignItems: 'center' }}
              >
                <Text style={{ color: activeSubTab === tab ? '#fff' : '#6C6C7A', fontSize: 15, fontWeight: '500' }}>{tab}</Text>
                {activeSubTab === tab && <View style={{ height: 2, backgroundColor: '#00C896', marginTop: 4, borderRadius: 1, width: '100%' }} />}
              </TouchableOpacity>
            ))}
          </View>

          {activeSubTab === 'Markets' && (
            <View style={{ flexDirection: 'row', marginBottom: 20, justifyContent: 'space-between' }}>
              {['Crypto', 'Spot', 'Futures', 'Margin', 'Option'].map(tab => (
                <TouchableOpacity
                  key={tab}
                  onPress={() => setActiveMarketTab(tab)}
                  style={{ flex: 1, alignItems: 'center' }}
                >
                  <Text style={{ color: activeMarketTab === tab ? '#00C896' : '#6C6C7A', fontSize: 14, fontWeight: '500' }}>{tab}</Text>
                  {activeMarketTab === tab && <View style={{ height: 2, backgroundColor: '#00C896', marginTop: 4, borderRadius: 1, width: '100%' }} />}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={{ flex: 1, paddingHorizontal: 20 }}>
          {activeSubTab === 'Favourites' && (
            favourites.length === 0 ? (
              <View style={marketStyles.emptyStateContainer}>
                <Ionicons name="heart-outline" size={56} color="#6C6C7A" style={marketStyles.emptyStateIcon} />
                <Text style={marketStyles.emptyStateTitle}>No favourites added</Text>
                <Text style={marketStyles.emptyStateText}>Tap the search bar to find and add coins to your favourites</Text>
              </View>
            ) : (
              <View style={marketStyles.favouritesContainer}>
                {favourites.map((coin, idx) => {
                  // Get market data for this coin
                  const coinData =
                    liveCoins.find(c => c.name === coin || c.symbol === coin) ||
                    MARKET_DATA.crypto.find(c => c.name === coin) ||
                    { price: 0, change24h: 0, volume24h: '-', marketCap: '-' };

                  return (
                    <View key={coin} style={marketStyles.favouriteItem}>
                      <View style={marketStyles.favouriteItemLeft}>
                        <Image source={{ uri: COIN_ICONS[coin] }} style={marketStyles.coinIcon} />
                        <View style={marketStyles.coinInfo}>
                          <Text style={marketStyles.coinName}>{coin}</Text>
                          <Text style={marketStyles.coinSymbol}>{coin}</Text>
                        </View>
                      </View>
                      <View style={marketStyles.favouriteItemRight}>
                        <View style={marketStyles.priceContainer}>
                          <Text style={marketStyles.priceText}>${safeFormatNumber(coinData.price)}</Text>
                          <Text style={[
                            marketStyles.changeText,
                            { color: coinData.change24h >= 0 ? '#00C896' : '#FF6B6B' }
                          ]}>
                            {coinData.change24h >= 0 ? '+' : ''}{coinData.change24h}%
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={() => setFavourites(favourites.filter(f => f !== coin))}
                          style={marketStyles.removeButton}
                          activeOpacity={0.7}
                        >
                          <Ionicons name="heart" size={20} color="#00C896" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}
              </View>
            )
          )}

          {activeSubTab === 'Markets' && (
            <View style={{ flex: 1 }}>
              {/* Status of the live feed: only shown when it matters. */}
              {marketLoading && liveCoins.length === 0 && (
                <View style={{ paddingVertical: 24, alignItems: 'center' }}>
                  <ActivityIndicator color="#00C896" />
                  <Text style={{ color: '#aaa', fontSize: 13, marginTop: 8 }}>Loading live prices...</Text>
                </View>
              )}
              {marketError && (
                <TouchableOpacity
                  onPress={refreshMarket}
                  style={{ backgroundColor: '#2A1F1F', borderColor: '#FF6B6B', borderWidth: 1, borderRadius: 10, padding: 12, marginBottom: 12 }}
                >
                  <Text style={{ color: '#FF6B6B', fontSize: 13 }}>{marketError}</Text>
                  <Text style={{ color: '#aaa', fontSize: 12, marginTop: 4 }}>Tap to retry</Text>
                </TouchableOpacity>
              )}
              {activeMarketTab === 'Crypto' && (
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                    <Text style={{ color: '#fff', fontSize: 18, fontWeight: '600' }}>Crypto Markets</Text>
                    <Text style={{ color: '#aaa', fontSize: 14 }}>24h Change</Text>
                  </View>
                  {getMarketDataWithChange(MARKET_SCENARIOS[marketScenario]?.crypto)?.map((coin, index) => (
                    <View key={index} style={{ backgroundColor: '#181E2A', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#2A2F3E' }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#2A2F3E', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                            <Text style={{ color: '#00C896', fontSize: 16, fontWeight: 'bold' }}>{coin.symbol.substring(0, 3)}</Text>
                          </View>
                          <View>
                            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>{coin.name}</Text>
                            <Text style={{ color: '#aaa', fontSize: 12 }}>{coin.symbol}</Text>
                          </View>
                        </View>
                        <Text style={{ color: coin.change24h >= 0 ? '#00C896' : '#FF6B6B', fontSize: 16, fontWeight: 'bold' }}>
                          {coin.change24h >= 0 ? '+' : ''}{Number(coin.change24h).toFixed(2)}%
                        </Text>
                      </View>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>${safeFormatNumber(coin.price)}</Text>
                        <View style={{ alignItems: 'flex-end' }}>
                          <Text style={{ color: '#aaa', fontSize: 12 }}>Vol: {safeFormatNumber(coin.volume24h)}</Text>
                          <Text style={{ color: '#aaa', fontSize: 12 }}>MCap: {safeFormatNumber(coin.marketCap)}</Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {activeMarketTab === 'Spot' && (
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                    <Text style={{ color: '#fff', fontSize: 18, fontWeight: '600' }}>Spot Trading</Text>
                    <Text style={{ color: '#aaa', fontSize: 14 }}>24h Change</Text>
                  </View>
                  {getMarketDataWithChange(MARKET_SCENARIOS[marketScenario]?.spot)?.map((coin, index) => (
                    <View key={index} style={{ backgroundColor: '#181E2A', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#2A2F3E' }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#2A2F3E', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                            <Text style={{ color: '#00C896', fontSize: 16, fontWeight: 'bold' }}>{coin.symbol.substring(0, 3)}</Text>
                          </View>
                          <View>
                            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>{coin.name}</Text>
                            <Text style={{ color: '#aaa', fontSize: 12 }}>{coin.symbol}</Text>
                          </View>
                        </View>
                        <Text style={{ color: coin.change24h >= 0 ? '#00C896' : '#FF6B6B', fontSize: 16, fontWeight: 'bold' }}>
                          {coin.change24h >= 0 ? '+' : ''}{Number(coin.change24h).toFixed(2)}%
                        </Text>
                      </View>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>${safeFormatNumber(coin.price)}</Text>
                        <Text style={{ color: '#aaa', fontSize: 12 }}>Vol: {safeFormatNumber(coin.volume24h)}</Text>
                      </View>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ color: '#aaa', fontSize: 12 }}>High: ${safeFormatNumber(coin.high24h)}</Text>
                        <Text style={{ color: '#aaa', fontSize: 12 }}>Low: ${safeFormatNumber(coin.low24h)}</Text>
                        <Text style={{ color: '#aaa', fontSize: 12 }}>Last: ${safeFormatNumber(coin.lastPrice)}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {activeMarketTab === 'Futures' && (
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                    <Text style={{ color: '#fff', fontSize: 18, fontWeight: '600' }}>Futures Trading</Text>
                    <Text style={{ color: '#aaa', fontSize: 14 }}>24h Change</Text>
                  </View>
                  {getMarketDataWithChange(MARKET_SCENARIOS[marketScenario]?.futures)?.map((coin, index) => (
                    <View key={index} style={{ backgroundColor: '#181E2A', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#2A2F3E' }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#2A2F3E', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                            <Text style={{ color: '#00C896', fontSize: 16, fontWeight: 'bold' }}>{coin.symbol.substring(0, 3)}</Text>
                          </View>
                          <View>
                            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>{coin.name}</Text>
                            <Text style={{ color: '#aaa', fontSize: 12 }}>{coin.symbol}</Text>
                          </View>
                        </View>
                        <Text style={{ color: coin.change24h >= 0 ? '#00C896' : '#FF6B6B', fontSize: 16, fontWeight: 'bold' }}>
                          {coin.change24h >= 0 ? '+' : ''}{Number(coin.change24h).toFixed(2)}%
                        </Text>
                      </View>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>${safeFormatNumber(coin.price)}</Text>
                        <Text style={{ color: '#aaa', fontSize: 12 }}>Vol: {safeFormatNumber(coin.volume24h)}</Text>
                      </View>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ color: '#aaa', fontSize: 12 }}>Funding: {safeFormatDecimal(coin.fundingRate * 100)}%</Text>
                        <Text style={{ color: '#aaa', fontSize: 12 }}>OI: {safeFormatNumber(coin.openInterest)}</Text>
                        <Text style={{ color: '#aaa', fontSize: 12 }}>L/S: {safeFormatNumber(coin.longShortRatio)}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {activeMarketTab === 'Margin' && (
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                    <Text style={{ color: '#fff', fontSize: 18, fontWeight: '600' }}>Margin Trading</Text>
                    <Text style={{ color: '#aaa', fontSize: 14 }}>24h Change</Text>
                  </View>
                  {getMarketDataWithChange(MARKET_SCENARIOS[marketScenario]?.margin)?.map((coin, index) => (
                    <View key={index} style={{ backgroundColor: '#181E2A', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#2A2F3E' }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#2A2F3E', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                            <Text style={{ color: '#00C896', fontSize: 16, fontWeight: 'bold' }}>{coin.symbol.substring(0, 3)}</Text>
                          </View>
                          <View>
                            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>{coin.name}</Text>
                            <Text style={{ color: '#aaa', fontSize: 12 }}>{coin.symbol}</Text>
                          </View>
                        </View>
                        <Text style={{ color: coin.change24h >= 0 ? '#00C896' : '#FF6B6B', fontSize: 16, fontWeight: 'bold' }}>
                          {coin.change24h >= 0 ? '+' : ''}{Number(coin.change24h).toFixed(2)}%
                        </Text>
                      </View>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>${safeFormatNumber(coin.price)}</Text>
                        <Text style={{ color: '#aaa', fontSize: 12 }}>Vol: {safeFormatNumber(coin.volume24h)}</Text>
                      </View>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ color: '#aaa', fontSize: 12 }}>Margin: {safeFormatDecimal(coin.marginRatio * 100)}%</Text>
                        <Text style={{ color: '#aaa', fontSize: 12 }}>Available: ${safeFormatNumber(coin.availableBalance)}</Text>
                        <Text style={{ color: '#aaa', fontSize: 12 }}>Borrowed: ${safeFormatNumber(coin.borrowedAmount)}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {activeMarketTab === 'Option' && (
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                    <Text style={{ color: '#fff', fontSize: 18, fontWeight: '600' }}>Options Trading</Text>
                    <Text style={{ color: '#aaa', fontSize: 14 }}>24h Change</Text>
                  </View>
                  {getMarketDataWithChange(MARKET_SCENARIOS[marketScenario]?.options)?.map((option, index) => (
                    <View key={index} style={{ backgroundColor: '#181E2A', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#2A2F3E' }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: option.type === 'Call' ? '#00C896' : '#FF6B6B', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                            <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>{option.type === 'Call' ? 'C' : 'P'}</Text>
                          </View>
                          <View>
                            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>{option.name}</Text>
                            <Text style={{ color: '#aaa', fontSize: 12 }}>{option.symbol}</Text>
                          </View>
                        </View>
                        <Text style={{ color: option.change24h >= 0 ? '#00C896' : '#FF6B6B', fontSize: 16, fontWeight: 'bold' }}>
                          {option.change24h >= 0 ? '+' : ''}{Number(option.change24h).toFixed(2)}%
                        </Text>
                      </View>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>${safeFormatDecimal(option.price)}</Text>
                        <Text style={{ color: '#aaa', fontSize: 12 }}>Vol: {safeFormatNumber(option.volume24h)}</Text>
                      </View>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ color: '#aaa', fontSize: 12 }}>Strike: ${safeFormatNumber(option.strikePrice)}</Text>
                        <Text style={{ color: '#aaa', fontSize: 12 }}>Delta: {safeFormatDecimal(option.delta)}</Text>
                        <Text style={{ color: '#aaa', fontSize: 12 }}>Gamma: {safeFormatDecimal(option.gamma)}</Text>
                      </View>
                      <Text style={{ color: '#666', fontSize: 11, marginTop: 4 }}>Expiry: {option.expiry}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
