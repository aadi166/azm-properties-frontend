import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import apiService from '../../services/api.js';

// This component is standalone and should not render navbar or footer
const AdminLogin = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  // Check if admin is already logged in
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!credentials || !credentials.email || !credentials.password) {
        throw new Error('Email and password are required');
      }
      
      console.log('Login form submitted with:', credentials);
      
      // Call real API service for authentication
      const data = await apiService.realAdminLogin(credentials);
      
      if (!data.success) {
        throw new Error(data.message || 'Login failed');
      }
      
      // Token and user data are already stored in the realAdminLogin function
      // But we can also access them from the response
      console.log('Login successful, token:', data.token);
      console.log('User data:', data.admin);
      
      toast.success(data.message || 'Login successful!', {
        style: {
          background: '#1F2937',
          color: '#F3E8D6',
          border: '1px solid rgba(251, 191, 36, 0.3)',
        },
      });
      setTimeout(() => navigate('/admin/dashboard'), 1000);
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = 'Invalid email or password. Please try again.';
      
      if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage, {
        style: {
          background: '#1F2937',
          color: '#F3E8D6',
          border: '1px solid rgba(251, 191, 36, 0.3)',
        },
      });
    } finally {
      setLoading(false);
    }
  };


  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white/10 backdrop-blur-lg p-8 rounded-xl shadow-2xl border border-yellow-200/20 animate-fade-in">
        <div className="text-center">
          <h2 className="mt-6 text-4xl font-bold text-white tracking-tight">
            AMZ Properties
          </h2>
          <p className="mt-2 text-sm text-yellow-200">
            Admin Panel Access
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-4 py-3 bg-gray-800/50 border border-yellow-200/30 rounded-lg text-white placeholder-yellow-200/70 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300"
              placeholder="Email address"
              value={credentials.email}
              onChange={handleChange}
              aria-label="Email address"
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-4 py-3 bg-gray-800/50 border border-yellow-200/30 rounded-lg text-white placeholder-yellow-200/70 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300"
              placeholder="Password"
              value={credentials.password}
              onChange={handleChange}
              aria-label="Password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center py-3 px-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-medium rounded-lg hover:from-yellow-500 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            aria-label="Sign in"
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 mr-3 text-gray-900"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8h8a8 8 0 11-16 0z"
                />
              </svg>
            ) : null}
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
          <p className="text-center text-sm text-yellow-200">
            Test credentials: admin@mail.com / Alchohol@123
          </p>
        </form>
      </div>
      <Toaster position="top-right" />
    </div>
  );
};

export default AdminLogin;