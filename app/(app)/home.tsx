import { Button, StyleSheet, Text } from 'react-native';
import { View } from '@/components/Themed';
import { Link, useRouter } from 'expo-router';
import React from 'react';
import { getPortfolios } from '@/stores/portfolioStore';
import { getAllWatchlistedItems } from '@/stores/useWatchlistStore';
import { useQuery } from '@tanstack/react-query';
import { usePortfolioStore } from '@/stores/usePortfolioStore';
import { useAuthStore } from '@/stores/useAuthStore';

export default function Home() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const portfolios = usePortfolioStore((state) => state.portfolios);
  const { isFetching, isLoading, isPending } = useQuery({
    queryKey: ['portfolios-nd-watchlists'],
    queryFn: async () => {
      if (user) {
        await getPortfolios(user.uid);
        await getAllWatchlistedItems(user.uid);
      }

      return null;
    }
  });

  if (isLoading || isFetching || isPending) {
    return <View style={styles.container}><Text style={styles.loadingText}>Loading...</Text></View>;
  }

  return (
    <View style={styles.container}>
      {/* Welcome Section */}
      <Text style={styles.welcomeText}>Welcome, {user?.displayName || 'User'}!</Text>
      
      {/* Portfolio Section */}
      {portfolios.length === 0 ? (
        // No Portfolios
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>You don't have any portfolios yet.</Text>
          <Button
            onPress={() => router.push("/(hidden)/portfolio/create")}
            title="Create a Portfolio"
            color="#0B74D4" // Blue accent color
          />
        </View>
      ) : (
        // Existing Portfolios
        <View style={styles.portfolioList}>
          <Text style={styles.listTitle}>Your Portfolios</Text>
          {portfolios.map((pItem) => (
            <View key={pItem.id} style={styles.portfolioCard}>
              <Link
                push
                href={{
                  pathname: "/(hidden)/portfolio/[id]",
                  params: { id: pItem.id }
                }}
              >
                <Text style={styles.portfolioTitle}>{pItem.title}</Text>
                <Text style={styles.portfolioSubtitle}>Tap to view</Text>
              </Link>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F9FAFB',  // Soft background color
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '600',
    color: '#1F2A44',  // Dark text for high readability
    textAlign: 'center',
    marginBottom: 40,
  },
  loadingText: {
    fontSize: 18,
    color: '#0B74D4',
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#7D8B99',
    textAlign: 'center',
    marginBottom: 20,
  },
  createPortfolioButton: {
    marginTop: 10,
    paddingVertical: 12,
    width: '60%',
    borderRadius: 8,
    backgroundColor: '#0B74D4',
    marginBottom: 20,
  },
  portfolioList: {
    marginTop: 20,
  },
  listTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1F2A44',
    marginBottom: 10,
    textAlign: 'center',
  },
  portfolioCard: {
    padding: 16,
    marginVertical: 10,
    backgroundColor: '#FFFFFF', // White card background
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E8ED', // Subtle border color for contrast
    alignItems: 'flex-start',
    justifyContent: 'center',
    elevation: 2,  // Light shadow for depth
  },
  portfolioTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2A44',
  },
  portfolioSubtitle: {
    fontSize: 16,
    color: '#A0B0C0',
    marginTop: 5,
  },
});
