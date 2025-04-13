// import { useEffect, useState } from "react"
// import { View, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator, Dimensions } from "react-native"
// import { useLocalSearchParams, useRouter } from "expo-router"
// import { CustomText } from "../components/CustomText"
// import { Ionicons } from "@expo/vector-icons"
// import { getDetails, getCredits, getVideos, type MediaItem } from "../services/tmdbApi"
// import { useAppContext } from "../context/AppContext"
// import { LinearGradient } from "expo-linear-gradient"

// interface CastMember {
//   id: number
//   name: string
//   character: string
//   profile_path: string | null
// }

// interface Video {
//   id: string
//   key: string
//   name: string
//   site: string
//   type: string
// }

// export default function MovieDetailsScreen() {
//   const { id } = useLocalSearchParams()
//   const router = useRouter()
//   const { isFavorite, addToFavorites, removeFromFavorites } = useAppContext()

//   const [movie, setMovie] = useState<MediaItem | null>(null)
//   const [cast, setCast] = useState<CastMember[]>([])
//   const [videos, setVideos] = useState<Video[]>([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [imageError, setImageError] = useState(false)

//   useEffect(() => {
//     const fetchMovieDetails = async () => {
//       try {
//         setIsLoading(true)
//         const [movieData, creditsData, videosData] = await Promise.all([
//           getDetails("movie", Number(id)),
//           getCredits("movie", Number(id)),
//           getVideos("movie", Number(id)),
//         ])

//         console.log("Movie data:", JSON.stringify(movieData, null, 2))
//         setMovie(movieData)
//         setCast(creditsData?.cast || [])
//         setVideos(videosData || [])
//       } catch (error) {
//         console.error("Error fetching movie details:", error)
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     fetchMovieDetails()
//   }, [id])

//   if (isLoading || !movie) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#E50914" />
//       </View>
//     )
//   }

//   const favorite = isFavorite(movie.id)

//   const handleFavoritePress = () => {
//     if (favorite) {
//       const favoriteItem = movie.watchlistId ? movie.watchlistId : `watchlist-${movie.id}`
//       removeFromFavorites(favoriteItem)
//     } else {
//       addToFavorites(movie)
//     }
//   }

//   const handleBackPress = () => {
//     router.back()
//   }

//   const handlePlayPress = () => {
//     // Find a trailer if available
//     const trailer = videos.find(
//       (video) => video.type.toLowerCase() === "trailer" && video.site.toLowerCase() === "youtube",
//     )
//     if (trailer) {
//       console.log("Play trailer:", trailer.key)
//       // In a real app, you would open the YouTube app or a video player
//     } else {
//       console.log("No trailer available")
//     }
//   }

//   // Get the backdrop path or use a placeholder
//   const backdropPath = movie.backdrop_path
//     ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
//     : "https://via.placeholder.com/1280x720?text=No+Image"

//   // Get the poster path or use a placeholder
//   const posterPath = movie.poster_path
//     ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
//     : "https://via.placeholder.com/342x513?text=No+Image"

//   // Format release date
//   const releaseDate = movie.release_date
//     ? new Date(movie.release_date).toLocaleDateString("en-US", {
//         year: "numeric",
//         month: "long",
//         day: "numeric",
//       })
//     : "Release date unknown"

//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.header}>
//         <Image
//           source={{ uri: backdropPath }}
//           style={styles.backdrop}
//           resizeMode="cover"
//           onError={() => setImageError(true)}
//         />
//         {imageError && (
//           <View style={[styles.backdrop, styles.placeholderBackdrop]}>
//             <CustomText>Image not available</CustomText>
//           </View>
//         )}
//         <LinearGradient colors={["transparent", "rgba(0,0,0,0.7)", "rgba(0,0,0,0.9)"]} style={styles.overlay} />

//         <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
//           <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.favoriteButton} onPress={handleFavoritePress}>
//           <Ionicons name={favorite ? "bookmark" : "bookmark-outline"} size={24} color="#FFFFFF" />
//         </TouchableOpacity>
//       </View>

//       <View style={styles.content}>
//         <View style={styles.titleSection}>
//           <CustomText variant="title" style={styles.title}>
//             {movie.title || movie.name}
//           </CustomText>
//           <View style={styles.metaInfo}>
//             <CustomText variant="caption">{releaseDate}</CustomText>
//             {movie.vote_average && (
//               <>
//                 <CustomText variant="caption" style={styles.dot}>
//                   •
//                 </CustomText>
//                 <View style={styles.rating}>
//                   <Ionicons name="star" size={12} color="#FFD700" />
//                   <CustomText variant="caption" style={styles.ratingText}>
//                     {movie.vote_average.toFixed(1)}
//                   </CustomText>
//                 </View>
//               </>
//             )}
//           </View>
//         </View>

