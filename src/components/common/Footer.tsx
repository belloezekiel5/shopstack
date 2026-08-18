import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-gray-100 bg-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-gray-400">
        <div className="flex flex-wrap items-center gap-6 text-center md:text-left">
          <span>&copy; {new Date().getFullYear()} ShopStack. All rights reserved.</span>
          <Link to="/shop" className="hover:text-[#1A1A1A] transition-colors">
            Catalog
          </Link>
          <a href="#privacy" onClick={(e) => e.preventDefault()} className="hover:text-[#1A1A1A] transition-colors">
            Privacy Policy
          </a>
          <a href="#terms" onClick={(e) => e.preventDefault()} className="hover:text-[#1A1A1A] transition-colors">
            Terms of Service
          </a>
        </div>

        <div className="flex items-center gap-4">
          <span className="font-bold text-[#1A1A1A]">Follow Us</span>
          <a href="#twitter" onClick={(e) => e.preventDefault()} className="hover:text-[#1A1A1A] transition-colors">
            Twitter
          </a>
          <a href="#instagram" onClick={(e) => e.preventDefault()} className="hover:text-[#1A1A1A] transition-colors">
            Instagram
          </a>
          <a href="#linkedin" onClick={(e) => e.preventDefault()} className="hover:text-[#1A1A1A] transition-colors">
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
};
