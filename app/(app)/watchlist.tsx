import { AuthStore } from '@/stores/authStore';
import { WatchlistStore, getAllWatchlistedItems } from '@/stores/watchlistStore';
import { Link } from 'expo-router';
import { useStoreState } from 'pullstate';
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Watchlist = () => {
	const [loading, setLoading] = useState(true);
	const watchlistedItems = useStoreState(WatchlistStore, s => s.items);
	const user = AuthStore.useState((state) => state.user);

	React.useEffect(() => {
		setLoading(true);

		if (user) {
			Promise.all([
				getAllWatchlistedItems(user.uid)
			]).then(() => setLoading(false));
		} else {
			setLoading(false);
		}
	}, []);

	if (loading) {
		return <View style={styles.container}><Text>Loading...</Text></View>;
	}
	
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Watchlisted Items</Text>
			{watchlistedItems.map((wItem) => (
				<View key={wItem.id} style={styles.watchlistItem}>
					<Link
						push
						href={{
							pathname: "/(hidden)/ticker/[symbol]",
							params: { symbol: wItem.symbol }
						}}
					>
						<View>
							<Text style={styles.title} >{wItem.symbol}</Text>
							<Text>{wItem.longName}</Text>
						</View>
					</Link>
				</View>
			))}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 10,
		justifyContent: 'center',
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
	},
	watchlistItem: {
		borderRadius: 10,
		borderWidth: 1,
		padding: 5,
		margin: 5,
	}
});

export default Watchlist;
