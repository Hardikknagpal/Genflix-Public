// // import { View, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
// // import { useRouter } from 'expo-router';
// // import { CustomText } from './CustomText';
// // import { Ionicons } from '@expo/vector-icons';
// // import { MediaItem, IMAGE_SIZES } from '../services/tmdbApi';
// // import { useAppContext } from '../context/AppContext';

// // interface FeaturedMovieProps {
// //   item: MediaItem;
// // }

// // export const FeaturedMovie = ({ item }: FeaturedMovieProps) => {
// //   const router = useRouter();
// //   const { isFavorite, addToFavorites, removeFromFavorites } = useAppContext();
  
// //   // Determine if this item is a movie or TV show
// //   const isMovie = 'title' in item;
// //   const title = isMovie ? item.title : item.name;
// //   const mediaType = isMovie ? 'movie' : 'tv';
  
// //   // Get the backdrop path or use a placeholder
// //   const backdropPath = item.backdrop_path 
// //     ? `${IMAGE_SIZES.backdrop.original}${item.backdrop_path}`
// //     : 'https://via.placeholder.com/1280x720?text=No+Image';
  
// //   // Check if this item is in favorites
// //   const favorite = isFavorite(item.id);
  
// //   // Handle favorite button press
// //   const handleFavoritePress = () => {
// //     if (favorite) {
// //       removeFromFavorites(item.id);
// //     } else {
// //       addToFavorites(item);
// //     }
// //   };
  
// //   // Handle play button press
// //   const handlePlayPress = () => {
// //     router.push({
// //       pathname: `/${mediaType}/[id]` as any,
// //       params: { id: item.id }
// //     });
// //   };
  
// //   // Get release date
// //   const releaseDate = isMovie 
// //     ? new Date(item.release_date || '').getFullYear() 
// //     : new Date(item.first_air_date || '').getFullYear();
  
// //   return (
// //     <View style={styles.container}>
// //       <Image
// //         source={{ uri: backdropPath }}
// //         style={styles.backdrop}
// //         resizeMode="cover"
// //       />
      
// //       <View style={styles.gradient} />
      
// //       <View style={styles.content}>
// //         <View style={styles.titleContainer}>
// //           <CustomText variant="title" style={styles.title}>
// //             {title}
// //           </CustomText>
// //           <View style={styles.metaInfo}>
// //             <CustomText variant="caption">{releaseDate}</CustomText>
// //             <CustomText variant="caption" style={styles.dot}>•</CustomText>
// //             <View style={styles.ratingContainer}>
// //               <Ionicons name="star" size={12} color="#FFD700" />
// //               <CustomText variant="caption" style={styles.rating}>
// //                 {item.vote_average.toFixed(1)}
// //               </CustomText>
// //             </View>
// //           </View>
// //         </View>
        
// //         <CustomText variant="body" style={styles.overview} numberOfLines={3}>
// //           {item.overview}
// //         </CustomText>
        
// //         <View style={styles.actions}>
// //           <TouchableOpacity style={styles.playButton} onPress={handlePlayPress}>
// //             <Ionicons name="play" size={24} color="#000000" />
// //             <CustomText style={styles.playButtonText}>Play</CustomText>
// //           </TouchableOpacity>
          
// //           <TouchableOpacity style={styles.actionButton} onPress={handleFavoritePress}>
// //             <Ionicons 
// //               name={favorite ? "heart" : "heart-outline"} 
// //               size={24} 
// //               color="#FFFFFF" 
// //             />
// //             <CustomText variant="caption">My List</CustomText>
// //           </TouchableOpacity>
          
// //           <TouchableOpacity style={styles.actionButton}>
// //             <Ionicons name="information-circle-outline" size={24} color="#FFFFFF" />
// //             <CustomText variant="caption">Info</CustomText>
// //           </TouchableOpacity>
// //         </View>
// //       </View>
// //     </View>
// //   );
// // };

// // const { width } = Dimensions.get('window');

// // const styles = StyleSheet.create({
// //   container: {
// //     height: 500,
// //     width: width,
// //     position: 'relative',
// //   },
// //   backdrop: {
// //     width: '100%',
// //     height: '100%',
// //   },
// //   gradient: {
// //     position: 'absolute',
// //     left: 0,
// //     right: 0,
// //     bottom: 0,
// //     height: '70%',
// //     backgroundColor: 'rgba(0,0,0,0.7)',
// //   },
// //   content: {
// //     position: 'absolute',
// //     bottom: 0,
// //     left: 0,
// //     right: 0,
// //     padding: 16,
// //     paddingBottom: 32,
// //   },
// //   titleContainer: {
// //     marginBottom: 8,
// //   },
// //   title: {
// //     fontSize: 28,
// //     marginBottom: 8,
// //   },
// //   metaInfo: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //   },
// //   dot: {
// //     marginHorizontal: 8,
// //   },
// //   ratingContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //   },
// //   rating: {
// //     marginLeft: 4,
// //   },
// //   overview: {
// //     marginBottom: 16,
// //     lineHeight: 20,
// //   },
// //   actions: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-around',
// //   },
// //   playButton: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: '#FFFFFF',
// //     paddingHorizontal: 24,
// //     paddingVertical: 8,
// //     borderRadius: 4,
// //   },
// //   playButtonText: {
// //     color: '#000000',
// //     marginLeft: 8,
// //     fontWeight: 'bold',
// //   },
// //   actionButton: {
// //     alignItems: 'center',
// //   },
// // }); 


