import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { getAdminToken, setAdminToken } from '../utils/api';
import { FaUsers, FaLink, FaHome, FaThLarge, FaBars, FaTimes, FaSignOutAlt } from 'react-icons/fa';

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', Icon: FaThLarge },
  { to: '/admin/partners', label: 'Partner requests', Icon: FaUsers },
  { to: '/admin/vault', label: 'Vault links', Icon: FaLink },
  { to: '/admin/homepage', label: 'Homepage content', Icon: FaHome },
];

const navLinkClass = (isActive) =>
  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
    isActive
      ? 'bg-secondary/10 text-secondary shadow-sm'
      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
  }`;

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!getAdminToken()) {
    navigate('/admin/login', { replace: true });
    return null;
  }

  const handleLogout = () => {
    setAdminToken(null);
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-gray-100/80 flex">
      {/* Sidebar – desktop */}
      <aside className="hidden md:flex md:flex-shrink-0 md:w-60 lg:w-64 bg-white/95 backdrop-blur border-r border-gray-200/80 flex-col shadow-sm">
        <div className="p-5 border-b border-gray-200/80">
          <h1 className="text-lg font-bold bg-gradient-to-r from-secondary to-secondary-dark bg-clip-text text-transparent">
            Edu-Bridge Admin
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">Content & partners</p>
        </div>
        <nav className="p-3 flex-1">
          {navItems.map(({ to, label, Icon }) => (
            <Link
              key={to}
              to={to}
              className={`${navLinkClass(location.pathname === to)} mb-0.5`}
            >
              <Icon className="w-4 h-4 flex-shrink-0 opacity-80" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-200/80">
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <FaSignOutAlt className="w-4 h-4" />
            Log out
          </button>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 max-w-[85vw] bg-white shadow-xl transform transition-transform duration-300 ease-out md:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-5 border-b border-gray-200 flex items-center justify-between">
          <h1 className="text-lg font-bold text-secondary">Edu-Bridge Admin</h1>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="p-2.5 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors"
            aria-label="Close menu"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>
        <nav className="p-3">
          {navItems.map(({ to, label, Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={navLinkClass(location.pathname === to)}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-200">
          <button
            type="button"
            onClick={() => { setSidebarOpen(false); handleLogout(); }}
            className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600"
          >
            <FaSignOutAlt className="w-4 h-4" />
            Log out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white/80 backdrop-blur border-b border-gray-200/80 px-4 sm:px-6 py-3.5 flex items-center justify-between sticky top-0 z-30">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2.5 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            aria-label="Open menu"
          >
            <FaBars className="w-5 h-5" />
          </button>
          <div className="flex-1 md:flex-none" />
          <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Signed in
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
