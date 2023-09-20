import React from 'react';
import { View, Button } from 'react-native';

function SupportScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button
        title="Support"
        onPress={() => {
          // Lógica a ser executada quando o botão é pressionado
          // Você pode adicionar ações de navegação ou outras ações aqui
        }}
      />
    </View>
  );
}

export default SupportScreen;