import { appSignUp } from '@/stores/authStore';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

const SignUp = () => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const router = useRouter();

	const handleSignUp = async () => {
		const resp = await appSignUp(
			email,
			password,
			name
		);

		if (resp.user) {
			router.replace("/(app)/home");
		} else {
			console.log(resp.error);
			Alert.alert('Sign up error!', (resp.error as any)?.message);
		}
	};

	return (
		<View style={styles.container}>
			<Text>Name:</Text>
			<TextInput
				style={styles.input}
				value={name}
				onChangeText={setName}
				placeholder="Enter your name"
			/>
			<Text>Email:</Text>

			<TextInput
				style={styles.input}
				value={email}
				onChangeText={setEmail}
				placeholder="Enter your email"
			/>
			<Text>Password:</Text>
			<TextInput
				style={styles.input}
				value={password}
				onChangeText={setPassword}
				placeholder="Enter your password"
				secureTextEntry={true}
			/>
			<Button title="Sign Up" onPress={handleSignUp} />
			<Button title="Sign In" onPress={() => router.replace('/(auth)/login')} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
	},
	input: {
		height: 40,
		width: '80%',
		borderColor: 'gray',
		borderRadius: 12,
		borderWidth: 1,
		marginBottom: 10,
		padding: 10,
	},
});

export default SignUp;
