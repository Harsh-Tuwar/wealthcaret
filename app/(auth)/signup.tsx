import { appSignUp } from '@/stores/useAuthStore';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView, ScrollView, Image } from 'react-native';

const SignUp = () => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const router = useRouter();

	const handleSignUp = async () => {
		const resp = await appSignUp(email, password, name);

		if (resp.user) {
			router.replace("/(app)/home");
		} else {
			console.log(resp.error);
			Alert.alert('Sign up error!', (resp.error as any)?.message);
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

				{/* Sign Up Form Section */}
				<Text style={styles.label}>Name</Text>
				<TextInput
					style={styles.input}
					value={name}
					onChangeText={setName}
					placeholder="Enter your name"
					placeholderTextColor="#9CA3AF"
				/>
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
					secureTextEntry={true}
					placeholderTextColor="#9CA3AF"
				/>

				{/* Sign Up Button */}
				<TouchableOpacity style={styles.button} onPress={handleSignUp} activeOpacity={0.7}>
					<Text style={styles.buttonText}>Sign Up</Text>
				</TouchableOpacity>

				{/* Redirect to Sign In Button */}
				<TouchableOpacity
					style={[styles.button, styles.secondaryButton]}
					onPress={() => router.replace('/(auth)/login')}
					activeOpacity={0.7}
				>
					<Text style={[styles.buttonText, styles.secondaryButtonText]}>Sign In</Text>
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

export default SignUp;
