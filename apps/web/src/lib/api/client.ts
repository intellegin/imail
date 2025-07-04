export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://imail-production.up.railway.app/api'

export const apiRequest = async <T>(
  endpoint: string,
  options?: RequestInit,
  accessToken?: string
): Promise<T> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers,
    ...options,
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}
