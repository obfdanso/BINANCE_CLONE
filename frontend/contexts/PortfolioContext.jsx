/**
 * The signed-in user's real balances, from GET /api/assets/overview.
 *
 * This replaces the single local "balance" number that used to live in
 * AsyncStorage: the backend is the source of truth, it knows every asset the
 * user holds, and it values the portfolio using current market prices.
 */
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { getAssetOverview } from '../services/assetsService';
import { useAuth } from './AuthContext';

const PortfolioContext = createContext(null);

// The currencies the overview endpoint can value a portfolio in.
export const SUPPORTED_CURRENCIES = ['USD', 'GHS', 'USDT', 'BTC', 'ETH'];

export function PortfolioProvider({ children }) {
    const { isAuthenticated } = useAuth();

    const [currency, setCurrency] = useState('GHS');
    const [balances, setBalances] = useState({});
    const [lastPrices, setLastPrices] = useState({});
    const [totalValue, setTotalValue] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const mounted = useRef(true);
    useEffect(() => () => { mounted.current = false; }, []);

    const refresh = useCallback(async (nextCurrency = currency) => {
        // Signed out: there is nothing to fetch and the request would 403.
        if (!isAuthenticated) {
            setBalances({});
            setLastPrices({});
            setTotalValue(0);
            setError(null);
            return;
        }

        setLoading(true);
        try {
            const data = await getAssetOverview(nextCurrency);
            if (!mounted.current) return;
            setBalances(data.balances || {});
            setLastPrices(data.lastPrices || {});
            setTotalValue(Number(data.estimatedTotalValue) || 0);
            setError(null);
        } catch (err) {
            if (!mounted.current) return;
            setError(err.message || 'Could not load your balances.');
        } finally {
            if (mounted.current) setLoading(false);
        }
    }, [currency, isAuthenticated]);

    // Reload on sign-in/sign-out and whenever the display currency changes.
    useEffect(() => { refresh(currency); }, [isAuthenticated, currency]); // eslint-disable-line react-hooks/exhaustive-deps

    /** Balances as a sorted array, dropping assets the user holds none of. */
    const holdings = useMemo(() => (
        Object.entries(balances)
            .map(([asset, amount]) => ({
                asset,
                amount: Number(amount) || 0,
                price: Number(lastPrices[asset]) || 0,
                value: (Number(amount) || 0) * (Number(lastPrices[asset]) || 0),
            }))
            .filter(h => h.amount > 0)
            .sort((a, b) => b.value - a.value)
    ), [balances, lastPrices]);

    const value = useMemo(() => ({
        currency,
        setCurrency,
        balances,
        lastPrices,
        holdings,
        totalValue,
        loading,
        error,
        refresh,
        getBalance: (asset) => Number(balances[String(asset || '').toUpperCase()]) || 0,
    }), [currency, balances, lastPrices, holdings, totalValue, loading, error, refresh]);

    return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;
}

export function usePortfolio() {
    const context = useContext(PortfolioContext);
    if (!context) {
        throw new Error('usePortfolio must be used inside a PortfolioProvider');
    }
    return context;
}

export default PortfolioProvider;