//         <TouchableOpacity style={styles.playButton} onPress={handlePlayPress}>
//           <Ionicons name="play" size={24} color="#000000" />
//           <CustomText style={styles.playButtonText}>Play</CustomText>
//         </TouchableOpacity>

//         <CustomText variant="body" style={styles.overview}>
//           {movie.overview || "No overview available."}
//         </CustomText>

//         {cast.length > 0 && (
//           <View style={styles.section}>
//             <CustomText variant="subtitle" style={styles.sectionTitle}>
//               Cast
//             </CustomText>
//             <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//               {cast.map((member) => (
//                 <View key={member.id} style={styles.castMember}>
//                   <Image
//                     source={{
//                       uri: member.profile_path
//                         ? `https://image.tmdb.org/t/p/w185${member.profile_path}`
//                         : "https://via.placeholder.com/185x278?text=No+Image",
//                     }}
//                     style={styles.castImage}
//                     resizeMode="cover"
//                     // defaultSource={require("../assets/placeholder-profile.png")}
//                   />
//                   <CustomText variant="caption" style={styles.castName}>
//                     {member.name}
//                   </CustomText>
//                   <CustomText variant="caption" style={styles.castCharacter}>
//                     {member.character}
//                   </CustomText>
//                 </View>
//               ))}
//             </ScrollView>
//           </View>
//         )}

//         {videos.length > 0 && (
//           <View style={styles.section}>
//             <CustomText variant="subtitle" style={styles.sectionTitle}>
//               Videos
//             </CustomText>
//             <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//               {videos.map((video) => (
//                 <TouchableOpacity
//                   key={video.id}
//                   style={styles.videoThumbnail}
//                   onPress={() => console.log("Play video:", video.key)}
//                 >
//                   <Image
//                     source={{
//                       uri: `https://img.youtube.com/vi/${video.key}/mqdefault.jpg`,
//                     }}
//                     style={styles.videoImage}
//                     resizeMode="cover"
//                   />
//                   <View style={styles.videoOverlay}>
//                     <Ionicons name="play-circle" size={40} color="#FFFFFF" />
//                   </View>
//                   <CustomText variant="caption" style={styles.videoTitle}>
//                     {video.name}
//                   </CustomText>
//                 </TouchableOpacity>
//               ))}
//             </ScrollView>
//           </View>
//         )}
        

//         {/* Add extra padding at the bottom to ensure content is visible above the tab bar */}
//         <View style={{ height: 100 }} />
//       </View>
//     </ScrollView>
//   )
// }

// const { width } = Dimensions.get("window")

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#000000",
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#000000",
//   },
//   header: {
//     height: 300,
//     position: "relative",
//   },
//   backdrop: {
//     width: "100%",
//     height: "100%",
//   },
//   placeholderBackdrop: {
//     backgroundColor: "#1A1A1A",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   overlay: {
//     ...StyleSheet.absoluteFillObject,
//   },
//   backButton: {
//     position: "absolute",
//     top: 16,
//     left: 16,
//     zIndex: 10,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     borderRadius: 20,
//     width: 40,
//     height: 40,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   favoriteButton: {
//     position: "absolute",
//     top: 16,
//     right: 16,
//     zIndex: 10,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     borderRadius: 20,
//     width: 40,
//     height: 40,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   content: {
//     padding: 16,
//   },
//   titleSection: {
//     marginBottom: 16,
//   },
//   title: {
//     marginBottom: 8,
//     fontSize: 28,
//     fontWeight: "bold",
//   },
//   metaInfo: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   dot: {
//     marginHorizontal: 8,
//   },
//   rating: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   ratingText: {
//     marginLeft: 4,
//   },
//   playButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "#FFFFFF",
//     paddingHorizontal: 24,
//     paddingVertical: 12,
//     borderRadius: 4,
//     marginBottom: 16,
//     alignSelf: "flex-start",
//   },
//   playButtonText: {
//     color: "#000000",
//     marginLeft: 8,
//     fontWeight: "bold",
//   },
//   overview: {
//     marginBottom: 24,
//     lineHeight: 22,
//   },
//   section: {
//     marginBottom: 24,
//   },
//   sectionTitle: {
//     marginBottom: 16,
//     fontSize: 20,
//   },
//   castMember: {
//     width: 120,
//     marginRight: 16,
//   },
//   castImage: {
//     width: 120,
//     height: 180,
//     borderRadius: 8,
//     marginBottom: 8,
//     backgroundColor: "#1A1A1A",
//   },
//   castName: {
//     marginBottom: 4,
//     fontWeight: "bold",
//   },
//   castCharacter: {
//     opacity: 0.7,
//   },
//   videoThumbnail: {
//     width: width * 0.7,
//     marginRight: 16,
//   },
//   videoImage: {
//     width: "100%",
//     height: 200,
//     borderRadius: 8,
//     marginBottom: 8,
//     backgroundColor: "#1A1A1A",
//   },
//   videoOverlay: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(0,0,0,0.3)",
//     borderRadius: 8,
//   },
//   videoTitle: {
//     marginTop: 8,
//   },
// })





