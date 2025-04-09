"use client"

import { useState } from "react"
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import { CustomText } from "../components/CustomText"
import { useAppContext } from "../context/AppContext"
import { useRouter } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"

const { width, height } = Dimensions.get("window")

export const LoginScreen = () => {
  const router = useRouter()
  const { login, isLoading } = useAppContext()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter both email and password")
      return
    }

    setError("")

    try {
      const result = await login(email, password)

      if (result.success) {
        router.replace("/")
      } else {
        setError(result.error || "Login failed. Please check your credentials and try again.")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError(error instanceof Error ? error.message : "An unexpected error occurred")
    }
  }

  const handleBack = () => {
    router.back()
  }

  return (
    <ImageBackground
      source={{
        uri: "https://assets.nflxext.com/ffe/siteui/vlv3/9c5457b8-9ab0-4a04-9fc1-e608d5670f1a/710d74e0-7158-408e-8d9b-23c219dee5df/US-en-20210719-popsignuptwoweeks-perspective_alpha_website_small.jpg",
      }}
      style={styles.backgroundImage}
    >
      <StatusBar style="light" />
      <LinearGradient colors={["rgba(0,0,0,0.7)", "rgba(0,0,0,0.9)"]} style={styles.gradient}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.content}>
            <CustomText variant="title" style={styles.logo}>
              Gen<CustomText style={styles.logoHighlight}>Flix</CustomText>
            </CustomText>

            <CustomText variant="title" style={styles.title}>
              Sign In
            </CustomText>

            {error ? (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={20} color="#E50914" />
                <CustomText variant="caption" style={styles.error}>
                  {error}
                </CustomText>
              </View>
            ) : null}

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Email or phone number"
                placeholderTextColor="#888888"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#888888"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                editable={!isLoading}
              />
              <TouchableOpacity style={styles.passwordToggle} onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="#888888" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <CustomText variant="body" style={styles.buttonText}>
                  Sign In
                </CustomText>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.forgotPassword}>
              <CustomText variant="caption" style={styles.forgotPasswordText}>
                Forgot password?
              </CustomText>
            </TouchableOpacity>

            <View style={styles.signupContainer}>
              <CustomText variant="caption" style={styles.signupText}>
                New to GenFlix?
              </CustomText>
              <TouchableOpacity>
                <CustomText variant="caption" style={styles.signupLink}>
                  Sign up now
                </CustomText>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 20,
    left: 20,
    zIndex: 10,
  },
  content: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
    marginTop: height * 0.15,
  },
  logo: {
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 40,
  },
  logoHighlight: {
    color: "#E50914",
  },
  title: {
    color: "#FFFFFF",
    marginBottom: 24,
    fontSize: 32,
    fontWeight: "bold",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(229, 9, 20, 0.1)",
    padding: 12,
    borderRadius: 4,
    marginBottom: 16,
  },
  error: {
    color: "#E50914",
    marginLeft: 8,
  },
  inputContainer: {
    position: "relative",
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#333333",
    borderRadius: 4,
    padding: 16,
    color: "#FFFFFF",
    fontSize: 16,
  },
  passwordToggle: {
    position: "absolute",
    right: 16,
    top: 16,
  },
  button: {
    backgroundColor: "#E50914",
    borderRadius: 4,
    padding: 16,
    alignItems: "center",
    marginTop: 24,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  forgotPassword: {
    alignSelf: "center",
    marginTop: 16,
  },
  forgotPasswordText: {
    color: "#AAAAAA",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 32,
  },
  signupText: {
    color: "#AAAAAA",
    marginRight: 4,
  },
  signupLink: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
})
