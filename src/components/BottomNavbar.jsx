import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Grid, ShieldCheck, Brain, User } from 'lucide-react';
import { translations } from '../data/translations';

export default function BottomNavbar({ language }) {
  const t = translations[language] || translations.EN;

  const navItems = [
    {
      to: '/get-started',
      label: 'Home',
      icon: Home
    },
    {
      to: '/services',
      label: 'Services',
      icon: Grid
    },
    {
      to: '/verify',
      label: 'Verify',
      icon: ShieldCheck
    },
    {
      to: '/memory',
      label: 'Memory',
      icon: Brain
    },
    {
      to: '/profile',
      label: 'Profile',
      icon: User
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-20 px-2 sm:px-4 bg-surface dark:bg-surface-container-low border-t border-outline-variant dark:border-outline shadow-lg rounded-t-2xl">
      {navItems.map((item) => {
        const IconComponent = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1 px-2 sm:px-3 rounded-xl transition-all active:scale-95 ${
                isActive
                  ? 'text-primary dark:text-primary-fixed font-extrabold bg-primary/10'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high font-medium'
              }`
            }
          >
            <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 mb-1" />
            <span className="text-[10px] sm:text-[11px] tracking-tight">{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
