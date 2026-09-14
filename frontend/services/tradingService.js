/** Spot trading endpoints under /api/v1/trading. All require a token. */
import apiClient from './apiClient';

export async function getTradingPairs() {
    const { data } = await apiClient.get('/api/v1/trading/pairs');
    return data;
}

export async function getOrderBook(symbol, depth = 20) {
    const { data } = await apiClient.get(`/api/v1/trading/orderbook/${symbol}`, { params: { depth } });
    return data;
}

export async function placeOrder(payload) {
    const { data } = await apiClient.post('/api/v1/trading/orders', payload);
    return data;
}

export async function cancelOrder(orderId) {
    const { data } = await apiClient.delete(`/api/v1/trading/orders/${orderId}`);
    return data;
}

export async function getUserOrders() {
    const { data } = await apiClient.get('/api/v1/trading/orders');
    return data;
}

/** The signed-in user's executed trades - the closest thing to a ledger. */
export async function getUserTrades() {
    const { data } = await apiClient.get('/api/v1/trading/trades');
    return data;
}

export async function getRecentTrades(symbol, limit = 50) {
    const { data } = await apiClient.get(`/api/v1/trading/trades/${symbol}`, { params: { limit } });
    return data;
}
