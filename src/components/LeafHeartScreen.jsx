import React, {useState, useCallback, useEffect} from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Button, StyleSheet,Text, 
  TextInput, TouchableOpacity, FlatList,
   Image
 } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { getPlantsHeart } from '../api/index'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import LeafHeartList from './LeafHeartScreenComponents/LeafHeartList';


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
        <LeafHeartList
          data={plantsHeats}          
          onEndReached={loadMorePlantsHearts}
          onEndReachedThreshold={0.5}
          isLoadingMore={isLoadingMorePlants}
          onPressItem={(item) => {
            navigation.navigate('PlantList', { data: item })
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


})

export default LeafHeartScreen;