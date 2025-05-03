import { useLocalSearchParams, useRouter } from 'expo-router';
import { Text, StyleSheet, Button } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
// import { PortfolioStore } from '@/stores/portfolioStore';
import { log } from '@/utils/logger';
import { usePortfolioStore } from '@/stores/usePortfolioStore';

const PortfolioItem = () => {
	const { id } = useLocalSearchParams();
	const router = useRouter();
	const portfolio = usePortfolioStore((state) =>
		state.portfolios.find((item) => item.id === id)
	);

	if (!portfolio) {
		log.debug(`Couldn't find the portfolio! Redirecting to home!`);
		router.back();
		return <></>;
	}

	return (
		<SafeAreaView style={styles.container}>
			<Text>Portfolio: {portfolio?.title}</Text>
			<Button onPress={() => router.back()} title='Home'></Button>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 10,
	}
});

export default PortfolioItem;