// "use client"

// import React from "react"
// import { View, StyleSheet, Image, TouchableOpacity, Dimensions } from "react-native"
// import { useRouter } from "expo-router"
// import { CustomText } from "./CustomText"
// import { Ionicons } from "@expo/vector-icons"
// import { type MediaItem, getImageUrl } from "../services/tmdbApi"
// import { useAppContext } from "../context/AppContext"
// import { LinearGradient } from "expo-linear-gradient"

// interface FeaturedMovieProps {
//   item: MediaItem
// }

// const { width, height } = Dimensions.get("window")

// export const FeaturedMovie = ({ item }: FeaturedMovieProps) => {
//   const router = useRouter()
//   const { isFavorite, addToFavorites, removeFromFavorites, isAuthenticated } = useAppContext()

//   // Determine if this item is a movie or TV show
//   const isMovie = item.title !== undefined
//   const title = isMovie ? item.title : item.name
//   const mediaType = isMovie ? "movie" : "tv"

//   // Get the backdrop path or use a placeholder
//   const backdropPath = item.backdrop_path
//     ? getImageUrl(item.backdrop_path, "original")
//     : "https://via.placeholder.com/1280x720?text=No+Image"

//   // Check if this item is in favorites
//   const favorite = isFavorite(item.id)

//   // Handle favorite button press
//   const handleFavoritePress = () => {
//     if (favorite) {
//       removeFromFavorites(item.id)
//     } else {
//       addToFavorites(item)
//     }
//   }

//   // Handle play button press
//   const handlePlayPress = () => {
//     router.push({
//       pathname: `/${mediaType}/[id]`,
//       params: { id: item.id },
//     })
//   }

//   // Get release date
//   const releaseDate = isMovie
//     ? new Date(item.release_date || "").getFullYear()
//     : new Date(item.first_air_date || "").getFullYear()

//   // Get genres
//   const genres = item.genre_ids
//     ?.slice(0, 3)
//     .map((id) => {
//       const genreMap: Record<number, string> = {
//         28: "Action",
//         12: "Adventure",
//         16: "Animation",
//         35: "Comedy",
//         80: "Crime",
//         99: "Documentary",
//         18: "Drama",
//         10751: "Family",
//         14: "Fantasy",
//         36: "History",
//         27: "Horror",
//         10402: "Music",
//         9648: "Mystery",
//         10749: "Romance",
//         878: "Sci-Fi",
//         10770: "TV Movie",
//         53: "Thriller",
//         10752: "War",
//         37: "Western",
//       }
//       return genreMap[id] || ""
//     })
//     .filter(Boolean)

//   return (
//     <View style={styles.container}>
//       <Image source={{ uri: backdropPath }} style={styles.backdrop} resizeMode="cover" />

//       <LinearGradient colors={["transparent", "rgba(0,0,0,0.6)", "rgba(0,0,0,0.9)"]} style={styles.gradient} />

//       <View style={styles.content}>
//         <View style={styles.titleContainer}>
//           <CustomText variant="title" style={styles.title}>
//             {title}
//           </CustomText>

//           <View style={styles.metaInfo}>
//             {releaseDate ? (
//               <View style={styles.metaItem}>
//                 <CustomText variant="caption" style={styles.metaText}>
//                   {releaseDate}
//                 </CustomText>
//               </View>
//             ) : null}

//             {item.vote_average ? (
//               <View style={styles.metaItem}>
//                 <Ionicons name="star" size={14} color="#FFD700" />
//                 <CustomText variant="caption" style={styles.metaText}>
//                   {item.vote_average.toFixed(1)}
//                 </CustomText>
//               </View>
//             ) : null}

//             {genres && genres.length > 0 ? (
//               <View style={styles.genreContainer}>
//                 {genres.map((genre, index) => (
//                   <React.Fragment key={genre}>
//                     <CustomText variant="caption" style={styles.metaText}>
//                       {genre}
//                     </CustomText>
//                     {index < genres.length - 1 && (
//                       <CustomText variant="caption" style={styles.dot}>
//                         •
//                       </CustomText>
//                     )}
//                   </React.Fragment>
//                 ))}
//               </View>
//             ) : null}
//           </View>
//         </View>

