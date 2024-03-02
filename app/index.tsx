import React from 'react';
import { Text, View } from 'react-native';
import { useRootNavigationState } from 'expo-router';
import { useRouter, useSegments } from 'expo-router';

import { AuthStore } from '@/stores/authStore';

const Index = () => {
	const segments = useSegments();
	const router = useRouter();
	const navigationState = useRootNavigationState();

	const { initialized, isLoggedIn } = AuthStore.useState();

	React.useEffect(() => {
		if (!navigationState?.key || !initialized) {
			return;
		}

		const isAuthGroup = segments[0] === "(auth)";

		if (!isLoggedIn && !isAuthGroup) {
			router.replace('/(auth)/login');
		} else if (isLoggedIn) {
			router.replace("/(app)/home");
		}

	}, [segments, navigationState?.key, initialized]);


	return (
		<View>
			{!navigationState?.key ? <Text>Loading...</Text> : <></>}
		</View>
	);
}

export default Index;
