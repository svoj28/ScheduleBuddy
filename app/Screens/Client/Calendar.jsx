import React, { useState, useEffect, useContext } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { Agenda } from "react-native-calendars";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import NavBar from "../SystemComponents/NavBar";
import { getTasks } from "../../../lib/backend/appwrite"; // ✅ Import getTasks
import { ThemeContext } from "../../ThemeContext"; // Import ThemeContext

const CalendarScreen = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const { isDarkMode } = useContext(ThemeContext); // Use ThemeContext
  const [items, setItems] = useState(null); // Start as null to show loading state
  const [loading, setLoading] = useState(true); // Loading state

  // Function to load and format tasks
  const fetchTasks = async () => {
    try {
      const tasks = await getTasks(); // ✅ Fetch from Appwrite
      console.log("Fetched tasks:", tasks); // ✅ Debugging log

      if (!tasks || tasks.length === 0) {
        console.warn("No tasks found!");
        setItems({});
        setLoading(false);
        return;
      }

      // Transform tasks into Agenda format
      const formattedTasks = tasks.reduce((acc, task) => {
        const date = new Date(task.taskdate).toISOString().split("T")[0]; // ✅ Ensure correct format
        if (!acc[date]) acc[date] = [];
        acc[date].push({
          name: task.taskname,
          time: task.tasktime || "No time specified", // ✅ Handle missing time
        });
        return acc;
      }, {});

      console.log("Formatted tasks:", formattedTasks);
      setItems({ ...formattedTasks }); // ✅ Force state update
    } catch (error) {
      console.error("Error fetching tasks:", error.message);
    } finally {
      setLoading(false); // Stop loading after fetching
    }
  };

  useEffect(() => {
    fetchTasks(); // ✅ Fetch on mount
  }, []);

  // Show loading indicator while fetching data
  if (loading) {
    return (
      <View className={`flex-1 justify-center items-center ${isDarkMode ? "bg-gray-900" : "bg-gray-100"}`}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className={`mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Loading tasks...</Text>
      </View>
    );
  }

  return (
    <View className={`flex-1 ${isDarkMode ? "bg-gray-900" : "bg-gray-100"}`}>
      {/* Header */}
      <View className={`flex-row items-center p-4 ${isDarkMode ? "bg-gray-800" : "bg-blue-500"}`}>
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold">Agenda Calendar</Text>
      </View>

      {/* Agenda Calendar */}
      <Agenda
        items={items || {}} // Ensure it's not null
        loadItemsForMonth={fetchTasks} // ✅ Load tasks dynamically
        selected={Object.keys(items || {})[0] || new Date().toISOString().split("T")[0]}
        renderItem={(item) => (
          <View className={`p-4 m-2 rounded-lg shadow-md ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
            <Text className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-black"}`}>{item.name}</Text>
            <Text className={`text-gray-500 ${isDarkMode ? "text-gray-400" : ""}`}>{item.time}</Text>
          </View>
        )}
        renderEmptyDate={() => (
          <View className="p-4 items-center">
            <Text className={`text-gray-400 ${isDarkMode ? "text-gray-500" : ""}`}>No tasks for this day</Text>
          </View>
        )}
      />
      <NavBar navigation={router} />
    </View>
  );
};

export default CalendarScreen;
