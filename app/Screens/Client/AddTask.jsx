import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePickerModal from "react-native-modal-datetime-picker"; // ✅ Using modal picker
import NavBar from "../SystemComponents/NavBar"; // Import NavBar Component
import { useRouter } from "expo-router";
import { createTask, getCurrentUser } from "../../../lib/backend/appwrite";
import { useNavigation } from "@react-navigation/native";
import { ThemeContext } from "../../ThemeContext"; // Import ThemeContext

const AddTask = ({  }) => {
  const navigation = useNavigation();
  const router = useRouter();
  const { isDarkMode } = useContext(ThemeContext); // Use ThemeContext
  const [taskname, setTaskname] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [taskdate, setTaskdate] = useState(new Date());
  const [tasktime, setTasktime] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [repetition, setRepetition] = useState([]); // For multiple days
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  // Show & Hide Pickers
  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);
  const showTimePicker = () => setTimePickerVisibility(true);
  const hideTimePicker = () => setTimePickerVisibility(false);

  // Handle Date Selection
  const handleConfirmDate = (date) => {
    setTaskdate(date);
    hideDatePicker();
  };

  // Handle Time Selection
  const handleConfirmTime = (time) => {
    setTasktime(time);
    hideTimePicker();
  };

  const handleSubmit = async () => {
    try {
      const user = await getCurrentUser();
      if (!user) throw new Error("No authenticated user found");

      // Send the task data with all fields, including computed 'exp' and 'status'
      await createTask({
        taskname,
        difficulty,
        taskdate: taskdate.toISOString(), // Ensure dates are properly formatted
        tasktime: tasktime.toISOString(),
        repetition,
        description,
        category,
        userId: user.$id, // Current user ID
      });

      alert("Task Saved!");
      navigation.goBack();
    } catch (error) {
      alert("Error saving task: " + error.message);
    }
  };

  const toggleDaySelection = (day) => {
    setRepetition(prev => {
      if (prev.includes(day)) {
        return prev.filter(item => item !== day); // Remove day
      } else {
        return [...prev, day]; // Add day
      }
    });
  };

  const handleDailySelection = () => {
    setRepetition(
      repetition.length === 7 ? [] : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    ); // Sets all days for "Daily"
  };

  return (
    <ScrollView className={`flex-1 ${isDarkMode ? "bg-gray-900" : "bg-gray-100"} p-5`}>
      <Text className={`text-2xl font-bold text-center mb-5 ${isDarkMode ? "text-white" : "text-black"}`}>Add Task</Text>

      {/* Task Name */}
      <Text className={`text-lg mb-1 ${isDarkMode ? "text-white" : "text-black"}`}>Task Name</Text>
      <TextInput
        className={`bg-white p-3 rounded-md mb-3 ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}
        placeholder="Enter task name"
        placeholderTextColor={isDarkMode ? "gray" : "darkgray"}
        value={taskname}
        onChangeText={setTaskname}
      />

      {/* Difficulty Picker */}
      <Text className={`text-lg mb-1 ${isDarkMode ? "text-white" : "text-black"}`}>Difficulty</Text>
      <View className={`bg-white p-3 rounded-md mb-3 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
        <Picker selectedValue={difficulty} onValueChange={setDifficulty}>
          <Picker.Item label="Easy" value="Easy" />
          <Picker.Item label="Medium" value="Medium" />
          <Picker.Item label="Hard" value="Hard" />
        </Picker>
      </View>

      {/* Task Date Picker */}
      <Text className={`text-lg mb-1 ${isDarkMode ? "text-white" : "text-black"}`}>Task Date</Text>
      <TouchableOpacity onPress={showDatePicker} className={`bg-white p-3 rounded-md mb-3 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
        <Text className={isDarkMode ? "text-white" : "text-black"}>{taskdate.toDateString()}</Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirmDate}
        onCancel={hideDatePicker}
      />

      {/* Task Time Picker */}
      <Text className={`text-lg mb-1 ${isDarkMode ? "text-white" : "text-black"}`}>Task Time</Text>
      <TouchableOpacity onPress={showTimePicker} className={`bg-white p-3 rounded-md mb-3 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
        <Text className={isDarkMode ? "text-white" : "text-black"}>{tasktime.toLocaleTimeString()}</Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={handleConfirmTime}
        onCancel={hideTimePicker}
      />

      {/* Repetition (Multiple Days, Daily, or Once Option) */}
      <Text className={`text-lg mb-1 ${isDarkMode ? "text-white" : "text-black"}`}>Repetition</Text>
      <View className="flex-row flex-wrap mb-3">
        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => toggleDaySelection(day)}
            className={`p-2 m-1 rounded-md ${repetition.includes(day) ? 'bg-blue-500' : isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
          >
            <Text className={repetition.includes(day) ? 'text-white' : isDarkMode ? 'text-white' : 'text-black'}>{day}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Or choose 'Daily' */}
      <TouchableOpacity
        onPress={handleDailySelection}
        className={`bg-white p-3 rounded-md mb-3 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}
      >
        <Text className={isDarkMode ? "text-white" : "text-black"}>{repetition.length === 7 ? 'Clear All Days' : 'Set Daily'}</Text>
      </TouchableOpacity>

      {/* Description */}
      <Text className={`text-lg mb-1 ${isDarkMode ? "text-white" : "text-black"}`}>Description</Text>
      <TextInput
        className={`bg-white p-3 rounded-md mb-3 ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}
        placeholder="Enter task description"
        placeholderTextColor={isDarkMode ? "gray" : "darkgray"}
        value={description}
        onChangeText={setDescription}
        multiline
      />

      {/* Category */}
      <Text className={`text-lg mb-1 ${isDarkMode ? "text-white" : "text-black"}`}>Category</Text>
      <TextInput
        className={`bg-white p-3 rounded-md mb-5 ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}
        placeholder="Enter category"
        placeholderTextColor={isDarkMode ? "gray" : "darkgray"}
        value={category}
        onChangeText={setCategory}
      />

      {/* Save Button */}
      <TouchableOpacity onPress={handleSubmit} className="bg-blue-500 p-4 rounded-md items-center">
        <Text className="text-white text-lg font-bold">Save Task</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AddTask;