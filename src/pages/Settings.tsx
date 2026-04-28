import React, { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { 
  Bell, 
  Moon, 
  Globe, 
  Lock, 
  Smartphone,
  Eye,
  EyeOff,
  UserCheck,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const Settings = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [isPublic, setIsPublic] = useState(true);

  const SettingRow = ({ icon: Icon, title, desc, children }: any) => (
    <div className="flex items-center justify-between py-6 first:pt-0 last:pb-0">
      <div className="flex gap-4">
        <div className="w-10 h-10 bg-surface-dark rounded-xl flex items-center justify-center text-text-muted border border-border-muted shadow-lg shadow-black/20">
          <Icon size={20} />
        </div>
        <div>
          <h4 className="font-semibold text-text-bright">{title}</h4>
          <p className="text-sm text-text-muted">{desc}</p>
        </div>
      </div>
      <div>
        {children}
      </div>
    </div>
  );

  const Toggle = ({ active, onToggle }: { active: boolean, onToggle: () => void }) => (
    <button 
      onClick={onToggle}
      className={cn(
        "w-12 h-6 rounded-full transition-all relative cursor-pointer",
        active ? "bg-primary-400 shadow-[0_0_12px_rgba(129,140,248,0.4)]" : "bg-surface-dark border border-border-muted"
      )}
    >
      <motion.div 
        animate={{ x: active ? 26 : 2 }}
        className={cn(
          "absolute top-1 left-0 w-4 h-4 rounded-full shadow-sm",
          active ? "bg-surface-dark" : "bg-text-muted"
        )}
      />
    </button>
  );

  return (
    <MainLayout title="Settings">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* General Settings */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 rounded-3xl border border-border-muted shadow-2xl"
        >
          <h3 className="font-display font-bold text-lg text-text-bright mb-8">General Preferences</h3>
          <div className="divide-y divide-border-muted">
            <SettingRow 
              icon={Bell} 
              title="Push Notifications" 
              desc="Get instant alerts about task updates and deadlines."
            >
              <Toggle active={notifications} onToggle={() => setNotifications(!notifications)} />
            </SettingRow>
            
            <SettingRow 
              icon={Moon} 
              title="Appearance" 
              desc="Switch between light and dark mode interfaces."
            >
              <Toggle active={darkMode} onToggle={() => setDarkMode(!darkMode)} />
            </SettingRow>

            <SettingRow 
              icon={Globe} 
              title="Language" 
              desc="Choose your preferred language for the interface."
            >
              <select className="bg-surface-dark border border-border-muted text-sm font-medium text-text-bright rounded-lg px-4 py-2 focus:ring-1 focus:ring-primary-400 transition-all cursor-pointer">
                <option>English (US)</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </SettingRow>
          </div>
        </motion.div>

        {/* Privacy & Security */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-8 rounded-3xl border border-border-muted shadow-2xl"
        >
          <h3 className="font-display font-bold text-lg text-text-bright mb-8">Privacy & Security</h3>
          <div className="divide-y divide-border-muted">
            <SettingRow 
              icon={Eye} 
              title="Public Profile" 
              desc="Allow others to see your public bio and tasks."
            >
              <Toggle active={isPublic} onToggle={() => setIsPublic(!isPublic)} />
            </SettingRow>
            
            <SettingRow 
              icon={Lock} 
              title="Two-Factor Auth" 
              desc="Add an extra layer of security to your account."
            >
              <button className="text-xs font-bold text-primary-400 bg-primary-950/30 border border-primary-900/50 px-3 py-2 rounded-lg hover:bg-primary-900/50 transition-all shadow-lg shadow-primary-400/5">
                Setup 2FA
              </button>
            </SettingRow>

            <SettingRow 
              icon={Smartphone} 
              title="Active Sessions" 
              desc="Manage devices where you are currently logged in."
            >
              <button className="text-xs font-bold text-text-muted hover:text-rose-400 transition-all uppercase tracking-widest">
                Revoke All
              </button>
            </SettingRow>
          </div>
        </motion.div>

        <div className="flex justify-end p-4">
           <p className="text-xs text-text-muted/60 font-medium italic">TaskFlow v1.2.0 • Build ID: CL-2026-X</p>
        </div>
      </div>
    </MainLayout>
  );
};

const cn = (...inputs: any[]) => inputs.filter(Boolean).join(' ');

export default Settings;
