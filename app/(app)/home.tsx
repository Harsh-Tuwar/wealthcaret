import { useAuthStore } from '@/stores/useAuthStore';
import { useWatchlistStore } from '@/stores/useWatchlistStore';
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
} from 'react-native';

const quotes = [
  {
    author: 'Warren Buffett',
    quote: "The stock market is a device for transferring money from the impatient to the patient.",
    authorImage: 'https://placekitten.com/40/40',
  },
  {
    author: 'Peter Lynch',
    quote: "Know what you own, and know why you own it.",
    authorImage: 'https://placekitten.com/40/40',
  },
  {
    author: 'Charlie Munger',
    quote: "The best thing a human being can do is to help another human being know more.",
    authorImage: 'https://placekitten.com/40/40',
  },
  {
    author: 'Benjamin Graham',
    quote: "The individual investor should act consistently as an investor and not as a speculator.",
    authorImage: 'https://placekitten.com/40/40',
  },
  {
    author: 'John Templeton',
    quote: "The four most dangerous words in investing are: 'This time it's different.'",
    authorImage: 'https://placekitten.com/40/40',
  },
];

const COLORS = ['#FF6B6B', '#6BCB77', '#4D96FF', '#FFD93D', '#FF6F91', '#845EC2'];

const getRandomColor = () => COLORS[Math.floor(Math.random() * COLORS.length)];
const getRandomQuote = () => quotes[Math.floor(Math.random() * quotes.length)];

export default function Home() {
  const user = useAuthStore((s) => s.user);
  const randomQuote = getRandomQuote();
  const watchlists = useWatchlistStore((s) => s.items);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hi, {user?.displayName}! 👋</Text>
        </View>

        <View style={styles.quoteContainer}>
          <Text style={styles.quoteText}>"{randomQuote.quote}"</Text>
          <View style={styles.authorContainer}>
            <Image source={{ uri: randomQuote.authorImage }} style={styles.authorImage} />
            <Text style={styles.authorText}>- {randomQuote.author}</Text>
          </View>
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>Your Watchlist</Text>
        </View>

        {watchlists.map((item) => (
          <View key={item.symbol} style={[styles.stockItem, { borderRightColor: getRandomColor() }]}>
            <Text style={styles.ticker}>{item.symbol}</Text>
            <View style={styles.stockInfo}>
              <Text style={styles.stockName}>{item.name}</Text>
              <Text style={styles.exchange}>{item.exchange}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    marginBottom: 60,
  },
  scrollContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    paddingTop: 42,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '600',
    color: '#222222',
    letterSpacing: 0.3,
  },
  quoteContainer: {
    marginVertical: 20,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E0E7FF',
    backgroundColor: '#FFFFFF',
  },
  quoteText: {
    fontSize: 13,
    fontStyle: 'italic',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 6,
    lineHeight: 18,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  authorImage: {
    width: 26,
    height: 26,
    borderRadius: 13,
    marginRight: 6,
  },
  authorText: {
    fontSize: 12.5,
    color: '#6B7280',
  },
  titleContainer: {
    marginTop: 12,
    marginBottom: 8,
  },
  title: {
    fontSize: 15.5,
    fontWeight: '500',
    color: '#4B5563',
    letterSpacing: 0.2,
  },
  stockItem: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 14,
    borderRadius: 12,
    borderRightWidth: 4,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },
  ticker: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    width: 60,
  },
  stockInfo: {
    marginLeft: 10,
    flex: 1,
  },
  stockName: {
    fontSize: 13.5,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 2,
    letterSpacing: 0.1,
  },
  exchange: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '400',
  },
});
