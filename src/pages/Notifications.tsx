import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import { Bell, Info, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const Notifications = () => {
  const mockNotifications = [
    { id: 1, type: 'info', message: 'Project "Marketing Redesign" has been shared with you.', time: '2 hours ago', unread: true },
    { id: 2, type: 'warning', message: 'Task "Design Review" is due in 3 hours.', time: '5 hours ago', unread: true },
    { id: 3, type: 'success', message: 'Task "API Integration" marked as completed by Alex.', time: '1 day ago', unread: false },
    { id: 4, type: 'clock', message: 'Weekly summary is ready for your review.', time: '2 days ago', unread: false },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning': return { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-950/30' };
      case 'success': return { icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-950/30' };
      case 'clock': return { icon: Clock, color: 'text-primary-400', bg: 'bg-primary-950/30' };
      default: return { icon: Info, color: 'text-primary-400', bg: 'bg-primary-950/30' };
    }
  };

  return (
    <MainLayout title="Notifications">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <span className="bg-primary-400 text-surface-dark text-xs font-bold px-2 py-0.5 rounded-full">2 New</span>
            <p className="text-text-muted text-sm italic">Stay updated with your team's pulse.</p>
          </div>
          <button className="text-xs font-bold text-primary-400 hover:underline transition-all">Mark all as read</button>
        </div>

        <div className="space-y-4">
          {mockNotifications.map((n, i) => {
            const { icon: Icon, color, bg } = getIcon(n.type);
            return (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={cn(
                  "p-5 bg-surface-lighter border rounded-2xl flex items-start gap-4 transition-all hover:shadow-xl hover:border-border-muted cursor-pointer group",
                  n.unread ? "border-primary-400/50 shadow-lg shadow-primary-400/5" : "border-border-muted"
                )}
              >
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110", bg)}>
                  <Icon size={18} className={color} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className={cn("text-sm transition-all", n.unread ? "font-bold text-text-bright" : "font-medium text-text-muted")}>
                      {n.message}
                    </p>
                    {n.unread && <div className="w-2 h-2 bg-primary-400 rounded-full shadow-[0_0_8px_rgba(129,140,248,0.6)]"></div>}
                  </div>
                  <p className="text-xs text-text-muted/60">{n.time}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
};

const cn = (...inputs: any[]) => inputs.filter(Boolean).join(' ');

export default Notifications;
