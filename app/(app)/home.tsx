import { Button, StyleSheet, Text } from 'react-native';

import { View } from '@/components/Themed';
import { Link, useRouter } from 'expo-router';
import React from 'react';
import { PortfolioStore, getPortfolios } from '@/stores/portfolioStore';
import { AuthStore } from '@/stores/authStore';
import { useStoreState } from 'pullstate';
import { getAllWatchlistedItems } from '@/stores/watchlistStore';
import { useQuery } from '@tanstack/react-query';

export default function Home() {
  const router = useRouter();
  const user = AuthStore.useState((state) => state.user);
  const portfolios = useStoreState(PortfolioStore, s => s.portfolios);
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
    return <View style={styles.container}><Text>Loading...</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
      <Button onPress={() => router.push("/(hidden)/portfolio/create")} title='Create Portfolio'></Button>
      {portfolios.map((pItem) => (
        <View key={pItem.id} style={styles.portfolioCard}>
          <Link
            push
            href={{
              pathname: "/(hidden)/portfolio/[id]",
              params: { id: pItem.id }
            }}
          >
            <Text style={styles.title} >{pItem.title}</Text>
          </Link>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  portfolioCard: {
    padding: 5,
    marginVertical: 10,
    borderRadius: 10,
    borderWidth: 4
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  }
});
