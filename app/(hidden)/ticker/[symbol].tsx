import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const TickerData = () => {
	const router = useRouter();
	const { symbol } = useLocalSearchParams();

	return (
		<SafeAreaView style={styles.container}>
			<Button onPress={() => router.back()} title='back'></Button>
			<Text>TickerData: {symbol}</Text>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 10,
	}
});

export default TickerData;
