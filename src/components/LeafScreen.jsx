import React from 'react';
import { View, Text } from 'react-native';


function LeafScreen({ route }) {  
  console.log("data leaf",  route.params )
  let category = {}
  if (route.params?.category){
    console.log("oiii", route.params.category)
    category = route.params
  }
  
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{JSON.stringify(category, null, 2)}</Text>
    </View>
  );
}

export default LeafScreen;