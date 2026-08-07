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
      to: '/documents',
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
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-20 px-2 sm:px-4 bg-surface dark:bg-surface-container-low border-t border-outline-variant dark:border-outline shadow-lg">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 py-1.5 px-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-primary dark:text-primary-fixed font-bold scale-105'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container/50'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span className="text-[11px] leading-none font-medium">{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
