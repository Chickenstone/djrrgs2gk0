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

      <nav className="bg-white border-t border-gray-200 pb-[env(safe-area-inset-bottom)] shrink-0">
        <div className="flex justify-around items-center h-14">
          {TABS.map((tab) => (
            <NavLink
              key={tab.path}
              to={tab.path}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center justify-center w-full h-full space-y-1',
                  isActive ? 'text-blue-500' : 'text-gray-500 hover:text-gray-900'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <tab.icon
                    className={cn('w-6 h-6', isActive ? 'text-blue-500' : 'text-gray-500')}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <span className="text-[10px] font-medium">{tab.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
