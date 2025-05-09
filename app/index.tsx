import React from 'react';
import { Text, View } from 'react-native';
import { useRootNavigationState } from 'expo-router';
import { useRouter, useSegments } from 'expo-router';
import { useAuthStore } from '@/stores/useAuthStore';
import { useWatchlistStore } from '@/stores/useWatchlistStore';

const Index = () => {
	const router = useRouter();
	const segments = useSegments();
	const navigationState = useRootNavigationState();

	const initialized = useAuthStore((s) => s.initialized);
	const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

	const fsUser = useAuthStore((s) => s.fsUser);

	const getAllWatchlistedItems = useWatchlistStore((s) => s.getAllWatchlistedItems);

	React.useEffect(() => {
		const tryRedirect = async () => {
			if (!navigationState?.key || !initialized) return;

			const isAuthGroup = segments[0] === "(auth)";

			if (!isLoggedIn && !isAuthGroup) {
				router.replace("/(auth)/login");
			} else if (isLoggedIn && fsUser?.uid) {
				await getAllWatchlistedItems(fsUser.uid); // fetch watchlist
				router.replace("/(app)/home");
			}
		};

		tryRedirect();
	}, [segments, navigationState?.key, initialized, isLoggedIn, fsUser?.uid]);

	return (
		<View style={{ margin: 15 }}>
			{!navigationState?.key ? <Text>Loading...</Text> : <></>}
		</View>
	);
}

export default Index;
