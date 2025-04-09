import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { CustomText } from './components/CustomText';
import { MovieCard } from './components/MovieCard';
import { getPopular, MediaItem } from './services/tmdbApi';
import { useAppContext } from './context/AppContext';

export default function MoviesScreen() {
  const router = useRouter();
  const { isLoading, setIsLoading } = useAppContext();
  const [movies, setMovies] = useState<MediaItem[]>([]);

  const fetchMovies = async () => {
    try {
      setIsLoading(true);
      const moviesData = await getPopular('movie');
      setMovies(moviesData);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleMoviePress = (item: MediaItem) => {
    router.push({
      pathname: '/movie/[id]',
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
      <CustomText variant="title" style={styles.title}>Popular Movies</CustomText>
      <FlatList
        data={movies}
        renderItem={({ item }) => (
          <MovieCard
            item={item}
            onPress={() => handleMoviePress(item)}
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