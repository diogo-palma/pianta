import React from 'react';
import { View, StatusBar, SafeAreaView } from 'react-native';
import { BottomTabs } from 'rn-animated-tabbar';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Leaf, LeafLG, Home, HomeLG, LeafHeart, LeafHeartLG, Chat, ChatLG } from '../svgs';
import HomeScreen from './HomeScreen'; 
import LeafScreen from './LeafScreen'; 
import LeafHeartScreen from './LeafHeartScreen'; 
import SupportScreen from './SupportScreen'; 

function DashboardScreen({ navigation }) {
  const TabsNavigator = createBottomTabNavigator();
  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor="#4b7350" />
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        <TabsNavigator.Navigator
          initialRouteName="Home"
          tabBar={({ state, descriptors, navigation }) => (
            <BottomTabs 
              tabsData={BottomTabsData} 
              tabBarBackground="#4b7350"
              textColor="#FFFFFF"
              activeTabBackground="#FFFFFF"
              navigationHandler={(screen: string) => {
                console.log("screen", screen)
                navigation.navigate(screen);
              }}
            />
          )}
        >
          <TabsNavigator.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          <TabsNavigator.Screen
            name="Leaf"
            component={LeafScreen}
            options={{ headerShown: false }}
          />
          <TabsNavigator.Screen
            name="LeafHeart"
            component={LeafHeartScreen}
            options={{ headerShown: false }}
          />
           <TabsNavigator.Screen
            name="Support"
            component={SupportScreen}
            options={{ headerShown: false }}
          />
          
       
        </TabsNavigator.Navigator>
      </SafeAreaView>
    </View>
  );
}

export default DashboardScreen;

const BottomTabsData = [
  {
    id: 'Home',
    title: 'Inizio',
    icon: Home,
    activeIcon: HomeLG,
  },
  {
    id: 'Leaf',
    title: 'Piante',
    icon: Leaf,
    activeIcon: LeafLG,
  },
  {
    id: 'LeafHeart',
    title: 'Malattia',
    icon: LeafHeart,
    activeIcon: LeafHeartLG,
  },
  {
    id: 'Support',
    title: 'Supporto',
    icon: Chat,
    activeIcon: ChatLG,
  },
 
];

