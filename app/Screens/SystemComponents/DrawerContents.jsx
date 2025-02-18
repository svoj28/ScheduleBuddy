import React, { useEffect, useState, useContext, useRef } from "react";
import { View, Text, FlatList, TouchableOpacity, DrawerLayoutAndroid, ActivityIndicator, Button } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { logout, getUserData } from "@/lib/backend/appwrite"; // Ensure getUserData fetches user details
import ProgressBar from "react-native-progress/Bar"; // Import ProgressBar
import { ThemeContext } from "../../ThemeContext"; // Import ThemeContext

const DrawerMenu = React.forwardRef((props, ref) => {
  const router = useRouter();
  const { isDarkMode } = useContext(ThemeContext); // Use ThemeContext
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const drawer = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUserData(); // Fetch user data
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/Screens/Auth/login_page");
  };

  const menuItems = [
    { id: "3", title: "Settings", icon: "settings", onPress: () => router.push("Screens/Client/Settings") },
  ];

  // Function to calculate the progress of the experience bar
  const calculateExpProgress = (exp) => {
    const maxExp = 1000;
    const progress = exp / maxExp;
    return Math.min(progress, 1);
  };

  const navigationView = () => (
    <View className={`flex-1 ${isDarkMode ? "bg-gray-800" : "bg-gray-200"} pt-12 px-4`}>

      <Text className={`text-xl font-bold text-center mb-5 ${isDarkMode ? "text-white" : "text-black"}`}>Menu</Text>

      {/* User Profile Section */}
      <View className={`p-4 rounded-lg shadow-md mb-4 ${isDarkMode ? "bg-gray-700" : "bg-white"}`}>
        {loading ? (
          <ActivityIndicator size="large" color="blue" />
        ) : user ? (
          <>
            <Text className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>{user.displayName}</Text>
            <Text className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Role: {user.role}</Text>
            <Text className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Hobbies: {user.hobbies?.join(", ") || "Not specified"}</Text>
            <Text className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>EXP: {user.exp}</Text>

            {/* Experience Progress Bar */}
            <View className="mt-2">
              <ProgressBar
                progress={calculateExpProgress(user.exp)}
                width={null}
                height={10}
                borderRadius={5}
                color="blue"
              />
            </View>
          </>
        ) : (
          <Text className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Failed to load user data</Text>
        )}
      </View>

      {/* Menu Items */}
      <View style={{ flexGrow: 1 }}>
        <FlatList
          data={menuItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              className={`flex-row items-center p-4 border-b ${isDarkMode ? "border-gray-600" : "border-gray-300"}`}
              onPress={item.onPress}
            >
              <Ionicons name={item.icon} size={24} color={isDarkMode ? "white" : "black"} className="mr-3" />
              <Text className={`text-lg ${isDarkMode ? "text-white" : "text-black"}`}>{item.title}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Logout Button at the Bottom */}
      <View className="p-4 mt-auto">
        <TouchableOpacity
          className={`flex-row items-center p-4 border-t ${isDarkMode ? "border-gray-600" : "border-gray-300"}`}
          onPress={handleLogout}
        >
          <Ionicons name="log-out" size={24} color={isDarkMode ? "white" : "black"} className="mr-3" />
          <Text className={`text-lg ${isDarkMode ? "text-white" : "text-black"}`}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <DrawerLayoutAndroid ref={ref} drawerWidth={300} drawerPosition="left" renderNavigationView={navigationView}>
      {props.children}
    </DrawerLayoutAndroid>
  );
});

export default DrawerMenu;
