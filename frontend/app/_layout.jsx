import { Stack } from "expo-router";
import { View } from "react-native";
import { AuthProvider } from "../contexts/AuthContext";
import { MarketDataProvider } from "../contexts/MarketDataContext";
import { NotificationsProvider } from "../contexts/NotificationsContext";
import { PortfolioProvider } from "../contexts/PortfolioContext";
import { UserProvider } from "../contexts/UserContext";
import { WalletProvider } from "../contexts/WalletContext";
import { PaymentProvider } from "../contexts/PaymentContext";
import { CoinProvider } from "./context/CoinContext";
import CustomStatusBar from "./components/CustomStatusBar";

export default function RootLayout() {
    return (
        <View style={{ flex: 1, backgroundColor: '#0A0F1E' }}>
            <CustomStatusBar />
            <AuthProvider>
                <MarketDataProvider>
                    <PortfolioProvider>
                        <UserProvider>
                            <NotificationsProvider>
                                <WalletProvider>
                                    <PaymentProvider>
                                        <CoinProvider>
                                            <Stack screenOptions={{ headerShown: false }}>
                                                <Stack.Screen name="index" options={{ headerShown: false }} />
                                                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                                                <Stack.Screen name="screens" options={{ headerShown: false }} />
                                            </Stack>
                                        </CoinProvider>
                                    </PaymentProvider>
                                </WalletProvider>
                            </NotificationsProvider>
                        </UserProvider>
                    </PortfolioProvider>
                </MarketDataProvider>
            </AuthProvider>
        </View>
    );
}
