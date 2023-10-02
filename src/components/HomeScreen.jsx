import React, { useState, useEffect, useCallback } from "react";
import { View, StatusBar, Text, 
  StyleSheet, Image,    
  ScrollView  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { getArticles, getCategories } from '../api/index'
import Articles from "./HomeScreenComponents/Articles";
import Header from "./HomeScreenComponents/Header";
import Categories from "./HomeScreenComponents/Categories";



function HomeScreen({ route }) {
  const [user, setUser] = useState(null);
  const [greeting, setGreeting] = useState('');
  const [iconWheater, setIconWheater] = useState('');
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(0);
  const [isLoadingMoreArticles, setIsLoadingMoreArticles] = useState(false);
  const [isLoadingMoreCategories, setIsLoadingMoreCategories] = useState(false);
  const [hasMoreDataArticles, setHasMoreDataArticles] = useState(true)
  const [hasMoreDataCategories, setHasMoreDataCategories] = useState(true)
  const { onTabChange } = route.params;

  async function getArticlesApi(page) {
    try {      
      const result = await getArticles(page);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async function getCategoriesApi(page) {
    try {      
      const result = await getCategories(page);
      return result;
    } catch (error) {
      throw error;
    }
  }

  useEffect(() => {
    loadMoreArticles()
    loadMoreCategories()
  }, []);

  const loadMoreArticles = useCallback(async () => {    
    if (isLoadingMoreArticles || !hasMoreDataArticles) return;
    setIsLoadingMoreArticles(true);
  
    try {      
      let newPage = page + 1;      
      const result = await getArticlesApi(newPage);  
      console.log(newPage)    
  
      if (result.data.length === 0) {        
        setHasMoreDataArticles(false);
      } else {
        setPage(newPage);
        setArticles([...articles, ...result.data]); 
      }
    } catch (error) {
      console.error('Erro ao carregar mais artigos:', error);
    } finally {
      setIsLoadingMoreArticles(false);
    }
  }, [page, articles, isLoadingMoreArticles, hasMoreDataArticles]);

  const loadMoreCategories = useCallback(async () => {    
    if (isLoadingMoreCategories || !hasMoreDataCategories) return;
    setIsLoadingMoreCategories(true);
  
    try {      
      let newPage = page + 1;      
      const result = await getCategoriesApi(newPage);  
      console.log(newPage)    
  
      if (result.data.length === 0) {        
        setHasMoreDataCategories(false);
      } else {
        setPage(newPage);
        setCategories([...categories, ...result.data]); 
      }
    } catch (error) {
      console.error('Erro ao carregar mais categorias:', error);
    } finally {
      setIsLoadingMoreCategories(false);
    }
  }, [page, categories, isLoadingMoreCategories, hasMoreDataCategories]);


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



  
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#dad7df" />
      
      <Header user={user} greeting={greeting} iconWheater={iconWheater} onTabChange={onTabChange}/>
      
      <ScrollView style={styles.scrollContainer}>           
        {user.capabilities.comprou_manual_plano && user.capabilities.comprou_manual_sucos ? (
          <Articles
            articles={articles}
            loadMoreArticles={loadMoreArticles}
            isLoadingMore={isLoadingMoreArticles}
            hasMoreData={hasMoreDataArticles}
          />       
        ) : (
          <View></View>
        )}
        <Categories 
          categories={categories} 
          loadMoreCategories={loadMoreCategories}
          isLoadingMore={isLoadingMoreCategories}
          onTabChange={onTabChange}
        />
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
    fontFamily: 'DMSans_400Regular',
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


