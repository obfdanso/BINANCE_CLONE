/**
 * Persistent auth session storage.
 *
 * The JWT and the user summary returned by /api/auth/login are kept in
 * AsyncStorage so a returning user is not forced to sign in again while the
 * token is still valid.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'bitby.auth.token';
const USER_KEY = 'bitby.auth.user';

export async function getToken() {
    try {
        return await AsyncStorage.getItem(TOKEN_KEY);
    } catch {
        return null;
    }
}

export async function getUser() {
    try {
        const raw = await AsyncStorage.getItem(USER_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export async function saveSession(token, user) {
    try {
        await AsyncStorage.multiSet([
            [TOKEN_KEY, token ?? ''],
            [USER_KEY, JSON.stringify(user ?? null)],
        ]);
    } catch (error) {
        console.warn('Could not persist session:', error?.message);
    }
}

export async function clearSession() {
    try {
        await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
    } catch (error) {
        console.warn('Could not clear session:', error?.message);
    }
}

const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

/** Decodes base64url without relying on atob, which Hermes may not expose. */
function base64UrlDecode(input) {
    const str = input.replace(/-/g, '+').replace(/_/g, '/');
    let out = '';
    let buffer = 0;
    let bits = 0;
    for (const ch of str) {
        const idx = B64.indexOf(ch);
        if (idx === -1) continue; // skip padding and stray characters
        buffer = (buffer << 6) | idx;
        bits += 6;
        if (bits >= 8) {
            bits -= 8;
            out += String.fromCharCode((buffer >> bits) & 0xff);
        }
    }
    return out;
}

/**
 * A JWT is three dot-separated base64url segments; the middle one carries the
 * "exp" claim in seconds. Checking it locally lets us treat an expired token
 * as signed-out at launch instead of waiting for the first 403.
 */
export function isTokenExpired(token) {
    if (!token) return true;
    try {
        const [, payload] = token.split('.');
        if (!payload) return true;
        const decoded = JSON.parse(base64UrlDecode(payload));
        if (!decoded.exp) return false;
        return decoded.exp * 1000 <= Date.now();
    } catch {
        // If it cannot be parsed we cannot trust it.
        return true;
    }
}
