import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { getUserData, updateUserProfile, uploadAvatarImage } from '../../../lib/backend/appwrite';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemeContext } from '../../ThemeContext'; // Import ThemeContext

const EditProfile = () => {
  const { isDarkMode } = useContext(ThemeContext); // Use ThemeContext
  const [state, setState] = useState({
    imageUri: null,
    displayName: '',
    role: '',
    hobbies: '',
    exp: 0,
    loading: false,
    existingFileId: null,
    error: null
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getUserData();
        if (userData) {
          setState(prevState => ({
            ...prevState,
            displayName: userData.displayName?.[0] || '',
            role: userData.role?.[0] || '',
            hobbies: userData.hobbies?.join(', ') || '',
            exp: userData.exp || 0,
            existingFileId: userData.avatarFileId
          }));
        }
      } catch (error) {
        setState(prevState => ({
          ...prevState,
          error: error.message
        }));
      }
    };

    fetchData();
  }, []);

  const handleSaveProfile = async () => {
    try {
      setState(prevState => ({ ...prevState, loading: true }));

      let avatarUrl = state.existingFileId;
      
      if (state.imageUri) {
        console.log("🖼️ Uploading avatar image...");
        const result = await uploadAvatarImage(state.imageUri);
        
        if (result) {
          avatarUrl = result;
          console.log("✅ Avatar uploaded successfully with file ID:", avatarUrl);
        } else {
          throw new Error("Failed to upload avatar image");
        }
      }

      // Save the updated profile to Appwrite
      console.log("💾 Saving profile...");
      await updateUserProfile(
        state.displayName,
        state.role,
        state.hobbies,
        state.exp,
        avatarUrl
      );
      console.log("✅ Profile updated successfully");

      setState(prevState => ({
        ...prevState,
        error: null,
        loading: false
      }));
    } catch (error) {
      setState(prevState => ({
        ...prevState,
        error: error.message,
        loading: false
      }));
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#1a1a1a' : '#F4F4F9' }]}>
      {state.error && (
        <Text style={styles.error}>{state.error}</Text>
      )}
      
      <Text style={[styles.header, { color: isDarkMode ? '#fff' : '#333' }]}>Edit Profile</Text>

      {/* Avatar Picker 
      <View style={styles.avatarContainer}>
        {state.imageUri ? (
          <Image 
            source={{ uri: state.imageUri }} 
            style={styles.avatar}
          />
        ) : (
          <Text style={styles.avatarPlaceholder}>No Avatar Selected</Text>
        )}
        <TouchableOpacity 
          style={styles.editIcon} 
          onPress={handleImagePick}
        >
          <MaterialIcons name="edit" size={30} color="white" />
        </TouchableOpacity>
      </View> */}

      {/* Profile Fields */}
      <TextInput
        style={[styles.input, state.error && styles.inputError, { backgroundColor: isDarkMode ? '#333' : '#fff', color: isDarkMode ? '#fff' : '#000' }]}
        placeholder="Display Name"
        placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
        value={state.displayName}
        onChangeText={(text) => setState(prevState => ({
          ...prevState,
          displayName: text
        }))}
      />
      <TextInput
        style={[styles.input, state.error && styles.inputError, { backgroundColor: isDarkMode ? '#333' : '#fff', color: isDarkMode ? '#fff' : '#000' }]}
        placeholder="Role"
        placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
        value={state.role}
        onChangeText={(text) => setState(prevState => ({
          ...prevState,
          role: text
        }))}
      />
      <TextInput
        style={[styles.input, state.error && styles.inputError, { backgroundColor: isDarkMode ? '#333' : '#fff', color: isDarkMode ? '#fff' : '#000' }]}
        placeholder="Hobbies"
        placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
        value={state.hobbies}
        onChangeText={(text) => setState(prevState => ({
          ...prevState,
          hobbies: text
        }))}
      />
      <TextInput
        style={[styles.input, state.error && styles.inputError, { backgroundColor: isDarkMode ? '#333' : '#fff', color: isDarkMode ? '#fff' : '#000' }]}
        placeholder="Experience"
        placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
        value={state.exp.toString()}
        onChangeText={(text) => setState(prevState => ({
          ...prevState,
          exp: Number(text)
        }))}
        keyboardType="numeric"
      />

      {/* Save Button */}
      <Button 
        title={state.loading ? 'Saving...' : 'Save'}
        onPress={handleSaveProfile}
        disabled={state.loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  avatarPlaceholder: {
    fontSize: 16,
    color: '#888',
    marginBottom: 15,
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    padding: 5,
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingLeft: 15,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#ff4444'
  },
  error: {
    color: '#ff4444',
    marginBottom: 15,
    textAlign: 'center'
  }
});

export default EditProfile;