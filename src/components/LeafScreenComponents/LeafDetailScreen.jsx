import React from 'react';
import { View, StatusBar, Image, Text,StyleSheet, useWindowDimensions  } from 'react-native';
import Swiper from 'react-native-swiper';
import { BASE_URL } from "@env";
import { TabView, SceneMap, TabBar  } from 'react-native-tab-view';
import LeafDescription from './LeafDescription';
import LeafProperties from './LeafProperties';
import LeafUse from './LeafUse';
import LeafPrecaution from './LeafPrecaution';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  useFonts,
  DMSans_400Regular,
  DMSans_400Regular_Italic,
  DMSans_500Medium,
  DMSans_500Medium_Italic,
  DMSans_700Bold,
  DMSans_700Bold_Italic,
} from '@expo-google-fonts/dm-sans';

function LeafDetailScreen({ route }) {

  const { plant } = route.params  
  console.log("plant screen", plant)
  

  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_400Regular_Italic,
    DMSans_500Medium,
    DMSans_500Medium_Italic,
    DMSans_700Bold,
    DMSans_700Bold_Italic,
  });
  
  const renderScene = SceneMap({
    first:  () => <LeafDescription description={plant.description}/>,
    second: () => <LeafProperties properties={plant.properties} />,
    third: () => <LeafUse uses={plant.uses}/>,
    fourth: () => <LeafPrecaution precautions={plant.precautions}/>
  });

  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first',  },
    { key: 'second', },
    { key: 'third', },
    { key: 'fourth'}
  ]);

  const customTabBar = (props) => {
    return (
      <TabBar
        {...props}
        renderLabel={({ route, focused, color }) => (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {route.key === 'first' && <FontAwesome name="info-circle" color="#4b7350" size={20} />}            
            {route.key === 'second' && <FontAwesome5 name="seedling" color="#4b7350" size={20} />}
            {route.key === 'third' && <MaterialCommunityIcons name="tea" color="#4b7350" size={20} />}
            {route.key === 'fourth' && <FontAwesome5 name="heartbeat" color="#4b7350" size={20} />}
          </View>
        )}
        indicatorStyle={{ backgroundColor: '#4b7350' }} 
        style={{ backgroundColor: '#fff' }} 
        labelStyle={{ color: '#000' }} 
      />
    );
  };

  function CustomPagination({ index, total }) {
    const rectangles = Array.from({ length: total }, (_, i) => (
      <View
        key={i}
        style={[styles.paginationRect, i === index && styles.activePaginationRect]}
      />
    ));
  
    return <View style={styles.pagination}>{rectangles}</View>;
  }

  if (!fontsLoaded) {   
    return (
      <View style={styles.loadingContainer}>
        <Text>Caricamento...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar  backgroundColor="#fff" />
      <View style={styles.headTitle}>
        <View style={styles.leftColumn}>
          <Text style={styles.titleName}>{plant.name}</Text>
          <Text style={styles.titleScientific}>{plant.scientific_name}</Text>
        </View>
        <View style={styles.rightColumn}>
          <Text style={styles.badge}>{plant.categories.name}</Text>
        </View>
      </View>
      {plant.plantgallery && plant.plantgallery.length > 0 && (
        <View style={{ height: 300, marginTop: 10, marginBottom: 5 }}>
          <Swiper 
            style={styles.wrapper}
            showsPagination={true} 
            loop={false}
            contentWidth={layout.width}
            renderPagination={(index, total) => (
              <CustomPagination index={index} total={total} />
            )}
          >
            {plant.plantgallery.map((item, index) => (
              <View key={index} style={{ flex: 1 }}>              
                <Image
                  source={{ uri: `${BASE_URL}${item.filename}` }} 
                  style={{ flex: 1, resizeMode: 'contain' }}
                />
              </View>
            ))}        
          </Swiper>            
    
        </View>
      )}
      
      
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={customTabBar}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  wrapper: {
    
  },
  headTitle:{
    marginTop: -5,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between', 
  },
  leftColumn: {
    flex: 1, 
  },
  rightColumn: {
    flex: 0,
  },
  titleName: {
    fontFamily: "DMSans_700Bold",
    fontSize: 20
  },
  titleScientific:{
    fontFamily: "DMSans_400Regular",
    fontSize: 15
  },
  badge: {
    backgroundColor: '#4b7350', 
    color: "#fff",
    borderRadius: 20, 
    padding: 5,    
    alignItems: 'center',
    marginTop: 6
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    position: 'absolute',
    top: -18,
    left: 0,
    right: 0
  },
  paginationRect: {
    width: 20, 
    height: 4, 
    borderRadius: 2, 
    marginHorizontal: 5, 
    backgroundColor: '#ccc', 
  },
  activePaginationRect: {
    backgroundColor: '#4b7350',
  }
})

export default LeafDetailScreen;