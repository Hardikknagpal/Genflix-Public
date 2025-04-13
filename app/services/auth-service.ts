import { Amplify } from "aws-amplify"
import {
  signIn as amplifySignIn,
  signOut as amplifySignOut,
  getCurrentUser as amplifyGetCurrentUser,
  fetchAuthSession,
} from "aws-amplify/auth"
import awsconfig from "./aws-exports"

// Configure Amplify
export const configureAmplify = () => {
  try {
    Amplify.configure(awsconfig)
    console.log("Amplify configured successfully")
  } catch (error) {
    console.error("Error configuring Amplify:", error)
    throw error
  }
}

// Check if user is already authenticated
export const checkAuthStatus = async () => {
  try {
    const { tokens } = await fetchAuthSession()
    return {
      isAuthenticated: true,
      tokens: {
        idToken: tokens.idToken.toString(),
        accessToken: tokens.accessToken.toString(),
        refreshToken: tokens.refreshToken?.toString(),
      },
    }
  } catch (error) {
    return { isAuthenticated: false }
  }
}

// Sign in with username and password
export const signIn = async (username: string, password: string) => {
  try {
    console.log("Attempting to sign in with username:", username)
    const signInResult = await amplifySignIn({
      username,
      password,
      options: {
        authFlowType: "USER_PASSWORD_AUTH",
      },
    })

    console.log("Sign in result:", signInResult)

    if (signInResult.isSignedIn) {
      return {
        success: true,
        user: { username },
        nextStep: signInResult.nextStep,
      }
    } else {
      return {
        success: false,
        error: "Sign in was not successful",
        nextStep: signInResult.nextStep,
      }
    }
  } catch (error: any) {
    console.error("Detailed error signing in:", error)
    // Check for specific error types
    if (error.name === "UserNotConfirmedException") {
      return {
        success: false,
        error: "User is not confirmed. Please check your email for confirmation code.",
        code: "UserNotConfirmed",
      }
    } else if (error.name === "NotAuthorizedException") {
      return {
        success: false,
        error: "Incorrect username or password.",
        code: "NotAuthorized",
      }
    } else if (error.name === "UserNotFoundException") {
      return {
        success: false,
        error: "User does not exist.",
        code: "UserNotFound",
      }
    } else if (error.name === "UserAlreadyAuthenticatedException") {
      // If user is already authenticated, sign them out and try again
      await signOut()
      return signIn(username, password)
    }
    return {
      success: false,
      error: error.message || "Failed to sign in",
      code: error.name || "Unknown",
    }
  }
}

// Get current authenticated user
export const getCurrentUser = async () => {
  try {
    const user = await amplifyGetCurrentUser()
    return { success: true, user }
  } catch (error) {
    console.error("Error getting current user:", error)
    return { success: false, error: error instanceof Error ? error.message : "No authenticated user" }
  }
}

// Get JWT tokens
export const getCurrentSession = async () => {
  try {
    const { tokens } = await fetchAuthSession()
    return {
      success: true,
      idToken: tokens.idToken.toString(),
      accessToken: tokens.accessToken.toString(),
      refreshToken: tokens.refreshToken?.toString(),
    }
  } catch (error) {
    console.error("Error getting current session:", error)
    return { success: false, error: error instanceof Error ? error.message : "No active session" }
  }
}

// Sign out
export const signOut = async () => {
  try {
    await amplifySignOut()
    return { success: true }
  } catch (error) {
    console.error("Error signing out:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to sign out" }
  }
}
