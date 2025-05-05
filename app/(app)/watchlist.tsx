import { useAuthStore } from '@/stores/useAuthStore';
import { useWatchlistStore } from '@/stores/useWatchlistStore';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Watchlist = () => {
	const [loading, setLoading] = useState(true);
	const watchlistedItems = useWatchlistStore((s) => s.items);
	const user = useAuthStore((s) => s.user);

	React.useEffect(() => {
		setLoading(true);

		if (user) {
			Promise.all([
				useWatchlistStore().getAllWatchlistedItems(user.uid)
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
							pathname: "/(hidden)/ticker/[ticker_info]",
							params: { ticker_info: wItem.symbol }
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
