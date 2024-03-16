import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import network from '../../utils/network';
import { Link } from 'expo-router';

const SearchTickers = () => {
	const [searchValue, setSearchValue] = useState<string>('');
	const [loading, setLoading] = useState(false);
	const [searchResults, setSearchResults] = useState<any[]>([]);

	React.useEffect(() => {
		if (searchValue.length === 0) {
			setSearchResults([]);
			return;
		}

		setLoading(true);
		
		const timeout = setTimeout(async () => {
			await fetchSeachResults();
		}, 400);
		
		setLoading(false);

		return () => clearTimeout(timeout);
	}, [searchValue]);
	
	const fetchSeachResults = async () => {
		const results = await network.get(`/picker/search?query=${searchValue}`) as SearchPickerResults;

		setSearchResults(results.quotes.length ? results.quotes.filter((res) => res.isYahooFinance) : []);
	};

	return (
		<SafeAreaView style={styles.container}>
			<Text>SearchTickers</Text>

			<TextInput
				style={styles.input}
				value={searchValue}
				onChangeText={setSearchValue}
				placeholder="Search for a ticker"
			/>

			<View style={styles.searchResultsContainer}>
				{loading ? <View style={styles.center}><Text>Loading...</Text></View> : searchResults.length ? searchResults.map((res) => (
					<View key={res.symbol} style={styles.resultItem}>
						<Link push href={{ pathname: '/(hidden)/ticker/[symbol]', params: { symbol: res.symbol }}}>
							<Text>
								{res.symbol} - {res.shortname} ({res.exchange})
							</Text>
						</Link>
					</View>
				)) : <Text>No results found!</Text>}
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	center: {
		justifyContent: 'center',
	},
	container: {
		flex: 1,
		padding: 10
	},
	searchResultsContainer: {
		flex: 1,
	},
	resultItem: {
		marginVertical: 5,
		padding: 5,
		borderWidth: 1,
		borderRadius: 10,
	},
	input: {
		marginVertical: 20,
		paddingLeft: 10,
		height: 40,
		borderColor: 'gray',
		borderRadius: 12,
		borderWidth: 1,
	}
})

export default SearchTickers;
