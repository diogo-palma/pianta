import { createStackNavigator,TransitionPresets  } from '@react-navigation/stack';
import LoginScreen from './LoginScreen';
import DashboardScreen from './DashboardScreen';
import ArticleDetailScreen from './HomeScreenComponents/ArticlesDetail';
import LeafDetailScreen from './LeafScreenComponents/LeafDetailScreen';
import PlantList from './LeafHeartScreenComponents/PlantList';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }} // Remover a app bar nesta tela
      />
      <Stack.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="ArticleDetail" 
        component={ArticleDetailScreen} 
        options={{
          title: '',
          ...TransitionPresets.SlideFromRightIOS,
        }}
        
      />
      <Stack.Screen 
        name="LeafDetail" 
        component={LeafDetailScreen} 
        
        options={{
          title: '',
          
          ...TransitionPresets.SlideFromRightIOS,
        }}
        
      />
      <Stack.Screen 
        name="PlantList" 
        component={PlantList} 
        options={{
          title: '',
          headerStyle: {
            backgroundColor: '#f2f2f2'
          },
          ...TransitionPresets.SlideFromRightIOS,
        }}
        
      />

    </Stack.Navigator>
  );
}

export default AppNavigator;