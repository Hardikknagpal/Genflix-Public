// // TMDb API configuration
// const API_KEY = process.env.TMDB_API_KEY || "8b8639f8e2232dd901a20b590dfb5374"
// const BASE_URL = process.env.API_BASE_URL || "https://api.themoviedb.org/3"
// const IMAGE_BASE_URL = process.env.API_IMAGE_BASE_URL || "https://image.tmdb.org/t/p"
// const ACCOUNT_ID = "21930345"
// const SESSION_ID = "YOUR_SESSION_ID" // We'll need to get this from the user's login

// // Make sure we're using the correct image URL format
// export const getImageUrl = (path: string, size = "original") => {
//   if (!path) return null
//   return `${IMAGE_BASE_URL}/${size}${path}`
// }

// // Image sizes for different types of images
// export const IMAGE_SIZES = {
//   poster: {
//     small: "/w185",
//     medium: "/w342",
//     large: "/w500",
//     original: "/original",
//   },
//   backdrop: {
//     small: "/w300",
//     medium: "/w780",
//     large: "/w1280",
//     original: "/original",
//   },
//   profile: {
//     small: "/w45",
//     medium: "/w185",
//     large: "/h632",
//     original: "/original",
//   },
// }

// // Media types
// export type MediaType = "movie" | "tv"

// // Update the MediaItem interface to include watchlistId
// export interface MediaItem {
//   id: number
//   title?: string // For movies
//   name?: string // For TV shows
//   overview?: string
//   poster_path?: string
//   backdrop_path?: string
//   vote_average?: number
//   release_date?: string // For movies
//   first_air_date?: string // For TV shows
//   media_type?: MediaType
//   watchlistId?: string // Add this for GraphQL integration
//   metadata?: {
//     id?: string
//     watchlistItemId?: string
//     [key: string]: any
//   }
// }

// // Authentication functions
// export const createRequestToken = async (): Promise<string> => {
//   try {
//     const response = await fetch(`${BASE_URL}/authentication/token/new?api_key=${API_KEY}`)
//     const data = await response.json()
//     return data.request_token
//   } catch (error) {
//     console.error("Error creating request token:", error)
//     throw error
//   }
// }

// export const validateRequestToken = async (
//   requestToken: string,
//   username: string,
//   password: string,
// ): Promise<boolean> => {
//   try {
//     const response = await fetch(`${BASE_URL}/authentication/token/validate_with_login?api_key=${API_KEY}`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         username,
//         password,
//         request_token: requestToken,
//       }),
//     })

//     const data = await response.json()
//     return data.success === true
//   } catch (error) {
//     console.error("Error validating request token:", error)
//     return false
//   }
// }

// export const createSession = async (requestToken: string): Promise<string> => {
//   try {
//     const response = await fetch(`${BASE_URL}/authentication/session/new?api_key=${API_KEY}`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ request_token: requestToken }),
//     })
//     const data = await response.json()
//     return data.session_id
//   } catch (error) {
//     console.error("Error creating session:", error)
//     throw error
//   }
// }

// // Update the fetchApi function to use the session ID from state
// let currentSessionId = ""

// export const setSessionId = (sessionId: string) => {
//   currentSessionId = sessionId
// }

// const fetchApi = async (endpoint: string, params: Record<string, any> = {}, method: "GET" | "POST" = "GET") => {
//   const queryParams = new URLSearchParams({
//     api_key: API_KEY,
//     ...(method === "GET" ? params : {}),
//   })

//   const url = `${BASE_URL}${endpoint}${method === "GET" ? `?${queryParams.toString()}` : `?api_key=${API_KEY}`}`

//   try {
//     const headers: Record<string, string> = {
//       "Content-Type": "application/json",
//     }

//     const response = await fetch(url, {
//       method,
//       headers,
//       body:
//         method === "POST"
//           ? JSON.stringify({
//               ...params,
//               session_id: currentSessionId || undefined,
//             })
//           : undefined,
//     })

//     if (!response.ok) {
//       const errorData = await response.json()
//       throw new Error(`API request failed with status ${response.status}: ${JSON.stringify(errorData)}`)
//     }
//     return await response.json()
//   } catch (error) {
//     console.error("API request error:", error)
//     throw error
//   }
// }

