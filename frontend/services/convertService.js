/**
 * Convert endpoints under /api/v1/convert.
 *
 * /quote and /types are public; placing an actual conversion requires a token.
 */
import apiClient from './apiClient';

/**
 * Priced quote for swapping one asset into another. Unlike deriving a rate
 * from two spot prices, this returns the fee the backend will charge and an
 * expiry, so the figure shown to the user is the figure they get.
 */
export async function getConvertQuote(fromSymbol, toSymbol, amount) {
    const { data } = await apiClient.post('/api/v1/convert/quote', {
        fromSymbol,
        toSymbol,
        amount: Number(amount),
    });
    return data;
}

export async function convertInstant(fromSymbol, toSymbol, amount) {
    const { data } = await apiClient.post('/api/v1/convert/instant', {
        fromSymbol,
        toSymbol,
        amount: Number(amount),
        convertType: 'INSTANT',
    });
    return data;
}

export async function getConvertOrders() {
    const { data } = await apiClient.get('/api/v1/convert/orders');
    return data;
}

export async function cancelConvertOrder(orderId) {
    const { data } = await apiClient.delete(`/api/v1/convert/orders/${orderId}`);
    return data;
}

export async function getConvertTypes() {
    const { data } = await apiClient.get('/api/v1/convert/types');
    return data;
}
