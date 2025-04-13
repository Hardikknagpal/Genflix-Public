import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { MediaItem } from "../services/tmdbApi"
import { Alert } from "react-native"
import {
  configureAmplify,
  checkAuthStatus,
  signIn as amplifySignIn,
  signOut as amplifySignOut,
  getCurrentUser,
} from "../services/auth-service"
import {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  convertWatchlistItemToMedia,
} from "../services/graphql-service"

interface AppContextType {
  favorites: MediaItem[]
  isFavorite: (id: number) => boolean
  addToFavorites: (item: MediaItem) => Promise<{ success: boolean; error?: string }>
  removeFromFavorites: (id: string) => Promise<{ success: boolean; error?: string }>
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  isAuthenticated: boolean
  setIsAuthenticated: (authenticated: boolean) => void
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<{ success: boolean; error?: string }>
  user: { username?: string; email?: string }
  navigateToLogin: () => void
  refreshWatchlist: () => Promise<void>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

interface AppProviderProps {
  children: React.ReactNode
  navigateToLogin: () => void
}

export const AppProvider: React.FC<AppProviderProps> = ({ children, navigateToLogin: navigateToLoginProp }) => {
  const [favorites, setFavorites] = useState<MediaItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<{ username?: string; email?: string }>({})
  const [isAmplifyConfigured, setIsAmplifyConfigured] = useState(false)

  // Initialize Amplify
  useEffect(() => {
    const initializeAmplify = async () => {
      try {
        configureAmplify()
        setIsAmplifyConfigured(true)
      } catch (error) {
        console.error("Error initializing Amplify:", error)
      }
    }

    initializeAmplify()
  }, [])

  // Check authentication status on app start
  useEffect(() => {
    const checkAuth = async () => {
      if (!isAmplifyConfigured) return

      try {
        const authStatus = await checkAuthStatus()

        if (authStatus.isAuthenticated) {
          // Get user details
          const userResult = await getCurrentUser()
          console.log("User result from Cognito:", userResult)

          if (userResult.success) {
            setIsAuthenticated(true)
            // Store the user information from Cognito
            const userInfo = {
              username: userResult.user.username,
              email: userResult.user.attributes?.email || userResult.user.username,
            }
            console.log("Setting user info:", userInfo)
            setUser(userInfo)
            // Load favorites if authenticated
            await loadWatchlist()
          }
        } else {
          setIsAuthenticated(false)
          setIsLoading(false)
        }
      } catch (error) {
        console.error("Error checking authentication:", error)
        setIsAuthenticated(false)
        setIsLoading(false)
      }
    }

    if (isAmplifyConfigured) {
      checkAuth()
    }
  }, [isAmplifyConfigured])

  // Load watchlist when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadWatchlist()
    } else {
      setFavorites([])
      setIsLoading(false)
    }
  }, [isAuthenticated])

  // Load watchlist from GraphQL API
  const loadWatchlist = async () => {
    try {
      setIsLoading(true)

      if (!isAuthenticated) {
        setFavorites([])
        return
      }

      console.log("Fetching watchlist from GraphQL API...")
      const result = await getWatchlist()
      console.log("Watchlist result:", result)

      if (result?.listItems) {
        // Filter out items that have isDeleted: true in their metadata
        const activeItems = result.listItems.filter((item) => !(item.metadata && item.metadata.isDeleted))

        // Convert the remaining items to MediaItem format
        const watchlistItems = activeItems.map(convertWatchlistItemToMedia)
        console.log("Converted watchlist items:", watchlistItems)
        setFavorites(watchlistItems)
      } else {
        console.log("No watchlist items found")
        setFavorites([])
      }
    } catch (error) {
      console.error("Error loading watchlist:", error)
      setFavorites([])
    } finally {
      setIsLoading(false)
    }
  }

  // Refresh watchlist data
  const refreshWatchlist = async () => {
    await loadWatchlist()
  }

  // Check if an item is in favorites
  const isFavorite = (id: number): boolean => {
    return favorites.some((item) => item.id === id)
  }

  // Add an item to favorites using GraphQL
  const addToFavorites = async (item: MediaItem): Promise<{ success: boolean; error?: string }> => {
    if (!isAuthenticated) {
      Alert.alert(
        "Authentication Required",
        "You must be signed in to add items to your watchlist. Would you like to sign in now?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Sign In",
            onPress: navigateToLoginProp,
          },
        ],
      )
      return {
        success: false,
        error: "You must be signed in to add items to your watchlist",
      }
    }

    // Check if the item is already in favorites to prevent duplicates
    if (isFavorite(item.id)) {
      console.log("Item already in watchlist, skipping add")
      return { success: true }
    }

    try {
      console.log("Adding item to watchlist:", item)
      const result = await addToWatchlist(item)
      console.log("Add to watchlist result:", result)

      if (result?.upsertItem?.id) {
        // Add the new item to the local state with the GraphQL ID
        const newItem = {
          ...item,
          watchlistId: result.upsertItem.id,
        }

        setFavorites((prev) => [...prev, newItem])
        return { success: true }
      } else {
        return {
          success: false,
          error: "Failed to add to watchlist",
        }
      }
    } catch (error) {
      console.error("Error adding to favorites:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      }
    }
  }

  // Remove an item from favorites using GraphQL
  // const removeFromFavorites = async (id: string): Promise<{ success: boolean; error?: string }> => {
  //   if (!isAuthenticated) {
  //     Alert.alert(
  //       "Authentication Required",
  //       "You must be signed in to remove items from your watchlist. Would you like to sign in now?",
  //       [
  //         {
  //           text: "Cancel",
  //           style: "cancel",
  //         },
  //         {
  //           text: "Sign In",
  //           onPress: navigateToLoginProp,
  //         },
  //       ],
  //     )
  //     return {
  //       success: false,
  //       error: "You must be signed in to remove items from your watchlist",
  //     }
  //   }

  //   try {
  //     console.log("Removing item from watchlist with ID:", id)
  //     const result = await removeFromWatchlist(id)
  //     console.log("Remove from watchlist result:", result)

  //     if (result?.upsertItem?.id) {
  //       // Remove the item from local state
  //       setFavorites((prev) => prev.filter((item) => item.watchlistId !== id))
  //       return { success: true }
  //     } else {
  //       return {
  //         success: false,
  //         error: "Failed to remove from watchlist",
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error removing from favorites:", error)
  //     return {
  //       success: false,
  //       error: error instanceof Error ? error.message : "An unexpected error occurred",
  //     }
  //   }
  // }



  const removeFromFavorites = async (id: string): Promise<{ success: boolean; error?: string }> => {
    if (!isAuthenticated) {
      Alert.alert(
        "Authentication Required",
        "You must be signed in to remove items from your watchlist. Would you like to sign in now?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Sign In", onPress: navigateToLoginProp }
        ]
      );
      return {
        success: false,
        error: "You must be signed in to remove items from your watchlist",
      };
    }
  
    try {
      console.log("Soft deleting item from watchlist with ID:", id);
      const result = await removeFromWatchlist(id);
      console.log("Soft delete result:", result);
  
      if (result?.upsertItem?.id) {
        // Remove the item from local state
        setFavorites((prev) => prev.filter((item) => item.watchlistId !== id));
        return { success: true };
      } else {
        return {
          success: false,
          error: "Failed to remove from watchlist",
        };
      }
    } catch (error) {
      console.error("Error removing from favorites:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      };
    }
  };

  // Login function using Amplify
  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true)
      console.log("Attempting login with username:", username)

      const result = await amplifySignIn(username, password)
      console.log("Login result:", result)

      if (result.success) {
        // Get user details after successful login
        const userResult = await getCurrentUser()
        console.log("User details after login:", userResult)

        if (userResult.success) {
          const userInfo = {
            username: userResult.user.username,
            email: userResult.user.attributes?.email || userResult.user.username,
          }
          console.log("Setting user info after login:", userInfo)
          setIsAuthenticated(true)
          setUser(userInfo)
          await loadWatchlist()
        } else {
          setIsAuthenticated(true)
          setUser({
            username: username,
            email: username,
          })
        }

        return { success: true }
      } else {
        return { success: false, error: result.error || "Login failed" }
      }
    } catch (error) {
      console.error("Login error:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Logout function using Amplify
  const logout = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log("Attempting to log out")
      const result = await amplifySignOut()
      console.log("Logout result:", result)

      if (result.success) {
        setIsAuthenticated(false)
        setUser({})
        setFavorites([])
        return { success: true }
      } else {
        return { success: false, error: result.error }
      }
    } catch (error) {
      console.error("Logout error:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      }
    }
  }

  const value = {
    favorites,
    isFavorite,
    addToFavorites,
    removeFromFavorites,
    isLoading,
    setIsLoading,
    isAuthenticated,
    setIsAuthenticated,
    login,
    logout,
    user,
    navigateToLogin: navigateToLoginProp,
    refreshWatchlist,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider")
  }
  return context
}
