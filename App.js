import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Image, Platform,  StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import logo from './assets/logo.png';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing'; 
import uploadToAnonymousFilesAsync from 'anonymous-files'; 

export default function App() {
  const [selectedImage, setSelectedImage] = React.useState(null);

  let openImagePickerAsync = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync();

    if (pickerResult.cancelled === true) {
      return;
    }

    if (Platform.OS === 'web') {
      let remoteUri = await uploadToAnonymousFilesAsync(pickerResult.uri);
      setSelectedImage({ localUri: pickerResult.uri, remoteUri });
    } else {
      setSelectedImage({ localUri: pickerResult.uri, remoteUri: null });
    } 

    };

    let openShareDialogAsync = async () => {
      if (!(await Sharing.isAvailableAsync())) {
        alert(`The image is available for sharing at: ${selectedImage.remoteUri}`);
        return;
      }
  
      await Sharing.shareAsync(selectedImage.localUri);
    }; 
    
    if (selectedImage !== null) {

      return (
        <View style={styles.container}>

          <Image source={{ uri: selectedImage.localUri }} style={styles.thumbnail}/>

          <TouchableOpacity onPress={openShareDialogAsync} style={styles.button}>

          <Text style={styles.buttonText}>Share this photo</Text>

        </TouchableOpacity>

        </View>);
  }


  return (

    <View style={styles.container}>

      <Image source={logo} style={styles.logo} />

      <Text style={styles.instructions}>To share a photo with a friend, just press the button below!</Text>
      
      <StatusBar style="auto" />

      <TouchableOpacity onPress={openImagePickerAsync}
        style={styles.button}>

        <Text  style={styles.buttonText}>Pick a photo</Text>

      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ' rgb(108,91,123)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 250,
    height: 81,
    marginBottom: 10,
  },
  instructions: {
    color: 'rgb(240,89,36)',
    fontSize: 14,
    marginHorizontal: 15,
    marginBottom: 10,
  }, 
  button: {
    backgroundColor: "rgb(240,89,36)",
    padding: 20,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 20,
    color: ' rgb(33,33,33)',
  }, 
  thumbnail: {
    width: 300,
    height: 300,
    resizeMode: "contain"
  }
});
