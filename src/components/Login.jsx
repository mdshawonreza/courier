
import { Mail, Package } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Login = ({ onLogin }) => {
  
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 

  useEffect(() => {
    // Load users data
    fetch('https://api.packerpanda.store/users')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error loading users:', error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Find user
    const user = users.find(u =>
      u.email === credentials.email && u.password === credentials.password
    );

    if (user) {
      onLogin(user);
    } else {
      setError('Invalid email or password');
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col gap-8 items-center justify-center p-4">
      <div className="text-center animate-bounce-in mt-0">
        <div className="flex justify-center">
          <div className="bg-blue-600 p-3 rounded-full">
            <Package className="h-12 w-12 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          Welcome back
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Sign in to your Courier Management account
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md transform transition-all duration-300 hover:scale-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="mt-1 relative text-black">
              <input
                type="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-black bg-white"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={credentials.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-black bg-white pr-12"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-9 right-3 text-gray-500 hover:text-blue-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5 mt-1.5" /> : <Eye className="w-5 h-5 mt-1.5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg animate-pulse">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Signing in...
              </div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </div>
       {/* <div className="mt-8 text-center">
        <div className="text-sm text-gray-600">
          <p className="mb-2">Demo Accounts:</p>
        <div className="space-y-1 text-xs">
           <p><strong>Admin:</strong> tuhan@gmail.com / 12345678</p>
            <p><strong>Merchant:</strong> irfan@gmail.com / 12345678</p>
            <p><strong>Booking Operator:</strong> forhad@gmail.com / 12345678</p>
           <p><strong>Accounts:</strong> najib@gmail.com / 12345678</p>
           <p><strong>Call Center:</strong> rifat@gmail.com / 12345678</p>
          </div>         </div>
       </div> */}
    </div>
  );
};

export default Login;
