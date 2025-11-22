import { useState, type FormEvent } from 'react';
import { loginUser, signupUser } from '../service/authService';
import { signInWithGooglePopup } from '../service/firebaseAuthService';

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    
    try {
      const result = await signInWithGooglePopup();
      const user = result.user;
      
      // Get the ID token from Firebase
      const idToken = await user.getIdToken();
      
      // Store token in localStorage
      localStorage.setItem('authToken', idToken);
      localStorage.setItem('userEmail', user.email || '');
      localStorage.setItem('userName', user.displayName || '');
      
      // You can also send this token to your backend for verification
      console.log('Google Sign-In successful:', {
        email: user.email,
        name: user.displayName,
        uid: user.uid
      });
      
      // Redirect to home page
      window.location.href = '/home';
    } catch (err) {
      console.error('Google Sign-In error:', err);
      if (err instanceof Error) {
        // Handle specific Firebase errors
        if (err.message.includes('popup-closed-by-user')) {
          setError('Sign-in cancelled. Please try again.');
        } else if (err.message.includes('network-request-failed')) {
          setError('Network error. Please check your connection.');
        } else {
          setError('Failed to sign in with Google. Please try again.');
        }
      } else {
        setError('An unexpected error occurred with Google Sign-In.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (isSignUp) {
      // Validate passwords match
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }

      // Validate password length
      if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }
    }

    setLoading(true);

    try {
      const result = isSignUp
        ? await signupUser({ name, email, password, newOne: true })
        : await loginUser({ email, password, newOne: true });

      if (result.success) {
        // Redirect to Home page on success
        window.location.href = '/home';
      } else {
        setError(result.message || `${isSignUp ? 'Signup' : 'Login'} failed. Please try again.`);
      }
    } catch (err) {
      setError('An unexpected error occurred.');
      console.error(`${isSignUp ? 'Signup' : 'Login'} error:`, err);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-5" style={{ backgroundColor: '#ffffff' }}>
      <div className="w-full max-w-md card animate-slide-in">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <img src="/logo.png" alt="SkillMint Logo" className="h-12" style={{ width: 'auto' }} />
          </div>
          <h2 className="text-3xl font-bold" style={{ color: '#19B86B' }}>
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {error && (
            <div className="banner-error animate-shake">
              {error}
            </div>
          )}
          
          {isSignUp && (
            <div className="flex flex-col gap-2">
              <label 
                htmlFor="name"
                className="text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
                disabled={loading}
                className="input"
              />
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label 
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={loading}
              className="input"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label 
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={loading}
              minLength={isSignUp ? 6 : undefined}
              className="input"
            />
          </div>

          {isSignUp && (
            <div className="flex flex-col gap-2">
              <label 
                htmlFor="confirmPassword"
                className="text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
                disabled={loading}
                minLength={6}
                className="input"
              />
            </div>
          )}

          <button 
            type="submit" 
            className="mt-3 btn btn-primary"
            disabled={loading}
          >
            {loading 
              ? (isSignUp ? 'Creating account...' : 'Signing in...') 
              : (isSignUp ? 'Sign Up' : 'Sign In')
            }
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 text-gray-500 bg-white">Or continue with</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border-2 border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-all duration-200 font-medium text-gray-700 hover:border-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign {isSignUp ? 'up' : 'in'} with Google
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button 
              type="button" 
              className="font-semibold transition-colors duration-200 hover:underline disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ color: '#19B86B' }}
              onClick={toggleMode}
              disabled={loading}
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
