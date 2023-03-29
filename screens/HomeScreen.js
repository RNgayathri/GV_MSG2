import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Menu, Provider } from "react-native-paper";
import React, { useEffect, useLayoutEffect, useState, useRef } from "react";
import { SafeAreaView } from "react-native";
import CustomListItem from "../components/CustomListItem";
import { auth, db } from "../firebase";
import { Avatar } from "@rneui/themed";
import { AntDesign, SimpleLineIcons } from "@expo/vector-icons";
import { doc, getDocs, collection } from "firebase/firestore";
import { Image } from "react-native";

export default function HomeScreen({ navigation }) {
  const [chats, setChats] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const menuRef = useRef();

  const signOutUser = () => {
    auth.signOut().then(() => {
      navigation.replace("Login");
      console.log("Signed Out");
    });
  };

  useEffect(() => {
    const getData = async () => {
      const snapshot = await getDocs(collection(db, "chats"));
      const datas = snapshot.docs.map((doc) => ({
        id: doc.id,
        docData: doc.data(),
      }));
      setChats(datas);
    };
    getData();
  }, [navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "GV CHAT",
      headerStyle: { backgroundColor: "#ffffff" },
      headerTitleStyle: { color: "black" },
      headerTintColor: "black",
      headerTitleAlign: "center",
      headerLeft: () => (
        <View style={{ marginLeft: 10 }}>
          <TouchableOpacity activeOpacity={0.5}>
            <Avatar
              rounded
              onPress={() => {
                navigation.navigate("Upload");
              }}
              source={{
                uri:
                  auth?.currentUser?.photoURL ||
                  "https://gravatar.com/avatar/c2e45941e01e294658431ad938678b4a?s=400&d=mp&r=x",
              }}
            />
          </TouchableOpacity>
        </View>
      ),
      headerRight: () => (
        <View style={{ marginRight: 10 }}>
          <Menu
            style={{ backgroundColor: "#fff" }}
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <TouchableOpacity onPress={() => setMenuVisible(true)}>
                <SimpleLineIcons name="menu" size={24} />
              </TouchableOpacity>
            }
            ref={menuRef}
          >
            <Menu.Item
              onPress={() => {
                navigation.navigate("AddChat");
                setMenuVisible(false);
              }}
              icon={({ color, size }) => (
                <AntDesign name="pluscircleo" size={size} color={color} />
              )}
              title="Add Chat"
            />
            <Menu.Item
              onPress={signOutUser}
              icon={({ color, size }) => (
                <AntDesign name="logout" size={size} color={color} />
              )}
              title="Logout"
            />
          </Menu>
        </View>
      ),
    });
  }, [navigation, menuVisible]);

  const enterChat = (id, chatName) => {
    navigation.navigate("Chat", { id, chatName });
  };

  return (
    <SafeAreaView behavior="padding" style={styles.containerStyle}>
      <StatusBar style="light" />
      <ScrollView style={styles.container}>
        {/* {imageUri && (
          <Avatar
            size="giant"
            source={{
              uri: `https://firebasestorage.googleapis.com/v0/b/gvmsg-d88c0.appspot.com/o/4F2DF318-DAF1-4AD7-8E12-168CDFF9D6F4.jpg?alt=media&token=4a94bafd-e3b0-42fd-a812-39383a98bde2`,
            }}
          />
        )} */}
        {chats.map(({ id, docData: { chatName } }) => (
          <CustomListItem
            id={id}
            key={id}
            chatName={chatName}
            enterChat={enterChat}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
});
