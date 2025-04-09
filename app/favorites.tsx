import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { router } from 'expo-router';
import { CustomText } from './components/CustomText';
import { MovieCard } from './components/MovieCard';
import { getFavorites, MediaItem } from './services/tmdbApi';
import { useAppContext } from './context/AppContext';

export default function FavoritesScreen() {
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<MediaItem[]>([]);
  const { isLoading, setIsLoading } = useAppContext();

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const data = await getFavorites();
      setFavorites(data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMoviePress = (movie: MediaItem) => {
    router.push({
      pathname: '/movie/[id]',
      params: { id: movie.id }
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <CustomText>Loading favorites...</CustomText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CustomText variant="title" style={styles.title}>My Favorites</CustomText>
      
      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <CustomText style={styles.emptyText}>
            You haven't added any favorites yet.
          </CustomText>
        </View>
      ) : (
        <FlatList
          data={favorites}
          renderItem={({ item }) => (
            <MovieCard
              item={item}
              onPress={() => handleMoviePress(item)}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 20,
  },
  title: {
    fontSize: 28,
    marginBottom: 20,
    marginTop: 10,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#AAAAAA',
    textAlign: 'center',
  },
}); 