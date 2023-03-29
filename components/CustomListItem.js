import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { ListItem, Avatar } from "@rneui/themed";
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

const CustomListItem = ({ id, chatName, enterChat }) => {
  const [chatMessages, setChatMessages] = useState([]);
  const getMessages = async () => {
    const messageRef = collection(db, "chats", id, "messages");
    const querySnapshot = query(messageRef, orderBy("timestamp", "desc"));
    const unsubscribe = await getDocs(querySnapshot);
    const datas = unsubscribe.docs.map((doc) => doc.data());
    setChatMessages(datas);
  };
  useEffect(() => {
    getMessages();
  });
  return (
    <ListItem onPress={() => enterChat(id, chatName)} key={id} bottomDivider>
      <Avatar
        rounded
        source={{
          uri:
            chatMessages?.[0]?.photoURL ||
            "https://gravatar.com/avatar/c2e45941e01e294658431ad938678b4a?s=400&d=mp&r=x",
        }}
      />
      <ListItem.Content>
        <ListItem.Title style={{ fontWeight: "800" }}>
          {chatName}
        </ListItem.Title>
        <ListItem.Subtitle numberOfLines={1}>
          {chatMessages?.[0]?.displayName
            ? chatMessages?.[0]?.displayName + ":"
            : ""}{" "}
          {chatMessages?.[0]?.message}
        </ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );
};

export default CustomListItem;

const styles = StyleSheet.create({});