// // Function to get trending media (movies and TV shows)
// export const getTrending = async (
//   mediaType: MediaType = "movie",
//   timeWindow: "day" | "week" = "week",
// ): Promise<MediaItem[]> => {
//   try {
//     const data = await fetchApi(`/trending/${mediaType}/${timeWindow}`)
//     return data.results.map((item: any) => ({
//       ...item,
//       media_type: mediaType,
//     }))
//   } catch (error) {
//     console.error("Error fetching trending:", error)
//     return []
//   }
// }

// // Function to get popular media
// export const getPopular = async (mediaType: MediaType = "movie"): Promise<MediaItem[]> => {
//   try {
//     const data = await fetchApi(`/${mediaType}/popular`)
//     return data.results.map((item: any) => ({
//       ...item,
//       media_type: mediaType,
//     }))
//   } catch (error) {
//     console.error("Error fetching popular:", error)
//     return []
//   }
// }

// // Function to get top rated media
// export const getTopRated = async (mediaType: MediaType = "movie"): Promise<MediaItem[]> => {
//   try {
//     const data = await fetchApi(`/${mediaType}/top_rated`)
//     return data.results.map((item: any) => ({
//       ...item,
//       media_type: mediaType,
//     }))
//   } catch (error) {
//     console.error("Error fetching top rated:", error)
//     return []
//   }
// }

// // Function to get media details
// export const getDetails = async (mediaType: MediaType, id: number): Promise<MediaItem | null> => {
//   try {
//     const data = await fetchApi(`/${mediaType}/${id}`)
//     return {
//       ...data,
//       media_type: mediaType,
//     }
//   } catch (error) {
//     console.error("Error fetching details:", error)
//     return null
//   }
// }

// // Function to search for media
// export const searchMedia = async (query: string, mediaType: MediaType = "movie"): Promise<MediaItem[]> => {
//   try {
//     const data = await fetchApi(`/search/${mediaType}`, { query })
//     return data.results.map((item: any) => ({
//       ...item,
//       media_type: mediaType,
//     }))
//   } catch (error) {
//     console.error("Error searching media:", error)
//     return []
//   }
// }

// // Function to get similar media
// export const getSimilar = async (mediaType: MediaType, id: number): Promise<MediaItem[]> => {
//   try {
//     const data = await fetchApi(`/${mediaType}/${id}/similar`)
//     return data.results.map((item: any) => ({
//       ...item,
//       media_type: mediaType,
//     }))
//   } catch (error) {
//     console.error("Error fetching similar media:", error)
//     return []
//   }
// }

// // Function to get media credits (cast and crew)
// export const getCredits = async (mediaType: MediaType, id: number) => {
//   try {
//     return await fetchApi(`/${mediaType}/${id}/credits`)
//   } catch (error) {
//     console.error("Error fetching credits:", error)
//     return null
//   }
// }

// // Function to get media videos (trailers, etc.)
// export const getVideos = async (mediaType: MediaType, id: number) => {
//   try {
//     const data = await fetchApi(`/${mediaType}/${id}/videos`)
//     return data.results
//   } catch (error) {
//     console.error("Error fetching videos:", error)
//     return []
//   }
// }

// // Genre mapping
// export const GENRES = {
//   28: "Action",
//   12: "Adventure",
//   16: "Animation",
//   35: "Comedy",
//   80: "Crime",
//   99: "Documentary",
//   18: "Drama",
//   10751: "Family",
//   14: "Fantasy",
//   36: "History",
//   27: "Horror",
//   10402: "Music",
//   9648: "Mystery",
//   10749: "Romance",
//   878: "Science Fiction",
//   10770: "TV Movie",
//   53: "Thriller",
//   10752: "War",
//   37: "Western",
//   10759: "Action & Adventure",
//   10762: "Kids",
//   10763: "News",
//   10764: "Reality",
//   10765: "Sci-Fi & Fantasy",
//   10766: "Soap",
//   10767: "Talk",
//   10768: "War & Politics",
// }

// // Function to get user's favorite media
// export const getFavorites = async (): Promise<MediaItem[]> => {
//   try {
//     // For now, return an empty array as we'll implement actual favorites functionality later
//     return []
//   } catch (error) {
//     console.error("Error fetching favorites:", error)
//     return []
//   }
// }

