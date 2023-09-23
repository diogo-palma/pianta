import React from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';

function Categories({ categories }) {
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
      <Text style={styles.labelTitle}>Categorie</Text>
      <FlatList
        data={categories}
        renderItem={renderCategoryPair}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  labelTitle: {
    fontFamily: 'OswaldLight',
    fontSize: 12,
  },
  categoryPair: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginLeft: -10
  },
  categoryItem: {
    marginRight: 10,
    alignItems: 'left',
    borderColor: "#ccc",
    borderWidth: 1,
    height: 170,
    width: "50%",
    borderRadius: 20,
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

export default Categories;
