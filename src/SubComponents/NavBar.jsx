import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../content/ThemeContext.jsx';

export default function NavBar() {
  const { dark, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinkClass = ({ isActive }) =>
    `rounded-full px-3 py-2 text-sm font-medium transition-all duration-200 ${
      isActive
        ? dark
          ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/30'
          : 'bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/40'
        : dark
          ? 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
          : 'text-slate-200 hover:bg-slate-800 hover:text-white'
    }`;

  const navItems = [
    { to: '/', label: 'Home' },
    { to: '/events', label: 'Explore Events' },
    { to: '/registration', label: 'My Bookings' },
    { to: '/favorites', label: 'Favorites' },
  ];

  return (
    <nav className={`${dark ? 'bg-white text-slate-900 shadow-sm' : 'bg-slate-950 text-white shadow-lg'} sticky top-0 z-50 border-b border-slate-200/10`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-200 hover:scale-105 ${dark ? 'bg-linear-to-br from-cyan-200 to-cyan-100' : 'bg-linear-to-br from-cyan-400 to-cyan-500'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-7 w-7" aria-label="EventHub logo">
                <defs>
                  <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#0891b2', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#0e7490', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
                <rect x="8" y="10" width="32" height="28" rx="2" fill="url(#logoGradient)" opacity="0.1" stroke="url(#logoGradient)" strokeWidth="1.5" />
                <rect x="12" y="14" width="24" height="4" fill="url(#logoGradient)" />
                <circle cx="18" cy="26" r="2" fill="url(#logoGradient)" />
                <circle cx="30" cy="26" r="2" fill="url(#logoGradient)" />
                <circle cx="18" cy="34" r="2" fill="url(#logoGradient)" />
                <circle cx="30" cy="34" r="2" fill="url(#logoGradient)" />
              </svg>
            </div>

            <div>
              <div className="bg-linear-to-r from-cyan-400 to-cyan-600 bg-clip-text text-lg font-black tracking-[0.18em] text-transparent">
                EVENTHUB
              </div>
              <p className={`text-[10px] font-medium uppercase tracking-[0.2em] ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
                Event management platform
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-2 rounded-full border border-slate-200/80 bg-slate-50/80 p-1.5 md:flex dark:border-slate-700 dark:bg-slate-900/80">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={navLinkClass}>
                {item.label}
              </NavLink>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <NavLink
              to="/registration"
              className={`rounded-full px-4 py-2.5 text-sm font-semibold transition ${dark ? 'bg-cyan-500 text-white hover:bg-cyan-600' : 'bg-cyan-400 text-slate-950 hover:bg-cyan-300'}`}
            >
              Register
            </NavLink>
            <button
              type="button"
              onClick={toggleTheme}
              className={`rounded-full p-2.5 text-sm font-medium transition ${dark ? 'bg-slate-200 text-slate-900 hover:bg-slate-300' : 'bg-slate-800 text-white hover:bg-slate-700'}`}
              aria-label="Toggle color mode"
            >
              {dark ? 'Dark' : 'Light'}
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className={`inline-flex h-11 w-11 items-center justify-center rounded-full border transition md:hidden ${dark ? 'border-slate-200 bg-slate-100 text-slate-900' : 'border-slate-700 bg-slate-800 text-white'}`}
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              {!isMenuOpen ? (
                <>
                  <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
                </>
              ) : (
                <>
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </>
              )}
            </svg>
          </button>
        </div>

        {isMenuOpen && (
          <div className={`space-y-3 border-t py-4 md:hidden ${dark ? 'border-slate-200/80' : 'border-slate-800'}`}>
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `rounded-2xl px-3 py-2.5 text-sm font-medium ${
                      isActive
                        ? dark
                          ? 'bg-cyan-500 text-white'
                          : 'bg-cyan-400 text-slate-950'
                        : dark
                          ? 'bg-slate-100 text-slate-700'
                          : 'bg-slate-800 text-slate-200'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <NavLink
                to="/registration"
                onClick={() => setIsMenuOpen(false)}
                className={`flex-1 rounded-full px-4 py-2.5 text-center text-sm font-semibold ${dark ? 'bg-cyan-500 text-white' : 'bg-cyan-400 text-slate-950'}`}
              >
                Register
              </NavLink>
              <button
                type="button"
                onClick={toggleTheme}
                className={`rounded-full px-4 py-2.5 text-sm font-medium  ${dark ? 'bg-slate-200 text-slate-900' : 'bg-slate-800 text-white'}`}
              >
                {dark ? 'Light' : 'Dark'}
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
