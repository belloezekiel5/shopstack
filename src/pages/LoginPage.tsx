import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { success, error } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      error('Please enter your email and password.');
      return;
    }

    try {
      setIsLoading(true);
      await login(email, password);
      success('Signed in successfully!');
      navigate(from, { replace: true });
    } catch (err: any) {
      error(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F9F9F9]">
      <div className="w-full max-w-md bg-white rounded-3xl border border-gray-100 p-8 shadow-xs space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-block">
            <span className="text-2xl font-bold tracking-tight text-[#1A1A1A]">
              Shop<span className="text-[#FDBF2D]">Stack</span>
            </span>
          </Link>
          <h2 className="text-lg font-bold text-[#1A1A1A]">Welcome Back</h2>
          <p className="text-xs text-gray-400">Sign in to manage orders, wishlist, and profile.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs py-2.5 pl-9 pr-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FDBF2D] text-[#1A1A1A]"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-gray-700">Password</label>
              <span className="text-[11px] text-gray-400 hover:text-black cursor-pointer">
                Forgot?
              </span>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs py-2.5 pl-9 pr-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FDBF2D] text-[#1A1A1A]"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full text-xs"
            isLoading={isLoading}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Sign In
          </Button>
        </form>

        {/* Register link */}
        <p className="text-center text-xs text-gray-500">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-[#1A1A1A] hover:underline">
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
};
