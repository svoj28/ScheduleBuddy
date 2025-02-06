import { Stack } from "expo-router";

const RootLayout = () => {
  return (
    <Stack initialRouteName="login_page">
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login_page" options={{ headerShown: false }} />
      <Stack.Screen name="signup_page" options={{ headerShown: false }} />
    </Stack>
  );
};

export default RootLayout;
