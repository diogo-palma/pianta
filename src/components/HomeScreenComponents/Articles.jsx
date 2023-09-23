import React from 'react';
import { View, Text, FlatList, Image, ActivityIndicator, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { BASE_URL } from "@env";

function Articles({ articles, loadMoreArticles, isLoadingMore, hasMoreData }) {
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
        <Image source={{ uri: `${BASE_URL}${item.image}` }} style={styles.backgroundImage} />
      <Text style={styles.titleText}>{item.title}</Text>
    </View>
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
  labelTitle: {
    fontFamily: 'OswaldLight',
    fontSize: 12,
  },
});

export default Articles;
