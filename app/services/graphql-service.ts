import { fetchAuthSession } from "aws-amplify/auth"
import type { MediaItem } from "./tmdbApi"

// GraphQL API URL
const API_URL = "https://nlop9z9t2e.execute-api.eu-west-1.amazonaws.com/"

// Make a GraphQL request with authentication
export const makeGraphQLRequest = async (query: string, variables = {}) => {
  try {
    // Get the current session to access tokens
    const { tokens } = await fetchAuthSession()
    const idToken = tokens.idToken.toString()

    console.log("Making GraphQL request to:", API_URL)
    console.log("Query:", query)
    console.log("Variables:", variables)

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
        Accept: "application/json",
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    })

    console.log("Response status:", response.status)
    const responseText = await response.text()
    console.log("Response text:", responseText)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}, response: ${responseText}`)
    }

    let result
    try {
      result = JSON.parse(responseText)
    } catch (e) {
      console.error("Error parsing response:", e)
      throw new Error("Invalid JSON response from server")
    }

    if (result.errors) {
      console.error("GraphQL errors:", result.errors)
      throw new Error(result.errors[0].message)
    }

    return result.data
  } catch (error) {
    console.error("GraphQL request error:", error)
    throw error
  }
}

// Convert TMDB MediaItem to watchlist item format
export const convertMediaToWatchlistItem = (item: MediaItem) => {
  return {
    name: item.title || item.name || "Unknown Title",
    content: item.overview || "No description available",
    metadata: {
      id: item.id.toString(),
      releaseDate: item.release_date || item.first_air_date || "Unknown",
      rating: item.vote_average ? item.vote_average.toString() : "0",
      posterUrl: item.poster_path ? `https://image.tmdb.org/t/p/w342${item.poster_path}` : null,
      backdropUrl: item.backdrop_path ? `https://image.tmdb.org/t/p/original${item.backdrop_path}` : null,
      mediaType: item.media_type || (item.title ? "movie" : "tv"),
    },
  }
}

// Convert GraphQL watchlist item to MediaItem format
export const convertWatchlistItemToMedia = (item: any): MediaItem => {
  const metadata = item.metadata || {}

  return {
    id: Number.parseInt(metadata.id || "0"),
    title: item.name,
    overview: item.content,
    poster_path: metadata.posterUrl ? metadata.posterUrl.replace("https://image.tmdb.org/t/p/w342", "") : null,
    backdrop_path: metadata.backdropUrl
      ? metadata.backdropUrl.replace("https://image.tmdb.org/t/p/original", "")
      : null,
    vote_average: Number.parseFloat(metadata.rating || "0"),
    release_date: metadata.releaseDate,
    media_type: metadata.mediaType || "movie",
    watchlistId: item.id, // Store the GraphQL item ID as watchlistId
  }
}

// Add a movie to watchlist
export const addToWatchlist = async (movieData: MediaItem) => {
  const mutation = `
    mutation UpsertItem($input: ItemInput!) {
      upsertItem(input: $input) {
        id
        name
        content
        metadata
      }
    }
  `

  const watchlistItem = convertMediaToWatchlistItem(movieData)

  const variables = {
    input: watchlistItem,
  }

  return makeGraphQLRequest(mutation, variables)
}

// Get all watchlist items
export const getWatchlist = async () => {
  // Fixed query - removed nested "items" field which was causing the error
  const query = `
    query ListItems {
      listItems {
        id
        name
        content
        metadata
      }
    }
  `

  return makeGraphQLRequest(query)
}

// Get a specific watchlist item
export const getWatchlistItem = async (id: string) => {
  const query = `
    query GetItem($id: ID!) {
      getItem(id: $id) {
        id
        name
        content
        metadata
      }
    }
  `

  return makeGraphQLRequest(query, { id })
}

// Remove an item from watchlist
// Remove an item from watchlist (soft delete)
export const removeFromWatchlist = async (id: string) => {
    // First get the item to preserve its data
    const item = await getWatchlistItem(id);
    
    const mutation = `
      mutation UpsertItem($input: ItemInput!) {
        upsertItem(input: $input) {
          id
          name
          content
          metadata
        }
      }
    `;
  
    const variables = {
      input: {
        id,
        name: item.getItem.name, // Preserve original name
        content: item.getItem.content, // Preserve original content
        metadata: {
          ...item.getItem.metadata, // Preserve all existing metadata
          isDeleted: true, // Add deletion flag
          deletedAt: new Date().toISOString() // Add deletion timestamp
        }
      }
    };
  
    return makeGraphQLRequest(mutation, variables);
  };