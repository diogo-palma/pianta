import React, { useState, useEffect, useCallback } from "react";
import { View, StatusBar, Text, 
  StyleSheet, Image,    
  ScrollView  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts, Oswald_500Medium,Oswald_200ExtraLight } from '@expo-google-fonts/oswald';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { getArticles } from '../api/index'
import Articles from "./HomeScreenComponents/Articles";
import Header from "./HomeScreenComponents/Header";
import Categories from "./HomeScreenComponents/Categories";



function HomeScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [greeting, setGreeting] = useState('');
  const [iconWheater, setIconWheater] = useState('');
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true)
  const [fontsLoaded] = useFonts({
    OswaldMedium: Oswald_500Medium,
    OswaldLight: Oswald_200ExtraLight
  });
  
  async function getArticlesApi(page) {
    try {      
      const result = await getArticles(page);
      return result;
    } catch (error) {
      throw error;
    }
  }
  useEffect(() => {
    loadMoreArticles()
  }, []);

  const loadMoreArticles = useCallback(async () => {    
    if (isLoadingMore || !hasMoreData) return;
    setIsLoadingMore(true);
  
    try {      
      let newPage = page + 1;      
      const result = await getArticlesApi(newPage);  
      console.log(newPage)    
  
      if (result.data.length === 0) {        
        setHasMoreData(false);
      } else {
        setPage(newPage);
        setArticles([...articles, ...result.data]); 
      }
    } catch (error) {
      console.error('Erro ao carregar mais artigos:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [page, articles, isLoadingMore, hasMoreData]);


  useEffect(() => {
    getUserFromStorage()
      .then((userData) => {
        setUser(userData);
      })
      .catch((error) => {
        console.error('Erro ao buscar usuário:', error);
      });
  }, []);

  useEffect(() => {
    const currentHour = new Date().getHours();

    if (currentHour >= 5 && currentHour < 12) {
      setGreeting('Buongiorno');
      setIconWheater(require('../../assets/morning.png'));
    } else if (currentHour >= 12 && currentHour < 18) {
      setGreeting('Buon pomeriggio');
      setIconWheater(require('../../assets/afternoon.png'));
    } else {
      setGreeting('Buona notte');
      setIconWheater(require('../../assets/night.png'));
    }
  }, [greeting, iconWheater]);

  const getUserFromStorage = async () => {
    try {
      const userJson = await AsyncStorage.getItem('user');
      
      if (userJson !== null) {
        const user = JSON.parse(userJson);
        console.log("user", user)
        return user;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Erro ao buscar usuário do AsyncStorage:', error);
      return null;
    }
  };

  const categories = [
    { name: 'Categoria 1', image: require('../../assets/green-background.jpg') },
    { name: 'Categoria 2', image: require('../../assets/green-background.jpg') },
    { name: 'Categoria 3', image: require('../../assets/green-background.jpg') },
    { name: 'Categoria 4', image: require('../../assets/green-background.jpg') },
    { name: 'Categoria 5', image: require('../../assets/green-background.jpg') },
    { name: 'Categoria 6', image: require('../../assets/green-background.jpg') },
  ]

  const renderCategoryPair = ({ item, index }) => {    
    if (index % 2 === 0) {
      const nextCategory = categories[index + 1];
      return (
        <View style={styles.categoryPair}>
          <View style={styles.categoryItem}>
            <Image source={item.image} style={styles.categoryImage} />
            <Text style={styles.categoryText}>{item.name}</Text>
          </View>
          {nextCategory && (
            <View style={styles.categoryItem}>
              <Image source={nextCategory.image} style={styles.categoryImage} />
              <Text style={styles.categoryText}>{nextCategory.name}</Text>
            </View>
          )}
        </View>
      );
    }
    return null;
  };

  
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#dad7df" />
      <Header user={user} greeting={greeting} iconWheater={iconWheater} />
      <ScrollView style={styles.scrollContainer}>           
        <Articles
          articles={articles}
          loadMoreArticles={loadMoreArticles}
          isLoadingMore={isLoadingMore}
          hasMoreData={hasMoreData}
        />        
        <Categories categories={categories} />
      </ScrollView>
    </View>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  container:{
    flexGrow: 1,
  },
  imageBackgroundView: {    
    height: 120,
    marginBottom: 15    
    
  },
  scrollContainer:{
    flex:1,    
  },
  viewArticles:{    
    padding: 20
  },
  viewCategories:{
    padding: 20
  },  
  itemContainer: {
    width: 250, 
    height: 150, 
    marginHorizontal: 10, 
    backgroundColor: 'lightgray',
    borderRadius: 10,
    overflow: 'hidden',
  },
  backgroundImage: {
    width: '100%', 
    height: '100%', 
    resizeMode: 'cover',
  },
  titleText: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    color: 'white',
    padding: 10,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    position: 'absolute',
    bottom: 0, 
    left: 0, 
    right: 0, 
  },
  labelTitle:{
    fontFamily: 'OswaldLight',
    fontSize: 12,    
  },
  categoryPair: {
    flexDirection: 'row',    
    alignItems: 'center',
    padding: 16,
  },
  categoryItem: {
    marginRight: 10,
    alignItems: 'left',
    borderColor: "#ccc",
    borderWidth: 1,
    height: 170,
    width: "50%",        
    borderRadius: 20
  },
  categoryImage: {
    width: 80,
    height: 120,
    position: "absolute",    
    right: 5,
    bottom: 0,
    resizeMode: 'cover', 
    marginBottom: 8,
  },
  categoryText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'left',
  },
});


