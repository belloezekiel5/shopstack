import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck, User as UserIcon } from 'lucide-react';
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

  const handleQuickLogin = async (role: 'customer' | 'admin') => {
    try {
      setIsLoading(true);
      const demoEmail = role === 'admin' ? 'admin@shopstack.com' : 'customer@shopstack.com';
      await login(demoEmail, 'password123');
      success(`Logged in as Demo ${role === 'admin' ? 'Administrator' : 'Customer'}!`);
      navigate(role === 'admin' ? '/admin' : from, { replace: true });
    } catch (err: any) {
      error('Failed demo login');
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

        {/* Demo Fast Login Buttons */}
        <div className="space-y-2 pt-2">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 text-center">
            One-Click Demo Access
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('customer')}
              className="py-2.5 px-3 rounded-xl bg-gray-50 border border-gray-200 text-xs font-bold text-gray-800 hover:bg-[#FAF92A] hover:border-[#FDBF2D] hover:text-[#1A1A1A] transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Customer Demo</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('admin')}
              className="py-2.5 px-3 rounded-xl bg-gray-50 border border-gray-200 text-xs font-bold text-gray-800 hover:bg-[#FAF92A] hover:border-[#FDBF2D] hover:text-[#1A1A1A] transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Demo</span>
            </button>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-gray-100 w-full" />
          <span className="bg-white px-3 text-[11px] text-gray-400 uppercase font-bold absolute">
            or with email
          </span>
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
