import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Camera, FileText, ShieldCheck } from 'lucide-react';
import Navigation from './Navigation';
import ThemeToggle from './ThemeToggle';

const desktopLinks = [
  { label: 'Dashboard', path: '/' },
  { label: 'Capture', path: '/add' },
  { label: 'Review', path: '/inbox' },
  { label: 'Ledger', path: '/tracker' },
  { label: 'Insights', path: '/insights' },
];

const linkClass = ({ isActive }) =>
  [
    'rounded-md px-3 py-2 text-sm font-semibold',
    isActive ? 'bg-surface-muted text-foreground' : 'text-muted hover:bg-surface-muted hover:text-foreground',
  ].join(' ');

const Layout = () => (
  <div className="min-h-screen bg-background text-foreground">
    <header className="sticky top-0 z-40 border-b border-border bg-background/92 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <NavLink to="/" className="flex min-h-10 items-center gap-3 rounded-md">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <FileText className="h-5 w-5" aria-hidden="true" />
          </span>
          <span>
            <span className="block text-base font-extrabold leading-none tracking-tight">LedgerSnap</span>
            <span className="block text-xs font-medium text-muted">Receipts to reconciled books</span>
          </span>
        </NavLink>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
          {desktopLinks.map((item) => (
            <NavLink key={item.label} to={item.path} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-xs font-semibold text-muted sm:flex">
            <ShieldCheck className="h-4 w-4 text-success" aria-hidden="true" />
            Local ledger
          </div>
          <NavLink to="/add" className="button-primary hidden sm:inline-flex">
            <Camera className="h-4 w-4" aria-hidden="true" />
            Capture
          </NavLink>
          <ThemeToggle />
        </div>
      </div>
    </header>

    <main>
      <Outlet />
    </main>

    <Navigation />
  </div>
);

export default Layout;
