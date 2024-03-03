import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import yahooFinance from 'yahoo-finance2';

const SearchTickers = () => {
	const [searchValue, setSearchValue] = useState<string>('');
	const [loading, setLoading] = useState(false);
	const [searchResults, setSearchResults] = useState([]);

	React.useEffect(() => {
		setLoading(true);
		yahooFinance.search(searchValue).then((val) => {
			console.log(val);
		}).finally(() => setLoading(false));
	}, [searchValue]);

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
				{loading ? <View style={styles.center}><Text>Loading...</Text></View> : <Text>asdsd</Text>}
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
