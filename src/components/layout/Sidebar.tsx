import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Trello, 
  Calendar, 
  Bell, 
  User, 
  Settings, 
  LogOut,
  ShieldCheck,
  Menu,
  X,
  Plus
} from 'lucide-react';
import { auth } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

import { useSidebar } from '../../context/SidebarContext';

const Sidebar = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const { isOpen, close, isMobile } = useSidebar();

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'My Tasks', icon: CheckSquare, path: '/tasks' },
    { name: 'Kanban', icon: Trello, path: '/kanban' },
    { name: 'Calendar', icon: Calendar, path: '/calendar' },
    { name: 'Notifications', icon: Bell, path: '/notifications' },
  ];

  const bottomItems = [
    { name: 'Profile', icon: User, path: '/profile' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <>
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.aside
            initial={isMobile ? { x: -300 } : { width: 0, opacity: 0 }}
            animate={isMobile ? { x: 0 } : { width: 256, opacity: 1 }}
            exit={isMobile ? { x: -300 } : { width: 0, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={cn(
              "fixed inset-y-0 left-0 z-40 bg-surface-lighter border-r border-border-muted flex flex-col overflow-hidden",
              isMobile ? "w-64" : "w-64"
            )}
          >
            {/* Logo */}
            <div className="p-6 flex items-center gap-3 shrink-0">
              <div className="w-8 h-8 bg-primary-400 rounded-lg flex items-center justify-center text-surface-dark font-bold text-xl">
                T
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-text-bright">TaskFlow</span>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 px-4 space-y-1">
              <div className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4 px-2">Menu</div>
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-text-muted hover:bg-border-muted hover:text-text-bright",
                    isActive && "bg-border-muted text-text-bright font-medium"
                  )}
                >
                  <item.icon size={20} />
                  <span>{item.name}</span>
                </NavLink>
              ))}

              {profile?.role === 'admin' && (
                <>
                  <div className="pt-6 pb-2 text-xs font-semibold text-text-muted uppercase tracking-wider px-2">Admin</div>
                  <NavLink
                    to="/admin"
                    className={({ isActive }) => cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-text-muted hover:bg-border-muted hover:text-text-bright",
                      isActive && "bg-border-muted text-text-bright font-medium"
                    )}
                  >
                    <ShieldCheck size={20} />
                    <span>Admin Panel</span>
                  </NavLink>
                </>
              )}
            </nav>

            {/* Bottom Links */}
            <div className="p-4 border-t border-border-muted space-y-1">
              {bottomItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-text-muted hover:bg-border-muted hover:text-text-bright uppercase text-xs font-medium tracking-wide",
                    isActive && "bg-border-muted text-text-bright"
                  )}
                >
                  <item.icon size={18} />
                  <span>{item.name}</span>
                </NavLink>
              ))}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-red-400 hover:bg-red-950/30 text-xs font-medium tracking-wide"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Overlay for mobile */}
      {isOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-surface-dark/40 backdrop-blur-sm z-30 lg:hidden"
          onClick={close}
        />
      )}
    </>
  );
};

export default Sidebar;
