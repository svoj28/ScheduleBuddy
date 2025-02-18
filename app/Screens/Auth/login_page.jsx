import React, { useState, useEffect, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, Animated, ScrollView, KeyboardAvoidingView, Platform, Keyboard } from "react-native";
import { useRouter } from "expo-router";
import { CheckBox } from "react-native-elements";
import { Eye, EyeOff } from "lucide-react-native";
import { signIn } from "@/lib/backend/appwrite";
import { ThemeContext } from "../../ThemeContext"; // Import ThemeContext

const LoginPage = () => {
  const router = useRouter();
  const { isDarkMode } = useContext(ThemeContext); // Use ThemeContext
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [stayLoggedIn, setStayLoggedIn] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // Animated values for placeholders
  const [emailPlaceholderPosition] = useState(new Animated.Value(0));
  const [passwordPlaceholderPosition] = useState(new Animated.Value(0));

  const [emailPlaceholder, setEmailPlaceholder] = useState("Email Address");
  const [passwordPlaceholder, setPasswordPlaceholder] = useState("Password");

  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

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

  const handleFocusEmail = () => {
    setIsEmailFocused(true);
    setEmailPlaceholder("");
    Animated.timing(emailPlaceholderPosition, {
      toValue: -20,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const handleBlurEmail = () => {
    if (!isEmailFocused) return;
    setIsEmailFocused(false);
    setEmailPlaceholder("Email Address");
    Animated.timing(emailPlaceholderPosition, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const handleFocusPassword = () => {
    setIsPasswordFocused(true);
    setPasswordPlaceholder("");
    Animated.timing(passwordPlaceholderPosition, {
      toValue: -20,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const handleBlurPassword = () => {
    if (!isPasswordFocused) return;
    setIsPasswordFocused(false);
    setPasswordPlaceholder("Password");
    Animated.timing(passwordPlaceholderPosition, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    try {
      const session = await signIn(email, password);

      // Redirect to dashboard
      router.push("../Client/homepage");
    } catch (error) {
      console.error("Error during login:", error);
      Alert.alert("Login failed", error.message || "An error occurred during login.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className={`flex-1 ${isDarkMode ? "bg-gray-900" : "bg-white"} items-center justify-center px-6`}>
          {!keyboardVisible && (
            <>
              {/* App Title */}
              <Text className={`absolute top-5 left-5 text-3xl font-extrabold ${isDarkMode ? "text-white" : "text-black"}`}>SCHEDULE</Text>
              <Text className={`absolute top-14 left-20 text-3xl font-extrabold ${isDarkMode ? "text-white" : "text-black"}`}>BUDDY</Text>
              <Text className={`absolute top-24 left-24 text-lg ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Level UP Your Productivity</Text>

              <View className="w-[110%] h-[100px] border-l-2 border-r-2 border-b-2 border-black rounded-bl-[100%] rounded-br-[100%] -mb-[90px] -mt-[150px] overflow-hidden relative" />

              {/* Another Curve Border */}
              <View className="w-[110%] h-[100px] border-l-2 border-r-2 border-b-2 border-black rounded-bl-[100%] rounded-br-[100%] -mb-[10px] overflow-hidden relative" />
            </>
          )}

          {/* Email Input */}
          <View className="relative w-full mt-10">
            <Animated.Text
              style={{
                position: 'absolute',
                left: 10,
                transform: [{ translateY: emailPlaceholderPosition }],
                color: isDarkMode ? '#ccc' : '#666',
                fontSize: 16,
                fontWeight: 'normal',
                opacity: isEmailFocused ? 1 : 0,
              }}
            >
              Email Address
            </Animated.Text>

            <View style={{ position: 'relative', width: '100%' }}>
              {/* Outer Bottom Border */}
              <View
                style={{
                  width: '100%',
                  borderBottomWidth: 2,
                  borderBottomColor: isDarkMode ? '#ccc' : '#666',
                  position: 'absolute',
                  bottom: -10,
                  marginBottom: 10,
                }}
              />

              {/* Inner Bottom Border */}
              <View
                style={{
                  width: '100%',
                  borderBottomWidth: 2,
                  borderBottomColor: isDarkMode ? '#fff' : '#000',
                  position: 'absolute',
                  bottom: -5,
                }}
              />

              <TextInput
                className="w-full py-2 text-lg"
                placeholder={emailPlaceholder}
                placeholderTextColor={isDarkMode ? '#ccc' : '#666'}
                onFocus={handleFocusEmail}
                onBlur={handleBlurEmail}
                value={email}
                onChangeText={setEmail}
                style={{
                  paddingTop: isEmailFocused ? 15 : 0,
                  width: '100%',
                  textAlign: 'left',
                  backgroundColor: 'transparent',
                  paddingBottom: 5,
                  color: isDarkMode ? '#fff' : '#000',
                }}
              />
            </View>
          </View>

          {/* Password Input */}
          <View className="relative w-full mt-6">
            <Animated.Text
              style={{
                position: 'absolute',
                left: 10,
                transform: [{ translateY: passwordPlaceholderPosition }],
                color: isDarkMode ? '#ccc' : '#666',
                fontSize: 16,
                fontWeight: 'normal',
                opacity: isPasswordFocused ? 1 : 0,
              }}
            >
              Password
            </Animated.Text>

            <View style={{ position: 'relative', width: '100%' }}>
              {/* Outer Bottom Border */}
              <View
                style={{
                  width: '100%',
                  borderBottomWidth: 2,
                  borderBottomColor: isDarkMode ? '#ccc' : '#666',
                  position: 'absolute',
                  bottom: -10,
                }}
              />

              {/* Inner Bottom Border */}
              <View
                style={{
                  width: '100%',
                  borderBottomWidth: 2,
                  borderBottomColor: isDarkMode ? '#fff' : '#000',
                  position: 'absolute',
                  bottom: -5,
                }}
              />

              {/* Password TextInput & Visibility Toggle */}
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TextInput
                  className="flex-1 py-2 text-lg"
                  placeholder={passwordPlaceholder}
                  secureTextEntry={!passwordVisible}
                  placeholderTextColor={isDarkMode ? '#ccc' : '#666'}
                  onFocus={handleFocusPassword}
                  onBlur={handleBlurPassword}
                  value={password}
                  onChangeText={setPassword}
                  style={{
                    paddingTop: isPasswordFocused ? 15 : 0,
                    width: '90%',
                    textAlign: 'left',
                    backgroundColor: 'transparent',
                    paddingBottom: 5,
                    color: isDarkMode ? '#fff' : '#000',
                  }}
                />
                <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} className="absolute right-2">
                  {passwordVisible ? <EyeOff size={24} color={isDarkMode ? "white" : "black"} /> : <Eye size={24} color={isDarkMode ? "white" : "black"} />}
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Stay Logged In */}
          <View className="w-full flex-row items-center mt-6">
            <CheckBox
              checked={stayLoggedIn}
              onPress={() => setStayLoggedIn(!stayLoggedIn)}
              containerStyle={{ padding: 0, margin: 0 }}
            />
            <Text className={`text-md ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Stay Logged In</Text>
          </View>

          {/* Forgot Password */}
          <TouchableOpacity onPress={() => router.push("/forgot_password")}>
            <Text className="text-blue-500 mt-2 text-md underline">Forgot Password?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity onPress={handleLogin} className="bg-black rounded-lg px-6 py-3 mt-4 w-full items-center">
            <Text className="text-white text-lg font-bold">LOG IN</Text>
          </TouchableOpacity>

          {/* Sign Up & Guest Login */}
          <Text className={`mt-6 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Don't have an account yet?</Text>
          <TouchableOpacity onPress={() => router.push("Screens/Auth/signup_page")}>
            <Text className="text-blue-500 underline">Sign Up</Text>
          </TouchableOpacity>

          <Text className={`mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>or</Text>
          {!keyboardVisible && (
            <>
              {/* Footer */}
              <View className="w-[110%] h-[100px] border-l-2 border-r-2 border-b-2 border-black rounded-bl-[100%] rounded-br-[100%] -mb-[90px] mt-[50px] overflow-hidden relative scale-y-[-1]" />
              <View className="w-[110%] h-[100px] border-l-2 border-r-2 border-b-2 border-black rounded-bl-[100%] rounded-br-[100%] -mb-[150px] overflow-hidden relative scale-y-[-1]" />

              <Text className="absolute bottom-6 text-4xl font-bold">LOGIN PAGE</Text>
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginPage;
