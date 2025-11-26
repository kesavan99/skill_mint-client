import axios from 'axios';

// Ensure axios sends cookies by default for cross-site requests
axios.defaults.withCredentials = true;

/**
 * Helper function to make authenticated API requests
 * Automatically includes credentials (cookies) and authorization header
 */
export const authenticatedFetch = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  
  // Merge headers
  const headers = {
    ...defaultHeaders,
    ...(options.headers as Record<string, string>),
  };
  
  // Make request with credentials to send/receive cookies
  return fetch(url, {
    ...options,
    credentials: 'include', // Important: send cookies
    headers,
  });
};

/**
 * Example usage for protected routes:
 * 
 * const response = await authenticatedFetch('http://localhost:3000/skill-mint/protected-route', {
 *   method: 'GET'
 * });
 */
