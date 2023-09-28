import React from 'react';
import { View, ScrollView, useWindowDimensions } from 'react-native';
import RenderHtml from 'react-native-render-html';

function LeafPrecaution({precautions}) {

  const { width } = useWindowDimensions();

  const tagsStyles = {
    body: {
      whiteSpace: 'normal',
      backgroundColor: "#69955d",
      borderRadius: 10,
      padding: 10,
      color: '#fff',
      display: 'flex',
      justifyContent: 'center',
      width: width - 20
      
    },
    a: {
      color: 'green'
    }
  };
  
  let html = null
  if (precautions){
    html = precautions.replace(/<\/p><p>&nbsp;/g, '');
    html = html.replace(/<p.*?>/g, '<p style="margin:0;">');
  }
  return (
    <ScrollView>
      <View style={{flex: 1, alignItems: 'flex-start', padding: 10}}>
        <RenderHtml          
            source={{ html: html }}
            tagsStyles={tagsStyles}
          />
      </View>
    </ScrollView>
  );
}

export default LeafPrecaution;