import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../service/authService';
import { signInWithGooglePopup, createUserWithEmail } from '../service/firebaseAuthService';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, signup } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Check if redirected after email verification
    if (searchParams.get('verified') === 'true') {
      setSuccess('Email verified successfully! You can now login.');
    }
  }, [searchParams]);

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    
    try {
      const result = await signInWithGooglePopup();
      const user = result.user;
      
      // Send Google sign-in data to backend
      const response = await fetch(`${BASE_URL}/skill-mint/google-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
          email: user.email, 
          name: user.displayName,
          googleId: user.uid
        })
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        // Check if user needs to set a password
        if (data.needsPassword) {
          // New Google user - redirect to password setup page
          navigate(`/google-set-password?email=${encodeURIComponent(user.email || '')}&name=${encodeURIComponent(user.displayName || '')}`);
        } else {
          // Existing user - store data and redirect to home with full page reload
          localStorage.setItem('userEmail', user.email || '');
          localStorage.setItem('userName', user.displayName || '');
          window.location.href = '/home';
        }
      } else {
        setError(data.message || 'Google sign-in failed. Please try again.');
      }
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

    // Prevent multiple submissions
    if (loading || isSubmitting) return;

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

      // Handle signup with email verification
      setLoading(true);
      setIsSubmitting(true);
      try {
        console.log('Starting signup process...');
        
        // Register user in backend with status = 'inactive'
        const response = await fetch(`${BASE_URL}/skill-mint/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ 
            name, 
            email, 
            password,
            newOne: true 
          })
        });

        const data = await response.json();

        if (response.ok && data.status === 'success') {
          console.log('Backend user created successfully');
          
          // Get verification token from response
          const token = data.data.verificationToken;
          
          try {
            // Create user in Firebase and send custom verification email
            const verificationUrl = `${window.location.origin}/login/token?email=${encodeURIComponent(email)}&token=${token}`;
            await createUserWithEmail(email, verificationUrl);
            console.log('Firebase email sent successfully');
          } catch (firebaseErr: any) {
            console.warn('Firebase email creation warning:', firebaseErr);
            // Continue even if Firebase fails - user is already created in backend
          }

          // Redirect to email verification page
          navigate(`/email-verification?email=${encodeURIComponent(email)}`);
        } else {
          setError(data.message || 'Signup failed. Please try again.');
          setLoading(false);
          setIsSubmitting(false);
        }
      } catch (err: any) {
        console.error('Signup error:', err);
        if (err.code === 'auth/email-already-in-use') {
          setError('This email is already registered. Please login instead.');
        } else {
          setError('Failed to create account. Please try again.');
        }
        setLoading(false);
        setIsSubmitting(false);
      } finally {
        // Don't reset here if navigation is happening
      }
    } else {
      // Handle login
      setLoading(true);
      try {
        const success = await login(email, password);

        if (success) {
          navigate('/home');
        } else {
          setError('Login failed. Please check your credentials.');
        }
      } catch (err) {
        setError('An unexpected error occurred.');
        console.error('Login error:', err);
      } finally {
        setLoading(false);
      }
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
          {success && (
            <div className="p-4 mb-4 text-sm rounded-lg bg-green-50 border border-green-200" style={{ color: '#19B86B' }}>
              {success}
            </div>
          )}
          
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
            disabled={loading || isSubmitting}
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
