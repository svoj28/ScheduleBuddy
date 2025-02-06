import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Animated } from "react-native";
import { useRouter } from "expo-router";
import { CheckBox } from "react-native-elements";
import { Eye, EyeOff } from "lucide-react-native";

const LoginPage = () => {
  const router = useRouter();
  const [stayLoggedIn, setStayLoggedIn] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  // Animated values for placeholders
  const [emailPlaceholderPosition] = useState(new Animated.Value(0));
  const [passwordPlaceholderPosition] = useState(new Animated.Value(0));

  const [emailPlaceholder, setEmailPlaceholder] = useState("Email Address");
  const [passwordPlaceholder, setPasswordPlaceholder] = useState("Password");

  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

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

  return (
    <View className="flex-1 bg-white items-center justify-center px-6">
      {/* App Title */}
      <Text style={{
        position: 'absolute', 
        top: 20, 
        left: 20, 
        fontSize: 30, 
        fontWeight: '800'
      }}>
        SCHEDULE
      </Text>

      
      <Text style={{
        position: 'absolute',
        top: 60, 
        left: 80,
        fontSize: 30,
        fontWeight: '800',
        color: 'black',
      }}>
        BUDDY
      </Text>

      {/* Tagline below TASK */}
      <Text style={{
        position: 'absolute',
        top: 100, 
        left: 100, 
        fontSize: 16, 
        color: '#666'
      }}>
        Level UP Your Productivity
      </Text>

      {/* Double Curve */}
      <View style={{
        width: '110%', 
        height: 100, 
        borderLeftWidth: 2, 
        borderRightWidth: 2, 
        borderBottomWidth: 2, 
        borderColor: '#000', 
        borderBottomLeftRadius: '100%', 
        borderBottomRightRadius: '100%', 
        marginBottom: -90,
        marginTop: -100, 
        overflow: 'hidden', 
        position: 'relative',
      }} />

      {/* Another Curve Border */}
      <View style={{
        width: '110%', 
        height: 100, 
        borderLeftWidth: 2, 
        borderRightWidth: 2, 
        borderBottomWidth: 2, 
        borderColor: '#000', 
        borderBottomLeftRadius: '100%', 
        borderBottomRightRadius: '100%', 
        marginBottom: 50, 
        overflow: 'hidden', 
        position: 'relative',
      }} />

{/* Email Input */}
<View style={{ position: 'relative', width: '100%' }}>
  {/* Floating Label for Email */}
  <Animated.Text
    style={{
      position: 'absolute',
      left: 10, 
      transform: [{ translateY: emailPlaceholderPosition }], 
      color: '#666',
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
        borderBottomColor: '#666', 
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
        borderBottomColor: '#000',
        position: 'absolute',
        bottom: -5, 
      }}
    />

    {/* Text Input */}
    <TextInput
      className="w-full py-2 text-lg"
      placeholder={emailPlaceholder} 
      placeholderTextColor="#666"
      onFocus={handleFocusEmail}
      onBlur={handleBlurEmail}
      style={{
        paddingTop: isEmailFocused ? 15 : 0,
        width: '100%',
        textAlign: 'left',
        backgroundColor: 'transparent',
        paddingBottom: 5,
      }}
    />
  </View>
</View>

{/* Password Input */}
<View style={{ position: 'relative', marginTop: 30, width: '100%' }}>
  {/* Floating Label for Password */}
  <Animated.Text
    style={{
      position: 'absolute',
      left: 10,
      transform: [{ translateY: passwordPlaceholderPosition }],
      color: '#666',
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
        borderBottomColor: '#666',
        position: 'absolute',
        bottom: -10,
      }}
    />

    {/* Inner Bottom Border */}
    <View
      style={{
        width: '100%',
        borderBottomWidth: 2,
        borderBottomColor: '#000',
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
        placeholderTextColor="#666"
        onFocus={handleFocusPassword}
        onBlur={handleBlurPassword}
        style={{
          paddingTop: isPasswordFocused ? 15 : 0,
          width: '90%',
          textAlign: 'left',
          backgroundColor: 'transparent',
          paddingBottom: 5,
        }}
      />
      {/* Toggle Password Visibility */}
      <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} style={{ position: 'absolute', right: 10 }}>
        {passwordVisible ? <EyeOff size={24} color="black" /> : <Eye size={24} color="black" />}
      </TouchableOpacity>
    </View>
  </View>
</View>

      {/* Stay Logged In */}
      <View className="w-full flex-row items-center mt-10">
        <CheckBox
          checked={stayLoggedIn}
          onPress={() => setStayLoggedIn(!stayLoggedIn)}
          containerStyle={{ padding: 0, margin: 0 }}
        />
        <Text className="text-gray-600 text-md">Stay Logged In</Text>
      </View>

      {/* Forgot Password */}
      <TouchableOpacity onPress={() => router.push("/forgot_password")}>
        <Text className="text-blue-500 mt-2 text-md underline">Forgot Password?</Text>
      </TouchableOpacity>


      {/* Login Button */}
      <TouchableOpacity className="bg-black rounded-lg px-6 py-3 mt-4 w-full items-center">
        <Text className="text-white text-lg font-bold">LOG IN</Text>
      </TouchableOpacity>

      {/* Sign Up & Guest Login */}
      <Text className="text-gray-600 mt-6">Don't have an account yet?</Text>
        <TouchableOpacity onPress={() => router.push("/signup_page")}>
          <Text className="text-blue-500 underline">Sign Up</Text>
        </TouchableOpacity>
      
      
      <Text className="text-gray-600 mt-2">or</Text>

      <TouchableOpacity onPress={() => router.push("/guest_login")}>
        <Text className="text-blue-500 text-md mt-1 underline">Login as Guest</Text>
      </TouchableOpacity>

      {/* Footer */}
      <View style={{
        width: '110%', 
        height: 100, 
        borderLeftWidth: 2, 
        borderRightWidth: 2, 
        borderBottomWidth: 2, 
        borderColor: '#000', 
        borderBottomLeftRadius: '100%', 
        borderBottomRightRadius: '100%', 
        marginBottom: -90, 
        marginTop: 50,
        overflow: 'hidden', 
        position: 'relative',
        transform: [{ scaleY: -1 }]  
      }} />

      {/* Another Curve Border */}
      <View style={{
        width: '110%', 
        height: 100, 
        borderLeftWidth: 2, 
        borderRightWidth: 2, 
        borderBottomWidth: 2, 
        borderColor: '#000', 
        borderBottomLeftRadius: '100%', 
        borderBottomRightRadius: '100%', 
        marginBottom: -150,
        overflow: 'hidden', 
        position: 'relative',
        transform: [{ scaleY: -1 }] 
      }} />
      <Text className="absolute bottom-6 text-4xl font-bold">LOGIN PAGE</Text>
    </View>
  );
};

export default LoginPage;