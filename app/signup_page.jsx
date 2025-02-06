import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';

const SignupPage = () => {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Signup Page</Text>
      <Button title="Go to Login" onPress={() => router.push('/login_page')} />
    </View>
  );
};

export default SignupPage;