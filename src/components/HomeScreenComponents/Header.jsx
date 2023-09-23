import React from 'react';
import { View, Text, TextInput, Image, ImageBackground, StyleSheet } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

function Header({ user, greeting, iconWheater }) {
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
        <View style={styles.inputContainer}>
          <FontAwesome5 name="search" style={styles.searchIcon} />
          <TextInput
            style={styles.input}
            placeholder="Filtraggio di piante ..."
            placeholderTextColor="#ccc"
            onChangeText={(text) => {

            }}
          />
        </View>
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
    
  },
  greeting: {
    marginTop: 2,
    fontFamily: 'OswaldMedium',
    fontSize: 20
  },
  weatherIcon:{
    marginLeft: 5,
    height: 40,
    width: 60
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
    fontSize: 12,
    color: 'black', 
    paddingVertical: 0,
  },
});

export default Header;
