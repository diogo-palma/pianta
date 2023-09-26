/* eslint-disable react-native/no-inline-styles */
import * as shape from 'd3-shape';
import React, { useState, useEffect } from 'react';
import { Animated, Dimensions, I18nManager, StyleSheet, View, } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { StaticTabbar, tabHeight as height } from './StaticTabbar';
const { width } = Dimensions.get('window');
const AnimatedSvg = Animated.createAnimatedComponent(Svg);
export const BottomTabs = ({ tabsData, tabBarBackground, activeTabBackground, navigationHandler, textColor,activeTabName }) => {
    const tabWidth = width / tabsData.length;
    // @ts-ignore
    const left = shape
        .line()
        // @ts-ignore
        .x((d) => d.x)
        // @ts-ignore
        .y((d) => d.y)([
        { x: 0, y: 0 },
        { x: width - 20, y: 0 },
    ]);
    // @ts-ignore
    const tab = shape
        .line()
        // @ts-ignore
        .x((d) => d.x)
        // @ts-ignore
        .y((d) => d.y)
        .curve(shape.curveBasis)([
        { x: width / 1.1, y: 0 },
        { x: width / 1.01 + tabWidth / 19.5, y: 0 },
        { x: width + tabWidth / 6.5, y: 10 },
        {
            x: width + tabWidth / 3.9,
            y: tabWidth > 100 ? tabWidth / 3.2 : tabWidth / 2.5,
        },
        {
            x: width + tabWidth - tabWidth / 3.9,
            y: tabWidth > 100 ? tabWidth / 3.2 : tabWidth / 2.5,
        },
        { x: width + tabWidth - tabWidth / 6.5, y: 10 },
        { x: (width + tabWidth) * 1.01 - tabWidth / 19.5, y: 0 },
        { x: (width + tabWidth) * 1.1, y: 0 },
    ]);
    // @ts-ignore
    const right = shape
        .line()
        // @ts-ignore
        .x((d) => d.x)
        // @ts-ignore
        .y((d) => d.y)([
        { x: width + tabWidth, y: 0 },
        { x: width * 2, y: 0 },
        { x: width * 2, y: height },
        { x: 0, y: height },
        { x: 0, y: 0 },
    ]);
    const d = `${left} ${tab} ${right}`;
    const [tabs] = useState(tabsData);
    const [value] = useState(new Animated.Value(I18nManager.isRTL ? width / 1.33 : -width));
  
    return (React.createElement(View, { style: { backgroundColor: tabBarBackground } },
        React.createElement(View, { style: { width, height } },
            React.createElement(AnimatedSvg, { width: width * 2, height: height / 1.4, style: {
                    backgroundColor: activeTabBackground,
                    transform: [{ translateX: value }],
                } },
                React.createElement(Path, { ...{ d }, fill: tabBarBackground }))),
        React.createElement(View, { style: [StyleSheet.absoluteFill, { paddingTop: 4 }] },
            React.createElement(StaticTabbar, { ...{ value, tabs, activeTabName }, navigate: (id) => navigationHandler(id), tabBarBackground: tabBarBackground, textColor: textColor }))));
};
//# sourceMappingURL=index.js.map