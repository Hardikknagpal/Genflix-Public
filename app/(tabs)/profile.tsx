import { View, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { CustomText } from "../components/CustomText"
import { Ionicons } from "@expo/vector-icons"
import { useAppContext } from "../context/AppContext"
import { useRouter } from "expo-router"
import { getCurrentSession, getCurrentUser } from "../services/auth-service"
import { useState, useEffect } from "react"

export default function ProfileScreen() {
  const { isAuthenticated, user, logout } = useAppContext()
  const router = useRouter()
  const [tokens, setTokens] = useState<{ idToken?: string; accessToken?: string }>({})
  const [userDetails, setUserDetails] = useState<{ username?: string; email?: string }>({})

  useEffect(() => {
    if (isAuthenticated) {
      fetchTokens()
      fetchUserDetails()
    }
  }, [isAuthenticated])

  // Set user details from context when it changes
  useEffect(() => {
    if (user && (user.username || user.email)) {
      console.log("Setting user details from context:", user)
      setUserDetails(user)
    }
  }, [user])

  const fetchUserDetails = async () => {
    try {
      const userResult = await getCurrentUser()
      if (userResult.success && userResult.user) {
        const details = {
          username: userResult.user.username,
          email: userResult.user.attributes?.email || userResult.user.username,
        }
        console.log("Fetched user details:", details)
        setUserDetails(details)
      }
    } catch (error) {
      console.error("Error fetching user details:", error)
    }
  }

  const fetchTokens = async () => {
    try {
      const session = await getCurrentSession()
      if (session.success) {
        setTokens({
          idToken: session.idToken,
          accessToken: session.accessToken,
        })
      }
    } catch (error) {
      console.error("Error fetching tokens:", error)
    }
  }

  const handleLogin = () => {
    router.push("/login")
  }

  const handleLogout = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          const result = await logout()
          if (result.success) {
            router.replace("/")
          } else {
            Alert.alert("Error", result.error || "Failed to sign out")
          }
        },
      },
    ])
  }

  const showTokenInfo = () => {
    if (tokens.idToken) {
      Alert.alert(
        "Authentication Tokens",
        `ID Token (first 20 chars): ${tokens.idToken.substring(0, 20)}...\n\nAccess Token (first 20 chars): ${tokens.accessToken?.substring(0, 20)}...`,
        [{ text: "OK" }],
      )
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "right", "left"]}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <CustomText variant="title" style={styles.headerTitle}>
            My Profile
          </CustomText>
        </View>

        <View style={styles.profileSection}>
          <Image
            source={{
              uri: isAuthenticated
                ? "https://ui-avatars.com/api/?name=" + encodeURIComponent(userDetails.username || "User")
                : "https://ui-avatars.com/api/?name=Guest&background=E50914&color=fff",
            }}
            style={styles.avatar}
          />

          <View style={styles.profileInfo}>
            <CustomText variant="title" style={styles.userName}>
              {isAuthenticated ? userDetails.username || "User" : "Guest"}
            </CustomText>

            <CustomText variant="caption" style={styles.userEmail}>
              {isAuthenticated ? userDetails.email : "Not signed in"}
            </CustomText>
          </View>
        </View>

        <View style={styles.menuSection}>
          {isAuthenticated ? (
            <>
              <TouchableOpacity style={styles.menuItem}>
                <Ionicons name="settings-outline" size={24} color="#FFFFFF" />
                <CustomText style={styles.menuItemText}>Account Settings</CustomText>
                <Ionicons name="chevron-forward" size={20} color="#666666" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem} onPress={() => router.push("/favorites")}>
                <Ionicons name="bookmark-outline" size={24} color="#FFFFFF" />
                <CustomText style={styles.menuItemText}>My Watchlist</CustomText>
                <Ionicons name="chevron-forward" size={20} color="#666666" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem}>
                <Ionicons name="time-outline" size={24} color="#FFFFFF" />
                <CustomText style={styles.menuItemText}>Watch History</CustomText>
                <Ionicons name="chevron-forward" size={20} color="#666666" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem} onPress={showTokenInfo}>
                <Ionicons name="key-outline" size={24} color="#FFFFFF" />
                <CustomText style={styles.menuItemText}>Authentication Info</CustomText>
                <Ionicons name="chevron-forward" size={20} color="#666666" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={24} color="#E50914" />
                <CustomText style={[styles.menuItemText, styles.logoutText]}>Sign Out</CustomText>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Ionicons name="log-in-outline" size={24} color="#FFFFFF" />
              <CustomText style={styles.loginButtonText}>Sign In</CustomText>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.appInfoSection}>
          <CustomText variant="subtitle" style={styles.sectionTitle}>
            App Information
          </CustomText>

          <View style={styles.infoItem}>
            <CustomText style={styles.infoLabel}>Version</CustomText>
            <CustomText style={styles.infoValue}>1.0.0</CustomText>
          </View>

          <View style={styles.infoItem}>
            <CustomText style={styles.infoLabel}>Build</CustomText>
            <CustomText style={styles.infoValue}>2023.1</CustomText>
          </View>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="help-circle-outline" size={24} color="#FFFFFF" />
            <CustomText style={styles.menuItemText}>Help & Support</CustomText>
            <Ionicons name="chevron-forward" size={20} color="#666666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="document-text-outline" size={24} color="#FFFFFF" />
            <CustomText style={styles.menuItemText}>Terms of Service</CustomText>
            <Ionicons name="chevron-forward" size={20} color="#666666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="shield-outline" size={24} color="#FFFFFF" />
            <CustomText style={styles.menuItemText}>Privacy Policy</CustomText>
            <Ionicons name="chevron-forward" size={20} color="#666666" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingTop: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
  },
  profileSection: {
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  profileInfo: {
    alignItems: "center",
  },
  userName: {
    fontSize: 24,
    marginBottom: 4,
  },
  userEmail: {
    color: "#AAAAAA",
  },
  menuSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
  },
  menuItemText: {
    flex: 1,
    marginLeft: 16,
    fontSize: 16,
  },
  logoutText: {
    color: "#E50914",
  },
  loginButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E50914",
    padding: 16,
    borderRadius: 8,
    marginVertical: 16,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  appInfoSection: {
    padding: 16,
  },
  sectionTitle: {
    marginBottom: 16,
    color: "#AAAAAA",
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
  },
  infoLabel: {
    color: "#AAAAAA",
  },
  infoValue: {
    color: "#FFFFFF",
  },
})
