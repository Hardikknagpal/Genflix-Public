// TMDb API configuration
const API_KEY = process.env.TMDB_API_KEY || "8b8639f8e2232dd901a20b590dfb5374"
const BASE_URL = process.env.API_BASE_URL || "https://api.themoviedb.org/3"
const IMAGE_BASE_URL = process.env.API_IMAGE_BASE_URL || "https://image.tmdb.org/t/p"

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

export type MediaType = "movie" | "tv"

export interface MediaItem {
  id: number
  title?: string 
  name?: string 
  overview?: string
  poster_path?: string
  backdrop_path?: string
  vote_average?: number
  release_date?: string 
  first_air_date?: string 
  media_type?: MediaType
  watchlistId?: string
  metadata?: {
    id?: string
    watchlistItemId?: string
    [key: string]: any
  }
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

// Function to get trending media
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

// Function to get media casts
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



export const tmdbApi = {
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

}

