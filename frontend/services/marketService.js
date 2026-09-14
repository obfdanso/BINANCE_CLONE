/** Market data endpoints under /api/v1/market. These are public (no token). */
import apiClient from './apiClient';

export async function getAllMarketData() {
    const { data } = await apiClient.get('/api/v1/market/all');
    return data;
}

export async function getCrypto(symbol) {
    const { data } = await apiClient.get(`/api/v1/market/crypto/${symbol}`);
    return data;
}

export async function getTopByMarketCap() {
    const { data } = await apiClient.get('/api/v1/market/top/market-cap');
    return data;
}

export async function getTopGainers() {
    const { data } = await apiClient.get('/api/v1/market/top/gainers');
    return data;
}

export async function getTopLosers() {
    const { data } = await apiClient.get('/api/v1/market/top/losers');
    return data;
}

export async function getPriceHistory(symbol, params = {}) {
    const { data } = await apiClient.get(`/api/v1/market/crypto/${symbol}/history`, { params });
    return data;
}

export async function searchCoins(query) {
    const { data } = await apiClient.get('/api/v1/market/search', { params: { query } });
    return data;
}
