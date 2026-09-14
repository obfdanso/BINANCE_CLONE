/**
 * Real authentication state, replacing the placeholder navigation that used to
 * stand in for signing in.
 *
 * Holds the signed-in user, restores a stored session at launch, and exposes
 * signIn / signOut. A token rejected anywhere in the app (via the apiClient
 * interceptor) clears state here too, so the UI can react in one place.
 */
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { setUnauthorizedHandler } from '../services/apiClient';
import * as authService from '../services/authService';
import { getToken, getUser, isTokenExpired, clearSession } from '../services/session';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const router = useRouter();
    const [user, setUser] = useState(null);
    // True until the stored session has been checked, so screens can wait
    // instead of flashing the sign-in page to an already-authenticated user.
    const [restoring, setRestoring] = useState(true);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            const [token, storedUser] = await Promise.all([getToken(), getUser()]);

            if (!cancelled) {
                if (token && !isTokenExpired(token)) {
                    setUser(storedUser);
                } else if (token) {
                    // Expired: drop it rather than letting the first request fail.
                    await clearSession();
                }
                setRestoring(false);
            }
        })();

        return () => { cancelled = true; };
    }, []);

    const signOut = useCallback(async ({ redirect = true } = {}) => {
        await authService.logout();
        setUser(null);
        if (redirect) router.replace('/screens/Auth');
    }, [router]);

    // A 401/403 from any request means the token is no longer good.
    useEffect(() => {
        setUnauthorizedHandler(() => {
            setUser(null);
        });
        return () => setUnauthorizedHandler(null);
    }, []);

    const signIn = useCallback(async (usernameOrEmail, password) => {
        const { user: signedIn } = await authService.login(usernameOrEmail, password);
        setUser(signedIn);
        return signedIn;
    }, []);

    const value = useMemo(() => ({
        user,
        isAuthenticated: !!user,
        restoring,
        signIn,
        signOut,
    }), [user, restoring, signIn, signOut]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used inside an AuthProvider');
    }
    return context;
}

export default AuthProvider;
