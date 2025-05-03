import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RefreshControl, ScrollView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import network from '@/utils/network';
import helpers from '@/utils/helpers';
import CalculationCard from '@/components/tickerInfo/CalculationCard';
import { DetailedPickerData } from '@/types/types';

const fetchPickerData = async (symbol: string) => {
  const data = await network.get(`/picker/data/detailed?picker=${symbol}`) as Promise<DetailedPickerData>;
  return data;
};

const TickerInfoScreen = () => {
  const router = useRouter();
  const [refreshing, setRefreshing] = React.useState(false);
  const [lastFetched, setLastFetched] = React.useState<Date | null>(null);


  const { ticker_info: symbol } = useLocalSearchParams();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['pickerData', symbol],
    queryFn: async () => {
      const result = await fetchPickerData(symbol as string);
      setLastFetched(new Date()); // set the fetch timestamp
      return result;
    },
    enabled: !!symbol,
  });

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

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
        <Ionicons name="arrow-back" size={24} color="#333" />
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
              { label: "Fair Value Price", value: calculations?.fairValuePrice, analysisKey: "Fair Value Price", showDollarSign: true },
              { label: "Price to Book Ratio", value: calculations?.priceToBookRatio, analysisKey: "Price to Book Ratio", showDollarSign: false },
              { label: "PEG Ratio", value: calculations?.pegRatio, analysisKey: "PEG Ratio", showDollarSign: false },
              { label: "Lynch Ratio", value: calculations?.lynchRatio, analysisKey: "Lynch Ratio",showDollarSign: false },
              { label: "Graham number (conservative)", value: calculations?.grahamNumber, analysisKey: 'Graham Number', showDollarSign: true },
              { label: "Graham Growth Number", value: calculations?.grahamGrowthNumber, analysisKey: "Graham Growth Number", showDollarSign: true },
            ]
              .map((item, index) =>
                <CalculationCard analysis={data.analysis} label={item.label} analysisKey={item.analysisKey} value={item.value} key={index} showDollarSign={item.showDollarSign} />
              )
          }
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TickerInfoScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fefefe',
  },
  container: {
    padding: 20,
    paddingTop: 40,
    paddingBottom: 40,
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
