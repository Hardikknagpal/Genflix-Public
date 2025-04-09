// import type React from "react"
// import { View, StyleSheet, Image, TouchableOpacity, Dimensions, Animated } from "react-native"
// import { router } from "expo-router"
// import { CustomText } from "./CustomText"
// import type { MediaItem } from "../services/tmdbApi"
// import { useAppContext } from "../context/AppContext"
// import { Ionicons } from "@expo/vector-icons"
// import { LinearGradient } from "expo-linear-gradient"

// interface MovieCardProps {
//   item: MediaItem
//   onPress?: () => void
// }

// const { width } = Dimensions.get("window")

// export const MovieCard: React.FC<MovieCardProps> = ({ item, onPress }) => {
//   const { isFavorite, addToFavorites, removeFromFavorites, isAuthenticated, navigateToLogin, favorites } =
//     useAppContext()
//   const scale = new Animated.Value(1)

//   const handleFavoritePress = async (e: any) => {
//     e.stopPropagation()

//     if (!isAuthenticated) {
//       navigateToLogin()
//       return
//     }

//     try {
//       if (isFavorite(item.id)) {
//         // Find the watchlistId for this item
//         const favoriteItem = favorites.find((fav) => fav.id === item.id)
//         if (favoriteItem && favoriteItem.watchlistId) {
//           await removeFromFavorites(favoriteItem.watchlistId)
//         } else {
//           console.error("Cannot remove from favorites: watchlistId not found")
//         }
//       } else {
//         await addToFavorites(item)
//       }
//     } catch (error) {
//       console.error("Error handling favorite:", error)
//     }
//   }

//   const handlePressIn = () => {
//     Animated.spring(scale, {
//       toValue: 0.95,
//       useNativeDriver: true,
//       speed: 20,
//     }).start()
//   }

//   const handlePressOut = () => {
//     Animated.spring(scale, {
//       toValue: 1,
//       useNativeDriver: true,
//       speed: 20,
//     }).start()
//   }

//   const handlePress = () => {
//     if (onPress) {
//       onPress()
//     } else {
//       const mediaType = item.media_type || (item.title ? "movie" : "tv")
//       router.push({
//         pathname: `/${mediaType}/[id]`,
//         params: { id: item.id },
//       })
//     }
//   }

//   // Get poster URL using the getImageUrl helper
//   const posterUrl = item.poster_path
//     ? `https://image.tmdb.org/t/p/w342${item.poster_path}`
//     : "https://via.placeholder.com/342x513?text=No+Image"

//   return (
//     <TouchableOpacity activeOpacity={0.9} onPress={handlePress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
//       <Animated.View style={[styles.container, { transform: [{ scale }] }]}>
//         <Image source={{ uri: posterUrl }} style={styles.poster} resizeMode="cover" />
//         <LinearGradient colors={["transparent", "rgba(0,0,0,0.9)"]} style={styles.overlay}>
//           <View style={styles.titleContainer}>
//             <CustomText variant="caption" style={styles.title} numberOfLines={1}>
//               {item.title || item.name}
//             </CustomText>
//             {item.vote_average && (
//               <View style={styles.ratingRow}>
//                 <Ionicons name="star" size={10} color="#FFD700" />
//                 <CustomText variant="caption" style={styles.rating}>
//                   {item.vote_average.toFixed(1)}
//                 </CustomText>
//               </View>
//             )}
//           </View>
//           <TouchableOpacity style={styles.favoriteButton} onPress={handleFavoritePress}>
//             <Ionicons
//               name={isFavorite(item.id) ? "bookmark" : "bookmark-outline"}
//               size={20}
//               color={isFavorite(item.id) ? "#E50914" : "#ffffff"}
//             />
//           </TouchableOpacity>
//         </LinearGradient>
//       </Animated.View>
//     </TouchableOpacity>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     width: width * 0.28,
//     height: width * 0.42,
//     borderRadius: 8,
//     overflow: "hidden",
//     margin: 5,
//     backgroundColor: "#1A1A1A",
//     elevation: 5,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//   },
//   poster: {
//     width: "100%",
//     height: "100%",
//   },
//   overlay: {
//     ...StyleSheet.absoluteFillObject,
//     justifyContent: "flex-end",
//     padding: 8,
//   },
//   titleContainer: {
//     flex: 1,
//     justifyContent: "flex-end",
//   },
//   title: {
//     color: "#ffffff",
//     fontSize: 12,
//     fontWeight: "bold",
//     marginBottom: 2,
//   },
//   ratingRow: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   rating: {
//     color: "#ffffff",
//     fontSize: 10,
//     marginLeft: 2,
//   },
//   favoriteButton: {
//     position: "absolute",
//     top: 4,
//     right: 4,
//     padding: 4,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     borderRadius: 12,
//   },
// })



