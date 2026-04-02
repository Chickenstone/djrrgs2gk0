import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Home, Utensils, Map, ShoppingBag, User } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const TABS = [
  { name: '首页', path: '/', icon: Home },
  { name: '美食', path: '/food', icon: Utensils },
  { name: '攻略', path: '/travel', icon: Map },
  { name: '文创', path: '/culture', icon: ShoppingBag },
  { name: '我的', path: '/user', icon: User },
];

export function MobileLayout() {
  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden w-full max-w-md mx-auto shadow-2xl relative">
      <main className="flex-1 overflow-y-auto pb-[env(safe-area-inset-bottom)]">
        <Outlet />
      </main>

      <nav className="bg-white/90 backdrop-blur-md border-t border-gray-100 pb-[env(safe-area-inset-bottom)] shrink-0 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.05)] z-50">
        <div className="flex justify-around items-center h-16 px-2">
          {TABS.map((tab) => (
            <NavLink
              key={tab.path}
              to={tab.path}
              className={({ isActive }) =>
                cn(
                  'group flex flex-col items-center justify-center w-full h-full space-y-1 relative',
                  isActive ? 'text-primary-600' : 'text-gray-400 hover:text-primary-500'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div className={cn(
                    'p-1.5 rounded-2xl transition-all duration-300 ease-out group-hover:scale-110',
                    isActive ? 'bg-primary-50 text-primary-600 shadow-soft' : 'text-gray-400'
                  )}>
                    <tab.icon
                      className="w-5 h-5"
                      strokeWidth={isActive ? 2.5 : 2}
                    />
                  </div>
                  <span className={cn(
                    'text-[10px] font-medium transition-colors',
                    isActive ? 'text-primary-700' : 'text-gray-500'
                  )}>{tab.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
