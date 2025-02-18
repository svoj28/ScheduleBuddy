import React, { useContext } from "react";
import { View, Text, TouchableOpacity, Switch, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "../../ThemeContext"; // Import ThemeContext

const Settings = () => {
  const router = useRouter();
  const { isDarkMode, toggleTheme } = useContext(ThemeContext); // Use ThemeContext

  const confirmDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => console.log("Account Deleted") },
      ]
    );
  };

  return (
    <View className={`flex-1 ${isDarkMode ? "bg-gray-900" : "bg-white"} p-5`}>
      <View className="flex-row items-center mb-6">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={24} color={isDarkMode ? "white" : "black"} />
        </TouchableOpacity>
        <Text className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-black"}`}>Settings</Text>
      </View>

      <TouchableOpacity onPress={() => router.push("Screens/Client/EditProfile")} className="flex-row items-center justify-between bg-blue-100 p-4 rounded-md mb-4">
        <Text className="text-lg font-semibold">Edit Profile</Text>
        <Ionicons name="person" size={24} color="black" />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("Screens/Client/Archive")} className="flex-row items-center justify-between bg-blue-100 p-4 rounded-md mb-4">
        <Text className="text-lg font-semibold">Archives</Text>
        <Ionicons name="archive" size={24} color="black" />
      </TouchableOpacity>

      <View className="flex-row items-center justify-between bg-blue-100 p-4 rounded-md mb-4">
        <Text className="text-lg font-semibold">Dark Mode</Text>
        <Switch value={isDarkMode} onValueChange={toggleTheme} />
      </View>

      <TouchableOpacity onPress={confirmDeleteAccount} className="bg-red-500 p-4 rounded-md items-center mt-6">
        <Text className="text-white text-lg font-bold">Delete Account</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Settings;
