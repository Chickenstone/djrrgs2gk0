import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { Home, Utensils, Map, ShoppingBag, User } from 'lucide-react';

const TABS = [
  { name: '首页', path: '/', icon: Home },
  { name: '美食', path: '/food', icon: Utensils },
  { name: '攻略', path: '/travel', icon: Map },
  { name: '文创', path: '/culture', icon: ShoppingBag },
  { name: '我的', path: '/user', icon: User },
];

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-soft transition-all duration-300">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-600 to-primary-400 flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-sm">东</span>
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 tracking-tight">
            东兴旅游
          </span>
        </div>
        
        <div className="hidden md:flex items-center gap-10">
          {TABS.map((tab) => (
            <NavLink
              key={tab.path}
              to={tab.path}
              className={({ isActive }) => cn(
                "group relative flex items-center gap-2 text-sm font-medium transition-colors duration-300 ease-out py-2",
                isActive 
                  ? "text-primary-600" 
                  : "text-gray-500 hover:text-primary-700"
              )}
            >
              {({ isActive }) => (
                <>
                  <tab.icon className={cn(
                    "w-4 h-4 transition-transform duration-300 group-hover:scale-110",
                    isActive ? "text-primary-600" : "text-gray-400 group-hover:text-primary-600"
                  )} />
                  {tab.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 rounded-full" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
