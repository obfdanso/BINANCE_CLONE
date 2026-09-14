/** Auth endpoints under /api/auth. */
import apiClient from './apiClient';
import { clearSession, saveSession } from './session';

/**
 * Signs in with a username or email. On success the JWT is persisted before
 * returning, so any call made afterwards is already authenticated.
 */
export async function login(usernameOrEmail, password) {
    const { data } = await apiClient.post('/api/auth/login', {
        usernameOrEmail,
        password,
    });

    const user = {
        userId: data.userId,
        username: data.username,
        email: data.email ?? null,
    };

    await saveSession(data.token, user);
    return { token: data.token, user };
}

/** Step 1 of email signup: asks the backend to send a verification OTP. */
export async function requestEmailSignup(email) {
    const { data } = await apiClient.post('/api/auth/signup/email', { email });
    return data;
}

/** Step 2: confirms the OTP that was emailed. */
export async function verifyEmailOtp(email, otp) {
    const { data } = await apiClient.post('/api/auth/signup/verify-email', { email, otp });
    return data;
}

/** Step 3: sets username and password, completing the account. */
export async function completeSignup(payload) {
    const { data } = await apiClient.post('/api/auth/signup/complete', payload);
    return data;
}

export async function forgotPassword(email) {
    const { data } = await apiClient.post('/api/auth/forgot-password', { email });
    return data;
}

export async function resetPassword(payload) {
    const { data } = await apiClient.post('/api/auth/reset-password', payload);
    return data;
}

/**
 * Best-effort server-side logout. The local session is cleared either way so
 * a failing network call can never strand the user in a signed-in state.
 */
export async function logout() {
    try {
        await apiClient.post('/api/auth/logout');
    } catch {
        // ignored on purpose
    } finally {
        await clearSession();
    }
}
