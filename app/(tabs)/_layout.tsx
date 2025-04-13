import { Tabs } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { useColorScheme } from "react-native"

export default function TabLayout() {
  const colorScheme = useColorScheme()

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#E50914",
        tabBarInactiveTintColor: "#888",
        tabBarStyle: {
          backgroundColor: "#121212",
          borderTopColor: "#333",
        },
        headerShown: false, 
        headerStyle: {
          backgroundColor: "#121212",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color, size }) => <Ionicons name="search" size={size} color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "My List",
          tabBarIcon: ({ color, size }) => <Ionicons name="bookmark" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
        }}
      />
    </Tabs>
  )
}
