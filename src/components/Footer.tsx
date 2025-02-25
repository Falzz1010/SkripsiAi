import React from 'react';
import { Heart, Github, Twitter } from 'lucide-react';

interface FooterProps {
  darkMode: boolean;
}

export default function Footer({ darkMode }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`mt-12 border-t-2 ${darkMode ? 'border-dark-border bg-dark-bg' : 'border-black bg-[#F4F3EE]'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-bold mb-3">About Us</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Empowering researchers with AI-driven thesis generation and academic writing assistance.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-[#FFD23F] transition-colors">Home</a></li>
              <li><a href="#" className="hover:text-[#FFD23F] transition-colors">About</a></li>
              <li><a href="#" className="hover:text-[#FFD23F] transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-bold mb-3">Connect With Us</h3>
            <div className="flex gap-4">
              <a href="#" className="hover:text-[#FFD23F] transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-[#FFD23F] transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-4 border-t border-black dark:border-dark-border text-center text-sm">
          <div className="flex items-center justify-center gap-2">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            <span>by Naufal Rizky</span>
          </div>
          <div className="mt-2">
            © {currentYear} Thesis AI. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}

