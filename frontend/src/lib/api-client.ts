"use client"

import { getSession } from "next-auth/react"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"

async function getAuthHeaders() {
  const session = await getSession()
  const token = (session?.user as any)?.accessToken
  
  return {
    "Authorization": token ? `Bearer ${token}` : "",
    "Content-Type": "application/json",
  }
}

export const apiClient = {
  async get(endpoint: string, options: RequestInit = {}) {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: { ...headers, ...options.headers },
    })
    return handleResponse(response, "GET")
  },

  async post(endpoint: string, data: any, options: RequestInit = {}) {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      ...options,
      headers: { ...headers, ...options.headers },
      body: JSON.stringify(data),
    })
    return handleResponse(response, "POST")
  },

  async put(endpoint: string, data: any, options: RequestInit = {}) {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PUT",
      ...options,
      headers: { ...headers, ...options.headers },
      body: JSON.stringify(data),
    })
    return handleResponse(response, "PUT")
  },

  async patch(endpoint: string, data: any, options: RequestInit = {}) {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PATCH",
      ...options,
      headers: { ...headers, ...options.headers },
      body: JSON.stringify(data),
    })
    return handleResponse(response, "PATCH")
  },

  async delete(endpoint: string, options: RequestInit = {}) {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "DELETE",
      ...options,
      headers: { ...headers, ...options.headers },
    })
    return handleResponse(response, "DELETE")
  }
}

import { toast } from "sonner"

// ... imports

async function handleResponse(response: Response, method?: string) {
  const isWriteRequest = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method || '');
  
  if (!response.ok) {
    if (response.status === 401) {
      if (typeof window !== "undefined") {
        window.location.href = "/auth/login?error=SessionExpired"
      }
    }
    
    const errorData = await response.json().catch(() => ({}))
    const errorMessage = errorData.message || `API Error: ${response.status}`
    
    // Trigger Toast Notification for Errors
    toast.error(errorMessage, {
      description: response.status === 403 ? "You don't have permission to perform this action." : undefined
    })
    
    throw new Error(errorMessage)
  }

  const data = await response.json()

  // Proactive Success Toasts for write operations
  if (isWriteRequest) {
    toast.success(data.message || "Operation successful")
  }

  return data
}
