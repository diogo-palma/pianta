import React from 'react';
import { FlatList, View, TouchableOpacity, Image, Text } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import * as Animatable from 'react-native-animatable';
import { BASE_URL } from "@env";

const LeafHeartList = ({
  data,  
  onEndReached,
  onEndReachedThreshold,
  isLoadingMore,
  onPressItem
}) => {
  
  const renderPlantsHeartPair = ({ item, index }) => {
    const handleItemPress = (item) => {
      onPressItem(item);
    };
  
    return (
      <TouchableOpacity 
        style={styles.itemContainer}
        onPress={() => handleItemPress(item)}
      >
        <View style={styles.containerInner}>
          <View style={styles.verticalIconContainer}>
            {item.image ? (
              <Image
                source={{ uri: `${BASE_URL}${item.image}` }}
                style={styles.circularImage}
              />
            ) : (
              <View style={styles.emptyImageContainer}>
                <FontAwesome5 name="heart-broken" size={25} color="#ccc" style={{marginTop: 10, marginLeft: 3}} />                  
              </View>
            )}
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.titleText} numberOfLines={1}>
              {item.heart_name}
            </Text>
           
          </View>
          <FontAwesome5 name="caret-right" size={24} color="#4b7350" />
        </View>
      </TouchableOpacity>
    );
  };
  return (    
    <FlatList
      data={data}
      renderItem={renderPlantsHeartPair}
      keyExtractor={(item, index) => index.toString()}
      onEndReached={onEndReached}
      onEndReachedThreshold={onEndReachedThreshold}
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
  );
};

const styles = {
  spinnerContainer: {
    alignItems: 'center',
    marginTop: 16,
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
  verticalIconContainer: {
    alignItems: 'center',
    
  },
  circularImage: {
    width: 50,
    height: 50,
    borderRadius: 25, 
  },
  titleText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 16,
  },
  textContainer: {
    flex: 1, 
    marginLeft: 10,
  },
  emptyImageContainer: {    
    marginLeft: 5,
    marginRight: 5,
    height: 55,
    width: 30
  },
};

export default LeafHeartList;
