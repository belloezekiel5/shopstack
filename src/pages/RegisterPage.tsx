import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, User, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';
import { ShopStackLogo } from '../components/common/ShopStackLogo';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { success, error } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      error('Please complete all registration fields.');
      return;
    }
    if (!agreeTerms) {
      error('Please agree to terms and privacy policy.');
      return;
    }

    try {
      setIsLoading(true);
      await register(name, email, password);
      success('Account created successfully! Welcome to ShopStack.');
      navigate('/');
    } catch (err: any) {
      error(err.message || 'Registration failed. Try another email.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F9F9F9]">
      <div className="w-full max-w-md bg-white rounded-3xl border border-gray-100 p-8 shadow-xs space-y-6">
        {/* Header */}
        <div className="text-center space-y-3 flex flex-col items-center">
          <Link to="/" className="inline-block group">
            <ShopStackLogo size="lg" />
          </Link>
          <div>
            <h2 className="text-lg font-bold text-[#1A1A1A]">Create your account</h2>
            <p className="text-xs text-gray-400">Join ShopStack for fast checkout & exclusive deals.</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="e.g. Jordan Lee"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs py-2.5 pl-9 pr-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FDBF2D] text-[#1A1A1A]"
              />
              <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

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
            <label className="block text-xs font-bold text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs py-2.5 pl-9 pr-10 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FDBF2D] text-[#1A1A1A]"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                title={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-2.5 p-0.5 text-gray-400 hover:text-[#1A1A1A] transition-colors rounded-md focus:outline-none cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="agree-terms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="w-4 h-4 rounded text-[#1A1A1A] accent-[#FAF92A] focus:ring-0"
            />
            <label htmlFor="agree-terms" className="text-xs text-gray-500 select-none cursor-pointer">
              I agree to the Terms of Service and Privacy Policy
            </label>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full text-xs"
            isLoading={isLoading}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Create Account
          </Button>
        </form>

        <p className="text-center text-xs text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-[#1A1A1A] hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};
