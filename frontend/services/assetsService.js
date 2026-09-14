/** Wallet and asset endpoints under /api/assets. All require a token. */
import apiClient from './apiClient';

/**
 * Portfolio snapshot. selectedCurrency is required by the backend - omitting
 * it returns an error, so it is defaulted here rather than left to callers.
 */
export async function getAssetOverview(selectedCurrency = 'USD') {
    const { data } = await apiClient.get('/api/assets/overview', {
        params: { selectedCurrency },
    });
    return data;
}

export async function getAssetPriceHistory(params) {
    const { data } = await apiClient.get('/api/assets/price-history', { params });
    return data;
}

export async function checkBalance(params) {
    const { data } = await apiClient.get('/api/assets/check-balance', { params });
    return data;
}

export async function deposit(payload) {
    const { data } = await apiClient.post('/api/assets/deposit', payload);
    return data;
}

export async function buyAsset(payload) {
    const { data } = await apiClient.post('/api/assets/buy', payload);
    return data;
}

export async function withdraw(payload) {
    const { data } = await apiClient.post('/api/assets/withdraw', payload);
    return data;
}
