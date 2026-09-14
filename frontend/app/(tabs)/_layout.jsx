import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: "#00C896",
                tabBarInactiveTintColor: "#8E8E93",
                tabBarStyle: {
                    backgroundColor: "#0A0F1E",
                    borderTopWidth: 1,
                    borderTopColor: "rgba(255,255,255,0.1)",
                    paddingBottom: 20,
                    paddingTop: 5,
                    height: 75,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: "500",
                },
            }}
        >
            <Tabs.Screen
                name="dashboard"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="market"
                options={{
                    title: "Market",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="trending-up-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="trade"
                options={{
                    title: "Trade",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="swap-horizontal-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="futures"
                options={{
                    title: "Futures",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="time" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="assets"
                options={{
                    title: "Assets",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="wallet-outline" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
} 