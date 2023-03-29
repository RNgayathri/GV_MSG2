import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { Menu, Provider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
import AddChatScreen from "./screens/AddChatScreen";
import ChatScreen from "./screens/ChatScreen";
import UploadScreen from "./screens/UploadScreen";

const Stack = createNativeStackNavigator();

const gloalScreensOptions = {
  headerStyle: { backgroundColor: "#2D2D2D" },
  headerTintColor: "#fff",
  headerTitleStyle: { color: "white" },
};

export default function App() {
  return (
    <Provider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={gloalScreensOptions}
          initialRouteName="Login"
        >
          <Stack.Screen
            // options={{ title: "Lets Sign Up" }}
            name="Login"
            component={LoginScreen}
          />
          <Stack.Screen
            // options={{ title: "Lets Sign Up" }}
            name="Register"
            component={RegisterScreen}
          />
          <Stack.Screen
            // options={{ title: "Lets Sign Up" }}
            name="Home"
            component={HomeScreen}
          />
          <Stack.Screen
            // options={{ title: "Lets Sign Up" }}
            name="AddChat"
            component={AddChatScreen}
          />
          <Stack.Screen
            // options={{ title: "Lets Sign Up" }}
            name="Chat"
            component={ChatScreen}
          />
          <Stack.Screen
            // options={{ title: "Lets Sign Up" }}
            name="Upload"
            component={UploadScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
