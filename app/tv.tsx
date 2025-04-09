import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { CustomText } from './components/CustomText';
import { MovieCard } from './components/MovieCard';
import { getPopular, MediaItem } from './services/tmdbApi';
import { useAppContext } from './context/AppContext';

export default function TVShowsScreen() {
  const router = useRouter();
  const { isLoading, setIsLoading } = useAppContext();
  const [tvShows, setTVShows] = useState<MediaItem[]>([]);

  const fetchTVShows = async () => {
    try {
      setIsLoading(true);
      const tvShowsData = await getPopular('tv');
      setTVShows(tvShowsData);
    } catch (error) {
      console.error('Error fetching TV shows:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTVShows();
  }, []);

  const handleTVShowPress = (item: MediaItem) => {
    router.push({
      pathname: '/tv/[id]',
      params: { id: item.id },
    });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CustomText variant="title" style={styles.title}>Popular TV Shows</CustomText>
      <FlatList
        data={tvShows}
        renderItem={({ item }) => (
          <MovieCard
            item={item}
            onPress={() => handleTVShowPress(item)}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    marginTop: 10,
  },
  listContent: {
    paddingBottom: 20,
  },
}); 