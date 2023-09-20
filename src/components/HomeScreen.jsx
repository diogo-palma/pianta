import React, { useState, useEffect } from "react";
import { View, StatusBar, Text, StyleSheet, TextInput, FlatList, TouchableOpacity,ImageBackground  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts, Oswald_500Medium,Oswald_200ExtraLight } from '@expo-google-fonts/oswald';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

function HomeScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [fontsLoaded] = useFonts({
    OswaldMedium: Oswald_500Medium,
    OswaldLight: Oswald_200ExtraLight
  });
  const data = [
    { key: '1', content: 'View 1', categoryId: 1 },
    { key: '2', content: 'View 2', categoryId: 2 },
    { key: '3', content: 'View 3', categoryId: 1 },
  ];

  const categories = [
    { id: 1, name: 'Category A' },
    { id: 2, name: 'Category B' },
    { id: 3, name: 'Category C' },
    { id: 4, name: 'Category D' },
  ];

  const [selectedCategory, setSelectedCategory] = useState(categories[0].id); 
  const [filteredData, setFilteredData] = useState([]);

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
    if (selectedCategory === null) {
      setFilteredData(data);
    } else {
      const filtered = data.filter((item) => item.categoryId === selectedCategory);
      setFilteredData(filtered);
    }
  }, [selectedCategory]);

  if (!fontsLoaded) {   
    return (
      <View style={styles.loadingContainer}>
        <Text>Caricamento...</Text>
      </View>
    );
  }


  const renderItem = ({ item, index }) => (
    <ImageBackground  
      style={[
        styles.ImageBackgroundView ,
        {
          marginLeft: index === 0 ? -10 : 15,          
        },
      ]}
      source={require('../../assets/green-brackground.jpg')}
      imageStyle={{opacity:0.6}}
    >
      <Text>{item.content}</Text>
    </ImageBackground>
  );
  
  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryButton,

      ]}
      onPress={() => setSelectedCategory(item.id)}
    >
    <View style={{width: "100%", alignItems: 'center'}}>
      <View style={[styles.viewCategory, {backgroundColor: selectedCategory === item.id ? '#45AC9C' : 'transparent'}]}></View>
    </View>
    <Text style={[styles.categoryText, { color: selectedCategory === item.id ? '#45AC9C' : '#ccc' }]}>{item.name}</Text>
    
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#f7f7f7" }}>
      <StatusBar backgroundColor="#45AC9C" />
      <View style={styles.container}>
        {user ? (
          <Text style={styles.text}>Ciao, {user.displayname}</Text>            
        ) : (
          <Text style={styles.text}>Ciao</Text>
        )}
        <View style={styles.inputContainer}>
          <FontAwesome5 name="search" style={styles.searchIcon} />
          <TextInput
            style={styles.input}
            placeholder="Filtraggio di piante ..."
            placeholderTextColor="#ccc"
            onChangeText={(text) => {
              // Faça algo com o texto da pesquisa, se necessário
            }}
          />
        </View>
      </View>
      <View style={{ marginLeft: 10, marginBottom: 10 }}>
        <FlatList
          data={categories}
          renderItem={renderCategory}
          horizontal={true}
          contentContainerStyle={styles.categoryList}
        />
      </View>
      <View style={{ marginLeft: 10 }}>
        <FlatList
          data={filteredData}
          renderItem={renderItem}
          horizontal={true}
          contentContainerStyle={styles.flatList}
        />
      </View>
    </View>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginBottom: -20
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    height: 80,
  },
  text: {
    fontFamily: 'OswaldMedium',
    fontSize: 20,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#fff",
    borderColor: '#ccc',
    borderWidth: 1,
    marginTop: 10,
    borderRadius: 15, 
    paddingLeft: 14,
    height: 44
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10, 
    color: '#ccc', 
  },
  input: {
    flex: 1, 
    height: 40,
    fontSize: 16,
    color: 'black', 
    paddingVertical: 0,
  },
  flatList: {
    marginLeft: 15,
    paddingHorizontal: 8, 
  },
  ImageBackgroundView: {
    width: 200,
    height: 300,
    backgroundColor: 'lightgray',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    overflow: 'hidden'
    
  },
  categoryList: {
    marginTop: 10,
    paddingHorizontal: 16,
  },
  categoryButton: {
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 10
  },
  categoryText: {
    fontFamily: 'OswaldLight',
    fontSize: 16,
    fontWeight: 100,
    fontWeight: 'bold',
    color: 'white',
  },
  viewCategory: {
    width: 5,
    height: 5,
    borderRadius: 20
  }
});

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
