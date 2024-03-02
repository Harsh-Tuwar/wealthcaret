import { appSignIn } from '@/stores/authStore';
import { useRouter } from 'expo-router';
import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native'

const Login = () => {
	const [email, setEmail] = React.useState('');
	const [password, setPassword] = React.useState('');
	const router = useRouter();

	const handleSignIn = async () => {
		const resp = await appSignIn(
			email,
			password
		);

		if (resp.user) {
			router.replace("/(app)/home");
		} else {
			console.log(resp.error);
			Alert.alert('Sign In error!', (resp.error as any)?.message);
		}
	};

	return (
		<View style={styles.container}>
			<Text>Login</Text>
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
			<Button title="Sign In" onPress={handleSignIn} />
			<Button title="Sign Up" onPress={() => router.replace('/(auth)/signup')} />
		</View>
	)
}

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
})

export default Login;
