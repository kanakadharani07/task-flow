import React, { useEffect, useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { 
  Users, 
  Trash2, 
  ShieldAlert, 
  BarChart3, 
  Search,
  CheckCircle,
  XCircle,
  MoreVertical
} from 'lucide-react';
import { collection, query, getDocs, deleteDoc, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { motion } from 'framer-motion';

const AdminPanel = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'users'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleDeleteUser = async (id: string) => {
    if (window.confirm('WARNING: Are you sure you want to delete this user? This action is irreversible.')) {
      await deleteDoc(doc(db, 'users', id));
    }
  };

  return (
    <MainLayout title="Admin Command Center">
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="glass-card p-6 rounded-2xl flex items-center gap-6">
          <div className="w-14 h-14 bg-indigo-950/40 rounded-2xl flex items-center justify-center text-primary-400 border border-primary-900/50 shadow-lg shadow-primary-400/5">
            <Users size={28} />
          </div>
          <div>
            <p className="text-text-muted text-xs font-bold uppercase tracking-widest mb-1">Active Users</p>
            <h3 className="text-3xl font-display font-bold text-text-bright">{users.length}</h3>
          </div>
        </div>
        <div className="glass-card p-6 rounded-2xl flex items-center gap-6">
          <div className="w-14 h-14 bg-primary-950/40 rounded-2xl flex items-center justify-center text-primary-400 border border-primary-900/50 shadow-lg shadow-primary-400/5">
            <BarChart3 size={28} />
          </div>
          <div>
            <p className="text-text-muted text-xs font-bold uppercase tracking-widest mb-1">Global Tasks</p>
            <h3 className="text-3xl font-display font-bold text-text-bright">1,204</h3>
          </div>
        </div>
        <div className="glass-card p-6 rounded-2xl flex items-center gap-6">
          <div className="w-14 h-14 bg-rose-950/40 rounded-2xl flex items-center justify-center text-rose-400 border border-rose-900/50 shadow-lg shadow-rose-400/5">
            <ShieldAlert size={28} />
          </div>
          <div>
            <p className="text-text-muted text-xs font-bold uppercase tracking-widest mb-1">System Health</p>
            <h3 className="text-3xl font-display font-bold text-emerald-500">Optimal</h3>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-border-muted flex items-center justify-between">
           <h3 className="font-display font-bold text-lg text-text-bright">User Management</h3>
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
              <input type="text" placeholder="Search Users..." className="bg-surface-dark border border-border-muted text-xs text-text-bright rounded-lg pl-10 pr-4 py-2 focus:ring-1 focus:ring-primary-400 w-64 placeholder:text-text-muted/50 transition-all" />
           </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-dark/50">
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-widest">User</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-widest">Role</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-muted">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-surface-lighter/50 transition-all group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-900/30 rounded-lg flex items-center justify-center text-primary-400 border border-primary-900/50 font-bold">
                        {user.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-text-bright group-hover:text-primary-400 transition-colors">{user.name}</p>
                        <p className="text-xs text-text-muted">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/30 text-emerald-500 text-[10px] font-bold uppercase tracking-wider border border-emerald-900/50">
                      <CheckCircle size={10} /> Active
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "text-xs font-semibold px-2 py-1 rounded-md capitalize",
                      user.role === 'admin' ? 'bg-primary-900/40 text-primary-400 border border-primary-900/50' : 'bg-surface-dark text-text-muted border border-border-muted'
                    )}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDeleteUser(user.id)}
                      className="p-2 text-text-muted hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
};

const cn = (...inputs: any[]) => inputs.filter(Boolean).join(' ');

export default AdminPanel;
