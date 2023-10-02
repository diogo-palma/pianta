import React, {useState, useCallback, useEffect} from 'react';
import { FlatList, View, TouchableOpacity, 
  Image,StyleSheet, Text, ScrollView,Platform,
  StatusBar } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';

import * as Animatable from 'react-native-animatable';
import { getPlants } from '../../api/index'
import { BASE_URL } from "@env";

const PlantList = ({route }) => {
  
  const {heart_name, image, plants_id } = route.params.data
  const [isLoadingMorePlants, setIsLoadingMorePlants] = useState(false);
  const [plants, setPlants] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMoreDataPlants, setHasMoreDataPlants] = useState(true)

  const navigation = useNavigation();

  async function getPlantsApi(page, plants_id) {
    try {
      const result = await getPlants(page, null, null, plants_id);      
      return result;
    } catch (error) {
      throw error;
    }
  }

  const loadMorePlants = useCallback(async () => {    
    console.log("hasMoreDataPlants", hasMoreDataPlants)
    if (!hasMoreDataPlants) return;
    setIsLoadingMorePlants(true);
  
    try {      
      let newPage = page + 1;      
      const result = await getPlantsApi(newPage, plants_id); 
      console.log(newPage) 
      
     console.log("result", result)
      if (result.data.length === 0) { 
        // if (newPage == 1)
        //   setPlants([])        
        setHasMoreDataPlants(false);
        setIsLoadingMorePlants(false); 
      } else {
        setPage(newPage);
        setPlants([...plants, ...result.data]);                
      }
      if(result.last_page == newPage){        
        setHasMoreDataPlants(false);
        setIsLoadingMorePlants(false); 
      }
    } catch (error) {
      console.error('Erro ao carregar mais plantas:', error);
    } finally {
      
    }
  }, [page, plants, isLoadingMorePlants, hasMoreDataPlants]);

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      activeOpacity={0.5}
      style={styles.itemContainer}
      onPress={() => {
        console.log("plantgallery", item.plantgallery)
        navigation.navigate('LeafDetail', { plant: item })
      }}
    >
      <View style={styles.itemContent}>
        <View style={styles.imageContainer}>
          {item.plantgallery && item.plantgallery.length > 0 ? (
            <Image
              source={{ uri: `${BASE_URL}${item.plantgallery[0].filename}` }}
              style={styles.circularImage}
            />
          ) : (
            <View style={styles.emptyImageContainer}>
              <FontAwesome5 name="seedling" size={25} color="#ccc" style={{ marginTop: 7, marginLeft: 3 }} />
            </View>
          )}
        </View>
        <Text style={styles.itemText}>
          {item.name}
        </Text>
        <Text style={styles.sientificText}>
          {item.scientific_name}
        </Text>
      </View>
    </TouchableOpacity>
  );
  

  useEffect(() => {
    setPlants([]); 
    setPage(0); 
    loadMorePlants();
  }, [plants_id]);
  
  return (   
    
    <View style={{ flex: 1}}>     
      <StatusBar backgroundColor="#f2f2f2" /> 
      <View style={{ justifyContent: "center", alignItems: "center",  flexDirection: 'row'}}>
        {image ? (
          <Image
              source={{ uri: `${BASE_URL}${image}` }}
              style={styles.circularImage}
          />
        ) : (
          <View style={styles.emptyImageContainer}>
            <FontAwesome5 name="heart-broken" size={25} color="#ccc" style={{marginTop: 5, marginLeft: 3}} />                  
          </View>
        )}
        <Text style={styles.titleHeart}>{heart_name}</Text>
      </View>
      <ScrollView style={styles.scrollContainer}>   
        <View style={styles.flatListContainer}>
          <FlatList
            style={{ flex: 1 }}
            data={plants}
            numColumns={3}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            onEndReached={loadMorePlants}
            onEndReachedThreshold={0.4}
            ListFooterComponent={() => {
              return isLoadingMorePlants ? (
                <View style={styles.spinnerContainer}>
                  <Animatable.View animation={isLoadingMorePlants ? 'rotate' : null} iterationCount="infinite">
                    <FontAwesome5 name="spinner" size={60} color="#4b7350" />
                  </Animatable.View>
                </View>
              ) : null;
            }}
            
          />
        </View>
      </ScrollView>      
    </View>
  );
}
const styles = StyleSheet.create({
  header: {
    padding: 10
  },
  itemContainer:{
    
  },
  titleHeart:{
    fontSize: 18,
    marginLeft: 5,
    fontFamily: "DMSans_700Bold",
  },
  circularImage: {
    width: 50,
    height: 50,    
    borderRadius: 25, 
  },
  scrollContainer:{
    marginBottom: 30,
  },
  spinnerContainer: {
    alignItems: 'center',
    marginTop: 16,    
  },
  itemContent: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    padding: 5,
    minWidth: 100,
    borderColor: "#ccc",
    borderRadius: 20,
    backgroundColor: "#ffff", 
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 1, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
      },
      android: {
        elevation: 5,
        shadowOffset: { width: 1, height: 3 },
      },
    }),
  },
  imageContainer: {
    marginBottom: 10,
  },
  circularImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  emptyImageContainer: {    
    marginLeft: 5,
    marginRight: 5,
    height: 50,
    width: 30
  },
  itemText: {
    fontFamily: "DMSans_700Bold",
    textAlign: 'center',
  },
  sientificText:{
    color: "#6b6363",
    fontFamily: "DMSans_400Regular_Italic"
  },
  flatListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PlantList;

