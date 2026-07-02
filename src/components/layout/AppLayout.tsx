import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Home, Headphones, BookOpen, HelpCircle, Bot } from 'lucide-react';

export function BottomNavigation() {
  const navItems = [
    { path: '/', label: 'Utama', icon: Home },
    { path: '/listen', label: 'Dengar', icon: Headphones },
    { path: '/read', label: 'Baca', icon: BookOpen },
    { path: '/quiz', label: 'Kuiz', icon: HelpCircle },
    { path: '/ai', label: 'AI', icon: Bot },
  ];

  return (
    <div className="w-full bg-white/95 backdrop-blur-xl border-t border-sky-50 shadow-[0_-15px_30px_rgba(37,99,235,0.08)] pb-safe rounded-t-3xl">
      <div className="flex justify-around items-center h-20 px-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `group flex flex-col items-center justify-center w-16 h-full gap-1.5 transition-all duration-300 ${
                isActive ? 'text-primary' : 'text-slate-400 hover:text-slate-600'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`relative p-2 rounded-2xl transition-all duration-300 ${isActive ? 'bg-primary/10 scale-110' : 'group-hover:bg-slate-50'}`}>
                  <item.icon className={`w-6 h-6 ${isActive ? 'fill-primary/20 stroke-[2.5px]' : 'stroke-2'}`} />
                </div>
                <span className={`text-[10px] font-bold tracking-wide transition-all ${isActive ? 'scale-105' : ''}`}>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
}

export function AppLayout() {
  return (
    <div className="h-[100dvh] flex justify-center bg-slate-100 overflow-hidden">
      <div className="w-full md:max-w-3xl lg:max-w-4xl bg-transparent h-full relative flex flex-col shadow-2xl bg-app-pattern overflow-hidden">
        <div className="flex-1 overflow-y-auto overflow-x-hidden pb-24 relative z-0">
          <Outlet />
        </div>
        <div className="absolute bottom-0 w-full z-50">
          <BottomNavigation />
        </div>
      </div>
    </div>
  );
}
