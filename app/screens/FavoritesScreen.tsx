import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { CustomText } from '../components/CustomText';
import { MovieCard } from '../components/MovieCard';
import { useAppContext } from '../context/AppContext';

export default function FavoritesScreen() {
  const router = useRouter();
  const { favorites } = useAppContext();
  
  const handleMoviePress = (item: any) => {
    const mediaType = 'title' in item ? 'movie' : 'tv';
    router.push({
      pathname: `/${mediaType}/[id]`,
      params: { id: item.id },
    });
  };
  
  if (favorites.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <CustomText variant="title" style={styles.emptyTitle}>
          Your Favorites
        </CustomText>
        <CustomText variant="body" style={styles.emptyText}>
          Movies and TV shows you add to your favorites will appear here.
        </CustomText>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <CustomText variant="title" style={styles.title}>
        Your Favorites
      </CustomText>
      
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
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 16,
  },
  title: {
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#000000',
  },
  emptyTitle: {
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.7,
  },
}); 