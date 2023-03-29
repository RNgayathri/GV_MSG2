import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import React, { useLayoutEffect, useState } from "react";
import { Avatar } from "@rneui/themed";
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import { auth, db } from "../firebase";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  orderBy,
} from "firebase/firestore";
// import { Voximplant } from "react-native-voximplant";
// const client = Voximplant.getInstance();

const ChatScreen = ({ navigation, route }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const onCall = async () => {
    try {
      let state = await client.getClientState();
      if (state === Voximplant.ClientState.DISCONNECTED) {
        await client.connect();
      }
      let authResult = await client.login(
        "gayathri@9mar94@gmail.com",
        "1234Gayathri@"
      );
      if (authResult) {
        VoxEngine.addEventListener(AppEvents.CallAlerting, (e) => {
          const newCall = VoxEngine.callUser({
            username: e.destination,
            callerid: e.callerid,
            displayName: e.displayName,
            video: true,
            scheme: e.scheme,
          });
          VoxEngine.easyProcess(e.call, newCall, () => {});
        });
      }
    } catch (e) {
      console.log(e.name + e.message);
    }
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Chat",
      headerTitleAlign: "left",
      headerBackTitleVisible: false,
      headerTitle: () => (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Avatar
            rounded
            source={{
              uri: messages[0]?.docData.photoURL,
            }}
          />
          <Text style={{ color: "white", marginLeft: 10, fontWeight: "700" }}>
            {route.params.chatName}
          </Text>
        </View>
      ),
      headerLeft: () =>
        Platform.OS === "ios" ? (
          <TouchableOpacity
            activeOpacity={0.5}
            style={{ marginLeft: 10 }}
            onPress={navigation.goBack}
          >
            <AntDesign name="arrowleft" size={24} color="white" />
          </TouchableOpacity>
        ) : (
          <View></View>
        ),
      headerRight: () => (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: 80,
            marginRight: 20,
          }}
        >
          <TouchableOpacity activeOpacity={0.5}>
            <FontAwesome name="video-camera" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.5}>
            <Ionicons name="call" size={24} color="white" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, messages]);
  const sendMessage = async () => {
    Keyboard.dismiss();
    await setDoc(doc(collection(db, "chats", route.params.id, "messages")), {
      timestamp: serverTimestamp(),
      message: input,
      displayName: auth.currentUser.displayName,
      email: auth.currentUser.email,
      photoURL: auth.currentUser.photoURL,
      sender: route.params.chatName,
    })
      .then(() => {
        // navigation.goBack();
      })
      .catch((error) => alert(error));
    setInput("");
  };
  const getMessages = async () => {
    const messageRef = collection(db, "chats", route.params.id, "messages");
    const querySnapshot = query(messageRef, orderBy("timestamp", "desc"));
    const unsubscribe = await getDocs(querySnapshot);
    const datas = unsubscribe.docs.map((doc) => ({
      id: doc.id,
      docData: doc.data(),
    }));
    setMessages(datas);
  };

  useLayoutEffect(() => {
    getMessages();
  }, [input]);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        // behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={90}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <>
            <ScrollView contentContainerStyle={{ paddingTop: 15 }}>
              {messages.map(({ id, docData }) =>
                docData.email === auth.currentUser.email ? (
                  <View key={id} style={styles.receiverMessageContainer}>
                    <Avatar
                      position={"absolute"}
                      rounded
                      size={30}
                      bottom={-15}
                      right={-5}
                      source={{
                        uri:
                          docData.photoURL ||
                          "https://gravatar.com/avatar/c2e45941e01e294658431ad938678b4a?s=400&d=mp&r=x",
                      }}
                    />
                    <Text style={styles.receiverText}>{docData.message}</Text>
                  </View>
                ) : (
                  <View key={id} style={styles.senderMessageContainer}>
                    <Avatar
                      position={"absolute"}
                      rounded
                      size={30}
                      bottom={-15}
                      right={-5}
                      source={{
                        uri:
                          docData.photoURL ||
                          "https://gravatar.com/avatar/c2e45941e01e294658431ad938678b4a?s=400&d=mp&r=x",
                      }}
                    />
                    <Text style={styles.senderText}>{docData.message}</Text>
                    <Text style={styles.senderName}>{docData.displayName}</Text>
                  </View>
                )
              )}
            </ScrollView>
            <View style={styles.footer}>
              <TextInput
                placeholder="GV CHAT"
                style={styles.textInput}
                value={input}
                onSubmitEditing={sendMessage}
                onChangeText={(text) => setInput(text)}
              />
              <TouchableOpacity activeOpacity={0.5} onPress={sendMessage}>
                <Ionicons name="send" size={24} color="#2D2D2D" />
              </TouchableOpacity>
            </View>
          </>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  receiverMessageContainer: {
    padding: 15,
    backgroundColor: "#ECECEC",
    alignSelf: "flex-end",
    borderRadius: 20,
    marginRight: 15,
    marginBottom: 20,
    maxWidth: "80%",
    position: "relative",
  },
  senderMessageContainer: {
    padding: 15,
    backgroundColor: "#2D2D2D",
    alignSelf: "flex-start",
    borderRadius: 20,
    margin: 15,
    maxWidth: "80%",
    position: "relative",
  },
  receiverText: {
    color: "black",
    marginLeft: 10,
    fontWeight: "500",
  },
  senderText: {
    color: "white",
    marginLeft: 10,
    marginBottom: 15,
    fontWeight: "500",
  },
  senderName: {
    paddingRight: 10,
    left: 10,
    fontSize: 10,
    color: "white",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 15,
  },
  textInput: {
    bottom: 0,
    height: 40,
    flex: 1,
    marginRight: 15,
    backgroundColor: "#ECECEC",
    padding: 10,
    color: "grey",
    borderRadius: 30,
  },
});