// // Function to get user's watchlist
// export const getWatchlist = async (): Promise<MediaItem[]> => {
//   try {
//     const response = await fetch(
//       `${BASE_URL}/account/${ACCOUNT_ID}/favorite/movies?api_key=${API_KEY}&session_id=${currentSessionId}`,
//     )

//     if (!response.ok) {
//       const errorData = await response.json()
//       throw new Error(`API request failed with status ${response.status}: ${JSON.stringify(errorData)}`)
//     }

//     const data = await response.json()
//     return data.results.map((item: any) => ({
//       ...item,
//       media_type: "movie",
//     }))
//   } catch (error) {
//     console.error("Error fetching watchlist:", error)
//     return []
//   }
// }

// // Function to add item to watchlist
// export const addToWatchlist = async (mediaId: number, mediaType: MediaType): Promise<boolean> => {
//   try {
//     const response = await fetch(
//       `${BASE_URL}/account/${ACCOUNT_ID}/favorite?api_key=${API_KEY}&session_id=${currentSessionId}`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           media_type: mediaType,
//           media_id: mediaId,
//           favorite: true,
//         }),
//       },
//     )

//     if (!response.ok) {
//       const errorData = await response.json()
//       throw new Error(`API request failed with status ${response.status}: ${JSON.stringify(errorData)}`)
//     }

//     const data = await response.json()
//     return data.success === true
//   } catch (error) {
//     console.error("Error adding to watchlist:", error)
//     return false
//   }
// }

// // Function to remove item from watchlist
// export const removeFromWatchlist = async (mediaId: number, mediaType: MediaType): Promise<boolean> => {
//   try {
//     const response = await fetch(
//       `${BASE_URL}/account/${ACCOUNT_ID}/favorite?api_key=${API_KEY}&session_id=${currentSessionId}`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           media_type: mediaType,
//           media_id: mediaId,
//           favorite: false,
//         }),
//       },
//     )

//     if (!response.ok) {
//       const errorData = await response.json()
//       throw new Error(`API request failed with status ${response.status}: ${JSON.stringify(errorData)}`)
//     }

//     const data = await response.json()
//     return data.success === true
//   } catch (error) {
//     console.error("Error removing from watchlist:", error)
//     return false
//   }
// }

// // API functions
// export const tmdbApi = {
//   // Get trending movies and TV shows
//   getTrending: async (timeWindow: "day" | "week" = "week"): Promise<MediaItem[]> => {
//     try {
//       const data = await fetchApi(`/trending/all/${timeWindow}`)
//       return data.results
//     } catch (error) {
//       console.error("Error fetching trending:", error)
//       return []
//     }
//   },

//   // Get popular movies
//   getPopularMovies: async (): Promise<MediaItem[]> => {
//     try {
//       const data = await fetchApi("/movie/popular", { page: 1 })
//       return data.results
//     } catch (error) {
//       console.error("Error fetching popular movies:", error)
//       return []
//     }
//   },

//   // Get popular TV shows
//   getPopularTVShows: async (): Promise<MediaItem[]> => {
//     try {
//       const data = await fetchApi("/tv/popular", { page: 1 })
//       return data.results
//     } catch (error) {
//       console.error("Error fetching popular TV shows:", error)
//       return []
//     }
//   },

//   // Get movie details
//   getMovieDetails: async (movieId: number): Promise<MediaItem> => {
//     try {
//       const data = await fetchApi(`/movie/${movieId}`)
//       return {
//         ...data,
//         media_type: "movie",
//       }
//     } catch (error) {
//       console.error("Error fetching movie details:", error)
//       throw error
//     }
//   },

//   // Get TV show details
//   getTVShowDetails: async (tvId: number): Promise<MediaItem> => {
//     try {
//       const data = await fetchApi(`/tv/${tvId}`)
//       return {
//         ...data,
//         media_type: "tv",
//       }
//     } catch (error) {
//       console.error("Error fetching TV show details:", error)
//       throw error
//     }
//   },

//   // Search for movies and TV shows
//   search: async (query: string): Promise<MediaItem[]> => {
//     if (!query.trim()) return []

