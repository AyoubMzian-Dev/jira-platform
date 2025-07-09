"use server"

import { cookies } from "next/headers"

export interface User {
  key: string
  name: string
  emailAddress: string
  displayName: string
  avatarUrls: {
    "48x48": string
  }
}

export interface ServiceDeskRequest {
  _expands: string[]
  issueId: string
  issueKey: string
  requestTypeId: string
  serviceDeskId: string
  createdDate: {
    iso8601: string
    jira: string
    friendly: string
    epochMillis: number
  }
  reporter: {
    name: string
    key: string
    emailAddress: string
    displayName: string
    active: boolean
    timeZone: string
    accountId?: string
    _links: {
      jiraRest: string
      avatarUrls: {
        "48x48": string
        "24x24": string
        "16x16": string
        "32x32": string
      }
      self: string
    }
  }
  requestFieldValues: Array<{
    fieldId: string
    label: string
    value: any
    renderedValue?: any[]
  }>
  currentStatus: {
    status: string
    statusDate: {
      iso8601: string
      jira: string
      friendly: string
      epochMillis: number
    }
  }
  _links: {
    jiraRest: string
    web: string
    self: string
  }
}

// Mock data for fallback when API fails or when explicitly enabled
const MOCK_USER: User = {
  key: "mock-user",
  name: "mockuser",
  emailAddress: "mock@example.com",
  displayName: "Mock User",
  avatarUrls: {
    "48x48": "/placeholder.svg",
  },
}

export async function login(formData: FormData) {
  const username = formData.get("username") as string
  const password = formData.get("password") as string

  if (!username || !password) {
    return { success: false, error: "Username and password are required" }
  }

  try {
    // Only use mock data if explicitly enabled
    if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true") {
      console.log("Using mock login (forced by environment variable)")
      // Store mock credentials in httpOnly cookie
      const cookieStore = await cookies()
      cookieStore.set("jira-auth", "mock-credentials", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })

      return { success: true, user: MOCK_USER }
    }

    // Default behavior: try real API
    console.log("Attempting real API login...")
    const credentials = btoa(`${username}:${password}`)

    const response = await fetch("https://jisr.marocpme.gov.ma/jira/rest/api/2/myself", {
      method: "GET",
      headers: {
        Authorization: `Basic ${credentials}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      console.error(`API login failed: ${response.status} ${response.statusText}`)
      return { success: false, error: "Invalid credentials" }
    }

    const user: User = await response.json()
    console.log("Real API login successful")

    // Store credentials in httpOnly cookie
    const cookieStore = await cookies()
    cookieStore.set("jira-auth", credentials, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return { success: true, user }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, error: "Connection failed. Please check your network and try again." }
  }
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete("jira-auth")
  return { success: true }
}

export async function getUser(): Promise<User | null> {
  try {
    // Only use mock data if explicitly enabled
    if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true") {
      console.log("Using mock user data (forced by environment variable)")
      return MOCK_USER
    }

    // Default behavior: try real API
    const cookieStore = await cookies()
    const credentials = cookieStore.get("jira-auth")?.value

    if (!credentials) {
      return null
    }

    // Skip API call if using mock credentials
    if (credentials === "mock-credentials") {
      return MOCK_USER
    }

    console.log("Fetching user from real API...")
    const response = await fetch("https://jisr.marocpme.gov.ma/jira/rest/api/2/myself", {
      method: "GET",
      headers: {
        Authorization: `Basic ${credentials}`,
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      console.error(`API user fetch failed: ${response.status} ${response.statusText}`)
      return null
    }

    const user = await response.json()
    console.log("Real API user fetch successful")
    return user
  } catch (error) {
    console.error("Get user error:", error)
    return null
  }
}

export async function getServiceDeskRequests(): Promise<ServiceDeskRequest[]> {
  try {
    // Default behavior: try real API
    const cookieStore = await cookies()
    const credentials = cookieStore.get("jira-auth")?.value

    if (!credentials) {
      throw new Error("Not authenticated")
    }

    console.log("Fetching service desk requests from real API...")
    const response = await fetch("https://jisr.marocpme.gov.ma/jira/rest/servicedeskapi/request/", {
      method: "GET",
      headers: {
        Authorization: `Basic ${credentials}`,
        Accept: "application/json",
      },
      // Add timeout to prevent hanging requests
      signal: AbortSignal.timeout(10000), // 10 second timeout
    })

    if (!response.ok) {
      console.error(`Failed to fetch service desk requests: ${response.status} ${response.statusText}`)
      throw new Error(`Failed to fetch service desk requests: ${response.status}`)
    }

    const data = await response.json()
    console.log("Real API service desk requests fetch successful")
    return data.values || []
  } catch (error) {
    console.error("Get service desk requests error:", error)
    return []
  }
}

/**
 * Deletes a service desk request
 * @param requestId - The issue key of the request to delete (e.g. "SD-123")
 * @returns Promise<void>
 * @throws Error if deletion fails
 */
export async function deleteServiceDeskRequest(requestId: string) {
  try {
    const cookieStore = await cookies()
    const credentials = cookieStore.get("jira-auth")?.value

    if (!credentials) {
      throw new Error("Not authenticated")
    }

    // Validate requestId format
    if (!requestId.match(/^[A-Z]+-\d+$/)) {
      throw new Error("Invalid request ID format. Expected format: PROJECT-123")
    }

    console.log(`Deleting service desk request ${requestId}...`)
    const response = await fetch(`https://jisr.marocpme.gov.ma/jira/rest/servicedeskapi/request/${requestId}/participant`, {
      method: "DELETE",
      headers: {
        Authorization: `Basic ${credentials}`,
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        usernames: [] // Empty array to remove all participants
      }),
      // Add timeout to prevent hanging requests
      signal: AbortSignal.timeout(10000) // 10 second timeout
    })

    if (response.status === 404) {
      throw new Error(`Request ${requestId} not found`)
    }

    if (response.status === 403) {
      throw new Error("You don't have permission to delete this request")
    }

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Failed to delete service desk request: ${response.status} ${response.statusText}`)
      console.error(`Error details: ${errorText}`)
      throw new Error(`Failed to delete service desk request: ${response.status} - ${errorText}`)
    }

    console.log(`Successfully deleted service desk request ${requestId}`)
  } catch (error) {
    console.error("Delete service desk request error:", error)
    throw error // Re-throw to handle in UI
  }
}