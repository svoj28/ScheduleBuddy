import React, { useContext } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ThemeContext } from "../../ThemeContext"; // Import ThemeContext

const NavBar = () => {
  const router = useRouter();
  const { isDarkMode } = useContext(ThemeContext); // Use ThemeContext

  return (
    <View className={`absolute bottom-0 left-0 right-0 ${isDarkMode ? "bg-gray-800" : "bg-white"} shadow-lg flex-row justify-between items-center p-4 m-5 rounded-2xl`}>
      {/* Home Button */}
      <TouchableOpacity onPress={() => router.push("Screens/Client/homepage")} className="flex items-center ml-10">
        <Ionicons name="home" size={24} color={isDarkMode ? "white" : "black"} />
        <Text className={`text-xs mt-1 ${isDarkMode ? "text-white" : "text-black"}`}>Home</Text>
      </TouchableOpacity>

      {/* Add Task Button (Floating in the Middle) */}
      <TouchableOpacity
        onPress={() => router.push("Screens/Client/AddTask")}
        className="bg-blue-500 rounded-full p-4 absolute -top-6 left-1/2 -translate-x-1/2 shadow-md"
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>

      {/* Calendar Button */}
      <TouchableOpacity onPress={() => router.push("Screens/Client/Calendar")} className="flex items-center mr-10">
        <Ionicons name="calendar" size={24} color={isDarkMode ? "white" : "black"} />
        <Text className={`text-xs mt-1 ${isDarkMode ? "text-white" : "text-black"}`}>Calendar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NavBar;
