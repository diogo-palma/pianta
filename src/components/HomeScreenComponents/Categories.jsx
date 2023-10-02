import React, { useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ImageBackground, TouchableWithoutFeedback } from 'react-native';
import { useFonts, DMSans_400Regular, DMSans_700Bold } from '@expo-google-fonts/dm-sans';
import * as Animatable from 'react-native-animatable';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { BASE_URL } from "@env";
import { useNavigation, useIsFocused } from '@react-navigation/native';

function Categories({ categories, loadMoreCategories, isLoadingMore, onTabChange }) {

  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_700Bold,
  });

  const handleCategoryPress = (tabName, data) => {
    onTabChange(tabName, data);
  }

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Caricamento...</Text>
      </View>
    );
  }

  const renderCategoryPair = ({ item, index }) => {
    if (index % 2 === 0) {
      const nextCategory = categories[index + 1];
      return (
        <View style={styles.categoryPair}>
          <TouchableWithoutFeedback
            key={item.id}
            onPress={() => handleCategoryPress('Leaf', item)}
          >
            <View style={{ flex: 1 }}>
              <ImageBackground
                style={styles.categoryItem}
                source={require('../../../assets/background-cateogires.png')}
                resizeMode="stretch"
              >
                <View style={styles.categoryContent}>
                  <Image source={{ uri: `${BASE_URL}${item.image}` }} style={styles.categoryImage} />
                  <Text style={styles.categoryText}>{item.name}</Text>
                </View>
              </ImageBackground>
            </View>
          </TouchableWithoutFeedback>
          {nextCategory && (
            <TouchableWithoutFeedback
              key={nextCategory.id}
              onPress={() => handleCategoryPress('Leaf', nextCategory)}
            >
              <View style={{ flex: 1 }}>
                <ImageBackground
                  style={styles.categoryItem}
                  source={require('../../../assets/background-cateogires.png')}
                  resizeMode="stretch"
                >
                  <View style={styles.categoryContent}>
                    <Image source={{ uri: `${BASE_URL}${nextCategory.image}` }} style={styles.categoryImage} />
                    <Text style={styles.categoryText}>{nextCategory.name}</Text>
                  </View>
                </ImageBackground>
              </View>
            </TouchableWithoutFeedback>
          )}
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.labelTitle}>Categorie</Text>
      <FlatList
        data={categories}        
        renderItem={renderCategoryPair}
        keyExtractor={(item, index) => index.toString()}
        onEndReached={loadMoreCategories}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() => {
          return isLoadingMore ? (
            <View style={styles.spinnerContainer}>
              <Animatable.View animation={isLoadingMore ? 'rotate' : null} iterationCount="infinite">
                <FontAwesome5 name="spinner" size={60} color="#4b7350" />
              </Animatable.View>
            </View>
          ) : null;
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  labelTitle: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 15,
  },
  categoryPair: {
    flexDirection: 'row',
    alignItems: 'center',    
    marginTop: 16,
    marginBottom: 10,
  },
  categoryContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  categoryItem: {
    flex: 1,
    marginRight: 10,
    alignItems: 'left',
    borderColor: "#ccc",
    borderRadius: 20,
    backgroundColor: "#efe2e2",

    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 1, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
      },
      android: {
        elevation: 5,
        shadowOffset: { width: 1, height: 3 },
      },
    }),
  },
  categoryImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
    marginTop: -20,
  },
  categoryText: {
    fontFamily: 'DMSans_700Bold',
    color: "#453f3f",
    marginTop: 10,
    fontSize: 16,
    textAlign: 'left',
  },
  spinnerContainer: {
    alignItems: 'center',
    marginTop: 16,
  }
});

export default Categories;
