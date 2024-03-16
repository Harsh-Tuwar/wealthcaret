import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Alert, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';


import { LineGraph, GraphPoint } from 'react-native-graph';

import helpers from '../../../utils/helpers';
import network from '../../../utils/network';
import { WatchlistStore, addToWatchlist, removeFromWatchlist } from '@/stores/watchlistStore';
import { AuthStore } from '@/stores/authStore';
import { TextInput } from 'react-native-gesture-handler';
import { Picker } from '@react-native-picker/picker';
import { PortfolioStore } from '@/stores/portfolioStore';
import { addTransaction } from '@/stores/txStore';


type PriceHistory = {
	value: string
	date: string
}

enum BuyPriceType {
	IN_TOTAL = '0',
	PER_UNIT = '1'
}

interface TxData {
	dt: string,
	buyPrice: string,
	buyType: BuyPriceType,
	amountBought: string,
	portfolioId: string,
	txFees?: string,
	boughtVia?: string,
	notes?: string
}

interface FSTxItem {
	dt: string,
	id?: string,
	buyPrice: string,
	buyType: BuyPriceType,
	amountBought: string,
	portfolioId: string,
	txFees?: string,
	boughtVia?: string,
	notes?: string,
	createdAt?: string,
	symbol: string
}

const TickerData = () => {
	const router = useRouter();
	const { symbol, shortName, longName } = useLocalSearchParams();
	const [history, setHistory] = useState<GraphPoint[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedPoint, setSelectedPoint] = useState<GraphPoint | null>(null);
	const userID = AuthStore.useState((state) => state.user?.uid);
	const portfolios = PortfolioStore.useState((state) => state.portfolios);
	const alredyWatchlisted = WatchlistStore.useState((state) => state.items.find((item) => item.symbol === symbol));
	const bottomSheetRef = React.useRef<BottomSheet>(null);
	const snapPoints = React.useMemo(() => ['30%', '95%'], []);

	const [txData, setTxData] = useState<TxData>({
		dt: new Date().toUTCString().toString(),
		amountBought: '',
		buyPrice: '',
		portfolioId: portfolios.find((pItem) => pItem.default)?.id ?? 'unknown',
		buyType: BuyPriceType.IN_TOTAL,
		boughtVia: '',
		notes: '',
		txFees: ''
	});

	useEffect(() => {
		getGraphData().then((priceHistory) => {
			const mappedPriceHistory = priceHistory.map((item) => ({
				date: new Date(item.date),
				value: Number.parseFloat(item.value)
			}));

			setHistory(mappedPriceHistory);
		}).catch((err) => console.log(err)).finally(() => setLoading(false));
	}, []);

	const resetTxDataState = () => {
		setTxData({
			dt: new Date().toUTCString().toString(),
			amountBought: '',
			buyPrice: '',
			portfolioId: portfolios.find((pItem) => pItem.default)?.id ?? 'unknown',
			buyType: BuyPriceType.IN_TOTAL,
			boughtVia: '',
			notes: '',
			txFees: ''
		});
	}

	const handleValueChange = (itemValue: BuyPriceType) => setTxData({ ...txData, buyType: itemValue });

	const getGraphData = async () => {
		const response = await network.get(`/picker/chart?query=${symbol}&interval=2m`);

		return response as PriceHistory[];
	}

	const onPointSelected = (point: GraphPoint) => {
		setSelectedPoint(point);
	};

	const handleAddToWatchlist = async () => {
		await addToWatchlist(symbol as string, shortName as string, longName as string, userID!);
		Alert.alert(`${symbol} added to the watchlist!`);
	};

	const handleRemoveFromWatchlist = async () => {
		await removeFromWatchlist(symbol as string, userID!);
		Alert.alert(`${symbol} removed from the watchlist!`);
	}

	const handleSaveTransaction = async () => {
		const docData: FSTxItem = {
			amountBought: txData.amountBought,
			buyPrice: txData.buyPrice,
			symbol: symbol as string,
			buyType: txData.buyType,
			dt: txData.dt,
			portfolioId: txData.portfolioId,
			boughtVia: txData.boughtVia,
			notes: txData.notes,
			txFees: txData.txFees
		};

		await addTransaction(docData, userID!);

		bottomSheetRef.current?.forceClose();

		Alert.alert(`Transactin entry added succefully!`);

		resetTxDataState();
	};

	const handleCancelTransaction = async () => {
		resetTxDataState();
		bottomSheetRef.current?.forceClose();
	};

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
				<Button onPress={() => {
					bottomSheetRef.current?.expand();
				}} title='Add a transaction'></Button>
			</View>
			<BottomSheet
				enablePanDownToClose
				ref={bottomSheetRef}
				backgroundStyle={{
					backgroundColor: '#e4e4e4'
				}}
				handleIndicatorStyle={{
					backgroundColor: 'grey'
				}}
				style={[ { padding: 10 }, Platform.OS === 'android' ? styles.androidShadow : styles.iosShadow]}
				index={-1}
				snapPoints={snapPoints}
			>
				<BottomSheetScrollView stickyHeaderHiddenOnScroll style={{ marginBottom: 30 }}>
					<Text>Date & Time</Text>
					<TextInput style={styles.input} aria-label='Date&Time' value={txData.dt} aria-disabled={true}></TextInput>
					<View style={{ marginVertical: 10 }}></View>
					<Text>Portfolio</Text>
					<Picker
						selectedValue={txData.portfolioId}
						style={styles.portfolioField}
						onValueChange={(selectedValue) => setTxData({...txData, portfolioId: selectedValue })}
					>
						{portfolios.map((pItem) => <Picker.Item key={pItem.id} label={pItem.title} value={pItem.id} />)}
					</Picker>
					<View style={{ flex: 1, flexDirection: 'row', marginVertical: 5 }}>
						<View style={{ flex: 1 }}>
							<Text>Unadjusted Total buy price in CAD</Text>
							<TextInput style={styles.input} aria-label='boughtAt' value={txData.buyPrice} onChangeText={(text) => setTxData({ ...txData, buyPrice: text })}></TextInput>
						</View>
						<View style={{ flex: 1 }}>
							<Picker
								selectedValue={txData.buyType}
								style={styles.pickerStyles}
								onValueChange={handleValueChange}
							>
								<Picker.Item label="In Total" value={BuyPriceType.IN_TOTAL} />
								<Picker.Item label="Per Unit" value={BuyPriceType.PER_UNIT} />
							</Picker>
						</View>
					</View>
					<Text>Amount bought</Text>
					<TextInput style={styles.input} aria-label='Amount bought' value={txData.amountBought} onChangeText={(text) => setTxData({ ...txData, amountBought: text })}></TextInput>
					<View style={{ marginVertical: 10 }}></View>
					<Text>Exchange/Transaction Fee (in CAD)</Text>
					<TextInput style={styles.input} aria-label='exchange/transaction fee' value={txData.txFees} onChangeText={(text) => setTxData({ ...txData, txFees: text })}></TextInput>
					<View style={{ marginVertical: 10 }}></View>
					<Text>Bought via (optional)</Text>
					<TextInput style={styles.input} aria-label='Bought via' value={txData.boughtVia} onChangeText={(text) => setTxData({ ...txData, boughtVia: text })}></TextInput>
					<View style={{ marginVertical: 10 }}></View>
					<Text>Notes (optional)</Text>
					<TextInput style={styles.input} aria-label='Notes' value={txData.notes} onChangeText={(text) => setTxData({ ...txData, notes: text })}></TextInput>
					<View style={{ marginVertical: 10 }}></View>
					<Button title='Save' onPress={handleSaveTransaction}></Button>
					<View style={{ margin: 5 }}></View>
					<Button title='Cancel' onPress={handleCancelTransaction}></Button>
				</BottomSheetScrollView>
			</BottomSheet>
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
	androidShadow: {
		elevation: 5, // Android shadow
	},
	iosShadow: {
		shadowColor: '#000',
		shadowOffset: { width: 0, height: -3 },
		shadowOpacity: 0.3,
		shadowRadius: 3,
	},
	input: {
		padding: 10,
		borderWidth: 1,
		borderRadius: 10
	},
	pickerStyles:{
		marginLeft: 10,
		backgroundColor:'gray',
		color: 'white',
		marginTop: 30
	},
	portfolioField: {
		backgroundColor:'gray',
		color: 'white',
	}
});

export default TickerData;
