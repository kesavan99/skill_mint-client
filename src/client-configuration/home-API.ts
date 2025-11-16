// API endpoints configuration for authentication

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export interface ApiEndpoint {
  url: string;
  method: string;
  headers: {
    'Content-Type': string;
    'Accept': string;
  };
}

export const AUTH_API = {
  LOGIN: {
    url: `${BASE_URL}/skill-mint/login`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  } as ApiEndpoint,
  SIGNUP: {
    url: `${BASE_URL}/skill-mint/signup`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  } as ApiEndpoint
};
