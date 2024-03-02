import { appSignOut } from '@/stores/authStore';
import { useRouter } from 'expo-router';
import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';

const SettingsScreen = () => {
	const router = useRouter();
	
	const onLogout = async () => {
		const resp = await appSignOut();

		if (!resp?.error) {
			router.replace("/(auth)/login");
		} else {
			console.log(resp?.error);
			Alert.alert("Logout error!", (resp?.error as any)?.message);
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.userName}>Harsh Tuwar</Text>
			<Button title="Logout" onPress={onLogout} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	userName: {
		fontSize: 20,
		marginBottom: 20,
	},
});

export default SettingsScreen;