//         <CustomText variant="body" style={styles.overview} numberOfLines={3}>
//           {item.overview}
//         </CustomText>

//         <View style={styles.actions}>
//           <TouchableOpacity style={styles.playButton} onPress={handlePlayPress} activeOpacity={0.8}>
//             <Ionicons name="play" size={22} color="#000000" />
//             <CustomText style={styles.playButtonText}>Play</CustomText>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.actionButton} onPress={handleFavoritePress} activeOpacity={0.7}>
//             <Ionicons name={favorite ? "bookmark" : "bookmark-outline"} size={22} color="#FFFFFF" />
//             <CustomText variant="caption" style={styles.actionButtonText}>
//               My List
//             </CustomText>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
//             <Ionicons name="information-circle-outline" size={22} color="#FFFFFF" />
//             <CustomText variant="caption" style={styles.actionButtonText}>
//               Info
//             </CustomText>
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* GenFlix logo badge */}
//       <View style={styles.netflixBadge}>
//         <CustomText style={styles.netflixLogo}>G</CustomText>
//       </View>
//     </View>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     height: "100%",
//     width: width,
//     position: "relative",
//   },
//   backdrop: {
//     width: "100%",
//     height: "100%",
//   },
//   gradient: {
//     position: "absolute",
//     left: 0,
//     right: 0,
//     bottom: 0,
//     height: "100%",
//   },
//   content: {
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     right: 0,
//     padding: 16,
//     paddingBottom: 32,
//   },
//   titleContainer: {
//     marginBottom: 12,
//   },
//   title: {
//     fontSize: 32,
//     fontWeight: "bold",
//     marginBottom: 8,
//     textShadowColor: "rgba(0, 0, 0, 0.75)",
//     textShadowOffset: { width: -1, height: 1 },
//     textShadowRadius: 10,
//   },
//   metaInfo: {
//     flexDirection: "row",
//     alignItems: "center",
//     flexWrap: "wrap",
//   },
//   metaItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginRight: 12,
//   },
//   metaText: {
//     marginLeft: 4,
//     color: "#CCCCCC",
//   },
//   genreContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   dot: {
//     marginHorizontal: 4,
//     color: "#CCCCCC",
//   },
//   ratingContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   rating: {
//     marginLeft: 4,
//   },
//   overview: {
//     marginBottom: 20,
//     lineHeight: 20,
//     color: "#CCCCCC",
//     textShadowColor: "rgba(0, 0, 0, 0.75)",
//     textShadowOffset: { width: -1, height: 1 },
//     textShadowRadius: 10,
//   },
//   actions: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   playButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "#FFFFFF",
//     paddingHorizontal: 20,
//     paddingVertical: 8,
//     borderRadius: 4,
//     marginRight: 16,
//   },
//   playButtonText: {
//     color: "#000000",
//     marginLeft: 8,
//     fontWeight: "bold",
//   },
//   actionButton: {
//     alignItems: "center",
//     marginRight: 20,
//   },
//   actionButtonText: {
//     color: "#CCCCCC",
//     marginTop: 4,
//   },
//   netflixBadge: {
//     position: "absolute",
//     top: 16,
//     left: 16,
//     backgroundColor: "#E50914",
//     width: 24,
//     height: 24,
//     borderRadius: 4,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   netflixLogo: {
//     color: "#FFFFFF",
//     fontWeight: "bold",
//     fontSize: 16,
//   },
// })




"use client"

import React from "react"
import { View, StyleSheet, Image, TouchableOpacity, Dimensions } from "react-native"
import { useRouter } from "expo-router"
import { CustomText } from "./CustomText"
import { Ionicons } from "@expo/vector-icons"
import { type MediaItem, getImageUrl } from "../services/tmdbApi"
import { useAppContext } from "../context/AppContext"
import { LinearGradient } from "expo-linear-gradient"

interface FeaturedMovieProps {
  item: MediaItem
}

const { width, height } = Dimensions.get("window")

