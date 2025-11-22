import { AUTH_API } from '../client-configuration/home-API';

export interface LoginCredentials {
  email: string;
  password: string;
  newOne: boolean;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  newOne: boolean;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: unknown;
  token?: string;
}

/**
 * Login service - calls the login API endpoint
 */
export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    credentials.newOne = false;
    const response = await fetch(AUTH_API.LOGIN.url, {
      method: AUTH_API.LOGIN.method,
      headers: AUTH_API.LOGIN.headers,
      credentials: 'include',
      body: JSON.stringify(credentials)
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Login failed'
      };
    }

    // Store token if provided
    if (data.token) {
      localStorage.setItem('authToken', data.token);
    }

    return {
      success: true,
      data,
      token: data.token
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Network error occurred'
    };
  }
};

/**
 * Signup service - calls the signup API endpoint
 */
export const signupUser = async (signupData: SignupData): Promise<AuthResponse> => {
  try {
    signupData.newOne = true;
    const response = await fetch(AUTH_API.SIGNUP.url, {
      method: AUTH_API.SIGNUP.method,
      credentials: 'include',
      headers: AUTH_API.SIGNUP.headers,
      body: JSON.stringify(signupData)
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Signup failed'
      };
    }

    // Store token if provided
    if (data.token) {
      localStorage.setItem('authToken', data.token);
    }

    return {
      success: true,
      data,
      token: data.token
    };
  } catch (error) {
    console.error('Signup error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Network error occurred'
    };
  }
};

/**
 * Logout service - clears stored authentication token
 */
export const logoutUser = (): void => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userName');
};

/**
 * Google login service - sends Google user data to backend
 */
export const googleLogin = async (googleUserData: {
  email: string;
  name: string;
  googleId: string;
  profilePicture?: string;
}): Promise<AuthResponse> => {
  try {
    const response = await fetch(AUTH_API.GOOGLE_LOGIN.url, {
      method: AUTH_API.GOOGLE_LOGIN.method,
      headers: AUTH_API.GOOGLE_LOGIN.headers,
      credentials: 'include',
      body: JSON.stringify(googleUserData)
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Google login failed'
      };
    }

    // Store token if provided
    if (data.token) {
      localStorage.setItem('authToken', data.token);
    }

    return {
      success: true,
      data,
      token: data.token
    };
  } catch (error) {
    console.error('Google login error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Network error occurred'
    };
  }
};
