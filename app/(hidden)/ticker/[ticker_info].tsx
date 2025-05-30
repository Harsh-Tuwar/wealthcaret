import React, { useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Alert, Button } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RefreshControl, ScrollView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import network from '@/utils/network';
import helpers from '@/utils/helpers';
import CalculationCard from '@/components/tickerInfo/CalculationCard';
import { DetailedPickerData, StatKey } from '@/types/types';
import { useWatchlistStore } from '@/stores/useWatchlistStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import StatsInfoContainer from '@/components/tickerInfo/StatsInfoContainer';

const fetchPickerData = async (symbol: string) => {
  const data = await network.get(`/picker/data/detailed?picker=${symbol}`) as Promise<DetailedPickerData>;
  return data;
};

const TickerInfoScreen = () => {
  const router = useRouter();
  const [refreshing, setRefreshing] = React.useState(false);
  const [lastFetched, setLastFetched] = React.useState<Date | null>(null);
  const watchlistStore = useWatchlistStore();
  const user = useAuthStore((s) => s.fsUser);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = React.useMemo(() => ['50%', '75%'], []);
  const [activeState, setActiveStat] = React.useState<{
    key: StatKey,
    verdict: number,
    currentValue: number
  }>({
    key: '',
    verdict: 0,
    currentValue: 0
  });

  const { ticker_info: symbol, exchange } = useLocalSearchParams();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['pickerData', symbol],
    queryFn: async () => {
      const result = await fetchPickerData(symbol as string);
      setLastFetched(new Date()); // set the fetch timestamp
      return result;
    },
    enabled: !!symbol,
  });

  const onButtonPress = () => {
    bottomSheetModalRef.current?.present();
  }

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator size="large" color="#FF6347" style={styles.loader} />
      </SafeAreaView>
    );
  }

  if (error || !data) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.errorText}>Failed to load data for {symbol}</Text>
      </SafeAreaView>
    );
  }

  const {
    name = 'Unknown',
    pricePerShare: price = 0,
    peRatio = 'N/A',
    marketCap = 'N/A',
    dividend = 'N/A',
    eps = 'N/A',
    dividendYield = 'N/A',
    sector = 'N/A',
    fiftyTwoWeekRange = { low: 0, high: 0 },
    calculations,
  } = data;

  const stats = [
    { label: 'Sector', value: sector },
    { label: 'Market Cap', value: (marketCap !== 'N/A') ? helpers.formatLargeNumber(marketCap) : 'N/A' },
    { label: 'P/E Ratio', value: (peRatio != 'N/A' && peRatio > 0) ? Math.abs(peRatio).toFixed(2) : 'N/A' },
    { label: 'EPS', value: eps },
    { label: 'Dividend (PA Per Share)', value: (dividend !== 'N/A' && dividend > 0) ? `$${Math.abs(dividend).toFixed(2)}` : 'N/A' },
    { label: 'Dividend Yield', value: (dividendYield !== 'N/A' && dividendYield > 0) ? `${Math.abs(dividendYield * 100).toFixed(2)}%` : 'N/A' },
    { label: '52W High', value: `$${fiftyTwoWeekRange.high}` },
    { label: '52W Low', value: `$${fiftyTwoWeekRange.low}` },
  ];

  const handleBackPress = () => {
    router.back();
  };

  const addToWatchlist = () => {
    const res = watchlistStore.toggleWatchlistItem(symbol as string, name, exchange as string, user?.uid as string);

    if (!res) {
      Alert.alert('There seem to be some issue adding this to watchlist. Try again later!');
      return;
    } else {
      Alert.alert(`${symbol} added to watchlist.`);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.starButton} onPress={addToWatchlist}>
        <Ionicons name={watchlistStore.items.findIndex((i) => i.id === symbol) === -1 ? "star-outline" : 'star'} size={24} color="#333" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.container} refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>

        <Text style={styles.heading}>{name}</Text>
        <Text style={styles.ticker}>({symbol})</Text>

        <View style={styles.priceCard}>
          <Text style={styles.priceLabel}>Price</Text>
          <Text style={styles.price}>${parseFloat(price as string).toFixed(2)}</Text>
          {lastFetched && (
            <Text style={styles.timestamp}>
              Last updated: {lastFetched.toLocaleTimeString()}
            </Text>
          )}
        </View>

        <View style={styles.grid}>
          {stats.map(({ label, value }) => (
            <View key={label} style={styles.statCard}>
              <Text style={styles.statLabel}>{label}</Text>
              <Text style={styles.statValue}>{value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.calculationsSection}>
          <Text style={styles.sectionTitle}>Additional Calculations</Text>
          {
            [
              { key: 'fairValuePrice', label: "Fair Value Price", value: calculations?.fairValuePrice, analysisKey: "Fair Value Price", showDollarSign: true },
              { key: 'pbRatio', label: "Price to Book Ratio", value: calculations?.priceToBookRatio, analysisKey: "Price to Book Ratio", showDollarSign: false },
              { key: 'pegRatio', label: "PEG Ratio", value: calculations?.pegRatio, analysisKey: "PEG Ratio", showDollarSign: false },
              { key: 'lynchRatio', label: "Lynch Ratio", value: calculations?.lynchRatio, analysisKey: "Lynch Ratio", showDollarSign: false },
              { key: 'grahamNumber', label: "Graham number (conservative)", value: calculations?.grahamNumber, analysisKey: 'Graham Number', showDollarSign: true },
              { key: 'grahamGrowth', label: "Graham Growth Number", value: calculations?.grahamGrowthNumber, analysisKey: "Graham Growth Number", showDollarSign: true },
            ]
              .map((item) =>
                <CalculationCard
                  analysis={data.analysis}
                  label={item.label}
                  analysisKey={item.analysisKey}
                  value={item.value}
                  key={item.key as StatKey}
                  emojiKey={item.key as StatKey}
                  onPress={() => {
                    const selectedStatItem = data.analysis.summary.find((summaryItem) => summaryItem.key === item.key);

                    if (selectedStatItem) {
                      setActiveStat({
                        key: item.key as StatKey,
                        verdict: selectedStatItem?.verdict,
                        currentValue: selectedStatItem?.value
                      });
                      onButtonPress();
                    }
                  }}
                  showDollarSign={item.showDollarSign} />
              )
          }
        </View>
      </ScrollView>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        style={styles.bottomSheetModel}
        enablePanDownToClose
        enableDismissOnClose
        snapPoints={snapPoints}
        onDismiss={() => setActiveStat({
          key: '',
          verdict: 0,
          currentValue: 0
        })}
      >
        <StatsInfoContainer stat={activeState.key} verdict={activeState.verdict} currentValue={activeState.currentValue} />
      </BottomSheetModal>
    </SafeAreaView>
  );
};

export default TickerInfoScreen;

const styles = StyleSheet.create({
  bottomSheetModel: {
    backgroundColor: '#fff', // solid white background for the sheet
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    marginTop:30,
    elevation: 10, // Android shadow
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#fefefe',
  },
  container: {
    padding: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },
  starButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 10,
    zIndex: 1,
  },
  loader: {
    marginTop: 20,
  },
  heading: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
  },
  ticker: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  priceCard: {
    backgroundColor: '#eaf4ec',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  priceLabel: {
    fontSize: 14,
    color: '#4d784e',
    marginBottom: 4,
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    borderColor: '#eee',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  timestamp: {
    marginTop: 6,
    fontSize: 12,
    color: '#555',
  },
  statLabel: {
    fontSize: 12,
    color: '#777',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    padding: 10,
    zIndex: 1,
  },
  calculationsSection: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  errorText: {
    marginTop: 30,
    textAlign: 'center',
    fontSize: 16,
    color: 'red',
  },
});