"use client"

import { useEffect, useState } from "react"
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator, Dimensions, StatusBar } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import { CustomText } from "../components/CustomText"
import { Ionicons } from "@expo/vector-icons"
import { getDetails, getCredits, getVideos, type MediaItem } from "../services/tmdbApi"
import { useAppContext } from "../context/AppContext"
import { LinearGradient } from "expo-linear-gradient"
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';


interface CastMember {
  id: number
  name: string
  character: string
  profile_path: string | null
}

interface Video {
  id: string
  key: string
  name: string
  site: string
  type: string
}

export default function MovieDetailsScreen() {
  const { id } = useLocalSearchParams()
  const router = useRouter()
  const { isFavorite, addToFavorites, removeFromFavorites } = useAppContext()

  const [movie, setMovie] = useState<MediaItem | null>(null)
  const [cast, setCast] = useState<CastMember[]>([])
  const [videos, setVideos] = useState<Video[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setIsLoading(true)
        const [movieData, creditsData, videosData] = await Promise.all([
          getDetails("movie", Number(id)),
          getCredits("movie", Number(id)),
          getVideos("movie", Number(id)),
        ])

        console.log("Movie data:", JSON.stringify(movieData, null, 2))
        setMovie(movieData)
        setCast(creditsData?.cast || [])
        setVideos(videosData || [])
      } catch (error) {
        console.error("Error fetching movie details:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMovieDetails()
  }, [id])

  if (isLoading || !movie) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    )
  }

  const favorite = isFavorite(movie.id)

  const handleFavoritePress = () => {
    if (favorite) {
      const favoriteItem = movie.watchlistId ? movie.watchlistId : `watchlist-${movie.id}`
      removeFromFavorites(favoriteItem)
    } else {
      addToFavorites(movie)
    }
  }

  const handleBackPress = () => {
    router.back()
  }

  const handlePlayPress = () => {
    // Find a trailer if available
    const trailer = videos.find(
      (video) => video.type.toLowerCase() === "trailer" && video.site.toLowerCase() === "youtube",
    )
    if (trailer) {
      console.log("Play trailer:", trailer.key)
      // In a real app, you would open the YouTube app or a video player
    } else {
      console.log("No trailer available")
    }
  }

  // Get the backdrop path or use a placeholder
  const backdropPath = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : "https://via.placeholder.com/1280x720?text=No+Image"

  // Get the poster path or use a placeholder
  const posterPath = movie.poster_path
    ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
    : "https://via.placeholder.com/342x513?text=No+Image"

  // Format release date
  const releaseDate = movie.release_date
    ? new Date(movie.release_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Release date unknown"

  return (
    <SafeAreaProvider>
    <View style={styles.fullScreen}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      {/* Background image */}
      <Image
        source={{ uri: backdropPath }}
        style={styles.absoluteBackdrop}
        resizeMode="cover"
      />
      
      <SafeAreaView edges={['right', 'bottom', 'left']} style={styles.safeArea}>

    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: backdropPath }}
          style={styles.backdrop}
          resizeMode="cover"
          onError={() => setImageError(true)}
        />
        {imageError && (
          <View style={[styles.backdrop, styles.placeholderBackdrop]}>
            <CustomText>Image not available</CustomText>
          </View>
        )}
        <LinearGradient colors={["transparent", "rgba(0,0,0,0.7)", "rgba(0,0,0,0.9)"]} style={styles.overlay} />

        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.favoriteButton} onPress={handleFavoritePress}>
          <Ionicons name={favorite ? "bookmark" : "bookmark-outline"} size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.titleSection}>
          <CustomText variant="title" style={styles.title}>
            {movie.title || movie.name}
          </CustomText>
          <View style={styles.metaInfo}>
            <CustomText variant="caption">{releaseDate}</CustomText>
            {movie.vote_average && (
              <>
                <CustomText variant="caption" style={styles.dot}>
                  •
                </CustomText>
                <View style={styles.rating}>
                  <Ionicons name="star" size={12} color="#FFD700" />
                  <CustomText variant="caption" style={styles.ratingText}>
                    {movie.vote_average.toFixed(1)}
                  </CustomText>
                </View>
              </>
            )}
          </View>
        </View>

        <TouchableOpacity style={styles.playButton} onPress={handlePlayPress}>
          <Ionicons name="play" size={24} color="#000000" />
          <CustomText style={styles.playButtonText}>Play</CustomText>
        </TouchableOpacity>

        <CustomText variant="body" style={styles.overview}>
          {movie.overview || "No overview available."}
        </CustomText>

        {cast.length > 0 && (
          <View style={styles.section}>
            <CustomText variant="subtitle" style={styles.sectionTitle}>
              Cast
            </CustomText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {cast.map((member) => (
                <View key={member.id} style={styles.castMember}>
                  <Image
                    source={{
                      uri: member.profile_path
                        ? `https://image.tmdb.org/t/p/w185${member.profile_path}`
                        : "https://via.placeholder.com/185x278?text=No+Image",
                    }}
                    style={styles.castImage}
                    resizeMode="cover"
                    // defaultSource={require("../assets/placeholder-profile.png")}
                  />
                  <CustomText variant="caption" style={styles.castName}>
                    {member.name}
                  </CustomText>
                  <CustomText variant="caption" style={styles.castCharacter}>
                    {member.character}
                  </CustomText>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {videos.length > 0 && (
          <View style={styles.section}>
            <CustomText variant="subtitle" style={styles.sectionTitle}>
              Videos
            </CustomText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {videos.map((video) => (
                <TouchableOpacity
                  key={video.id}
                  style={styles.videoThumbnail}
                  onPress={() => console.log("Play video:", video.key)}
                >
                  <Image
                    source={{
                      uri: `https://img.youtube.com/vi/${video.key}/mqdefault.jpg`,
                    }}
                    style={styles.videoImage}
                    resizeMode="cover"
                  />
                  <View style={styles.videoOverlay}>
                    <Ionicons name="play-circle" size={40} color="#FFFFFF" />
                  </View>
                  <CustomText variant="caption" style={styles.videoTitle}>
                    {video.name}
                  </CustomText>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Add extra padding at the bottom to ensure content is visible above the tab bar */}
        <View style={{ height: 100 }} />
      </View>
    </ScrollView>
    </SafeAreaView>
      </View>
    </SafeAreaProvider>
  )
}

const { width } = Dimensions.get("window")

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
  },
  absoluteBackdrop: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    height: 300,
  },
  safeArea: {
    flex: 1,
    
    backgroundColor: 'transparent',
  },
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000000",
  },
  header: {
    height: 300,
    marginTop:15,
    position: "relative",
  },
  backdrop: {
    width: "100%",
    height: "100%",
  },
  placeholderBackdrop: {
    backgroundColor: "#1A1A1A",
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  backButton: {
    position: "absolute",
    top: 16,
    left: 16,
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  favoriteButton: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: 16,
  },
  titleSection: {
    marginBottom: 16,
  },
  title: {
    marginBottom: 8,
    fontSize: 28,
    fontWeight: "bold",
  },
  metaInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  dot: {
    marginHorizontal: 8,
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    marginLeft: 4,
  },
  playButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 4,
    marginBottom: 16,
    alignSelf: "flex-start",
  },
  playButtonText: {
    color: "#000000",
    marginLeft: 8,
    fontWeight: "bold",
  },
  overview: {
    marginBottom: 24,
    lineHeight: 22,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 16,
    fontSize: 20,
  },
  castMember: {
    width: 120,
    marginRight: 16,
  },
  castImage: {
    width: 120,
    height: 180,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "#1A1A1A",
  },
  castName: {
    marginBottom: 4,
    fontWeight: "bold",
  },
  castCharacter: {
    opacity: 0.7,
  },
  videoThumbnail: {
    width: width * 0.7,
    marginRight: 16,
  },
  videoImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "#1A1A1A",
  },
  videoOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 8,
  },
  videoTitle: {
    marginTop: 8,
  },
})

