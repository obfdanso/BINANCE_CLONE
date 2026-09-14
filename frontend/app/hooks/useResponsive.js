import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';
import responsiveUtils from '../utils/responsive';

const {
    getDeviceType,
    isTablet,
    isPhone,
    scale,
    verticalScale,
    horizontalScale,
    fontSize,
    spacing,
    padding,
    borderRadius,
    iconSize,
    buttonSize,
    cardSize,
    getGridColumns,
    getModalSize,
    getContainerMaxWidth,
    screen,
    getPlatformShadow
} = responsiveUtils;

const useResponsive = () => {
    const [dimensions, setDimensions] = useState({
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    });

    useEffect(() => {
        const subscription = Dimensions.addEventListener('change', ({ window }) => {
            setDimensions({
                width: window.width,
                height: window.height,
            });
        });

        return () => subscription?.remove();
    }, []);

    return {
        // Device detection
        deviceType: getDeviceType(),
        isTablet: isTablet(),
        isPhone: isPhone(),

        // Responsive scaling
        scale,
        verticalScale,
        horizontalScale,

        // Responsive design tokens
        fontSize,
        spacing,
        padding,
        borderRadius,
        iconSize,
        buttonSize,
        cardSize,

        // Responsive utilities
        getGridColumns,
        getModalSize,
        getContainerMaxWidth,
        getPlatformShadow,

        // Screen dimensions
        screen,
        dimensions,

        // Responsive breakpoints
        breakpoints: {
            phone: 480,
            tablet: 768,
            largeTablet: 1024,
        },

        // Responsive helpers
        getResponsiveValue: (phoneValue, tabletValue, largeTabletValue) => {
            const deviceType = getDeviceType();
            switch (deviceType) {
                case 'phone':
                    return phoneValue;
                case 'tablet':
                    return tabletValue || phoneValue;
                case 'largeTablet':
                    return largeTabletValue || tabletValue || phoneValue;
                default:
                    return phoneValue;
            }
        },

        // Responsive layout helpers
        getResponsiveLayout: () => {
            const deviceType = getDeviceType();
            return {
                columns: getGridColumns(),
                maxWidth: getContainerMaxWidth(),
                modalSize: getModalSize(),
                isCompact: deviceType === 'phone',
                isExpanded: deviceType === 'largeTablet',
            };
        },
    };
};

export default useResponsive; 