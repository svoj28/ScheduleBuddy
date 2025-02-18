import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/backend/appwrite"; // Import the function to get the current user
import "../global.css";
import { ThemeProvider } from "./ThemeContext"; // Import ThemeProvider

const RootLayout = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        // Handle the error gracefully without logging it
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, []);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("Screens/Client/homepage"); // Redirect to homepage if user is logged in
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return null; // Render nothing or a loading indicator while checking authentication
  }

  return (
    <ThemeProvider>
      <Stack initialRouteName="Screens/Auth/login_page">
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="Screens/Auth/login_page" options={{ headerShown: false }} />
        <Stack.Screen name="Screens/Auth/signup_page" options={{ headerShown: false }} />
        <Stack.Screen name="Screens/Client/homepage" options={{ headerShown: false }} />
        <Stack.Screen name="Screens/Client/AddTask" options={{ headerShown: false }} />
        <Stack.Screen name="Screens/Client/Calendar" options={{ headerShown: false }} />
        <Stack.Screen name="Screens/Client/Settings" options={{ headerShown: false }} />
        <Stack.Screen name="Screens/Client/Edittask" options={{ headerShown: false }} />
        <Stack.Screen name="Screens/Client/Archive" options={{ headerShown: false }} />
        <Stack.Screen name="Screens/Client/EditProfile" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
};

export default RootLayout;
