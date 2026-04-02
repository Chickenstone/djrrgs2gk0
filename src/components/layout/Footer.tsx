import React from 'react';
import { NavLink } from 'react-router-dom';

const LINKS = [
  { name: '关于我们', path: '/about' },
  { name: '服务条款', path: '/terms' },
  { name: '隐私政策', path: '/privacy' },
  { name: '联系方式', path: '/contact' },
];

export function Footer() {
  return (
    <footer className="bg-gray-50 pt-16 pb-8 mt-auto">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-12">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-300 to-gray-200 flex items-center justify-center">
                <span className="text-gray-600 font-bold text-sm">东</span>
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">
                东兴旅游
              </span>
            </div>
            <p className="text-sm text-gray-500 font-light tracking-wide max-w-xs text-center md:text-left leading-relaxed">
              探索东兴之美，体验地道风情。为您提供最优质的旅游服务与文化体验。
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center md:justify-end gap-10">
            {LINKS.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className="text-sm font-medium text-gray-500 hover:text-primary-700 transition-colors duration-300 ease-out"
              >
                {link.name}
              </NavLink>
            ))}
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-gray-200/60 flex flex-col items-center">
          <p className="text-xs text-gray-400 font-light tracking-widest uppercase">
            &copy; {new Date().getFullYear()} Dongxing Travel. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