export const FeaturedMovie = ({ item }: FeaturedMovieProps) => {
  const router = useRouter()
  const { isFavorite, addToFavorites, removeFromFavorites, isAuthenticated, navigateToLogin } = useAppContext()

  // Determine if this item is a movie or TV show
  const isMovie = item.title !== undefined
  const title = isMovie ? item.title : item.name
  const mediaType = isMovie ? "movie" : "tv"

  // Get the backdrop path or use a placeholder
  const backdropPath = item.backdrop_path
    ? getImageUrl(item.backdrop_path, "original")
    : "https://via.placeholder.com/1280x720?text=No+Image"

  // Check if this item is in favorites
  const favorite = isFavorite(item.id)

  // Handle favorite button press
  const handleFavoritePress = async () => {
    if (!isAuthenticated) {
      navigateToLogin()
      return
    }

    try {
      if (favorite) {
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

  // Handle play button press
  const handlePlayPress = () => {
    router.push({
      pathname: `/${mediaType}/[id]`,
      params: { id: item.id },
    })
  }

  // Get release date
  const releaseDate = isMovie
    ? new Date(item.release_date || "").getFullYear()
    : new Date(item.first_air_date || "").getFullYear()

  // Get genres
  const genres = item.genre_ids
    ?.slice(0, 3)
    .map((id) => {
      const genreMap: Record<number, string> = {
        28: "Action",
        12: "Adventure",
        16: "Animation",
        35: "Comedy",
        80: "Crime",
        99: "Documentary",
        18: "Drama",
        10751: "Family",
        14: "Fantasy",
        36: "History",
        27: "Horror",
        10402: "Music",
        9648: "Mystery",
        10749: "Romance",
        878: "Sci-Fi",
        10770: "TV Movie",
        53: "Thriller",
        10752: "War",
        37: "Western",
      }
      return genreMap[id] || ""
    })
    .filter(Boolean)

  return (
    <View style={styles.container}>
      <Image source={{ uri: backdropPath }} style={styles.backdrop} resizeMode="cover" />

      <LinearGradient colors={["transparent", "rgba(0,0,0,0.6)", "rgba(0,0,0,0.9)"]} style={styles.gradient} />

      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <CustomText variant="title" style={styles.title}>
            {title}
          </CustomText>

          <View style={styles.metaInfo}>
            {releaseDate ? (
              <View style={styles.metaItem}>
                <CustomText variant="caption" style={styles.metaText}>
                  {releaseDate}
                </CustomText>
              </View>
            ) : null}

            {item.vote_average ? (
              <View style={styles.metaItem}>
                <Ionicons name="star" size={14} color="#FFD700" />
                <CustomText variant="caption" style={styles.metaText}>
                  {item.vote_average.toFixed(1)}
                </CustomText>
              </View>
            ) : null}

            {genres && genres.length > 0 ? (
              <View style={styles.genreContainer}>
                {genres.map((genre, index) => (
                  <React.Fragment key={genre}>
                    <CustomText variant="caption" style={styles.metaText}>
                      {genre}
                    </CustomText>
                    {index < genres.length - 1 && (
                      <CustomText variant="caption" style={styles.dot}>
                        •
                      </CustomText>
                    )}
                  </React.Fragment>
                ))}
              </View>
            ) : null}
          </View>
        </View>

        <CustomText variant="body" style={styles.overview} numberOfLines={3}>
          {item.overview}
        </CustomText>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.playButton} onPress={handlePlayPress} activeOpacity={0.8}>
            <Ionicons name="play" size={22} color="#000000" />
            <CustomText style={styles.playButtonText}>Play</CustomText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleFavoritePress} activeOpacity={0.7}>
            <Ionicons name={favorite ? "bookmark" : "bookmark-outline"} size={22} color="#FFFFFF" />
            <CustomText variant="caption" style={styles.actionButtonText}>
              My List
            </CustomText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
            <Ionicons name="information-circle-outline" size={22} color="#FFFFFF" />
            <CustomText variant="caption" style={styles.actionButtonText}>
              Info
            </CustomText>
          </TouchableOpacity>
        </View>
      </View>

      {/* GenFlix logo badge */}
      <View style={styles.netflixBadge}>
        <CustomText style={styles.netflixLogo}>G</CustomText>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: width,
    position: "relative",
  },
  backdrop: {
    width: "100%",
    height: "100%",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "100%",
  },
  content: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 32,
  },
  titleContainer: {
    marginBottom: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  metaInfo: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  metaText: {
    marginLeft: 4,
    color: "#CCCCCC",
  },
  genreContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dot: {
    marginHorizontal: 4,
    color: "#CCCCCC",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    marginLeft: 4,
  },
  overview: {
    marginBottom: 20,
    lineHeight: 20,
    color: "#CCCCCC",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  playButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 4,
    marginRight: 16,
  },
  playButtonText: {
    color: "#000000",
    marginLeft: 8,
    fontWeight: "bold",
  },
  actionButton: {
    alignItems: "center",
    marginRight: 20,
  },
  actionButtonText: {
    color: "#CCCCCC",
    marginTop: 4,
  },
  netflixBadge: {
    position: "absolute",
    top: 16,
    left: 16,
    backgroundColor: "#E50914",
    width: 24,
    height: 24,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  netflixLogo: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
})

