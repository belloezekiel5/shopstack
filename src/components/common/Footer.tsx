import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter } from 'lucide-react';
import { ShopStackLogo } from './ShopStackLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-gray-100 bg-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 flex flex-col md:flex-row items-center justify-between gap-6 text-[11px] text-gray-500">
        {/* Left: Brand Logo & Legal Links */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-left">
          <Link to="/" className="group">
            <ShopStackLogo size="sm" />
          </Link>
          <span className="text-gray-400">&copy; {new Date().getFullYear()} ShopStack. All rights reserved.</span>
          <div className="flex items-center gap-4 text-gray-500">
            <Link to="/shop" className="hover:text-[#1A1A1A] transition-colors">
              Catalog
            </Link>
            <a href="#privacy" onClick={(e) => e.preventDefault()} className="hover:text-[#1A1A1A] transition-colors">
              Privacy Policy
            </a>
            <a href="#terms" onClick={(e) => e.preventDefault()} className="hover:text-[#1A1A1A] transition-colors">
              Terms
            </a>
          </div>
        </div>

        {/* Right: Social Media Icons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-xs font-bold text-[#1A1A1A] mr-1 hidden sm:inline">Connect</span>

          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            title="Twitter / X"
            aria-label="ShopStack on Twitter"
            className="w-8 h-8 rounded-full bg-gray-50 border border-gray-200 text-gray-600 hover:text-[#1A1A1A] hover:bg-[#FAF92A] hover:border-[#1A1A1A] transition-all flex items-center justify-center shadow-2xs cursor-pointer"
          >
            <Twitter className="w-3.5 h-3.5" />
          </a>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            title="Instagram"
            aria-label="ShopStack on Instagram"
            className="w-8 h-8 rounded-full bg-gray-50 border border-gray-200 text-gray-600 hover:text-[#1A1A1A] hover:bg-[#FAF92A] hover:border-[#1A1A1A] transition-all flex items-center justify-center shadow-2xs cursor-pointer"
          >
            <Instagram className="w-3.5 h-3.5" />
          </a>

          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            title="Facebook"
            aria-label="ShopStack on Facebook"
            className="w-8 h-8 rounded-full bg-gray-50 border border-gray-200 text-gray-600 hover:text-[#1A1A1A] hover:bg-[#FAF92A] hover:border-[#1A1A1A] transition-all flex items-center justify-center shadow-2xs cursor-pointer"
          >
            <Facebook className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </footer>
  );
};
