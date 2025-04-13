import { useState, useEffect, useRef } from "react"
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
} from "react-native"
import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { CustomText } from "../components/CustomText"
import { MovieCard } from "../components/MovieCard"
import { searchMedia, getTrending, type MediaItem } from "../services/tmdbApi"
import { useAppContext } from "../context/AppContext"
import { debounce } from "lodash"
import { StatusBar } from "expo-status-bar"
import { SafeAreaView } from "react-native-safe-area-context"

const { width } = Dimensions.get("window")

export default function SearchScreen() {
  const router = useRouter()
  const { isLoading, setIsLoading } = useAppContext()

  const [query, setQuery] = useState("")
  const [results, setResults] = useState<MediaItem[]>([])
  const [trending, setTrending] = useState<MediaItem[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const inputRef = useRef<TextInput>(null)
  const fadeAnim = useRef(new Animated.Value(0)).current

  // Load trending content when the screen loads
  useEffect(() => {
    const loadTrending = async () => {
      try {
        setIsLoading(true)
        const data = await getTrending()
        setTrending(data)
      } catch (error) {
        console.error("Error loading trending:", error)
      } finally {
        setIsLoading(false)

        // Fade in animation
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start()
      }
    }

    loadTrending()
  }, [])

  // Debounce the search function to avoid too many API calls
  const debouncedSearch = useRef(
    debounce(async (searchQuery: string) => {
      if (searchQuery.trim().length < 2) {
        setResults([])
        return
      }

      try {
        setIsSearching(true)
        const searchResults = await searchMedia(searchQuery)
        setResults(searchResults)
      } catch (error) {
        console.error("Error searching:", error)
      } finally {
        setIsSearching(false)
      }
    }, 500),
  ).current

  // Update search results when query changes
  useEffect(() => {
    debouncedSearch(query)
    return () => {
      debouncedSearch.cancel()
    }
  }, [query])

  const handleMoviePress = (item: MediaItem) => {
    const mediaType = item.media_type || (item.title ? "movie" : "tv")
    router.push({
      pathname: `/${mediaType}/[id]`,
      params: { id: item.id },
    })
  }

  const handleClearSearch = () => {
    setQuery("")
    setResults([])
    inputRef.current?.focus()
  }

  const renderTrendingSection = () => (
    <Animated.View style={[styles.trendingSection, { opacity: fadeAnim }]}>
      <CustomText variant="title" style={styles.sectionTitle}>
        Popular Searches
      </CustomText>
      <FlatList
        data={trending.slice(0, 10)}
        numColumns={2}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.trendingItem} onPress={() => handleMoviePress(item)} activeOpacity={0.7}>
            <Ionicons name="trending-up" size={16} color="#E50914" style={styles.trendingIcon} />
            <CustomText variant="body" style={styles.trendingText} numberOfLines={1}>
              {item.title || item.name}
            </CustomText>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </Animated.View>
  )

  return (
    <SafeAreaView style={styles.container} edges={["top", "right", "left"]}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#FFFFFF" style={styles.searchIcon} />
          <TextInput
            ref={inputRef}
            style={styles.searchInput}
            placeholder="Search movies and TV shows"
            placeholderTextColor="#666666"
            value={query}
            onChangeText={setQuery}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={handleClearSearch}>
              <Ionicons name="close-circle" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {isSearching ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E50914" />
        </View>
      ) : results.length > 0 ? (
        <FlatList
          data={results}
          renderItem={({ item }) => <MovieCard item={item} onPress={() => handleMoviePress(item)} />}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={[styles.resultsContainer, { paddingBottom: 100 }]}
        />
      ) : query.length >= 2 ? (
        <View style={styles.noResultsContainer}>
          <Ionicons name="search-outline" size={64} color="#666666" />
          <CustomText variant="body" style={styles.noResultsText}>
            No results found for "{query}"
          </CustomText>
          <CustomText variant="caption" style={styles.noResultsSubtext}>
            Try different keywords or check for typos
          </CustomText>
        </View>
      ) : (
        renderTrendingSection()
      )}
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
    paddingTop: Platform.OS === "ios" ? 10 : 16,
    borderBottomWidth: 1,
    borderBottomColor: "#222222",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
    paddingVertical: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  resultsContainer: {
    padding: 8,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  noResultsText: {
    textAlign: "center",
    marginTop: 16,
    fontSize: 18,
  },
  noResultsSubtext: {
    textAlign: "center",
    color: "#666666",
    marginTop: 8,
  },
  trendingSection: {
    padding: 16,
  },
  sectionTitle: {
    marginBottom: 16,
    fontSize: 20,
  },
  trendingItem: {
    flexDirection: "row",
    alignItems: "center",
    width: width / 2 - 24,
    backgroundColor: "#1A1A1A",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    marginHorizontal: 4,
  },
  trendingIcon: {
    marginRight: 8,
  },
  trendingText: {
    flex: 1,
  },
})

