import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Instagram, Linkedin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-gray-100 bg-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-gray-400">
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-center md:text-left">
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

        <div className="flex items-center gap-2.5">
          <span className="font-bold text-[#1A1A1A] mr-1 text-xs">Follow Us</span>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
            className="w-8 h-8 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-600 hover:text-[#1A1A1A] hover:bg-[#FAF92A] hover:border-[#FDBF2D] transition-all"
          >
            <Twitter className="w-4 h-4" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="w-8 h-8 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-600 hover:text-[#1A1A1A] hover:bg-[#FAF92A] hover:border-[#FDBF2D] transition-all"
          >
            <Instagram className="w-4 h-4" />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="w-8 h-8 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-600 hover:text-[#1A1A1A] hover:bg-[#FAF92A] hover:border-[#FDBF2D] transition-all"
          >
            <Linkedin className="w-4 h-4" />
          </a>
        </div>
      </div>
    </footer>
  );
};
