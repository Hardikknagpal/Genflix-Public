"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { MediaItem } from "../services/tmdbApi"
import { Alert } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"

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

  // Check authentication status on app start
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user")
        if (storedUser) {
          const userData = JSON.parse(storedUser)
          setIsAuthenticated(true)
          setUser(userData)
          // Load favorites if authenticated
          loadFavorites()
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

    checkAuth()
  }, [])

  // Load favorites when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadFavorites()
    } else {
      setFavorites([])
    }
  }, [isAuthenticated])

  // Load favorites from AsyncStorage
  const loadFavorites = async () => {
    try {
      setIsLoading(true)
      const storedFavorites = await AsyncStorage.getItem("favorites")
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites))
      } else {
        setFavorites([])
      }
    } catch (error) {
      console.error("Error loading favorites:", error)
      setFavorites([])
    } finally {
      setIsLoading(false)
    }
  }

  // Check if an item is in favorites
  const isFavorite = (id: number): boolean => {
    return favorites.some((item) => item.id === id)
  }

  // Add an item to favorites
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

    try {
      const newFavorites = [...favorites, { ...item, watchlistId: Date.now().toString() }]
      await AsyncStorage.setItem("favorites", JSON.stringify(newFavorites))
      setFavorites(newFavorites)
      return { success: true }
    } catch (error) {
      console.error("Error adding to favorites:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      }
    }
  }

  // Remove an item from favorites
  const removeFromFavorites = async (id: string): Promise<{ success: boolean; error?: string }> => {
    if (!isAuthenticated) {
      Alert.alert(
        "Authentication Required",
        "You must be signed in to remove items from your watchlist. Would you like to sign in now?",
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
        error: "You must be signed in to remove items from your watchlist",
      }
    }

    try {
      const newFavorites = favorites.filter((item) => item.watchlistId !== id)
      await AsyncStorage.setItem("favorites", JSON.stringify(newFavorites))
      setFavorites(newFavorites)
      return { success: true }
    } catch (error) {
      console.error("Error removing from favorites:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      }
    }
  }

  // Login function
  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true)
      console.log("Attempting login with username:", username)
      
      // For demo purposes, accept any non-empty username/password
      if (username && password) {
        const userData = { username, email: username }
        await AsyncStorage.setItem("user", JSON.stringify(userData))
        setIsAuthenticated(true)
        setUser(userData)
        await loadFavorites()
        return { success: true }
      } else {
        return { success: false, error: "Invalid credentials" }
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

  // Logout function
  const logout = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      await AsyncStorage.removeItem("user")
      await AsyncStorage.removeItem("favorites")
      setIsAuthenticated(false)
      setUser({})
      setFavorites([])
      return { success: true }
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
