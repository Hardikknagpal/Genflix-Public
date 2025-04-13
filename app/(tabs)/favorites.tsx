import { useState } from "react"
import { View, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from "react-native"
import { useRouter } from "expo-router"
import { CustomText } from "../components/CustomText"
import { MovieCard } from "../components/MovieCard"
import { useAppContext } from "../context/AppContext"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"

export default function FavoritesScreen() {
  const { favorites, isAuthenticated, isLoading, navigateToLogin, refreshWatchlist } = useAppContext()
  const [refreshing, setRefreshing] = useState(false)

  const router = useRouter()

  const handleLogin = () => {
    router.push("/login")
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      console.log("Refreshing watchlist...")
      await refreshWatchlist()
    } catch (error) {
      console.error("Error refreshing watchlist:", error)
    } finally {
      setRefreshing(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "right", "left"]}>
        <View style={styles.emptyContainer}>
          <Ionicons name="lock-closed-outline" size={64} color="#666666" />
          <CustomText variant="title" style={styles.emptyTitle}>
            Sign in to view your watchlist
          </CustomText>
          <CustomText variant="body" style={styles.emptyText}>
            Keep track of movies and shows you want to watch
          </CustomText>
          <View style={styles.signInButton} onTouchEnd={handleLogin}>
            <CustomText style={styles.signInText}>Sign In</CustomText>
          </View>
        </View>
      </SafeAreaView>
    )
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "right", "left"]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E50914" />
          <CustomText variant="body" style={styles.loadingText}>
            Loading your watchlist...
          </CustomText>
        </View>
      </SafeAreaView>
    )
  }

  if (favorites.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "right", "left"]}>
        <View style={styles.emptyContainer}>
          <Ionicons name="bookmark-outline" size={64} color="#666666" />
          <CustomText variant="title" style={styles.emptyTitle}>
            Your watchlist is empty
          </CustomText>
          <CustomText variant="body" style={styles.emptyText}>
            Movies and shows you add to your watchlist will appear here
          </CustomText>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "right", "left"]}>
      <View style={styles.header}>
        <CustomText variant="title" style={styles.headerTitle}>
          My Watchlist
        </CustomText>
      </View>
      <FlatList
        data={favorites}
        renderItem={({ item }) => <MovieCard item={item} />}
        keyExtractor={(item) => (item.watchlistId ? item.watchlistId : `movie-${item.id}`)}
        numColumns={2}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#FFFFFF" />}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
  },
  headerTitle: {
    fontSize: 24,
  },
  list: {
    padding: 16,
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  emptyText: {
    textAlign: "center",
    color: "#AAAAAA",
    marginBottom: 24,
  },
  signInButton: {
    backgroundColor: "#E50914",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
  },
  signInText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    color: "#AAAAAA",
  },
})
