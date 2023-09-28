import React, {useEffect, useRef, useState} from 'react';
import { View, StatusBar, SafeAreaView } from 'react-native';
import { BottomTabs } from './bottom-tab/BottomTab';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Leaf, LeafLG, Home, HomeLG, LeafHeart, LeafHeartLG, Chat, ChatLG } from '../svgs';
import HomeScreen from './HomeScreen'; 
import LeafScreen from './LeafScreen'; 
import LeafHeartScreen from './LeafHeartScreen'; 
import SupportScreen from './SupportScreen'; 
import { BackHandler } from "react-native";

function DashboardScreen({ navigation }) {
  const tabsRef = useRef(null);
  const TabsNavigator = createBottomTabNavigator();
  const [activeTab, setActiveTab] = useState(null);
  const [dataTab, setDataTab] = useState(null)
  const [screenHistory, setScreenHistory] = useState(['Home', null]); 


  const changeTab = (tabName, data) => {        
    setDataTab(data)
    console.log("eii",activeTab, tabName)
    setScreenHistory([activeTab, tabName]);
    navigation.navigate(tabName, {categorySelected: data, activeTab})    
    setActiveTab(tabName);
  }

  function handleBackButtonClick() {
    console.log("screenHistory",screenHistory)
    console.log("screenHistory[0",screenHistory[0])
    if (!screenHistory)
      changeTab("Home") 
    else
      changeTab(screenHistory[0])    
    //navigation.goBack();
    return true;
  }

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackButtonClick);
    };
  }, []);
  
  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor="#4b7350" />
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        <TabsNavigator.Navigator
          id="bottomTab"
          initialRouteName="Home"
          tabBar={({ state, descriptors, navigation }) => (
            <BottomTabs     
              tabsData={BottomTabsData}               
              tabBarBackground="#4b7350"
              textColor="#FFFFFF"
              activeTabBackground="#FFFFFF"
              navigationHandler={(screen) => {     
               
                if (activeTab != screen){        
                  console.log("screen", activeTab, screen)   
                  setScreenHistory([activeTab, screen])
                  console.log("screenHistory", screenHistory)
                }
                setActiveTab(screen)                
                navigation.navigate(screen, {category: dataTab});
                
                setDataTab(null)
              }}
              activeTabName={activeTab}
            />
          )}
        >
          <TabsNavigator.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
            initialParams={{ onTabChange: changeTab }}
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

