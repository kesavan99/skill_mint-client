import { 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  signOut,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  type User,
  type UserCredential
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import { googleLogin } from './authService';

/**
 * Sign in with Google using popup and save to backend
 * @returns Promise with user credentials
 */
export const signInWithGooglePopup = async (): Promise<UserCredential> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    
    // Send user data to backend
    const user = result.user;
    await googleLogin({
      email: user.email!,
      name: user.displayName || '',
      googleId: user.uid,
      profilePicture: user.photoURL || undefined
    });
    
    return result;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

/**
 * Sign in with Google using redirect
 * Use this for mobile devices where popup might not work well
 */
export const signInWithGoogleRedirect = async (): Promise<void> => {
  try {
    await signInWithRedirect(auth, googleProvider);
  } catch (error) {
    console.error('Error signing in with Google redirect:', error);
    throw error;
  }
};

/**
 * Get the result of a redirect sign-in
 * Call this on page load to check if user just completed redirect sign-in
 */
export const getGoogleRedirectResult = async (): Promise<UserCredential | null> => {
  try {
    const result = await getRedirectResult(auth);
    return result;
  } catch (error) {
    console.error('Error getting redirect result:', error);
    throw error;
  }
};

/**
 * Sign out the current user
 */
export const signOutFirebase = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

/**
 * Get current authenticated user
 */
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

/**
 * Listen to auth state changes
 * @param callback Function to call when auth state changes
 */
export const onAuthStateChanged = (callback: (user: User | null) => void) => {
  return auth.onAuthStateChanged(callback);
};

/**
 * Create a new user with email and password and send verification email
 * @param email User's email
 * @param verificationUrl Custom verification URL to include in email
 * @returns Promise with user credentials
 */
export const createUserWithEmail = async (email: string, verificationUrl: string): Promise<UserCredential> => {
  try {
    // Create user in Firebase with a temporary password
    const tempPassword = 'TempPassword123!';
    const userCredential = await createUserWithEmailAndPassword(auth, email, tempPassword);
    
    // Send verification email with custom URL
    const actionCodeSettings = {
      url: verificationUrl,
      handleCodeInApp: true,
    };
    
    await sendEmailVerification(userCredential.user, actionCodeSettings);
    
    return userCredential;
  } catch (error) {
    console.error('Error creating user with email:', error);
    throw error;
  }
};

