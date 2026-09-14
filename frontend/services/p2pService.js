/** Peer-to-peer endpoints under /api/p2p. All require a token. */
import apiClient from './apiClient';

export async function getActiveListings() {
    const { data } = await apiClient.get('/api/p2p/listings');
    return data;
}

export async function createListing(payload) {
    const { data } = await apiClient.post('/api/p2p/create-listing', payload);
    return data;
}

export async function cancelListing(listingId) {
    const { data } = await apiClient.post(`/api/p2p/listings/${listingId}/cancel`);
    return data;
}

export async function createOrder(payload) {
    const { data } = await apiClient.post('/api/p2p/orders', payload);
    return data;
}

export async function confirmPayment(orderId) {
    const { data } = await apiClient.post(`/api/p2p/orders/${orderId}/confirm-payment`);
    return data;
}

export async function releaseOrder(orderId) {
    const { data } = await apiClient.post(`/api/p2p/orders/${orderId}/release`);
    return data;
}

export async function cancelOrder(orderId) {
    const { data } = await apiClient.post(`/api/p2p/orders/${orderId}/cancel`);
    return data;
}

export async function getBuyerOrders() {
    const { data } = await apiClient.get('/api/p2p/orders/buyer');
    return data;
}

export async function getSellerOrders() {
    const { data } = await apiClient.get('/api/p2p/orders/seller');
    return data;
}
