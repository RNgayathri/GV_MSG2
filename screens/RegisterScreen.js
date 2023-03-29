import { KeyboardAvoidingView, StyleSheet, View } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Button, Input, Image, Text } from "@rneui/themed";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase";
import UploadScreen from "./UploadScreen";

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitle: "Login",
    });
  }, [navigation]);

  const register = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        updateProfile(userCredential.user, {
          displayName: name,
          photoURL:
            imageUrl ||
            "https://gravatar.com/avatar/c2e45941e01e294658431ad938678b4a?s=400&d=mp&r=x",
        }).then(() => {
          navigation.navigate("Home");
        });
      })
      .catch((error) => {
        alert(error.message);
      });
    navigation.navigate("Login");
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.containerStyle}>
      <StatusBar style="light" />
      {/* <Image
        style={{
          width: 200,
          height: 200,
          borderRadius: 70,
          marginBottom: 30,
        }}
        source={require("../assets/logo.gif")}
        PlaceholderContent={<Text>Logo</Text>}
      /> */}
      <Text h3 style={{ marginBottom: 20 }}>
        Create GV CHAT Account
      </Text>
      <View style={styles.inputContainer}>
        <Input
          placeholder="Full Name"
          type="text"
          value={name}
          onChangeText={(text) => setName(text)}
        />
        <Input
          placeholder="Email"
          type="text"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <Input
          placeholder="Password"
          type="password"
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        {/* <Input
          placeholder="Profile Picture URL (optional)"
          type="text"
          value={imageUrl}
          onChangeText={(text) => setImageUrl(text)}
          onSubmitEditing={register}
        />
        <UploadScreen /> */}
      </View>
      <Button
        raised
        containerStyle={styles.button}
        title="Register"
        onPress={register}
        buttonStyle={{ backgroundColor: "#2D2D2D" }}
      />
      <View style={{ height: 100 }} />
    </KeyboardAvoidingView>
  );
}

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
