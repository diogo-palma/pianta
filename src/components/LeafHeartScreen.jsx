import React from 'react';
import { View, Button } from 'react-native';

function LeafHeartScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button
        title="LeafHeart"
        onPress={() => {
          // Lógica a ser executada quando o botão é pressionado
          // Você pode adicionar ações de navegação ou outras ações aqui
        }}
      />
    </View>
  );
}

export default LeafHeartScreen;