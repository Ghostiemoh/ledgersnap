import React from 'react';
import { NavLink } from 'react-router-dom';
import { BarChart3, Home, Inbox, PlusCircle, Settings } from 'lucide-react';

const navItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: PlusCircle, label: 'Capture', path: '/add' },
  { icon: Inbox, label: 'Review', path: '/inbox' },
  { icon: BarChart3, label: 'Insights', path: '/insights' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

const navClass = ({ isActive }) =>
  [
    'flex min-h-11 flex-1 flex-col items-center justify-center gap-1 rounded-md px-2 text-xs font-semibold',
    isActive ? 'bg-primary text-primary-foreground' : 'text-muted hover:bg-surface-muted hover:text-foreground',
  ].join(' ');

const Navigation = () => (
  <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-surface/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur md:hidden">
    <div className="mx-auto flex max-w-lg gap-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink key={item.label} to={item.path} className={navClass}>
            <Icon className="h-4 w-4" aria-hidden="true" />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </div>
  </nav>
);

export default Navigation;
