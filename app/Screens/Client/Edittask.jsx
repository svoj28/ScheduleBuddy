import React, { useState, useEffect, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useNavigation, useRoute } from "@react-navigation/native";
import { updateTask, getTaskById } from "../../../lib/backend/appwrite"; // Database functions
import { ThemeContext } from "../../ThemeContext"; // Import ThemeContext

const EditTask = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { taskId } = route.params; // Get task ID from route params
  const { isDarkMode } = useContext(ThemeContext); // Use ThemeContext

  const [taskname, setTaskname] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [taskdate, setTaskdate] = useState(null);
  const [tasktime, setTasktime] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [repetition, setRepetition] = useState([]);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const task = await getTaskById(taskId);
        setTaskname(task.taskname || "");
        setDifficulty(task.difficulty || "Easy");
        setTaskdate(task.taskdate ? new Date(task.taskdate) : new Date());
        setTasktime(task.tasktime ? new Date(task.tasktime) : new Date());
        setRepetition(task.repetition || []);
        setDescription(task.description || "");
        setCategory(task.category || "");
      } catch (error) {
        alert("Error fetching task: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    if (taskId) {
      fetchTask();
    }
  }, [taskId]);

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

  const handleSaveChanges = async () => {
    try {
      await updateTask(taskId, {
        taskname,
        difficulty,
        taskdate: taskdate.toISOString(),
        tasktime: tasktime.toISOString(),
        repetition,
        description,
        category,
      });

      alert("Task Updated Successfully!");
      navigation.goBack();
    } catch (error) {
      alert("Error updating task: " + error.message);
    }
  };

  const toggleDaySelection = (day) => {
    setRepetition((prev) =>
      prev.includes(day) ? prev.filter((item) => item !== day) : [...prev, day]
    );
  };

  return (
    <ScrollView className={`flex-1 ${isDarkMode ? "bg-gray-900" : "bg-gray-100"} p-5`}>
      <Text className={`text-2xl font-bold text-center mb-5 ${isDarkMode ? "text-white" : "text-black"}`}>Edit Task</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
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
            <Text className={isDarkMode ? "text-white" : "text-black"}>{taskdate?.toDateString()}</Text>
          </TouchableOpacity>
          <DateTimePickerModal isVisible={isDatePickerVisible} mode="date" onConfirm={handleConfirmDate} onCancel={hideDatePicker} />

          {/* Task Time Picker */}
          <Text className={`text-lg mb-1 ${isDarkMode ? "text-white" : "text-black"}`}>Task Time</Text>
          <TouchableOpacity onPress={showTimePicker} className={`bg-white p-3 rounded-md mb-3 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
            <Text className={isDarkMode ? "text-white" : "text-black"}>{tasktime?.toLocaleTimeString()}</Text>
          </TouchableOpacity>
          <DateTimePickerModal isVisible={isTimePickerVisible} mode="time" onConfirm={handleConfirmTime} onCancel={hideTimePicker} />

          {/* Repetition */}
          <Text className={`text-lg mb-1 ${isDarkMode ? "text-white" : "text-black"}`}>Repetition</Text>
          <View className="flex-row flex-wrap mb-3">
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day, index) => (
              <TouchableOpacity key={index} onPress={() => toggleDaySelection(day)} className={`p-2 m-1 rounded-md ${repetition.includes(day) ? "bg-blue-500" : isDarkMode ? "bg-gray-800" : "bg-white"}`}>
                <Text className={repetition.includes(day) ? "text-white" : isDarkMode ? "text-white" : "text-black"}>{day}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Description */}
          <Text className={`text-lg mb-1 ${isDarkMode ? "text-white" : "text-black"}`}>Description</Text>
          <TextInput className={`bg-white p-3 rounded-md mb-3 ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`} placeholder="Enter task description" placeholderTextColor={isDarkMode ? "gray" : "darkgray"} value={description} onChangeText={setDescription} multiline />

          {/* Category */}
          <Text className={`text-lg mb-1 ${isDarkMode ? "text-white" : "text-black"}`}>Category</Text>
          <TextInput className={`bg-white p-3 rounded-md mb-5 ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`} placeholder="Enter category" placeholderTextColor={isDarkMode ? "gray" : "darkgray"} value={category} onChangeText={setCategory} />

          {/* Save Changes Button */}
          <TouchableOpacity onPress={handleSaveChanges} className="bg-blue-500 p-4 rounded-md items-center">
            <Text className="text-white text-lg font-bold">Save Changes</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
};

export default EditTask;
