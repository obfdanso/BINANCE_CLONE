# Status Bar Configuration

## Overview
The Bitby app now has a consistent status bar configuration that matches the app's background color (`#0A0F1E`) across all screens.

## Configuration Details

### App-Level Configuration (`app.json`)
```json
{
  "expo": {
    "userInterfaceStyle": "dark",
    "android": {
      "adaptiveIcon": {
        "backgroundColor": "#0A0F1E"
      },
      "edgeToEdgeEnabled": true
    },
    "plugins": [
      [
        "expo-splash-screen",
        {
          "backgroundColor": "#0A0F1E"
        }
      ]
    ]
  }
}
```

### Root Layout Configuration (`app/_layout.jsx`)
```jsx
import { View } from "react-native";
import CustomStatusBar from "./components/CustomStatusBar";

export default function RootLayout() {
    return (
        <View style={{ flex: 1, backgroundColor: '#0A0F1E' }}>
            <CustomStatusBar />
            <UserProvider>
                <NotificationsProvider>
                    <Stack screenOptions={{ headerShown: false }}>
                        {/* ... */}
                    </Stack>
                </NotificationsProvider>
            </UserProvider>
        </View>
    );
}
```

### Custom Status Bar Component (`app/components/CustomStatusBar.jsx`)
```jsx
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform, View } from 'react-native';

const CustomStatusBar = ({ 
    style = "light", 
    backgroundColor = "#0A0F1E",
    translucent = true,
    animated = true,
    ...props 
}) => {
    return (
        <>
            {/* Status bar background for edge-to-edge */}
            <View 
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: Platform.OS === 'ios' ? 44 : 24,
                    backgroundColor: backgroundColor,
                    zIndex: 9999,
                }}
            />
            <StatusBar
                style={style}
                translucent={translucent}
                animated={animated}
                {...props}
            />
        </>
    );
};
```

## Status Bar Properties

### Background Color
- **Color**: `#0A0F1E` (matches app background)
- **Consistency**: Applied across all screens
- **Theme**: Dark theme for better contrast

### Style Configuration
- **Style**: `"light"` (white text/icons)
- **Translucent**: `true` (allows content to flow under status bar)
- **Animated**: `true` (smooth transitions)
- **Edge-to-Edge**: `true` (enabled for modern Android experience)

### Platform-Specific Behavior

#### iOS
- Status bar text/icons are white
- Background matches app color
- Translucent effect for seamless integration

#### Android
- Status bar icons are light colored
- Background color matches app theme
- Edge-to-edge experience with translucent status bar

## Updated Screens

All screens now use consistent status bar configuration:

### Main Screens
- ✅ **Dashboard**: Uses root layout status bar
- ✅ **Notifications**: Uses root layout status bar
- ✅ **Trade**: Updated to use `#0A0F1E` background
- ✅ **PreviewOrder**: Updated to use `#0A0F1E` background

### Tab Screens
- ✅ **Market**: Updated to use `#0A0F1E` background
- ✅ **Futures**: Updated to use `#0A0F1E` background
- ✅ **Assets**: Updated to use `#0A0F1E` background

## Benefits

1. **Visual Consistency**: Status bar seamlessly blends with app background
2. **Professional Look**: No jarring color transitions
3. **Better UX**: Content flows naturally under status bar
4. **Theme Consistency**: Matches the dark crypto app aesthetic
5. **Cross-Platform**: Works consistently on iOS and Android

## Implementation Notes

### Root Layout Approach
- Single status bar configuration at the root level
- Eliminates need for individual screen status bar management
- Ensures consistency across the entire app

### Translucent Status Bar
- Allows content to extend under the status bar
- Creates immersive experience
- Safe area insets handle proper spacing

### Color Matching
- Status bar background: `#0A0F1E`
- App background: `#0A0F1E`
- Perfect color match for seamless integration
- Edge-to-edge background view ensures consistent coloring

## Testing

The status bar now provides:
- ✅ **Consistent Background**: Same color as app background
- ✅ **Light Text/Icons**: White status bar content for contrast
- ✅ **Translucent Effect**: Content flows under status bar
- ✅ **Edge-to-Edge Support**: Modern Android experience
- ✅ **Cross-Platform**: Works on iOS and Android
- ✅ **Theme Consistency**: Matches dark crypto app theme 