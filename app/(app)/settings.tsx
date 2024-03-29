import { AuthStore, appSignOut } from '@/stores/authStore';
import { log } from '@/utils/logger';
import { useRouter } from 'expo-router';
import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';

const SettingsScreen = () => {
	const router = useRouter();
	const user = AuthStore.useState((state) => state.user);

	if (!user) {
		log.debug(`Coundn't find user! Returing to where you came from!`);
		router.back();
		return <></>;
	}
	
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
			<Text style={styles.userName}>{user.displayName}</Text>
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
