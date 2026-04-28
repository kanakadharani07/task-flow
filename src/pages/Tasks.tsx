import React, { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Trash2, 
  Edit3, 
  CheckCircle2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { collection, query, where, onSnapshot, orderBy, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { formatDate, cn } from '../lib/utils';
import TaskForm from '../components/tasks/TaskForm';
import { motion, AnimatePresence } from 'framer-motion';

const Tasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    if (!user) return;

    const tasksRef = collection(db, 'tasks');
    const q = query(
      tasksRef, 
      where('userId', '==', user.uid), 
      orderBy('createdAt', 'desc')
    );

    setError(null);
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        setTasks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching tasks:", err);
        setError(err.message || "Missing or insufficient permissions.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteDoc(doc(db, 'tasks', id));
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    }
  };

  const toggleComplete = async (task: any) => {
    try {
      const newStatus = task.status === 'completed' ? 'pending' : 'completed';
      await updateDoc(doc(db, 'tasks', task.id), { 
        status: newStatus,
        updatedAt: serverTimestamp()
      });
    } catch (err: any) {
      console.error("Error toggling task status:", err);
      setError(err.message || "Failed to update task status.");
    }
  };

  const handleEdit = (task: any) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <MainLayout title="My Tasks">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row gap-4 flex-1 max-w-2xl">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search tasks..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10" 
            />
          </div>
          {/* Filter */}
          <div className="relative w-full sm:w-48">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field pl-10"
            >
              <option value="all">All Tasks</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
        
        <button 
          onClick={() => { setEditingTask(null); setIsFormOpen(true); }}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <Plus size={20} /> Create Task
        </button>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-rose-950/30 border border-rose-900/40 text-rose-400 text-sm font-medium rounded-xl flex items-center gap-3">
          <AlertCircle size={20} />
          <div className="flex-1">
            <p className="font-bold">Permission Issue</p>
            <p className="text-xs opacity-80">{error}</p>
          </div>
          <button onClick={() => window.location.reload()} className="px-3 py-1 bg-surface-dark border border-border-muted rounded-lg text-xs font-bold hover:bg-surface-lighter">
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="h-48 bg-surface-lighter/50 rounded-2xl animate-pulse border border-border-muted"></div>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredTasks.length > 0 ? filteredTasks.map((task, i) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                className={cn(
                  "glass-card p-6 rounded-2xl group border-l-4 hover:border-primary-400/50 transition-all",
                  task.priority === 'high' ? 'border-l-rose-500' : task.priority === 'medium' ? 'border-l-amber-500' : 'border-l-primary-400'
                )}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={cn(
                    "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider",
                    task.status === 'completed' ? 'bg-emerald-950/30 text-emerald-400' : 
                    task.status === 'in-progress' ? 'bg-primary-950/30 text-primary-400' : 'bg-surface-dark/50 text-text-muted'
                  )}>
                    {task.status.replace('-', ' ')}
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEdit(task)}
                      className="p-1 px-2 text-text-muted hover:text-primary-400 hover:bg-border-muted rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(task.id)}
                      className="p-1 px-2 text-text-muted hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <h3 className={cn(
                  "font-display font-bold text-lg text-text-bright mb-2 transition-all",
                  task.status === 'completed' && "line-through text-text-muted"
                )}>
                  {task.title}
                </h3>
                <p className="text-sm text-text-muted line-clamp-2 mb-4">
                  {task.description || 'No description provided.'}
                </p>

                <div className="pt-4 border-t border-border-muted flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-text-muted font-medium">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      {formatDate(task.dueDate)}
                    </div>
                  </div>
                  <button 
                    onClick={() => toggleComplete(task)}
                    className={cn(
                      "flex items-center gap-1 text-xs font-bold transition-all",
                      task.status === 'completed' ? "text-emerald-400" : "text-text-muted hover:text-primary-400"
                    )}
                  >
                    <CheckCircle2 size={18} fill={task.status === 'completed' ? 'currentColor' : 'none'} className={task.status === 'completed' ? 'fill-emerald-400/20' : ''} />
                    {task.status === 'completed' ? 'Done' : 'Complete'}
                  </button>
                </div>
              </motion.div>
            )) : (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 bg-surface-lighter rounded-full flex items-center justify-center text-text-muted mb-4 border border-border-muted">
                  <AlertCircle size={32} />
                </div>
                <h3 className="font-display font-bold text-lg text-text-bright">No tasks found</h3>
                <p className="text-text-muted text-sm">Create your first task to see it here.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      )}

      <TaskForm 
        isOpen={isFormOpen} 
        onClose={() => { setIsFormOpen(false); setEditingTask(null); }} 
        task={editingTask} 
      />
    </MainLayout>
  );
};

export default Tasks;
