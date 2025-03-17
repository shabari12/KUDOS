import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Github, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black border-t border-gray-200">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center">
              <MessageSquare className="h-6 w-6 text-white" />
              <span className="ml-2 text-lg font-bold text-white">Kudos</span>
            </Link>
            <p className="mt-2 text-sm text-white">
              Collect and showcase testimonials with ease.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Product</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link to="/features" className="text-base text-white">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-base text-white">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Support</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link to="/help" className="text-base text-white">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-base text-white">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Legal</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link to="/privacy" className="text-base text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-base text-white">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 border-t border-gray-200 pt-8 md:flex md:items-center md:justify-between">
          <div className="flex space-x-6 md:order-2">
            <a href="https://github.com/shabari12" className="text-white">
              <span className="sr-only">Twitter</span>
            <Github className="h-5 w-5"  />
            </a>
            <a href="https://x.com/home?lang=en" className="text-white">
              <span className="sr-only">GitHub</span>
              <Twitter className="h-5 w-5" />
            </a>
          </div>
          <p className="mt-8 text-base text-white md:mt-0 md:order-1">
            &copy; {new Date().getFullYear()} Kudos. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;