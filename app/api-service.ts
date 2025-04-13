import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth"

const API_URL = "https://nlop9z9t2e.execute-api.eu-west-1.amazonaws.com/"

interface MovieData {
  title: string
  description: string
  releaseDate?: string
  rating?: string
  posterUrl?: string
}

export const makeGraphQLRequest = async (query: string, variables: Record<string, any> = {}) => {
  try {
   
    const user = await getCurrentUser()
    console.log("Current user:", user)

    if (!user) {
      throw new Error("No authenticated user found")
    }


    const session = await fetchAuthSession()
    console.log("Auth session:", session)

    if (!session) {
      throw new Error("No auth session found")
    }

  
    const idToken = session.tokens?.idToken?.toString()
    console.log("Auth token:", idToken)

    if (!idToken) {
      throw new Error("No ID token found in session")
    }

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

export const addToWatchlist = async (movieData: MovieData) => {
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

  const variables = {
    input: {
      name: movieData.title,
      content: movieData.description,
      metadata: {
        releaseDate: movieData.releaseDate,
        rating: movieData.rating,
        posterUrl: movieData.posterUrl,
      },
    },
  }

  return makeGraphQLRequest(mutation, variables)
}

// export const getWatchlist = async () => {
//   const query = `
//     query {
//       listItems {
//         items {
//           id
//           name
//           content
//           metadata
//         }
//       }
//     }
//   `

//   try {
//     const result = await makeGraphQLRequest(query)
//     console.log("Watchlist result:", result)
//     return result
//   } catch (error) {
//     console.error("Error fetching watchlist:", error)
//     throw error
//   }
// }


export const getWatchlist = async () => {
  const query = `
    query ListItems {
      listItems {
        id
        name
        content
        metadata
      }
    }
  `;

  const result = await makeGraphQLRequest(query);
  

  if (result?.listItems) {
    result.listItems = result.listItems.filter(
      (item: any) => !(item.metadata && item.metadata.isDeleted)
    );
  }
  
  return result;
};

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

export const removeFromWatchlist = async (id: string) => {
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

  const variables = {
    input: {
      id,
      name: "",
      content: "",
      metadata: {
        isDeleted: true,
        deletedAt: new Date().toISOString(),
      },
    },
  }

  return makeGraphQLRequest(mutation, variables)
}
