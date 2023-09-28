import React from 'react';
import { View, Text, TextInput,TouchableWithoutFeedback, Image, ImageBackground, StyleSheet } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {
  useFonts,
  DMSans_400Regular,
  DMSans_400Regular_Italic,
  DMSans_500Medium,
  DMSans_500Medium_Italic,
  DMSans_700Bold,
  DMSans_700Bold_Italic,
} from '@expo-google-fonts/dm-sans';

function Header({ user, greeting, iconWheater, onTabChange }) {

  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_400Regular_Italic,
    DMSans_500Medium,
    DMSans_500Medium_Italic,
    DMSans_700Bold,
    DMSans_700Bold_Italic,
  });

  const handleFilterPress = (tabName, data) => {
    onTabChange(tabName, data);
  }

  if (!fontsLoaded) {   
    return (
      <View style={styles.loadingContainer}>
        <Text>Caricamento...</Text>
      </View>
    );
  }
  return (
    <ImageBackground style={styles.imageBackgroundView}
      source={require('../../../assets/plant-top.jpg')}
      resizeMode="stretch"
      imageStyle={{ opacity: 0.8 }}
    >
      <View style={{ margin: 10 }}>
        {user ? (
          <Text style={styles.text}>Ciao, {user.displayname}</Text>
        ) : (
          <Text style={styles.text}>Ciao, Amante delle piante </Text>
        )}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          <Text style={styles.greeting}>{greeting}</Text>
          <Image style={styles.weatherIcon} source={iconWheater} />
        </View>
        <TouchableWithoutFeedback onPress={() => handleFilterPress('Leaf', {searchFocus: true})}>
          <View style={styles.inputContainer}>
            <FontAwesome5 name="search" style={styles.searchIcon}  />
            <Text
              style={styles.input}              
              
            >
              Filtraggio di piante ...
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  imageBackgroundView: {
    height: 120,
    marginBottom: 15
  },
  text: {
    fontFamily: 'DMSans_400Regular'
  },
  greeting: {
    marginTop: 2,
    fontFamily: 'DMSans_700Bold',
    fontSize: 20
  },
  weatherIcon:{
    marginLeft: 5,
    height: 30,
    width: 25
  },
  inputContainer: {    
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#ffffffdb",
    borderColor: '#ccc',
    borderWidth: 1,
    marginTop: 20,
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
    color: "#ccc",    
    paddingVertical: 0,
    marginTop: 10
  },
});

export default Header;
