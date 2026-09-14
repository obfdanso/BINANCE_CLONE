/**
 * Display metadata for the assets the backend supports.
 *
 * The icon name and colour for each asset were being repeated in every screen
 * that listed holdings, so they live here once.
 */
export const ASSET_META = {
    BTC: { icon: 'bitcoin', color: '#F7931A', name: 'Bitcoin' },
    ETH: { icon: 'ethereum', color: '#627EEA', name: 'Ethereum' },
    BNB: { icon: 'currency-bnb', color: '#F3BA2F', name: 'BNB' },
    USDT: { icon: 'currency-usdt', color: '#26A17B', name: 'TetherUS' },
    USD: { icon: 'currency-usd', color: '#1A73E8', name: 'US Dollar' },
    GHS: { icon: 'cash', color: '#00C896', name: 'Ghanaian Cedi' },
};

export function assetMeta(symbol) {
    const key = String(symbol || '').toUpperCase();
    return ASSET_META[key] || { icon: 'circle-outline', color: '#888', name: key };
}

/** Balances span whole cedis to fractions of a bitcoin, so precision varies. */
export function formatAssetAmount(value) {
    const n = Number(value) || 0;
    if (n >= 1000) return n.toLocaleString('en-US', { maximumFractionDigits: 2 });
    if (n >= 1) return n.toFixed(4);
    return n.toFixed(8);
}
