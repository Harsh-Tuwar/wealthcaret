import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useFocusEffect } from 'expo-router';
import network from '../../utils/network';
import { PickerQuote, SearchPickerResults } from '@/types/types';
import PageHeader from '@/components/ui/PageHeader';

const SearchTickers = () => {
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<PickerQuote[]>([]);

  useEffect(() => {
    if (searchValue.length === 0) {
      setSearchResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const timeout = setTimeout(() => {
      fetchSearchResults();
    }, 400);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line
  }, [searchValue]);

  // Reset state when this screen is focused
  useFocusEffect(
    useCallback(() => {
      setSearchValue('');
      setSearchResults([]);
      setLoading(false);
    }, [])
  );

  const fetchSearchResults = async () => {
    try {
      const results = (await network.get(
        `/picker/search?query=${searchValue}`
      )) as PickerQuote[];

      setSearchResults(
        results
      );
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <PageHeader
        title='Search Stocks'
      />

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>

          <View style={styles.searchBox}>
            <TextInput
              style={styles.input}
              value={searchValue}
              onChangeText={setSearchValue}
              placeholder="Search by ticker or name"
              placeholderTextColor="#A0A0A0"
              clearButtonMode="while-editing"
              autoCorrect={false}
              autoCapitalize="characters"
            />
          </View>

          {loading && (
            <ActivityIndicator
              size="small"
              color="#111"
              style={styles.loader}
            />
          )}

          <View style={styles.resultsContainer}>
            {searchResults.length === 0 && searchValue.length > 0 && !loading ? (
              <Text style={styles.noResults}>No results found</Text>
            ) : (
              <FlatList
                data={searchResults}
                keyExtractor={(item) => item.symbol}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <Link
                    push
                    href={{
                      pathname: '/(hidden)/ticker/[ticker_info]',
                      params: {
                        ticker_info: item.symbol,
                        exchange: item.exchange,
                      },
                    }}
                    asChild
                  >
                    <TouchableOpacity
                      style={styles.resultItem}
                      activeOpacity={0.8}
                    >
                      <View>
                        <Text style={styles.tickerSymbol}>{item.symbol}</Text>
                        <Text style={styles.tickerName}>
                          {item.shortname || item.longname}
                        </Text>
                      </View>
                      <Text style={styles.exchange}>{item.exchange}</Text>
                    </TouchableOpacity>
                  </Link>
                )}
                contentContainerStyle={{ paddingBottom: 16 }}
              />
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fefefe',
    marginTop: -24,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
		paddingTop: 15,
		paddingBottom: 40,
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 18,
    textAlign: 'center',
    letterSpacing: 0.1,
  },
  searchBox: {
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 18,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  input: {
    height: 44,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#222',
    borderRadius: 18,
    backgroundColor: '#fff',
    fontWeight: '500',
  },
  loader: {
    marginTop: 12,
  },
  resultsContainer: {
    flex: 1,
    marginTop: 8,
  },
  resultItem: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.03,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 3,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  tickerSymbol: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1C1C1E',
    letterSpacing: 0.1,
  },
  tickerName: {
    fontSize: 13,
    color: '#555',
    marginTop: 1,
    fontWeight: '400',
  },
  exchange: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  noResults: {
    textAlign: 'center',
    color: '#888',
    marginTop: 32,
    fontSize: 15,
    fontWeight: '500',
    opacity: 0.7,
  },
});

export default SearchTickers;
