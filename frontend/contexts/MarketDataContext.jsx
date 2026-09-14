/**
 * Live market data, fetched once and shared by every screen that needs prices.
 *
 * Previously each screen carried its own hardcoded coin table. Fetching in one
 * place means the market tab, dashboard, search and coin detail screens all
 * show the same numbers, and the API is hit once rather than per screen.
 */
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { getAllMarketData } from '../services/marketService';
import { adaptCoins } from '../services/marketAdapters';

// The backend refreshes from CoinGecko every 5 minutes, so polling faster than
// this only adds load without producing new numbers.
const REFRESH_INTERVAL_MS = 60_000;

const MarketDataContext = createContext(null);

export function MarketDataProvider({ children }) {
    const [coins, setCoins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastFetched, setLastFetched] = useState(null);

    // Guards against a slow response landing after the component unmounts.
    const mounted = useRef(true);
    useEffect(() => () => { mounted.current = false; }, []);

    const refresh = useCallback(async ({ silent = false } = {}) => {
        if (!silent) setLoading(true);
        try {
            const data = await getAllMarketData();
            if (!mounted.current) return;
            setCoins(adaptCoins(data));
            setError(null);
            setLastFetched(Date.now());
        } catch (err) {
            if (!mounted.current) return;
            // Keep whatever prices we already have; a failed refresh should not
            // blank out a screen the user is reading.
            setError(err.message || 'Could not load market data.');
        } finally {
            if (mounted.current && !silent) setLoading(false);
        }
    }, []);

    useEffect(() => {
        refresh();
        const id = setInterval(() => refresh({ silent: true }), REFRESH_INTERVAL_MS);
        return () => clearInterval(id);
    }, [refresh]);

    // Prices go stale while the app is backgrounded; refresh on return.
    useEffect(() => {
        const sub = AppState.addEventListener('change', (state) => {
            if (state === 'active') refresh({ silent: true });
        });
        return () => sub.remove();
    }, [refresh]);

    const bySymbol = useMemo(() => {
        const map = {};
        for (const coin of coins) map[coin.symbol] = coin;
        return map;
    }, [coins]);

    const value = useMemo(() => ({
        coins,
        bySymbol,
        getCoin: (symbol) => bySymbol[String(symbol || '').toUpperCase()] || null,
        topGainers: [...coins].sort((a, b) => b.change24h - a.change24h).slice(0, 10),
        topLosers: [...coins].sort((a, b) => a.change24h - b.change24h).slice(0, 10),
        topByMarketCap: [...coins].sort((a, b) => b.marketCapRaw - a.marketCapRaw).slice(0, 10),
        loading,
        error,
        lastFetched,
        refresh,
    }), [coins, bySymbol, loading, error, lastFetched, refresh]);

    return <MarketDataContext.Provider value={value}>{children}</MarketDataContext.Provider>;
}

export function useMarketData() {
    const context = useContext(MarketDataContext);
    if (!context) {
        throw new Error('useMarketData must be used inside a MarketDataProvider');
    }
    return context;
}

export default MarketDataProvider;
