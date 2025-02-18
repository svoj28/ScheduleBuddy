import React, { useState, useEffect, useContext } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native"; // Import navigation hook
import { getArchivedTasks, getCurrentUser } from "../../../lib/backend/appwrite"; // Import functions
import { Ionicons } from "@expo/vector-icons"; // Import icons
import { ThemeContext } from "../../ThemeContext"; // Import ThemeContext

const Archive = () => {
  const navigation = useNavigation(); // Initialize navigation
  const { isDarkMode } = useContext(ThemeContext); // Use ThemeContext
  const [archivedTasks, setArchivedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchArchivedTasks = async () => {
      try {
        const user = await getCurrentUser();
        if (!user) throw new Error("No authenticated user found");

        setUserId(user.$id);
        const tasks = await getArchivedTasks(user.$id);

        if (tasks.length === 0) {
          setErrorMessage("NO Archived Tasks Yet"); // Show this when no tasks exist
        } else {
          setArchivedTasks(tasks);
        }
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArchivedTasks();
  }, []);

  return (
    <View className={`flex-1 ${isDarkMode ? "bg-gray-900" : "bg-white"} px-4`}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => navigation.goBack()} className="absolute left-4 top-5">
        <Ionicons name="arrow-back" size={28} color={isDarkMode ? "white" : "black"} />
      </TouchableOpacity>

      {/* Title */}
      <Text className={`text-center text-xl font-bold mb-3 mt-10 ${isDarkMode ? "text-white" : "text-black"}`}>Archived Tasks</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : errorMessage ? (
        <Text className={`text-center ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>{errorMessage}</Text> // Displays "NO Archived Tasks Yet"
      ) : (
        <FlatList
          data={archivedTasks}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }) => (
            <View className={`flex-row items-center shadow-md rounded-lg mb-3 p-2 border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-400"}`}>
              {/* Experience Box */}
              <View className={`w-20 h-12 rounded-md flex items-center justify-center ${isDarkMode ? "bg-gray-700 border-gray-600" : "bg-white border-black"}`}>
                <Text className={`font-bold text-xs ${isDarkMode ? "text-white" : "text-black"}`}>10 exp</Text>
              </View>

              {/* Task Content Box */}
              <View className={`flex-1 ml-2 p-3 rounded-lg ${isDarkMode ? "border-gray-600" : "border-black"}`}>
                <Text className={`font-bold text-lg ${isDarkMode ? "text-white" : "text-black"}`}>{item.taskname}</Text>
                <Text className={`text-gray-600 ${isDarkMode ? "text-gray-400" : ""}`}>{item.description}</Text>
                <Text className={`text-gray-400 ${isDarkMode ? "text-gray-500" : ""}`}>Archived on: {new Date(item.taskdate).toLocaleDateString()}</Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default Archive;
