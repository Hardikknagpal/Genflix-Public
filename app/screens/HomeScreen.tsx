import { useEffect, useState, useRef } from "react"
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Animated,
  Dimensions,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native"
import { useRouter } from "expo-router"
import { CustomText } from "../components/CustomText"
import { FeaturedMovie } from "../components/FeaturedMovie"
import { getTrending, getPopular, getTopRated, type MediaItem } from "../services/tmdbApi"
import { useAppContext } from "../context/AppContext"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { StatusBar } from "expo-status-bar"
import { SafeAreaView } from "react-native-safe-area-context"

const { width, height } = Dimensions.get("window")
const ITEM_HEIGHT = height * 0.28
const SPACING = 10

export default function HomeScreen() {
  const router = useRouter()
  const { isLoading, setIsLoading } = useAppContext()
  const [refreshing, setRefreshing] = useState(false)
  const [trending, setTrending] = useState<MediaItem[]>([])
  const [popular, setPopular] = useState<MediaItem[]>([])
  const [topRated, setTopRated] = useState<MediaItem[]>([])
  const [featured, setFeatured] = useState<MediaItem | null>(null)
  const scrollY = useRef(new Animated.Value(0)).current

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const [trendingData, popularData, topRatedData] = await Promise.all([
        getTrending("movie"),
        getPopular("movie"),
        getTopRated("movie"),
      ])

      setTrending(trendingData)
      setPopular(popularData)
      setTopRated(topRatedData)

      // Set the first trending movie as featured
      if (trendingData.length > 0) {
        setFeatured(trendingData[0])
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const onRefresh = async () => {
    setRefreshing(true)
    await fetchData()
    setRefreshing(false)
  }

  const handleMoviePress = (item: MediaItem) => {
    const mediaType = item.media_type || "movie"
    router.push({
      pathname: `/${mediaType}/[id]`,
      params: { id: item.id },
    })
  }

  const renderSectionHeader = (title: string) => (
    <View style={styles.sectionHeader}>
      <CustomText variant="title" style={styles.sectionTitle}>
        {title}
      </CustomText>
    </View>
  )

  const renderMovieRow = (data: MediaItem[], title: string) => (
    <View style={styles.section}>
      {renderSectionHeader(title)}
      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.rowContent}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.movieItem} onPress={() => handleMoviePress(item)} activeOpacity={0.8}>
            <Image
              source={{
                uri: item.poster_path
                  ? `https://image.tmdb.org/t/p/w342${item.poster_path}`
                  : "https://via.placeholder.com/342x513?text=No+Image",
              }}
              style={styles.posterImage}
              resizeMode="cover"
            />
            <LinearGradient colors={["transparent", "rgba(0,0,0,0.9)"]} style={styles.gradientOverlay} />
            <View style={styles.movieInfo}>
              <CustomText variant="caption" style={styles.movieTitle} numberOfLines={1}>
                {item.title || item.name}
              </CustomText>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={12} color="#FFD700" />
                <CustomText variant="caption" style={styles.rating}>
                  {item.vote_average?.toFixed(1)}
                </CustomText>
              </View>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  )

  if (isLoading && !refreshing) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "right", "left"]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E50914" />
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "right", "left"]}>
      <StatusBar style="light" />

      <Animated.ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFFFFF" />}
      >
        {featured && (
          <View style={styles.featuredContainer}>
            <FeaturedMovie item={featured} />
          </View>
        )}

        {renderMovieRow(trending, "Trending Now")}
        {renderMovieRow(popular, "Popular on GenFlix")}
        {renderMovieRow(topRated, "Top Rated")}

        <View style={styles.footer}>
          <CustomText variant="caption" style={styles.footerText}>
            © 2025 GenFlix • All Rights Reserved
          </CustomText>
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    // Add extra padding at the top to avoid notch issues
    paddingTop: Platform.OS === "ios" ? 10 : 20,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000000",
  },
  featuredContainer: {
    width: "100%",
    height: height * 0.65,
    marginBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  rowContent: {
    paddingHorizontal: 8,
  },
  movieItem: {
    width: width * 0.28,
    height: ITEM_HEIGHT,
    marginHorizontal: SPACING / 2,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#1A1A1A",
  },
  posterImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  gradientOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "30%",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  movieInfo: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 8,
  },
  movieTitle: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  rating: {
    color: "#FFFFFF",
    fontSize: 10,
    marginLeft: 4,
  },
  footer: {
    padding: 16,
    alignItems: "center",
  },
  footerText: {
    color: "#666666",
    fontSize: 12,
  },
})

