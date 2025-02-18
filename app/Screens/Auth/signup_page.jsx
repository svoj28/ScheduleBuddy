// signup_page.jsx

import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Keyboard, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { signUpUser } from '../../../lib/backend/auth/signup'; // Import the sign up function
import { createUser } from '@/lib/backend/appwrite';
import { ThemeContext } from '../../ThemeContext'; // Import ThemeContext

const SignupPage = () => {
  const router = useRouter();
  const { isDarkMode } = useContext(ThemeContext); // Use ThemeContext
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // State for each input field
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState(''); // Default role, you can modify based on your needs
  const [displayName, setDisplayName] = useState('');
  const [hobbies, setHobbies] = useState('');

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  // Handle the sign up process
  const handleSignUp = async () => {
    if (password !== confirmPassword) {
        Alert.alert('Error', 'Passwords do not match!');
        return;
    }

    if (!email || !password) {
        Alert.alert('Error', 'Please fill in all the fields');
        return;
    }

    try {
        // Pass the entire object containing all the required fields
        const result = await createUser({
            email,
            password,
            role, 
            displayName,
            hobbies
        });

        // Redirect to the login page after successful signup
        router.push('/Screens/Client/homepage');
        Alert.alert('Success', 'Sign up successful!');
    } catch (error) {
        Alert.alert('Error', 'Sign up failed. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className={`flex-1 justify-center items-center ${isDarkMode ? "bg-gray-900" : "bg-white"} px-6`}>
          {!keyboardVisible && (
            <Text className={`text-3xl font-extrabold mb-8 ${isDarkMode ? "text-white" : "text-black"}`}>Sign Up</Text>
          )}

          {/* Email Input */}
          <TextInput
            className={`w-full border-b-2 mb-4 p-2 ${isDarkMode ? "border-gray-600 text-white" : "border-black text-black"}`}
            placeholder="Email"
            placeholderTextColor={isDarkMode ? "#ccc" : "#666"}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          {/* Password Input */}
          <TextInput
            className={`w-full border-b-2 mb-4 p-2 ${isDarkMode ? "border-gray-600 text-white" : "border-black text-black"}`}
            placeholder="Password"
            placeholderTextColor={isDarkMode ? "#ccc" : "#666"}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {/* Confirm Password Input */}
          <TextInput
            className={`w-full border-b-2 mb-4 p-2 ${isDarkMode ? "border-gray-600 text-white" : "border-black text-black"}`}
            placeholder="Confirm Password"
            placeholderTextColor={isDarkMode ? "#ccc" : "#666"}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          {/* Role Input */}
          <TextInput
            className={`w-full border-b-2 mb-4 p-2 ${isDarkMode ? "border-gray-600 text-white" : "border-black text-black"}`}
            placeholder="Role (e.g., Admin, User)"
            placeholderTextColor={isDarkMode ? "#ccc" : "#666"}
            value={role}
            onChangeText={setRole}
          />

          {/* Display Name Input */}
          <TextInput
            className={`w-full border-b-2 mb-4 p-2 ${isDarkMode ? "border-gray-600 text-white" : "border-black text-black"}`}
            placeholder="Display Name"
            placeholderTextColor={isDarkMode ? "#ccc" : "#666"}
            value={displayName}
            onChangeText={setDisplayName}
          />

          {/* Hobbies Input */}
          <TextInput
            className={`w-full border-b-2 mb-4 p-2 ${isDarkMode ? "border-gray-600 text-white" : "border-black text-black"}`}
            placeholder="Hobbies"
            placeholderTextColor={isDarkMode ? "#ccc" : "#666"}
            value={hobbies}
            onChangeText={setHobbies}
          />

          {/* Sign Up Button */}
          <TouchableOpacity
            className="bg-black rounded-lg px-6 py-3 mt-6 w-full items-center"
            onPress={handleSignUp}
          >
            <Text className="text-white text-lg font-bold">Sign Up</Text>
          </TouchableOpacity>

          {!keyboardVisible && (
            <Text className={`text-gray-600 mt-6 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Already have an account?{' '}
              <TouchableOpacity onPress={() => router.push('/Screens/Auth/login_page')}>
                <Text className="text-blue-500">Login</Text>
              </TouchableOpacity>
            </Text>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignupPage;
