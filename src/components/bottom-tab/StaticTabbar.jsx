/* eslint-disable react-native/no-inline-styles */
import React, { Fragment, useEffect, useState } from 'react';
import { Animated, Dimensions, I18nManager, Text, TouchableWithoutFeedback, View, } from 'react-native';
const AnimatedView = Animated.createAnimatedComponent(View);
const { width } = Dimensions.get('window');
export const tabHeight = 64;
export const StaticTabbar = ({ tabs, value, navigate, tabBarBackground, textColor,activeTabName }) => {
    const tabWidth = width / tabs.length;
    const [values, setValues] = useState([]);    

    useEffect(() => {
        setValues(tabs.map((_, index) => new Animated.Value(index === 0 ? 1 : 0)));
    }, [tabs]);

    useEffect(() => {      
      const tabIndex = tabs.findIndex((tab) => tab.id === activeTabName);
      console.log("tabIndex", tabIndex)
      console.log("activeTabName", activeTabName)
      if (tabIndex !== -1) {
        onNavigate(tabIndex);
        navigate(activeTabName)        
      }        
     
    }, [tabs, activeTabName]);
    const onNavigate = (index) => {
      const animations = values.map((v, i) =>
        Animated.timing(v, {
          toValue: i === index ? 1 : 0,
          duration: 300, 
          useNativeDriver: true,
        })
      );
    
      Animated.parallel([
        ...animations,
        Animated.spring(value, {
          toValue: I18nManager.isRTL
            ? width / 1.33 - tabWidth * index
            : -width + tabWidth * index,
          useNativeDriver: true,
        }),
      ]).start();
    };
    
    return (React.createElement(View, { style: { flexDirection: 'row' } }, tabs.map(({ id, title, icon: Icon, activeIcon: ActiveIcon }, index) => {
        let activeValue = values[index];        
        const opacity = value.interpolate({
            inputRange: I18nManager.isRTL
                ? [
                    width / 1.33 - tabWidth * (index + 1),
                    width / 1.33 - tabWidth * index,
                    width / 1.33 - tabWidth * (index - 1),
                ]
                : [
                    -width + tabWidth * (index - 1),
                    -width + tabWidth * index,
                    -width + tabWidth * (index + 1),
                ],
            outputRange: [1, 0, 1],
            extrapolate: 'clamp',
        });        
        const translateY = activeValue === null || activeValue === void 0 ? void 0 : activeValue.interpolate({
            inputRange: [0, 1],
            outputRange: [2 * tabHeight, 0],
        });
        return (React.createElement(Fragment, { key: `icon-${index}` },
            React.createElement(TouchableWithoutFeedback, { onPress: () => {
                    onNavigate(index);
                    navigate(id);
                } },
                React.createElement(AnimatedView, { style: {
                        flex: 1,
                        height: tabHeight - 4,
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        opacity,
                    } },
                    React.createElement(Icon, null),
                    React.createElement(View, { style: { marginTop: 8 } },
                        React.createElement(Text, { style: {
                                color: textColor,
                                fontSize: 12,
                                textAlign: 'center',
                            } }, title)))),
            React.createElement(AnimatedView, { style: {
                    position: 'absolute',
                    top: -32,
                    width: tabWidth,
                    height: tabHeight,
                    left: tabWidth * index,
                    justifyContent: 'center',
                    alignItems: 'center',
                    transform: [{ translateY: translateY || 0 }],
                } },
                React.createElement(View, { style: {
                        height: tabWidth > 100 ? tabWidth / 2.25 : tabWidth / 1.6,
                        width: tabWidth > 100 ? tabWidth / 2.25 : tabWidth / 1.6,
                        borderRadius: 48,
                        backgroundColor: tabBarBackground,
                        justifyContent: 'center',
                        alignItems: 'center',
                    } },
                    React.createElement(ActiveIcon, null)))));
    })));
};
//# sourceMappingURL=index.js.map