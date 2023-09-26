import React, { useState, useEffect } from "react";
import { View, Text, Image, 
  StyleSheet, Dimensions, Alert, TextInput, 
  TouchableOpacity, ScrollView, 
  ActivityIndicator, ImageBackground, Platform } from 'react-native';
import { useFonts, Roboto_500Medium,Roboto_300Light } from '@expo-google-fonts/roboto';
import axios from "axios";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';

function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAutoLogin, setIsAutoLogin] = useState(false);
  const [isChecked, setIsChecked] = useState(true);
  const [fontsLoaded] = useFonts({
    RobotoMedium: Roboto_500Medium,
    RobotoLight: Roboto_300Light
  });


  const toggleCheckbox = () => {
    setIsChecked(!isChecked);
  };

 

  const autoLogin = async () => {
    try {
      
      const savedUsername = await AsyncStorage.getItem('username');
      const savedPassword = await AsyncStorage.getItem('password');

      if (savedUsername !== null && savedPassword !== null) {
        setIsAutoLogin(true);
        setUsername(savedUsername);
        setPassword(savedPassword);

        if (username && password)
          handleLogin();
      }else{
        setIsAutoLogin(false);
      }
    } catch (error) {
      console.error('Erro ao recuperar os dados de login:', error);
    }
  };

  useEffect(() => {
    // AsyncStorage.removeItem('username')
    // AsyncStorage.removeItem('password')
    autoLogin();
  }, [username, password]);

  const handleLogin = async () => {
    if (username.trim() === "" || password.trim() === "") {
      Alert.alert(
        "Campi richiesti",
        "Compila entrambi i campi nome utente e password."
      );
      return;
    }
    setIsLoading(true);

    axios
      .get(
        `https://piantecheguariscono.pro/api/auth/generate_auth_cookie/?nonce=f4320f4a67&username=${username}&password=${password}`
      )
      .then((response) => {        
        if (response.data.status === "ok") {
          if (isChecked){
            AsyncStorage.setItem('username', username);
            AsyncStorage.setItem('password', password);
          }
          AsyncStorage.setItem('user', JSON.stringify(response.data.user));
          navigation.navigate("Dashboard");
        } else {
          Alert.alert(
            "Errore di autenticazione",
            "Le credenziali non sono corrette."
          );
        }
      })
      .catch((error) => {
        console.error("Erro ao fazer login:", error);
        Alert.alert(
          "Errore di autenticazione",
          "Si è verificato un errore durante l'accesso. Controlla le tue credenziali"
        );
      })
      .finally(() => {
        setIsLoading(false);
      })
  };

  LoginScreen.navigationOptions = {
    header: null,
  }

  if (!fontsLoaded) {   
    return (
      <View style={styles.loadingContainer}>
        <Text>Caricamento...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={{ alignItems: 'start', height: 350 }}>
        <ImageBackground 
          source={require('../../assets/login-background.png')} 
          style={{ width: "100%", height: "100%", resizeMode: 'cover', alignSelf: 'flex-start' }}
        />
      </View>
      <View style={{alignItems: 'center', marginTop: 20}}>
        <Text style={{ fontWeight: "500", fontSize: 32, color: "#4b7350", fontFamily: 'RobotoMedium' }}>
          Benvenuto
        </Text>
        <Image
         source={require('../../assets/leaf-watter.png')} 
         style={{width: 80, height: 80, position: 'absolute', right: 0}}
        />
        {isAutoLogin ? (
          <Animatable.View style={{marginTop: 50}} animation={isAutoLogin ? 'rotate' : null} iterationCount="infinite">
            <FontAwesome5 name="spinner" size={60} color="#4b7350" />
          </Animatable.View>
        ) : (
          <View style={{flex: 1, width: "100%"}}>
            <Text style={{ fontSize: 14, color: "#ccc", textAlign: "center" }}>
              Effettuare l'accesso
            </Text>
            <View style={styles.inputContainer}>
              <FontAwesome5 name="user" style={styles.searchIcon} />
              <TextInput
                  style={styles.inputLabel}
                  autoCapitalize="none"
                  placeholder="Email"
                  placeholderTextColor="#4b7350"
                  onChangeText={setUsername}              
                  value={username}
                  onSubmitEditing={() => { this.passwordTextInput.focus(); }}
              />
            </View>
            <View style={[styles.inputContainer, {marginTop: -8}]}>
              <FontAwesome5 name="lock" style={styles.searchIcon} />
              <TextInput
                  ref={(input) => { this.passwordTextInput = input; }}
                  style={styles.inputLabel}
                  autoCapitalize="none"
                  placeholder="Password"
                  placeholderTextColor="#4b7350"
                  autoCorrect={false}
                  secureTextEntry={true}
                  value={password}
                  onChangeText={setPassword}
                  onSubmitEditing={() => {
                    handleLogin()
                  }}
              />
            </View>
          </View>
        )}
      </View>
      {isAutoLogin ? (
        <View></View>
      ) : (
        <TouchableOpacity style={styles.checkboxContainer} onPress={toggleCheckbox}>
          {isChecked ? (
            <FontAwesome5 name="check-square" style={styles.checkedIcon} />
          ) : (
            <FontAwesome5 name="square" style={styles.uncheckedIcon} />
          )}
          <Text style={styles.labelCheckBox}>Ricordati di me</Text>
        </TouchableOpacity> 
      )}
      {isAutoLogin ? (
        <View></View>
      ) : (
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleLogin} disabled={isLoading}>
            <View
              style={[
                styles.loginButton,
                isLoading && styles.loadingButton,
              ]}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="white" style={styles.loadingIndicator} />
              ) : (
                <Text style={styles.loginButtonText}>Accedere</Text>
              )}
            </View>
          </TouchableOpacity>
        </View>
      )}
      
          
    </ScrollView>
  );
}

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#dce5de",
    borderColor: '#ccc',
    
    borderRadius: 15, 
    paddingLeft: 14,
    height: 55,
    margin: 20,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10, 
    color: '#4b7350', 
  },
  inputLabel: {
    fontFamily: 'RobotoLight',
    flex: 1, 
    height: 40,
    fontSize: 12,
    color: 'black', 
    paddingVertical: 0,
  },
  buttonContainer: {
    marginTop: 50,
    flex: 1,    
    justifyContent: "center",
    alignItems: "center",
  },
  loginButton: {
    margin: 10,
    width: 280,
    height: 50,
    backgroundColor: "#4b7350",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,    
  },

  loadingButton: {
    backgroundColor: "#999", 
    margin: 10,
    paddingVertical: 5,
  },

  loginButtonText: {
    fontFamily: 'RobotoMedium',
    color: "white",
    fontSize: 16,
  },
  loadingIndicator: {
    width: 40,
    height: 30,
  },
  checkboxContainer: {    
    marginLeft: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkedIcon: {
    fontSize: 18,
    color: 'green',
  },
  uncheckedIcon: {
    fontSize: 18,
    color: 'gray',
  },
  labelCheckBox: {
    fontFamily: 'RobotoMedium',
    marginLeft: 10,
    fontSize: 12,
    color: "#4b7350"
  },
 
});
