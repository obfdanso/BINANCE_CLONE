import { Dimensions, Platform } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Breakpoints for different device types
export const BREAKPOINTS = {
    phone: 480,
    tablet: 768,
    largeTablet: 1024,
};

// Device type detection
export const getDeviceType = () => {
    if (screenWidth >= BREAKPOINTS.largeTablet) return 'largeTablet';
    if (screenWidth >= BREAKPOINTS.tablet) return 'tablet';
    return 'phone';
};

export const isTablet = () => getDeviceType() !== 'phone';
export const isPhone = () => getDeviceType() === 'phone';

// Responsive scaling functions
export const scale = (size) => {
    const deviceType = getDeviceType();
    const scaleFactors = {
        phone: 1,
        tablet: 1.2,
        largeTablet: 1.4,
    };
    return size * scaleFactors[deviceType];
};

export const verticalScale = (size) => {
    const deviceType = getDeviceType();
    const scaleFactors = {
        phone: 1,
        tablet: 1.1,
        largeTablet: 1.2,
    };
    return size * scaleFactors[deviceType];
};

export const horizontalScale = (size) => {
    const deviceType = getDeviceType();
    const scaleFactors = {
        phone: 1,
        tablet: 1.3,
        largeTablet: 1.5,
    };
    return size * scaleFactors[deviceType];
};

// Responsive font sizes
export const fontSize = {
    xs: scale(10),
    sm: scale(12),
    base: scale(14),
    lg: scale(16),
    xl: scale(18),
    '2xl': scale(20),
    '3xl': scale(24),
    '4xl': scale(28),
    '5xl': scale(32),
};

// Responsive spacing
export const spacing = {
    xs: scale(4),
    sm: scale(8),
    md: scale(12),
    lg: scale(16),
    xl: scale(20),
    '2xl': scale(24),
    '3xl': scale(32),
    '4xl': scale(40),
};

// Responsive padding/margin
export const padding = {
    xs: scale(4),
    sm: scale(8),
    md: scale(12),
    lg: scale(16),
    xl: scale(20),
    '2xl': scale(24),
    '3xl': scale(32),
    '4xl': scale(40),
};

// Responsive border radius
export const borderRadius = {
    sm: scale(4),
    md: scale(8),
    lg: scale(12),
    xl: scale(16),
    '2xl': scale(20),
    '3xl': scale(24),
    full: scale(9999),
};

// Responsive icon sizes
export const iconSize = {
    xs: scale(12),
    sm: scale(16),
    md: scale(20),
    lg: scale(24),
    xl: scale(28),
    '2xl': scale(32),
    '3xl': scale(48),
    '4xl': scale(64),
};

// Responsive button sizes
export const buttonSize = {
    sm: {
        height: scale(32),
        paddingHorizontal: scale(12),
        fontSize: fontSize.sm,
    },
    md: {
        height: scale(40),
        paddingHorizontal: scale(16),
        fontSize: fontSize.base,
    },
    lg: {
        height: scale(48),
        paddingHorizontal: scale(20),
        fontSize: fontSize.lg,
    },
    xl: {
        height: scale(56),
        paddingHorizontal: scale(24),
        fontSize: fontSize.xl,
    },
};

// Responsive card sizes
export const cardSize = {
    sm: {
        padding: spacing.md,
        borderRadius: borderRadius.md,
    },
    md: {
        padding: spacing.lg,
        borderRadius: borderRadius.lg,
    },
    lg: {
        padding: spacing.xl,
        borderRadius: borderRadius.xl,
    },
};

// Responsive grid columns
export const getGridColumns = () => {
    const deviceType = getDeviceType();
    const columns = {
        phone: 2,
        tablet: 3,
        largeTablet: 4,
    };
    return columns[deviceType];
};

// Responsive modal sizes
export const getModalSize = () => {
    const deviceType = getDeviceType();
    const sizes = {
        phone: { width: '90%', maxWidth: 400 },
        tablet: { width: '70%', maxWidth: 600 },
        largeTablet: { width: '60%', maxWidth: 800 },
    };
    return sizes[deviceType];
};

// Responsive container max width
export const getContainerMaxWidth = () => {
    const deviceType = getDeviceType();
    const maxWidths = {
        phone: screenWidth,
        tablet: 600,
        largeTablet: 800,
    };
    return maxWidths[deviceType];
};

// Screen dimensions
export const screen = {
    width: screenWidth,
    height: screenHeight,
    isSmall: screenWidth < 375,
    isMedium: screenWidth >= 375 && screenWidth < 414,
    isLarge: screenWidth >= 414,
};

// Platform-specific adjustments
export const platformAdjustments = {
    ios: {
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    android: {
        elevation: 4,
    },
};

export const getPlatformShadow = () => {
    return Platform.select(platformAdjustments);
};

// Default export for the responsive utilities
const responsiveUtils = {
    // Device detection
    getDeviceType,
    isTablet,
    isPhone,

    // Scaling functions
    scale,
    verticalScale,
    horizontalScale,

    // Design tokens
    fontSize,
    spacing,
    padding,
    borderRadius,
    iconSize,
    buttonSize,
    cardSize,

    // Utilities
    getGridColumns,
    getModalSize,
    getContainerMaxWidth,
    getPlatformShadow,

    // Screen dimensions
    screen,

    // Breakpoints
    BREAKPOINTS,
};

export default responsiveUtils; 