/**
 * Resolves the backend base URL at runtime.
 *
 * On a physical device "localhost" means the phone itself, not the laptop
 * running the Spring Boot server. Expo Go already knows the laptop's LAN
 * address (it is how the bundle was downloaded), so we reuse that host and
 * swap Metro's port for the API port. This keeps working when the laptop's
 * IP changes on a different network, with no edit required here.
 */
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const API_PORT = 8080;

function resolveHost() {
    const hostUri =
        Constants.expoConfig?.hostUri ||
        Constants.expoGoConfig?.debuggerHost ||
        Constants.manifest2?.extra?.expoGo?.debuggerHost ||
        '';

    const host = hostUri.split(':')[0];
    if (host) return host;

    // Android emulator reaches the host machine's loopback on 10.0.2.2.
    if (Platform.OS === 'android') return '10.0.2.2';
    return 'localhost';
}

// An explicit value in app.json (expo.extra.apiBaseUrl) always wins, which is
// how a deployed build will point at a real server.
const explicit = Constants.expoConfig?.extra?.apiBaseUrl;

export const API_BASE_URL = explicit || `http://${resolveHost()}:${API_PORT}`;

export const REQUEST_TIMEOUT_MS = 15000;
