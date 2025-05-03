import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { appSignIn } from '@/stores/authStore';

const Login = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const router = useRouter();

  const handleSignIn = async () => {
    const resp = await appSignIn(email, password);

    if (resp.user) {
      router.replace('/(app)/home');
    } else {
      console.log(resp.error);
      Alert.alert('Sign In error!', (resp.error as any)?.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.body} contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Image Section */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: 'https://your-image-url.com/logo.png' }}  // Replace with your image URL
            style={styles.image} 
          />
        </View>

        {/* Login Form Section */}
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          placeholderTextColor="#9CA3AF"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry
          placeholderTextColor="#9CA3AF"
        />

        <TouchableOpacity style={styles.button} onPress={handleSignIn} activeOpacity={0.7}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => router.replace('/(auth)/signup')}
          activeOpacity={0.7}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>Sign Up</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  body: {
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 60, // Adjust the space above the image
  },
  image: {
    width: 120, // Adjust image width
    height: 120, // Adjust image height
    resizeMode: 'contain',
  },
  label: {
    fontSize: 14,
    color: '#374151',
    marginTop: 24,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB',
    color: '#111827',
  },
  button: {
    marginTop: 24,
    backgroundColor: '#EC4899',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EC4899',
    marginTop: 16,
  },
  secondaryButtonText: {
    color: '#EC4899',
  },
});

export default Login;
