import React, { useState, useEffect } from "react";
import { View, Text, Image,  
  StyleSheet, Dimensions,Alert, TextInput,TouchableOpacity, 
  ScrollView, ActivityIndicator
} from 'react-native';

import axios from "axios";

import AsyncStorage from '@react-native-async-storage/async-storage';


function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);  


  const autoLogin = async () => {
    try {
      const savedUsername = await AsyncStorage.getItem('username');
      const savedPassword = await AsyncStorage.getItem('password');
  
      if (savedUsername !== null && savedPassword !== null) {
        
        setUsername(savedUsername);
        setPassword(savedPassword);        
        
        
        console.log("username", username)
        console.log("password", password)
        if (username && password)
          handleLogin()
        
      }
    } catch (error) {
      console.error('Erro ao recuperar os dados de login:', error);
    }
  };

  useEffect(() => {
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
          console.log("response.data.user", response.data.user)
          AsyncStorage.setItem('username', username);
          AsyncStorage.setItem('password', password);
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        {/* Contianer 1 */}
        <View style={{ backgroundColor: "#ffffff" }}>
          <View
            style={{
              backgroundColor: "#45AC9C",
              padding: 50,
              borderBottomLeftRadius: 60,
            }}
          >
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Image
                style={{ width: 300, height: 200, resizeMode: "contain" }}
                source={require("../../assets/que-curam.png")}
              />
            </View>

            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Text style={{ fontWeight: "500", fontSize: 16, color: "#fff" }}>
                Effettuare l'accesso
              </Text>             
            </View>
          </View>
        </View>

        {/* Container 2 */}
        <View style={{ backgroundColor: "#45AC9C" }}>
          <View
            style={{
              justifyContent: "center",
              backgroundColor: "#fff",
              paddingHorizontal: 30,
              borderTopRightRadius: 60,
            }}
          >
            <View style={styles.spacing_big}></View>

            <View style={styles.label}>
              <Text style={styles.label}>Email</Text>
            </View>
            <TextInput
              style={styles.input}
              autoCapitalize="none"
              onChangeText={setUsername}              
              value={username}
              onSubmitEditing={() => { this.passwordTextInput.focus(); }}
            />

            <View style={styles.spacing}></View>

            <View style={styles.label}>
              <Text style={styles.label}>Password</Text>
            </View>
            <TextInput
              ref={(input) => { this.passwordTextInput = input; }}
              style={styles.input}
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry={true}
              value={password}
              onChangeText={setPassword}
              onSubmitEditing={() => {
                handleLogin()
              }}
            />

            <View style={styles.spacing}></View>

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
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1, 
    backgroundColor: "#fff", 
  },
  spacing: {
        margin: 10
    }, 
    spacing_big: {
      margin: 30
  },  
    label: {
        // justifyContent: 'center',
        // alignItems: 'center',\
        fontWeight: '300',
        paddingLeft: 5,
        fontSize: 17,
        color: '#999',
        
    },  
    input: {
        height: 40,
        margin: 5,
        borderRadius: 100,
        backgroundColor: '#e7e7e7',
        padding: 10,

      },
      imagecontainer: {
        justifyContent: 'center',
        alignItems: 'center',
      },
      image_logo: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
        
      },
      card: {
        backgroundColor: '#fff',
        padding: 10,
        margin: 10,
        borderRadius: 7,
        elevation: 5,
        marginTop: 100,

        // alignItems:'center',
        // justifyContent:'center'
      },
      buttonContainer: {
        justifyContent: "center",
        alignItems: "center",
      },
    
      loginButton: {
        margin: 10,
        width: 200,
        backgroundColor: "#45AC9C",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 100,
        paddingVertical: 5,
      },
    
      loadingButton: {
        backgroundColor: "#999", 
        margin: 10,
        paddingVertical: 5,
      },
    
      loginButtonText: {
        color: "white",
        fontSize: 20,
      },
      loadingIndicator: {
        width: 40,
        height: 30,
      },

});
