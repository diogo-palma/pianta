import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { BASE_URL } from "@env";
import {
  useFonts,
  DMSans_400Regular,
  DMSans_400Regular_Italic,
  DMSans_500Medium,
  DMSans_500Medium_Italic,
  DMSans_700Bold,
  DMSans_700Bold_Italic,
} from '@expo-google-fonts/dm-sans';
import { useNavigation } from '@react-navigation/native';


function Articles({ articles, loadMoreArticles, isLoadingMore, hasMoreData }) {

  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_400Regular_Italic,
    DMSans_500Medium,
    DMSans_500Medium_Italic,
    DMSans_700Bold,
    DMSans_700Bold_Italic,
  });

  const navigation = useNavigation();


  if (!fontsLoaded) {   
    return (
      <View style={styles.loadingContainer}>
        <Text>Caricamento...</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('ArticleDetail', { article: item })}
    >
      <View style={styles.itemContainer}>
          <Image source={{ uri: `${BASE_URL}${item.image}` }} style={styles.backgroundImage} />
        <Text style={styles.titleText} numberOfLines={1}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.viewArticles}>
      <Text style={styles.labelTitle}>Articoli</Text>
      <FlatList
        style={{ marginLeft: -10 }}
        data={articles}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        onEndReached={loadMoreArticles}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() => {
          return isLoadingMore ? (
            <Animatable.View animation={isLoadingMore ? 'rotate' : null} iterationCount="infinite">
              <FontAwesome5 name="spinner" size={60} color="#4b7350" />
            </Animatable.View>
          ) : null;
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  viewArticles:{
    padding: 20,
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
    backgroundColor: '#4b7350cc',
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
  labelTitle: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 15,
    marginBottom: 10
  },
});

export default Articles;
