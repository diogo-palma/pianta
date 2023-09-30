import React, {useState, useCallback, useEffect} from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Button, StyleSheet,Text, 
  TextInput, TouchableOpacity, FlatList,
   Image
 } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { getPlantsHeart } from '../api/index'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { BASE_URL } from "@env";


function LeafHeartScreen({ route }) {  
  const [plantsHeats, setPlantsHearts] = useState([]);
  const [page, setPage] = useState(0);  
  const [isLoadingMorePlants, setIsLoadingMorePlants] = useState(false);
  const [hasMoreDataPlants, setHasMoreDataPlants] = useState(true)
  const [searchText, setSearchText] = useState('');   
  const [searchTimeout, setSearchTimeout] = useState(null);

  const navigation = useNavigation();


  async function getPlantsHeartApi(page, query, category_id) {
    try {
      const result = await getPlantsHeart(page, query, category_id);      
      return result;
    } catch (error) {
      throw error;
    }
  }

  const loadMorePlantsHearts = useCallback(async () => {    
    console.log("hasMoreDataPlants", hasMoreDataPlants)
    if (!hasMoreDataPlants) return;
    setIsLoadingMorePlants(true);
  
    try {      
      let newPage = page + 1;      
      const result = await getPlantsHeartApi(newPage, searchText); 
      console.log(newPage) 
      
      
      if (result.data.length === 0) { 
        setHasMoreDataPlants(false);
        setIsLoadingMorePlants(false); 
      } else {
        setPage(newPage);
        setPlantsHearts([...plantsHeats, ...result.data]);        
      }
      if(result.last_page == newPage){
        setHasMoreDataPlants(false);
        setIsLoadingMorePlants(false); 
      }
    } catch (error) {
      console.error('Erro ao carregar mais plantas:', error);
    } finally {
      
    }
  }, [page, plantsHeats, isLoadingMorePlants, hasMoreDataPlants, searchText]);

  const handleTextChange = (text) => {
    
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    setHasMoreDataPlants(true);    
    const newTimeout = setTimeout(() => {
      console.log("handleTextChange", text)  
      setHasMoreDataPlants(true);        
      setSearchText(text);
    }, 800);    
    
    setSearchTimeout(newTimeout);
  };

  const renderPlantsHeartPair = ({ item, index }) => {
    return (
      <TouchableOpacity 
        style={styles.itemContainer}
        // onPress={() => navigation.navigate('LeafDetail', { plant: item })}
      >
        <View style={styles.containerInner}>
          <View style={styles.verticalIconContainer}>
            {item.image ? (
              <Image
                source={{ uri: `${BASE_URL}${item.image}` }}
                style={styles.circularImage}
              />
            ) : (
              <View style={styles.emptyImageContainer}>
                  <FontAwesome5 name="heart-broken" size={25} color="#ccc" style={{marginTop: 10, marginLeft: 3}} />
                  
              </View>
            )}
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.titleText} numberOfLines={1}>
              {item.heart_name}
            </Text>
           
          </View>
          <FontAwesome5 name="caret-right" size={24} color="#4b7350" />
        </View>
      </TouchableOpacity>
    );
  };
  useEffect(() => {
    setPlantsHearts([]); 
    setPage(0); 
    loadMorePlantsHearts();
  }, [searchText]);

  return (
    <View style={{ flex: 1, }}>
      <View style={styles.searchContainer}>
          <FontAwesome5 name="search" style={styles.searchIcon} />
          <TextInput
            style={styles.inputSearch}
            placeholder="Filtraggio per malattia ..."
            placeholderTextColor="#ccc"
            onChangeText={handleTextChange}
            onEndEditing={() => {
              console.log("terminou")
            }}            
            
          />
      </View>
      <View>
        <FlatList
          data={plantsHeats}
          renderItem={renderPlantsHeartPair}
          keyExtractor={(item, index) => index.toString()}
          onEndReached={loadMorePlantsHearts}
          onEndReachedThreshold={0.5}
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
    </View>
  );
}
const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#fff",
    borderColor: '#ccc',
    borderWidth: 1,
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 15, 
    paddingLeft: 14,
    height: 44
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10, 
    color: '#ccc', 
  },
  inputSearch:{
    fontFamily: "DMSans_400Regular_Italic",
    width: "100%"
  },  

  spinnerContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  itemContainer: {   
    padding: 10,            
  },
  containerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 0,    
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginVertical: -7,
    
  },
  verticalIconContainer: {
    alignItems: 'center',
    
  },
  emptyImageContainer: {    
    marginLeft: 5,
    marginRight: 5,
    height: 55,
    width: 30
  },
  circularImage: {
    width: 50,
    height: 50,
    borderRadius: 25, 
  },
  textContainer: {
    flex: 1, 
    marginLeft: 10,
  },
  titleText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 16,
  },

})

export default LeafHeartScreen;