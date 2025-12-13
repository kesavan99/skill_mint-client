import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const EmailConfirmation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Parse email and token from URL
    // Check continueUrl first (from Firebase redirect)
    const continueUrl = searchParams.get('continueUrl');
    if (continueUrl) {
      try {
        const url = new URL(continueUrl);
        const emailFromUrl = url.searchParams.get('email');
        const tokenFromUrl = url.searchParams.get('token');
        if (emailFromUrl) setEmail(decodeURIComponent(emailFromUrl));
        if (tokenFromUrl) setToken(tokenFromUrl);
      } catch (err) {
        console.error('Error parsing continueUrl:', err);
      }
    }
    
    // Fallback to direct params
    if (!email || !token) {
      const directEmail = searchParams.get('email');
      const directToken = searchParams.get('token');
      if (directEmail && directEmail !== '%EMAIL%') setEmail(decodeURIComponent(directEmail));
      if (directToken) setToken(directToken);
    }
  }, [searchParams]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    if (!email || !token) {
      setError('Invalid confirmation link.');
      return;
    }

    setLoading(true);

    try {
      // Verify email with password - no authentication required
      const response = await fetch(`${BASE_URL}/skill-mint/confirm-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, token, password })
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        // Redirect to login page with success message
        navigate('/login?verified=true');
      } else {
        setError(data.message || 'Confirmation failed. Please check your password.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
      console.error('Email confirmation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-5" style={{ backgroundColor: '#ffffff' }}>
      <div className="w-full max-w-md card animate-slide-in">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <img src="/logo.png" alt="SkillMint Logo" className="h-12" style={{ width: 'auto' }} />
          </div>
          <h2 className="text-3xl font-bold mb-4" style={{ color: '#19B86B' }}>
            Confirm Your Email
          </h2>
          <p className="text-sm text-gray-600">
            Enter your password to activate your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {error && (
            <div className="banner-error animate-shake">
              {error}
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
              value={email || ''}
              disabled
              className="input bg-gray-100"
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
              className="input"
            />
            <p className="text-xs text-gray-500">
              Enter the password you used during signup
            </p>
          </div>

          <button 
            type="submit" 
            className="mt-3 btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Confirming...' : 'Confirm & Activate Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            type="button" 
            className="text-sm font-semibold transition-colors duration-200 hover:underline"
            style={{ color: '#19B86B' }}
            onClick={() => navigate('/login')}
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailConfirmation;
