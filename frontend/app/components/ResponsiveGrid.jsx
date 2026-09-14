import React from 'react';
import { View } from 'react-native';
import useResponsive from '../hooks/useResponsive';

const ResponsiveGrid = ({
    children,
    style,
    spacing = 'default',
    columns = null,
    ...props
}) => {
    const { getGridColumns, spacing: responsiveSpacing, isTablet } = useResponsive();

    const gridColumns = columns || getGridColumns();
    const gridSpacing = spacing === 'default' ? responsiveSpacing.md : responsiveSpacing[spacing] || responsiveSpacing.md;

    const gridStyle = {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginHorizontal: -gridSpacing / 2,
        ...style,
    };

    const itemStyle = {
        width: `${100 / gridColumns}%`,
        paddingHorizontal: gridSpacing / 2,
        paddingVertical: gridSpacing / 2,
    };

    const childrenWithStyle = React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
            return React.cloneElement(child, {
                style: [itemStyle, child.props.style],
            });
        }
        return child;
    });

    return (
        <View style={gridStyle} {...props}>
            {childrenWithStyle}
        </View>
    );
};

export default ResponsiveGrid; 