import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

const CalendarPage = () => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const date = new Date();
  const currentMonth = date.toLocaleString('default', { month: 'long' });
  const currentYear = date.getFullYear();

  // Mock days for display
  const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <MainLayout title="Calendar">
      <div className="bg-surface-lighter rounded-3xl border border-border-muted overflow-hidden shadow-2xl">
        {/* Calendar Header */}
        <div className="p-8 border-b border-border-muted flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <h2 className="font-display font-extrabold text-3xl text-text-bright leading-none">{currentMonth}</h2>
              <p className="text-text-muted font-bold tracking-[0.2em] uppercase text-[10px] mt-2">{currentYear}</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-surface-dark rounded-xl border border-border-muted text-text-muted transition-all">
                <ChevronLeft size={18} />
              </button>
              <button className="p-2 hover:bg-surface-dark rounded-xl border border-border-muted text-text-muted transition-all">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
             <button className="btn-secondary text-sm flex items-center gap-2">
                <Filter size={16} /> Filter
             </button>
             <button className="btn-primary flex items-center gap-2 shadow-lg shadow-primary-400/10">
                <CalendarIcon size={18} /> Today
             </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 border-b border-border-muted bg-surface-dark/30">
          {days.map(day => (
            <div key={day} className="py-4 text-center text-xs font-bold text-text-muted uppercase tracking-widest border-r border-border-muted last:border-0">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 border-r border-border-muted">
          {calendarDays.map((day, i) => {
            const hasTask = day === 12 || day === 21 || day === 25;
            const isToday = day === date.getDate();
            
            return (
              <div 
                key={day} 
                className="h-44 p-4 border-b border-l border-border-muted transition-all hover:bg-primary-900/10 cursor-pointer relative group"
              >
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-all",
                  isToday ? "bg-primary-400 text-surface-dark shadow-lg shadow-primary-400/20" : "text-text-muted group-hover:text-primary-400"
                )}>
                  {day}
                </div>

                {hasTask && (
                  <div className="mt-2 space-y-1">
                    <div className="px-2 py-1 bg-amber-950/30 rounded border-l-2 border-amber-500">
                       <p className="text-[10px] font-bold text-amber-500 truncate">Design Review</p>
                    </div>
                    {day === 25 && (
                      <div className="px-2 py-1 bg-primary-950/30 rounded border-l-2 border-primary-400">
                        <p className="text-[10px] font-bold text-primary-400 truncate">Sprint Planning</p>
                      </div>
                    )}
                  </div>
                )}

                <button className="absolute bottom-2 right-2 p-1.5 bg-primary-400 rounded-lg text-surface-dark opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 shadow-lg">
                  <Plus size={14} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
};

const cn = (...inputs: any[]) => inputs.filter(Boolean).join(' ');
const Plus = ({ size, className }: any) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><path d="M12 5v14M5 12h14"/></svg>;

export default CalendarPage;
