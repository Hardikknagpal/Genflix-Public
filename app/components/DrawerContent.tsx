"use client"
import { View, StyleSheet, Image, TouchableOpacity, Dimensions } from "react-native"
import { DrawerContentScrollView } from "@react-navigation/drawer"
import { useRouter } from "expo-router"
import { CustomText } from "./CustomText"
import { Ionicons } from "@expo/vector-icons"
import { useAppContext } from "../context/AppContext"
import { LinearGradient } from "expo-linear-gradient"

const { width } = Dimensions.get("window")

export const DrawerContent = (props: any) => {
  const router = useRouter()
  const { isAuthenticated, logout, user } = useAppContext()

  const menuItems = [
    { name: "Home", icon: "home", route: "/(tabs)" as const },
    { name: "Movies", icon: "film", route: "/movies" as const },
    { name: "TV Shows", icon: "tv", route: "/tv" as const },
    { name: "My List", icon: "heart", route: "/favorites" as const },
    { name: "Search", icon: "search", route: "/search" as const },
    { name: "Settings", icon: "settings", route: "/settings" as const },
  ]

  const handleNavigation = (route: string) => {
    router.push(route)
    props.navigation.closeDrawer()
  }

  const handleLogout = async () => {
    await logout()
    router.push("/login")
    props.navigation.closeDrawer()
  }

  return (
    <DrawerContentScrollView {...props} style={styles.container}>
      <LinearGradient
        colors={["#E50914", "#1A1A1A"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.2 }}
        style={styles.gradient}
      >
        <View style={styles.drawerContent}>
          <View style={styles.userInfoSection}>
            <View style={styles.userImageContainer}>
              <Image source={{ uri: "https://via.placeholder.com/100" }} style={styles.userImage} />
            </View>
            <CustomText variant="title" style={styles.userName}>
              {isAuthenticated ? user?.username || "User Name" : "Guest"}
            </CustomText>
            <CustomText variant="caption" style={styles.userEmail}>
              {isAuthenticated ? user?.email || "user@example.com" : "Sign in to access your account"}
            </CustomText>
          </View>

          <View style={styles.drawerItemsContainer}>
            {menuItems.map((item, index) => (
              <TouchableOpacity key={index} style={styles.drawerItem} onPress={() => handleNavigation(item.route)}>
                <Ionicons name={item.icon as any} size={22} color="#FFFFFF" />
                <CustomText style={styles.drawerItemText}>{item.name}</CustomText>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.bottomDrawerSection}>
            <TouchableOpacity style={styles.drawerItem}>
              <Ionicons name="help-circle-outline" size={22} color="#FFFFFF" />
              <CustomText style={styles.drawerItemText}>Help & Support</CustomText>
            </TouchableOpacity>
            {isAuthenticated ? (
              <TouchableOpacity style={styles.drawerItem} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={22} color="#FFFFFF" />
                <CustomText style={styles.drawerItemText}>Sign Out</CustomText>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.drawerItem} onPress={() => handleNavigation("/login")}>
                <Ionicons name="log-in-outline" size={22} color="#FFFFFF" />
                <CustomText style={styles.drawerItemText}>Sign In</CustomText>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.footer}>
            <CustomText variant="caption" style={styles.footerText}>
              GenFlix v1.0.0
            </CustomText>
          </View>
        </View>
      </LinearGradient>
    </DrawerContentScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1A1A1A",
  },
  gradient: {
    flex: 1,
  },
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
  },
  userImageContainer: {
    marginBottom: 10,
  },
  userImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  userName: {
    fontSize: 18,
    marginTop: 10,
    color: "#FFFFFF",
  },
  userEmail: {
    fontSize: 14,
    color: "#AAAAAA",
    marginTop: 5,
  },
  drawerItemsContainer: {
    flex: 1,
    paddingTop: 10,
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 5,
    marginHorizontal: 10,
    marginVertical: 2,
  },
  drawerItemText: {
    marginLeft: 15,
    fontSize: 16,
    color: "#FFFFFF",
  },
  bottomDrawerSection: {
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: "#333333",
    marginTop: 10,
  },
  footer: {
    padding: 20,
    alignItems: "center",
  },
  footerText: {
    color: "#666666",
  },
})

