import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, Search, Plus, User, Menu, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useSidebar } from '../../context/SidebarContext';
import TaskForm from '../tasks/TaskForm';

const Navbar = ({ title }: { title: string }) => {
  const { profile } = useAuth();
  const { toggle, isOpen } = useSidebar();
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);

  return (
    <header className="h-16 border-b border-border-muted bg-surface-dark/80 backdrop-blur-md sticky top-0 z-30 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggle}
          className="p-2 -ml-2 text-text-muted hover:text-text-bright hover:bg-surface-lighter rounded-lg transition-all"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <h1 className="font-display font-bold text-xl text-text-bright">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="hidden md:flex items-center bg-surface-lighter border border-border-muted rounded-full px-4 py-1.5 focus-within:ring-2 focus-within:ring-primary-400/10 transition-all">
          <Search size={18} className="text-text-muted" />
          <input 
            type="text" 
            placeholder="Search tasks..." 
            className="bg-transparent border-none focus:outline-none ml-2 text-sm text-text-bright w-48 placeholder:text-text-muted/50"
          />
        </div>

        {/* Action Buttons */}
        <button 
          onClick={() => setIsTaskFormOpen(true)}
          className="p-2 text-text-muted hover:bg-surface-lighter hover:text-primary-400 rounded-full transition-all"
        >
          <Plus size={20} />
        </button>

        <button className="p-2 text-text-muted hover:bg-surface-lighter rounded-full transition-all relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-surface-dark rounded-full"></span>
        </button>

        <div className="h-8 w-px bg-border-muted"></div>

        {/* Profile Mini */}
        <div className="flex items-center gap-3 hover:bg-surface-lighter p-1 rounded-lg transition-all cursor-pointer">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-text-bright leading-none">{profile?.name || 'User'}</p>
            <p className="text-xs text-text-muted mt-1 uppercase tracking-tight">{profile?.role || 'Guest'}</p>
          </div>
          {profile?.avatar ? (
            <img 
              src={profile.avatar} 
              alt={profile.name} 
              className="w-10 h-10 rounded-lg border border-border-muted" 
            />
          ) : (
            <div className="w-10 h-10 bg-primary-900/30 rounded-lg flex items-center justify-center text-primary-400 border border-primary-900/50 font-bold">
              {profile?.name?.charAt(0) || 'U'}
            </div>
          )}
        </div>
      </div>
      <TaskForm isOpen={isTaskFormOpen} onClose={() => setIsTaskFormOpen(false)} />
    </header>
  );
};

export default Navbar;
