/**
 * Translates backend market payloads into the shape the screens already use.
 *
 * The API returns raw numbers (marketCap: 1549904396927) while the UI was
 * written against pre-formatted strings ('1.2T'), so the formatting that used
 * to be baked into the mock data happens here instead of in every screen.
 */

/** 1549904396927 -> '1.55T' */
export function formatCompact(value) {
    const n = Number(value);
    if (!Number.isFinite(n)) return '-';

    const abs = Math.abs(n);
    if (abs >= 1e12) return `${(n / 1e12).toFixed(2)}T`;
    if (abs >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
    if (abs >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
    if (abs >= 1e3) return `${(n / 1e3).toFixed(2)}K`;
    return n.toFixed(2);
}

/**
 * Cheap coins need more decimal places than expensive ones, so a single
 * toFixed(2) would render most altcoins as "0.00".
 */
export function formatPrice(value) {
    const n = Number(value);
    if (!Number.isFinite(n)) return '-';
    if (n >= 1000) return n.toLocaleString('en-US', { maximumFractionDigits: 2 });
    if (n >= 1) return n.toFixed(2);
    if (n >= 0.01) return n.toFixed(4);
    return n.toFixed(8);
}

/**
 * Maps one API entry to the fields the market/dashboard screens read.
 * `symbol` stays the bare ticker (BTC); `pairSymbol` is the trading-pair form
 * (BTCUSDT) the older mock data used.
 */
export function adaptCoin(raw) {
    const price = Number(raw.currentPrice);
    const changePct = Number(raw.priceChangePercentage24h);

    return {
        symbol: raw.symbol,
        pairSymbol: `${raw.symbol}USDT`,
        name: raw.name,
        price: Number.isFinite(price) ? price : 0,
        priceLabel: formatPrice(price),
        change24h: Number.isFinite(changePct) ? changePct : 0,
        priceChange24h: Number(raw.priceChange24h) || 0,
        volume24h: formatCompact(raw.volume24h),
        volume24hRaw: Number(raw.volume24h) || 0,
        marketCap: formatCompact(raw.marketCap),
        marketCapRaw: Number(raw.marketCap) || 0,
        high24h: Number(raw.high24h) || 0,
        low24h: Number(raw.low24h) || 0,
        image: raw.imageUrl || null,
        lastUpdated: raw.lastUpdated || null,
    };
}

export function adaptCoins(list) {
    if (!Array.isArray(list)) return [];
    return list.map(adaptCoin);
}
