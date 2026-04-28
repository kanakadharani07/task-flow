import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useSidebar } from '../../context/SidebarContext';
import { cn } from '../../lib/utils';

const MainLayout: React.FC<{ children: React.ReactNode, title: string }> = ({ children, title }) => {
  const { isOpen, isMobile } = useSidebar();

  return (
    <div className="min-h-screen bg-surface-dark flex overflow-x-hidden">
      <Sidebar />
      <div className={cn(
        "flex-1 flex flex-col transition-all duration-300 ease-in-out min-w-0",
        isOpen && !isMobile ? "lg:ml-64" : "ml-0"
      )}>
        <Navbar title={title} />
        <main className="p-6 md:p-8 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
