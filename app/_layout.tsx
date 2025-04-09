"use client"

import { useEffect, useState } from "react"
import { Stack } from "expo-router"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { AppProvider } from "./context/AppContext"
import { View, Text, ActivityIndicator, Button } from "react-native"
import { SplashScreen } from "./components/SplashScreen"
import { useRouter } from "expo-router"


export default function Layout() {
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
    const [isReady, setIsReady] = useState(false)
    const router = useRouter()
  

   useEffect(() => {
      // Simulate splash screen delay
      const timer = setTimeout(() => {
        setIsReady(true)
      }, 2000)
  
      return () => clearTimeout(timer)
    }, [])


  useEffect(() => {

    const initializeApp = async () => {
      try {
        // Initialize app
      } catch (err) {
        console.error("Error initializing app:", err)
        setError(err instanceof Error ? err.message : "Unknown error initializing app")
      }
    }

    initializeApp()
  }, [retryCount])

  const handleRetry = () => {
    setError(null)
    setRetryCount((prev) => prev + 1)
  }

  const navigateToLogin = () => {
    router.push("/login")
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#000" }}>
        <Text style={{ color: "red", marginBottom: 10, fontSize: 18, textAlign: "center" }}>
          Error initializing app:
        </Text>
        <Text style={{textAlign: "center", color: "white", marginBottom: 20 }}>{error}</Text>
        <Button title="Retry" onPress={handleRetry} color="#E50914" />
      </View>
    )
  }

   if (!isReady) {
      return (
        <AppProvider navigateToLogin={navigateToLogin}>
          <SplashScreen onFinish={() => setIsReady(true)} />
        </AppProvider>
      )
    }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProvider navigateToLogin={navigateToLogin}>
        <Stack
          screenOptions={{
            // Set headerShown: false globally for all screens
            headerShown: false,
          }}
        >
          <Stack.Screen
            name="(drawer)"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="movie/[id]"
            options={{
              presentation: "card",
              animation: "slide_from_right",
              headerShown: false
            }}
          />
          <Stack.Screen
            name="login"
            options={{
              presentation: "modal",
              animation: "slide_from_bottom",
              headerShown: false
            }}
          />
        </Stack>
      </AppProvider>
    </GestureHandlerRootView>
  )
}