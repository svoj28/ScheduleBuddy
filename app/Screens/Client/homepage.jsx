import React, { useRef, useEffect, useState, useContext } from "react";
import { DrawerLayoutAndroid, Text, View, TouchableOpacity, FlatList, Modal, Pressable, Alert, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { logout } from "@/lib/backend/appwrite";
import { Ionicons } from "@expo/vector-icons";
import NavBar from "../SystemComponents/NavBar"; // Import NavBar Component
import { getTasks, getCurrentUser, deleteTask, updateTask, archiveTask, getTaskById, getTasksForWeek } from "../../../lib/backend/appwrite"; // Import necessary functions
import { useNavigation, useRoute } from "@react-navigation/native";
import DrawerMenu from "../SystemComponents/DrawerContents"
import { ThemeContext } from "../../ThemeContext"; // Import ThemeContext

const Homepage = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const drawer = useRef(null);
  const [weekAgenda, setWeekAgenda] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true); // Track loading state
  const [errorMessage, setErrorMessage] = useState(""); // Track error messages
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [menuVisible, setMenuVisible] = useState(null); // Track which menu is open
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const buttonRefs = useRef({});
    const [selectedDay, setSelectedDay] = useState(null);
  const [weekmodalVisible, setweekModalVisible] = useState(false);
  const { isDarkMode } = useContext(ThemeContext); // Use ThemeContext
  
  const openDayTasks = (day) => {
    setSelectedDay(day);
    setweekModalVisible(true);
  };

  useEffect(() => {
    const fetchWeeklyTasks = async () => {
      try {
        const tasks = await getTasksForWeek();
        setWeekAgenda(tasks);
      } catch (error) {
        setErrorMessage("Failed to load weekly tasks.");
      } finally {
        setLoading(false);
      }
    };

    fetchWeeklyTasks();
  }, []);

  const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  


  useEffect(() => {
    filterTasksByRepetition();
  }, [tasks]);

  const filterTasksByRepetition = () => {
    const today = new Date().toDateString();
    const todayDay = new Date().toLocaleDateString("en-US", { weekday: "long" });
  
    const filtered = tasks.filter((task) => {
      const taskDate = new Date(task.taskdate).toDateString();
  
      // If task has "Only Once" in repetition array → Show only today, then move to archive after completion
      if (Array.isArray(task.repetition) && task.repetition.includes("Only Once")) {
        return taskDate === today && task.status !== "Completed"; // Show only if not completed
      }
  
      // If task has other repetitions → Show only on the specified days
      if (Array.isArray(task.repetition) && task.repetition.length > 0) {
        return task.repetition.includes(todayDay);
      }
  
      // Default: Show task only on its scheduled date
      return taskDate === today;
    });
  
    setFilteredTasks(filtered);
  };
  
  const openMenu = (task, taskId) => {
    setSelectedTask(task);

    // Ensure the ref exists before measuring
    setTimeout(() => {
      if (buttonRefs.current[taskId]) {
        buttonRefs.current[taskId].measure((fx, fy, width, height, px, py) => {
          setDropdownPosition({ top: py + height, left: px - 100 });
          setMenuVisible(true);
        });
      }
    }, 50); // Small delay to ensure layout is updated
  };

  const toggleMenu = (taskId) => {
    setMenuVisible(menuVisible === taskId ? null : taskId); // Toggle visibility
  };
  
  const openModal = (task) => {
    setSelectedTask(task);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedTask(null);
  };

  useEffect(() => {
    const fetchUserTasks = async () => {
      try {
        const fetchedTasks = await getTasks(); // Fetch tasks for the current user
        setTasks(fetchedTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error.message);
        setErrorMessage("Could not fetch tasks. Please try again later.");
      } finally {
        setLoading(false); // Stop loading after fetching
      }
    };
  
    fetchUserTasks();
  }, []);

  // Fetch tasks for the current user
  const fetchUserTasks = async () => {
    try {
      const user = await getCurrentUser();
      if (!user) throw new Error("No authenticated user found");
      const fetchedTasks = await getTasks(user.$id); // Pass userId to fetch tasks
      setTasks(fetchedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error.message);
      setErrorMessage("Please log in to see your tasks.");
    }
  };

  const handleOpenDrawer = () => {
    if (drawer.current) {
      drawer.current.openDrawer();
    } else {
      console.log("Drawer is not available");
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/Screens/Auth/login_page");
  };

  const menuItems = [
    { id: "3", title: "Settings", icon: "settings", onPress: () => router.push("Screens/Client/Settings") }, // Navigate to Settings
    { id: "4", title: "Logout", icon: "log-out", onPress: handleLogout }, // Logout item
  ];

  const generateWeekAgenda = () => {
    const today = new Date();
    const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1)); // Start from Monday
    let weekDays = [];

    for (let i = 0; i < 7; i++) {
      let date = new Date(firstDayOfWeek);
      date.setDate(date.getDate() + i);
      weekDays.push({
        id: i.toString(),
        date: date.toDateString(),
        tasks: i % 2 === 0 ? ["Task 1", "Task 2"] : [], // Add tasks on alternate days
      });
    }

    setWeekAgenda(weekDays);
  };

  const handleDeleteTask = async (taskId) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this task?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const task = await getTaskById(taskId); // Fetch task details before deletion
              if (!task) {
                alert("Task not found.");
                return;
              }
  
              await archiveTask(task); // Move task to archive before deleting
              await deleteTask(taskId); // Delete from active tasks collection
  
              setTasks(prevTasks => prevTasks.filter(task => task.$id !== taskId)); // Remove from UI
              alert("Task archived and deleted successfully.");
            } catch (error) {
              console.error("Error deleting task:", error.message);
              alert("Failed to delete task.");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const getNextRepetitionDate = (repetition) => {
    const today = new Date();
    const todayIndex = today.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6
  
    const dayMap = {
      Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3,
      Thursday: 4, Friday: 5, Saturday: 6
    };
  
    // Convert repetition days to numeric indices and sort
    const repeatDays = repetition.map(day => dayMap[day]).sort();
  
    if (repeatDays.length === 0) {
      console.error("No valid repetition days found.");
      return null;
    }
  
    // Find the next available day
    for (let i = 0; i < repeatDays.length; i++) {
      if (repeatDays[i] > todayIndex) {
        const daysUntilNext = repeatDays[i] - todayIndex;
        return new Date(today.setDate(today.getDate() + daysUntilNext));
      }
    }
  
    // If no future day, return the first occurrence next week
    const daysUntilNextWeek = 7 - todayIndex + repeatDays[0];
    return new Date(today.setDate(today.getDate() + daysUntilNextWeek));
  };
  
  
  const handleUpdateTask = async (taskId, updatedData) => {
    Alert.alert(
      "Confirm Update",
      "Are you sure you want to mark this task as done?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Update",
          style: "default",
          onPress: async () => {
            try {
              const task = await getTaskById(taskId);
              if (!task) {
                alert("Task not found.");
                return;
              }
  
              const isOnlyOnce = Array.isArray(task.repetition) && task.repetition.includes("Only Once");
  
              if (isOnlyOnce) {
                console.log(`Archiving task: ${task.taskname}`);
  
                // Move to archive first
                await archiveTask(task);
  
                // Delete from active tasks collection
                await deleteTask(taskId);
  
                // Remove from UI immediately
                setTasks(prevTasks => prevTasks.filter(t => t.$id !== taskId));
  
                alert("Task archived and removed from active tasks.");
              } else if (Array.isArray(task.repetition) && task.repetition.length > 0) {
                console.log(`Moving task: ${task.taskname} to next scheduled date`);
  
                // Get the next valid date
                const nextDate = getNextRepetitionDate(task.repetition);
  
                if (!nextDate || isNaN(nextDate.getTime())) {
                  throw new Error("Invalid next repetition date.");
                }
  
                // Update task to next repeat date
                await updateTask(taskId, { taskdate: nextDate.toISOString(), status: "Pending" });
  
                // Remove from UI immediately (so it does not appear today)
                setTasks(prevTasks =>
                  prevTasks.filter(t => t.$id !== taskId)
                );
  
                alert(`Task moved to next occurrence on ${nextDate.toDateString()}`);
              } else {
                console.log(`Updating task: ${task.taskname}`);
  
                // Normal update for tasks without repetition
                await updateTask(taskId, updatedData);
  
                // Remove from UI immediately if completed
                if (updatedData.status === "Completed") {
                  setTasks(prevTasks =>
                    prevTasks.filter(t => t.$id !== taskId)
                  );
                }
  
                alert("Task updated successfully.");
              }
            } catch (error) {
              console.error("Error updating task:", error.message);
              alert("Failed to update task: " + error.message);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const processedWeekAgenda = Object.keys(weekAgenda).reduce((acc, day) => {
    acc[day] = weekAgenda[day] || [];
  
    // Move "Only Once" tasks to "For Today Only"
    if (day !== "For Today Only") {
      acc[day] = acc[day].filter(task => task.repetition !== "Only Once"); 
    }
  
    acc["For Today Only"] = [
      ...(acc["For Today Only"] || []),
      ...(weekAgenda[day]?.filter(task => task.repetition === "Only Once") || [])
    ];
  
    return acc;
  }, {});

  return (
    <DrawerMenu ref={drawer}>
      <View className={`flex-1 ${isDarkMode ? "bg-gray-900" : "bg-white"} p-5`}>
        {/* Hamburger Button */}
        <TouchableOpacity className="absolute top-10 left-5 p-2 z-10" onPress={handleOpenDrawer}>
          <Ionicons name="menu" size={30} color={isDarkMode ? "white" : "black"} />
        </TouchableOpacity>
  
        {/* App Title */}
        <Text className={`text-center text-xl font-bold mt-16 ${isDarkMode ? "text-white" : "text-black"}`}>SCHEDULEBUDDY</Text>
  
        {/* Week Agenda - Moved to the Top */}
        <View className="mt-6 px-4">
          <Text className={`text-center text-xl font-bold mb-3 ${isDarkMode ? "text-white" : "text-black"}`}>This Week's Agenda</Text>
          <FlatList
            horizontal
            data={weekdays}
            keyExtractor={(day) => day}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => openDayTasks(item)}>
                <View className="bg-blue-200 p-3 m-2 rounded-md w-40">
                  <Text className="text-md font-bold text-center">{item}</Text>
                  <Text className="text-sm text-gray-700 text-center mt-2">
                    {processedWeekAgenda[item] && processedWeekAgenda[item].length > 0
                      ? `${processedWeekAgenda[item].length} tasks`
                      : "No tasks"}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
  
        {/* Today's tasks */}
        <Text className={`text-center text-xl font-bold mb-3 ${isDarkMode ? "text-white" : "text-black"}`}>Your Tasks</Text>
        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }) => (
            <Pressable onPress={() => setMenuVisible(null)}>
              <View className={`flex-row items-center shadow-md rounded-lg mb-3 p-2 border relative ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-black"}`}>
                {/* Experience Box */}
                <View className={`w-20 h-12 rounded-md flex items-center justify-center ${isDarkMode ? "bg-gray-700 border-gray-600" : "bg-white border-black"}`}>
                  <Text className={`font-bold text-xs ${isDarkMode ? "text-white" : "text-black"}`}>10 exp</Text>
                </View>
  
                {/* Task Content Box - Clickable */}
                <TouchableOpacity onPress={() => openModal(item)} className={`flex-1 ml-2 p-3 rounded-lg ${isDarkMode ? "border-gray-600" : "border-black"}`}>
                  <Text className={`font-bold text-lg ${isDarkMode ? "text-white" : "text-black"}`}>{item.taskname}</Text>
                  <Text className={`text-gray-600 ${isDarkMode ? "text-gray-400" : ""}`}>{item.description}</Text>
                </TouchableOpacity>
  
                {/* Options Menu Button */}
                <TouchableOpacity
                  ref={(el) => (buttonRefs.current[item.$id] = el)}
                  onPress={(e) => {
                    e.stopPropagation();
                    openMenu(item, item.$id);
                  }}
                >
                  <Text className={`text-xl font-bold px-3 ${isDarkMode ? "text-white" : "text-black"}`}>...</Text>
                </TouchableOpacity>
  
                {/* Dropdown Menu for Actions */}
                <Modal transparent visible={menuVisible} animationType="fade">
                  <Pressable
                    onPress={() => setMenuVisible(false)}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: "transparent",
                    }}
                  >
                    <View
                      style={{
                        position: "absolute",
                        top: dropdownPosition.top,
                        left: dropdownPosition.left,
                        backgroundColor: isDarkMode ? "gray-800" : "white",
                        borderWidth: 1,
                        borderColor: "#ccc",
                        borderRadius: 8,
                        padding: 10,
                        shadowColor: "#000",
                        shadowOpacity: 0.2,
                        shadowOffset: { width: 0, height: 2 },
                        shadowRadius: 4,
                        elevation: 10,
                        zIndex: 10001,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          console.log(`Marked ${selectedTask.taskname} as Done`);
                          setMenuVisible(false);
                        }}
                        style={{ paddingVertical: 8 }}
                      >
                        <Text style={{ color: "green", fontSize: 16 }}>Mark as Done</Text>
                      </TouchableOpacity>
  
                      <TouchableOpacity
                        onPress={() => {
                          console.log(`Deleted ${selectedTask.taskname}`);
                          setMenuVisible(false);
                        }}
                        style={{ paddingVertical: 8 }}
                      >
                        <Text style={{ color: "red", fontSize: 16 }}>Delete</Text>
                      </TouchableOpacity>
  
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate("Screens/Client/Edittask", { taskId: selectedTask.$id });
                          setMenuVisible(false);
                        }}
                        style={{ paddingVertical: 8 }}
                      >
                        <Text style={{ color: "blue", fontSize: 16 }}>Edit</Text>
                      </TouchableOpacity>
                    </View>
                  </Pressable>
                </Modal>
              </View>
            </Pressable>
          )}
          ListEmptyComponent={() => (
            <Text className={`text-center ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>No tasks for today</Text>
          )}
          ListHeaderComponent={() => (
            !filteredTasks.length && (
              <Text className={`text-center ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Loading tasks...</Text>
            )
          )}
        />
  
        {/* Task Details Modal */}
        <Modal visible={modalVisible} animationType="slide" transparent>
          <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
            <View className={`p-6 rounded-2xl shadow-lg w-4/5 border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"}`}>
              {selectedTask && (
                <>
                  {/* Task Title */}
                  <Text className={`text-2xl font-bold text-center mb-3 ${isDarkMode ? "text-white" : "text-gray-800"}`}>{selectedTask.taskname}</Text>
  
                  {/* Task Description */}
                  <Text className={`text-base mb-4 text-center ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{selectedTask.description}</Text>
  
                  {/* Task Date & Status */}
                  <View className="flex-row justify-between items-center mb-4">
                    <Text className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                      📅 Due: {new Date(selectedTask.taskdate).toLocaleDateString()}
                    </Text>
  
                    {/* Status Badge */}
                    <View
                      className={`px-3 py-1 rounded-full ${
                        selectedTask.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      <Text className="text-sm font-semibold">
                        {selectedTask.status}
                      </Text>
                    </View>
                  </View>
  
                  {/* Action Buttons */}
                  <View className="flex-row justify-center space-x-4">
                    <TouchableOpacity
                      onPress={() => setModalVisible(false)}
                      className="bg-red-500 px-4 py-2 rounded-lg shadow-md"
                    >
                      <Text className="text-white font-semibold">Close</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </View>
        </Modal>
        <NavBar navigation={router} />
      </View>
    </DrawerMenu>
  );
};  

export default Homepage;
