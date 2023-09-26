import React from 'react';
import { View, Text, StatusBar, StyleSheet, Image, ScrollView } from 'react-native';
import {
  useFonts,
  DMSans_400Regular,
  DMSans_400Regular_Italic,
  DMSans_500Medium,
  DMSans_500Medium_Italic,
  DMSans_700Bold,
  DMSans_700Bold_Italic,
} from '@expo-google-fonts/dm-sans';
import RenderHtml from 'react-native-render-html';
import { BASE_URL } from "@env";


function ArticleDetailScreen({ route }) {
  
  const { article } = route.params  

  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_400Regular_Italic,
    DMSans_500Medium,
    DMSans_500Medium_Italic,
    DMSans_700Bold,
    DMSans_700Bold_Italic,
  });
  
  let html = article.text.replace(/<\/p><p>&nbsp;/g, '');

  html = html.replace(/<p.*?>/g, '<p style="margin:0;">');
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff",  }}>
      <StatusBar  backgroundColor="#fff" />
      <View style={{flex: 1, alignItems: "center", padding: 10}}>
        <Text style={styles.title}>{article.title}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Image source={{ uri: `${BASE_URL}${article.image}` }} style={styles.backgroundImage} />
      </View>
      <View style={{flex: 1, alignItems: 'flex-start', padding: 10}}>
        <RenderHtml          
          source={{ html: html }}
          style={{ flex: 1 }}
        />
      </View>
      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title:{
    fontFamily: 'DMSans_700Bold',
    fontSize: 28,      
  },
  backgroundImage: {
    width: '100%',        
    height: 200,
    resizeMode: 'stretch',
  },
})

export default ArticleDetailScreen;