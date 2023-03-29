import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  TouchableOpacity,
  Text,
  View,
  Image,
} from "react-native";
import { getAuth, updateProfile } from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  uploadBytes,
  getBytes,
  getBlob,
} from "firebase/storage";
import { auth, db } from "../firebase";
import * as ImagePicker from "expo-image-picker";
import * as Progress from "react-native-progress";
import * as ImageManipulator from "expo-image-manipulator";
import { Avatar } from "@rneui/themed";

export default function ImagePickerScreen({ navigation }) {
  const [image, setImage] = useState(null);
  const [showImage, setShowImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);

  const uploadImageAsync = async (uri, onProgress) => {
    console.log(image);
    const metadata = {
      contentType: "image/jpeg",
    };
    const storage = getStorage();
    const filename = image.substring(image.lastIndexOf("/") + 1);
    const response = await fetch(image);
    const blob = await response.blob();
    const uploadUri =
      Platform.OS === "ios" ? image.replace("file://", "") : image;
    const storageRef = ref(storage, filename);
    setUploading(true);
    setTransferred(0);
    const uploadTask = uploadBytesResumable(storageRef, blob, metadata);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setTransferred(progress);
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case "storage/unauthorized":
            // User doesn't have permission to access the object
            break;
          case "storage/canceled":
            // User canceled the upload
            break;

          // ...

          case "storage/unknown":
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          console.log(downloadURL);
          setShowImage(downloadURL);
          updateUserProfile(downloadURL);
          setImage(null);
          setUploading(false);
          setTransferred(0);
          navigation.navigate("Home");
        });
      }
    );
  };

  const updateUserProfile = async (photoURL) => {
    await updateProfile(auth.currentUser, {
      photoURL: photoURL,
    });
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }
  };

  const selectImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled) {
        const manipResult = await ImageManipulator.manipulateAsync(
          result.uri,
          [{ resize: { width: 300 } }],
          { compress: 0.7, format: ImageManipulator.SaveFormat.JPG }
        );
        setImage(manipResult.uri);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const uploadImage = async () => {
    setUploading(true);
    uploadImageAsync(image, setTransferred);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.imageContainer}>
        {image !== null ? (
          <Avatar
            source={{ uri: image }}
            style={{ width: 200, height: 200 }}
            rounded
          />
        ) : (
          <Avatar
            style={{ width: 200, height: 200 }}
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
        )}
      </View>
      {image == null && (
        <TouchableOpacity style={styles.selectButton} onPress={selectImage}>
          <Text style={styles.buttonText}>Pick from Gallery</Text>
        </TouchableOpacity>
      )}
      {image == null && (
        <TouchableOpacity style={styles.selectButton} onPress={takePhoto}>
          <Text style={styles.buttonText}>Take a photo</Text>
        </TouchableOpacity>
      )}
      {uploading && (
        <View style={styles.progressBarContainer}>
          <Progress.Bar progress={transferred} width={300} />
        </View>
      )}
      {image != null && uploading == false && (
        <TouchableOpacity style={styles.uploadButton} onPress={uploadImage}>
          <Text style={styles.buttonText}>Upload image</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = {
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  selectButton: {
    backgroundColor: "#2D2D2D",
    borderRadius: 20,
    padding: 10,
    margin: 20,
  },
  uploadButton: {
    backgroundColor: "#2D2D2D",
    borderRadius: 20,
    padding: 10,
    margin: 20,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  imageBox: {
    width: 300,
    height: 300,
    resizeMode: "contain",
    margin: 20,
    borderRadius: 30,
  },
  progressBarContainer: {
    margin: 20,
  },
};
