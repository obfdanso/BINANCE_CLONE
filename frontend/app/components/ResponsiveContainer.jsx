import React from 'react';
import { View, ScrollView } from 'react-native';
import useResponsive from '../hooks/useResponsive';

const ResponsiveContainer = ({
    children,
    style,
    scrollable = false,
    maxWidth = null,
    padding = 'default',
    centerContent = false,
    ...props
}) => {
    const { getContainerMaxWidth, isTablet, spacing } = useResponsive();

    const containerStyle = {
        flex: 1,
        width: '100%',
        maxWidth: maxWidth || getContainerMaxWidth(),
        alignSelf: centerContent ? 'center' : 'stretch',
        ...(padding === 'default' && {
            paddingHorizontal: isTablet() ? spacing.xl : spacing.lg,
        }),
        ...(padding === 'none' && {}),
        ...(padding === 'small' && {
            paddingHorizontal: spacing.md,
        }),
        ...(padding === 'large' && {
            paddingHorizontal: spacing['2xl'],
        }),
        ...style,
    };

    if (scrollable) {
        return (
            <ScrollView
                style={containerStyle}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
                {...props}
            >
                {children}
            </ScrollView>
        );
    }

    return (
        <View style={containerStyle} {...props}>
            {children}
        </View>
    );
};

export default ResponsiveContainer; 