//     try {
//       const data = await fetchApi("/search/multi", { query })
//       return data.results
//         .filter((item: MediaItem) => item.media_type === "movie" || item.media_type === "tv")
//         .map((item: MediaItem) => ({
//           ...item,
//           media_type: item.media_type as MediaType,
//         }))
//     } catch (error) {
//       console.error("Error searching:", error)
//       return []
//     }
//   },

//   // Mark a movie as favorite
//   markAsFavorite: async (
//     accountId: string,
//     sessionId: string,
//     mediaId: number,
//     mediaType: MediaType,
//     favorite: boolean,
//   ): Promise<boolean> => {
//     try {
//       const response = await fetch(
//         `${BASE_URL}/account/${accountId}/favorite?api_key=${API_KEY}&session_id=${sessionId}`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             media_type: mediaType,
//             media_id: mediaId,
//             favorite: favorite,
//           }),
//         },
//       )
//       const data = await response.json()
//       return data.success
//     } catch (error) {
//       console.error("Error marking as favorite:", error)
//       return false
//     }
//   },
// }




// TMDb API configuration
const API_KEY = process.env.TMDB_API_KEY || "8b8639f8e2232dd901a20b590dfb5374"
const BASE_URL = process.env.API_BASE_URL || "https://api.themoviedb.org/3"
const IMAGE_BASE_URL = process.env.API_IMAGE_BASE_URL || "https://image.tmdb.org/t/p"
const ACCOUNT_ID = "21930345"
const SESSION_ID = "YOUR_SESSION_ID" // We'll need to get this from the user's login

// Make sure we're using the correct image URL format
export const getImageUrl = (path: string, size = "original") => {
  if (!path) return null
  return `${IMAGE_BASE_URL}/${size}${path}`
}

// Image sizes for different types of images
export const IMAGE_SIZES = {
  poster: {
    small: "/w185",
    medium: "/w342",
    large: "/w500",
    original: "/original",
  },
  backdrop: {
    small: "/w300",
    medium: "/w780",
    large: "/w1280",
    original: "/original",
  },
  profile: {
    small: "/w45",
    medium: "/w185",
    large: "/h632",
    original: "/original",
  },
}

// Media types
export type MediaType = "movie" | "tv"

// Update the MediaItem interface to include watchlistId
export interface MediaItem {
  id: number
  title?: string // For movies
  name?: string // For TV shows
  overview?: string
  poster_path?: string
  backdrop_path?: string
  vote_average?: number
  release_date?: string // For movies
  first_air_date?: string // For TV shows
  media_type?: MediaType
  watchlistId?: string // Add this for local storage integration
  metadata?: {
    id?: string
    watchlistItemId?: string
    [key: string]: any
  }
}

// Authentication functions
export const createRequestToken = async (): Promise<string> => {
  try {
    const response = await fetch(`${BASE_URL}/authentication/token/new?api_key=${API_KEY}`)
    const data = await response.json()
    return data.request_token
  } catch (error) {
    console.error("Error creating request token:", error)
    throw error
  }
}

export const validateRequestToken = async (
  requestToken: string,
  username: string,
  password: string,
): Promise<boolean> => {
  try {
    const response = await fetch(`${BASE_URL}/authentication/token/validate_with_login?api_key=${API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
        request_token: requestToken,
      }),
    })

    const data = await response.json()
    return data.success === true
  } catch (error) {
    console.error("Error validating request token:", error)
    return false
  }
}

export const createSession = async (requestToken: string): Promise<string> => {
  try {
    const response = await fetch(`${BASE_URL}/authentication/session/new?api_key=${API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ request_token: requestToken }),
    })
    const data = await response.json()
    return data.session_id
  } catch (error) {
    console.error("Error creating session:", error)
    throw error
  }
}

// Update the fetchApi function to use the session ID from state
let currentSessionId = ""

export const setSessionId = (sessionId: string) => {
  currentSessionId = sessionId
}

