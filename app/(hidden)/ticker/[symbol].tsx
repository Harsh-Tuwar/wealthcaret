import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LineGraph, GraphPoint } from 'react-native-graph';

import network from '../../../utils/network';
import { WatchlistStore, addToWatchlist, removeFromWatchlist } from '@/stores/watchlistStore';
import { AuthStore } from '@/stores/authStore';

type PriceHistory = {
	value: string
	date: string
}

const TickerData = () => {
	const router = useRouter();
	const { symbol } = useLocalSearchParams();
	const [history, setHistory] = useState<GraphPoint[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedPoint, setSelectedPoint] = useState<GraphPoint | null>(null);
	const userID = AuthStore.useState((state) => state.user?.uid);
	const alredyWatchlisted = WatchlistStore.useState((state) => state.items.find((item) => item.symbol === symbol));
	const stuff = WatchlistStore.useState((state) => state.items);

	useEffect(() => {
		getGraphData().then((priceHistory) => {
			const mappedPriceHistory = priceHistory.map((item) => ({
				date: new Date(item.date),
				value: Number.parseFloat(item.value)
			}));

			setHistory(mappedPriceHistory);
		}).catch((err) => console.log(err)).finally(() => setLoading(false));

		console.log(stuff);
	}, []);

	const getGraphData = async () => {
		const response = await network.get(`/picker/chart?query=${symbol}&interval=15m`);

		return response as PriceHistory[];
	}

	const onPointSelected = (point: GraphPoint) => {
		setSelectedPoint(point);
	};

	const handleAddToWatchlist = async () => {
		await addToWatchlist(symbol as string, userID!);
		Alert.alert(`${symbol} added to the watchlist!`);
	};

	const handleRemoveFromWatchlist = async () => {
		await removeFromWatchlist(symbol as string, userID!);
		Alert.alert(`${symbol} removed from the watchlist!`);
	}

	if (loading) {
		return <View style={styles.loading}><Text>Loading...</Text></View>;
	}

	return (
		<SafeAreaView style={styles.container}>
			<View>
				<Button onPress={() => router.back()} title='back'></Button>
				<Text>TickerData: {symbol}</Text>
				<Text> ${selectedPoint?.value.toFixed(3)}</Text>
				<Text>{selectedPoint?.date.toISOString()}</Text>

				<View style={styles.graph}>
					<LineGraph
						style={{ width: '100%', height: 300 }}
						points={history}
						animated={true}
						color="#017560"
						gradientFillColors={['#0175605D', '#7476df00']}
						enablePanGesture
						onPointSelected={onPointSelected}
						verticalPadding={25}
						onGestureEnd={() => setSelectedPoint(null)}
						enableIndicator
						indicatorPulsating
						enableFadeInMask
					/>
				</View>

				<Button onPress={alredyWatchlisted ? handleRemoveFromWatchlist : handleAddToWatchlist} title={alredyWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}></Button>
				<View style={{ marginTop: 10 }} />
				<Button onPress={() => {}} title='Add a transaction'></Button>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 10,
	},
	loading: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	graph: {
		marginTop: 10,
		marginHorizontal: -10
	},
});

export default TickerData;
