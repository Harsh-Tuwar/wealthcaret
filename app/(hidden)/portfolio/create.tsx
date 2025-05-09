import React, { useState } from 'react';
import {Picker} from '@react-native-picker/picker';
import { View, Text, TextInput, StyleSheet, Button } from 'react-native';
import { createNewPortfolio } from '@/stores/usePortofolioStore';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/useAuthStore';

enum PortfolioType {
	NONE = '0',
	CRYPTO = '1',
	STONKS = '2',
	MIXED = '3'
}


const CreatePortfolio: React.FC = () => {
	const router = useRouter();
	const [loading, setLoading] = useState();
	const [portfolioName, setPortfolioName] = useState<string>('');
	const [type, setType] = useState<PortfolioType>(PortfolioType.NONE);
	const user = useAuthStore((s) => s.user);
	
	const handleValueChange = (itemValue: PortfolioType) => setType(itemValue);

	if (loading) {
		return <View style={styles.container}><Text>Loading...</Text></View>;
	}
	
	return (
		<View style={styles.container}>
			<Text>Portfolio Name:</Text>
			<TextInput
				style={styles.input}
				value={portfolioName}
				onChangeText={setPortfolioName}
				placeholder="Enter portfolio name"
			/>
			<Text>Select Portfolio Type:</Text>
			<Picker
				selectedValue={type}
				style={styles.pickerStyles}
				onValueChange={handleValueChange}
			>
				<Picker.Item label="None" value="0" />
				<Picker.Item label="Crypto" value="1" />
				<Picker.Item label="Stocks" value="2" />
				<Picker.Item label="Mixed" value="3" />
			</Picker>
			<Button onPress={async () => {
				await createNewPortfolio(portfolioName, type, user?.uid!);
				router.push('/(app)/home');
			}} title='Save'></Button>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
	},
	input: {
		height: 40,
		width: '80%',
		borderColor: 'gray',
		borderWidth: 1,
		marginBottom: 10,
		padding: 10,
	},
	pickerStyles:{
		width:'70%',
		backgroundColor:'gray',
		color:'white'
	  }
});

export default CreatePortfolio;
