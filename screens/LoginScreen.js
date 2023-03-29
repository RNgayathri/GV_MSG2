import { StyleSheet, Text, View, KeyboardAvoidingView } from "react-native";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { Button, Input, Image } from "@rneui/themed";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        navigation.replace("Home");
      }
    });
    return unsubscribe;
  }, []);

  const signIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        navigation.navigate("Home");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.containerStyle}>
      <StatusBar style="light" />
      <Image
        style={{
          width: 200,
          height: 200,
          borderRadius: 70,
          marginBottom: 50,
        }}
        source={require("../assets/logo.gif")}
        PlaceholderContent={<Text>Logo</Text>}
      />
      <View style={styles.inputContainer}>
        <Input
          placeholder="Email"
          type="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <Input
          placeholder="Password"
          type="password"
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
          onSubmitEditing={signIn}
        />
      </View>
      <Button
        containerStyle={styles.button}
        title="Login"
        onPress={signIn}
        buttonStyle={{ backgroundColor: "#2D2D2D" }}
      />
      <Button
        containerStyle={styles.button}
        buttonStyle={{
          borderColor: "#2D2D2D",
        }}
        onPress={() => navigation.navigate("Register")}
        type="outline"
        title="Register"
        titleStyle={{ color: "#2D2D2D" }}
      />
      <View style={{ height: 100 }} />
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#FFFFFF",
  },
  inputContainer: {
    width: 300,
  },
  button: {
    color: "#FFFFFF",
    width: 200,
    marginTop: 10,
  },
});