import type React from "react"
import { View, StyleSheet, Image, TouchableOpacity, Dimensions, Animated } from "react-native"
import { router } from "expo-router"
import { CustomText } from "./CustomText"
import type { MediaItem } from "../services/tmdbApi"
import { useAppContext } from "../context/AppContext"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"

interface MovieCardProps {
  item: MediaItem
  onPress?: () => void
}

const { width } = Dimensions.get("window")

export const MovieCard: React.FC<MovieCardProps> = ({ item, onPress }) => {
  const { isFavorite, addToFavorites, removeFromFavorites, isAuthenticated, navigateToLogin } = useAppContext()
  const scale = new Animated.Value(1)

  const handleFavoritePress = async (e: any) => {
    e.stopPropagation()

    if (!isAuthenticated) {
      navigateToLogin()
      return
    }

    try {
      if (isFavorite(item.id)) {
        // Find the watchlistId for this item
        if (item.watchlistId) {
          await removeFromFavorites(item.watchlistId)
        } else {
          console.error("Cannot remove from favorites: watchlistId not found")
        }
      } else {
        await addToFavorites(item)
      }
    } catch (error) {
      console.error("Error handling favorite:", error)
    }
  }

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 20,
    }).start()
  }

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
    }).start()
  }

  const handlePress = () => {
    if (onPress) {
      onPress()
    } else {
      const mediaType = item.media_type || (item.title ? "movie" : "tv")
      router.push({
        pathname: `/${mediaType}/[id]`,
        params: { id: item.id },
      })
    }
  }

  // Get poster URL
  const posterUrl = item.poster_path
    ? `https://image.tmdb.org/t/p/w342${item.poster_path}`
    : "https://via.placeholder.com/342x513?text=No+Image"

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={handlePress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View style={[styles.container, { transform: [{ scale }] }]}>
        <Image source={{ uri: posterUrl }} style={styles.poster} resizeMode="cover" />
        <LinearGradient colors={["transparent", "rgba(0,0,0,0.9)"]} style={styles.overlay}>
          <View style={styles.titleContainer}>
            <CustomText variant="caption" style={styles.title} numberOfLines={1}>
              {item.title || item.name}
            </CustomText>
            {item.vote_average && (
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={10} color="#FFD700" />
                <CustomText variant="caption" style={styles.rating}>
                  {item.vote_average.toFixed(1)}
                </CustomText>
              </View>
            )}
          </View>
          <TouchableOpacity style={styles.favoriteButton} onPress={handleFavoritePress}>
            <Ionicons
              name={isFavorite(item.id) ? "bookmark" : "bookmark-outline"}
              size={20}
              color={isFavorite(item.id) ? "#E50914" : "#ffffff"}
            />
          </TouchableOpacity>
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    width: width * 0.45,
    height: width * 0.56,
    borderRadius: 8,
    overflow: "hidden",
    margin: 5,
    backgroundColor: "#1A1A1A",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  poster: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    padding: 8,
  },
  titleContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  title: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 2,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    color: "#ffffff",
    fontSize: 10,
    marginLeft: 2,
  },
  favoriteButton: {
    position: "absolute",
    top: 4,
    right: 4,
    padding: 4,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 12,
  },
})