const fetchApi = async (endpoint: string, params: Record<string, any> = {}, method: "GET" | "POST" = "GET") => {
  const queryParams = new URLSearchParams({
    api_key: API_KEY,
    ...(method === "GET" ? params : {}),
  })

  const url = `${BASE_URL}${endpoint}${method === "GET" ? `?${queryParams.toString()}` : `?api_key=${API_KEY}`}`

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    }

    const response = await fetch(url, {
      method,
      headers,
      body:
        method === "POST"
          ? JSON.stringify({
              ...params,
              session_id: currentSessionId || undefined,
            })
          : undefined,
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`API request failed with status ${response.status}: ${JSON.stringify(errorData)}`)
    }
    return await response.json()
  } catch (error) {
    console.error("API request error:", error)
    throw error
  }
}

// Function to get trending media (movies and TV shows)
export const getTrending = async (
  mediaType: MediaType = "movie",
  timeWindow: "day" | "week" = "week",
): Promise<MediaItem[]> => {
  try {
    const data = await fetchApi(`/trending/${mediaType}/${timeWindow}`)
    return data.results.map((item: any) => ({
      ...item,
      media_type: mediaType,
    }))
  } catch (error) {
    console.error("Error fetching trending:", error)
    return []
  }
}

// Function to get popular media
export const getPopular = async (mediaType: MediaType = "movie"): Promise<MediaItem[]> => {
  try {
    const data = await fetchApi(`/${mediaType}/popular`)
    return data.results.map((item: any) => ({
      ...item,
      media_type: mediaType,
    }))
  } catch (error) {
    console.error("Error fetching popular:", error)
    return []
  }
}

// Function to get top rated media
export const getTopRated = async (mediaType: MediaType = "movie"): Promise<MediaItem[]> => {
  try {
    const data = await fetchApi(`/${mediaType}/top_rated`)
    return data.results.map((item: any) => ({
      ...item,
      media_type: mediaType,
    }))
  } catch (error) {
    console.error("Error fetching top rated:", error)
    return []
  }
}

// Function to get media details
export const getDetails = async (mediaType: MediaType, id: number): Promise<MediaItem | null> => {
  try {
    const data = await fetchApi(`/${mediaType}/${id}`)
    return {
      ...data,
      media_type: mediaType,
    }
  } catch (error) {
    console.error("Error fetching details:", error)
    return null
  }
}

// Function to search for media
export const searchMedia = async (query: string, mediaType: MediaType = "movie"): Promise<MediaItem[]> => {
  try {
    const data = await fetchApi(`/search/${mediaType}`, { query })
    return data.results.map((item: any) => ({
      ...item,
      media_type: mediaType,
    }))
  } catch (error) {
    console.error("Error searching media:", error)
    return []
  }
}

// Function to get similar media
export const getSimilar = async (mediaType: MediaType, id: number): Promise<MediaItem[]> => {
  try {
    const data = await fetchApi(`/${mediaType}/${id}/similar`)
    return data.results.map((item: any) => ({
      ...item,
      media_type: mediaType,
    }))
  } catch (error) {
    console.error("Error fetching similar media:", error)
    return []
  }
}

// Function to get media credits (cast and crew)
export const getCredits = async (mediaType: MediaType, id: number) => {
  try {
    return await fetchApi(`/${mediaType}/${id}/credits`)
  } catch (error) {
    console.error("Error fetching credits:", error)
    return null
  }
}

// Function to get media videos (trailers, etc.)
export const getVideos = async (mediaType: MediaType, id: number) => {
  try {
    const data = await fetchApi(`/${mediaType}/${id}/videos`)
    return data.results
  } catch (error) {
    console.error("Error fetching videos:", error)
    return []
  }
}

// Genre mapping
export const GENRES = {
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
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
  10759: "Action & Adventure",
  10762: "Kids",
  10763: "News",
  10764: "Reality",
  10765: "Sci-Fi & Fantasy",
  10766: "Soap",
  10767: "Talk",
  10768: "War & Politics",
}

// Function to get user's favorite media
export const getFavorites = async (): Promise<MediaItem[]> => {
  try {
    // For now, return an empty array as we'll implement actual favorites functionality later
    return []
  } catch (error) {
    console.error("Error fetching favorites:", error)
    return []
  }
}

