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
import AsyncStorage from '@react-native-async-storage/async-storage';



function DashboardScreen({ navigation }) {
  const tabsRef = useRef(null);
  const TabsNavigator = createBottomTabNavigator();
  const [activeTab, setActiveTab] = useState(null);
  const [dataTab, setDataTab] = useState(null)  


  const changeTab = (tabName, data) => {        
    setDataTab(data)
    console.log("eiiiii",tabName)    
    navigation.navigate(tabName, {categorySelected: data, activeTab})    
    setActiveTab(tabName);
  }

  async function handleBackButtonClick() {  
    console.log("activeTabName handle", activeTab)
    // console.log("navigation", navigation)
    // console.log("navigation get parent", navigation.getParent())
    // console.log("navigation state", navigation.getState())
    const navigationIndex = navigation.getState()
    const historyPage = await AsyncStorage.getItem('historyPage')
    console.log("historyPage", historyPage)
    console.log("navigationIndex.index", navigationIndex.index)
    if (navigationIndex.index == 3){  
      console.log("to aqui 3")
      navigation.goBack();
      return true;
    }
    if (navigationIndex.index == 2){      
      console.log("to aqui 2")
      navigation.goBack();
      return true;
    }
    changeTab("Home") 
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
              navigationHandler={async (screen) => {
                setActiveTab(screen)                
                navigation.navigate(screen, {category: dataTab});
                await AsyncStorage.setItem('historyPage', screen);
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

