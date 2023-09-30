import React, {useCallback, useState, useEffect, useRef} from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, FlatList,
  StyleSheet, Image,TextInput,
  TouchableOpacity,ScrollView
} from 'react-native';
import { getPlants, getAllCategories } from '../api/index'
import { BASE_URL } from "@env";
import * as Animatable from 'react-native-animatable';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';




function LeafScreen({ route }) {  
  const [plants, setPlants] = useState([]);
  const [page, setPage] = useState(0);  
  const [isLoadingMorePlants, setIsLoadingMorePlants] = useState(false);
  const [hasMoreDataPlants, setHasMoreDataPlants] = useState(true)
  const [searchText, setSearchText] = useState('');   
  const [searchTimeout, setSearchTimeout] = useState(null);
  const textInputRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [scrollRef, setScrollRef] = useState(null);
  const [isListBlocked, setIsListBlocked] = useState(false);


  const navigation = useNavigation();

  useEffect(() => {
    async function fetchCategories() {
      try {
        const result = await getAllCategoriesApi();
        const categoriesWithSelection = result.map(category => ({
          ...category,
          isSelected: selectedCategory === category.id, // Verifica se é igual ao selectedCategory
        }));
        const categoriesWithTodas = [{ id: "all", name: 'Tutto', isSelected: !selectedCategory }, ...categoriesWithSelection];
  
        setCategories(categoriesWithTodas);
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
      }
    }
  
    fetchCategories();
  }, [selectedCategory]); 

  async function getPlantsApi(page, query, category_id) {
    try {
      const result = await getPlants(page, query, category_id);      
      return result;
    } catch (error) {
      throw error;
    }
  }

  async function getAllCategoriesApi() {
    try {      
      const result = await getAllCategories();
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
      const result = await getPlantsApi(newPage, searchText, selectedCategory); 
      console.log(newPage) 
      
     
      if (result.data.length === 0) { 
        // if (newPage == 1)
        //   setPlants([])
        setIsListBlocked(false); 
        setHasMoreDataPlants(false);
        setIsLoadingMorePlants(false); 
      } else {
        setPage(newPage);
        setPlants([...plants, ...result.data]);        
        setIsListBlocked(false); 
      }
      if(result.last_page == newPage){
        setIsListBlocked(false); 
        setHasMoreDataPlants(false);
        setIsLoadingMorePlants(false); 
      }
    } catch (error) {
      console.error('Erro ao carregar mais plantas:', error);
    } finally {
      
    }
  }, [page, plants, isLoadingMorePlants, hasMoreDataPlants, searchText, selectedCategory]);

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.itemContainer}
      onPress={() => navigation.navigate('LeafDetail', { plant: item })}
    >
      <View style={styles.containerInner}>
        <View style={styles.verticalIconContainer}>
          {item.plantgallery && item.plantgallery.length > 0 ? (
            <Image
              source={{ uri: `${BASE_URL}${item.plantgallery[0].filename}` }}
              style={styles.circularImage}
            />
          ) : (
            <View style={styles.emptyImageContainer}>
                <FontAwesome5 name="seedling" size={25} color="#ccc" style={{marginTop: 7, marginLeft: 3}} />
            </View>
          )}
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.titleText} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.scientificText} numberOfLines={1}>
            {item.scientific_name}
          </Text>
          <Text style={styles.categoryText} numberOfLines={1}>
            {item.categories.name}
          </Text>
        </View>
        <FontAwesome5 name="caret-right" size={24} color="#4b7350" />
      </View>
    </TouchableOpacity>
  );
  useEffect(() => {
    setPlants([]); 
    setPage(0); 
    loadMorePlants();
  }, [searchText, selectedCategory]);

  function updatedCategories(selectedCategoryId){
    const updatedCategories = categories.map(category => ({
      ...category,
      isSelected: category.id === selectedCategoryId,
    }));
    setCategories(updatedCategories);
  }

  useEffect(() => {        
    console.log("nomeTelaAnterior", route)
    if(route.params?.category?.searchFocus) {        
      if (textInputRef.current) {
      
        setTimeout(() => {
          textInputRef.current.focus();  
        }, 500);
        
      }      
      return
    }
    if (route.params?.category) {
      const selectedCategoryId = route.params.category.id;
      console.log("category", route.params.category)
      handleCategorySelect(selectedCategoryId)
    }
    
    
  }, [route]);
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

  const  handleCategorySelect   = (categoryId) => {
    console.log("categoryId", categoryId)
    setPlants([])
    if (categoryId == selectedCategory)
      return
    updatedCategories(categoryId)
    setIsListBlocked(true);
    if (categoryId === 'all') {
      setPage(0)      
      setHasMoreDataPlants(true)      
      setSelectedCategory(null);
    }else{      
      setPage(0)      
      setHasMoreDataPlants(true)      
      setSelectedCategory(categoryId);
      const selectedIndex = categories.findIndex((item) => item.id === categoryId);
      if (scrollRef) {
        if (selectedIndex > -1)
          scrollRef.scrollToIndex({ index: selectedIndex, animated: true });
      }

    }

    
  }


  
  
  return (
    <View style={{ flex: 1, }}>
     
      <View style={styles.searchContainer}>
          <FontAwesome5 name="search" style={styles.searchIcon} />
          <TextInput
            ref={textInputRef}
            style={styles.inputSearch}
            placeholder="Filtraggio di piante ..."
            placeholderTextColor="#ccc"
            onChangeText={handleTextChange}
            onEndEditing={() => {
              console.log("terminou")
            }}            
            
          />
      </View>
      <View>        
        <FlatList
          ref={(ref) => setScrollRef(ref)}          
          horizontal
          
          style={{marginBottom: 10}}
          data={categories}          
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleCategorySelect(item.id)}
              style={{margin: 5}} 
              disabled={isListBlocked}                        
            >
              <View style={styles.categoryItem}>
                <View style={[
                  styles.badge,
                  {
                    backgroundColor: item.isSelected ? '#4b7350' : '#ccc',
                    

                  },
                ]}>
                  <Text 
                    style={[
                      styles.categoryName,
                      {
                        color: isListBlocked ? '#baaeae' : '#fff',
                      }
                    ]}
                  >
                    {item.name}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />        
      </View>
      <ScrollView style={styles.scrollContainer}>   
        <FlatList
          style={{  }}
          data={plants}
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
      </ScrollView>
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
  spinnerContainer: {
    alignItems: 'center',
    marginTop: 16,    
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10, 
    color: '#ccc', 
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%', 
    padding: 10,
  },
  verticalIconContainer: {
    alignItems: 'center',
    
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
  scientificText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
  },
  categoryText: {
    fontFamily: "DMSans_500Medium",
    fontSize: 12,
    color: "#716767"
  },
  arrowContainer: {
    marginLeft: 10,
  },
  inputSearch:{
    fontFamily: "DMSans_400Regular_Italic",
    width: "100%"
  },
  emptyImageContainer: {    
    marginLeft: 5,
    marginRight: 5,
    height: 55,
    width: 30
  },
  categoryItem: {
    margin: 5,    
    marginRight: 2,
    alignItems: 'center',
  },
  badge: {
    backgroundColor: '#ccc', 
    borderRadius: 20, 
    padding: 5,    
    alignItems: 'center',
  },
  categoryName:{
    fontFamily: "DMSans_700Bold",
    color: "white",
    marginBottom: 4,
    marginLeft: 5,
    marginRight: 5

  },
  scrollContainer:{
    marginBottom: 30
  }
})

export default LeafScreen;