// Function to get user's watchlist
export const getWatchlist = async (): Promise<MediaItem[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/account/${ACCOUNT_ID}/favorite/movies?api_key=${API_KEY}&session_id=${currentSessionId}`,
    )

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`API request failed with status ${response.status}: ${JSON.stringify(errorData)}`)
    }

    const data = await response.json()
    return data.results.map((item: any) => ({
      ...item,
      media_type: "movie",
    }))
  } catch (error) {
    console.error("Error fetching watchlist:", error)
    return []
  }
}

// Function to add item to watchlist
export const addToWatchlist = async (mediaId: number, mediaType: MediaType): Promise<boolean> => {
  try {
    const response = await fetch(
      `${BASE_URL}/account/${ACCOUNT_ID}/favorite?api_key=${API_KEY}&session_id=${currentSessionId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          media_type: mediaType,
          media_id: mediaId,
          favorite: true,
        }),
      },
    )

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`API request failed with status ${response.status}: ${JSON.stringify(errorData)}`)
    }

    const data = await response.json()
    return data.success === true
  } catch (error) {
    console.error("Error adding to watchlist:", error)
    return false
  }
}

// Function to remove item from watchlist
export const removeFromWatchlist = async (mediaId: number, mediaType: MediaType): Promise<boolean> => {
  try {
    const response = await fetch(
      `${BASE_URL}/account/${ACCOUNT_ID}/favorite?api_key=${API_KEY}&session_id=${currentSessionId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          media_type: mediaType,
          media_id: mediaId,
          favorite: false,
        }),
      },
    )

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`API request failed with status ${response.status}: ${JSON.stringify(errorData)}`)
    }

    const data = await response.json()
    return data.success === true
  } catch (error) {
    console.error("Error removing from watchlist:", error)
    return false
  }
}

// API functions
export const tmdbApi = {
  // Get trending movies and TV shows
  getTrending: async (timeWindow: "day" | "week" = "week"): Promise<MediaItem[]> => {
    try {
      const data = await fetchApi(`/trending/all/${timeWindow}`)
      return data.results
    } catch (error) {
      console.error("Error fetching trending:", error)
      return []
    }
  },

  // Get popular movies
  getPopularMovies: async (): Promise<MediaItem[]> => {
    try {
      const data = await fetchApi("/movie/popular", { page: 1 })
      return data.results
    } catch (error) {
      console.error("Error fetching popular movies:", error)
      return []
    }
  },

  // Get popular TV shows
  getPopularTVShows: async (): Promise<MediaItem[]> => {
    try {
      const data = await fetchApi("/tv/popular", { page: 1 })
      return data.results
    } catch (error) {
      console.error("Error fetching popular TV shows:", error)
      return []
    }
  },

  // Get movie details
  getMovieDetails: async (movieId: number): Promise<MediaItem> => {
    try {
      const data = await fetchApi(`/movie/${movieId}`)
      return {
        ...data,
        media_type: "movie",
      }
    } catch (error) {
      console.error("Error fetching movie details:", error)
      throw error
    }
  },

  // Get TV show details
  getTVShowDetails: async (tvId: number): Promise<MediaItem> => {
    try {
      const data = await fetchApi(`/tv/${tvId}`)
      return {
        ...data,
        media_type: "tv",
      }
    } catch (error) {
      console.error("Error fetching TV show details:", error)
      throw error
    }
  },

  // Search for movies and TV shows
  search: async (query: string): Promise<MediaItem[]> => {
    if (!query.trim()) return []

    try {
      const data = await fetchApi("/search/multi", { query })
      return data.results
        .filter((item: MediaItem) => item.media_type === "movie" || item.media_type === "tv")
        .map((item: MediaItem) => ({
          ...item,
          media_type: item.media_type as MediaType,
        }))
    } catch (error) {
      console.error("Error searching:", error)
      return []
    }
  },

  // Mark a movie as favorite
  markAsFavorite: async (
    accountId: string,
    sessionId: string,
    mediaId: number,
    mediaType: MediaType,
    favorite: boolean,
  ): Promise<boolean> => {
    try {
      const response = await fetch(
        `${BASE_URL}/account/${accountId}/favorite?api_key=${API_KEY}&session_id=${sessionId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            media_type: mediaType,
            media_id: mediaId,
            favorite: favorite,
          }),
        },
      )
      const data = await response.json()
      return data.success
    } catch (error) {
      console.error("Error marking as favorite:", error)
      return false
    }
  },
}

