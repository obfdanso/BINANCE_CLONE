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
                    zIndex: 1,
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

export default CustomStatusBar; 