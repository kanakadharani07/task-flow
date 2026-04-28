import React, { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { collection, query, where, onSnapshot, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { cn, formatDate } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MoreVertical, Calendar, Flag } from 'lucide-react';
import TaskForm from '../components/tasks/TaskForm';

const Kanban = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [columns, setColumns] = useState([
    { id: 'pending', title: 'To Do', color: 'bg-primary-400' },
    { id: 'in-progress', title: 'In Progress', color: 'bg-amber-500' },
    { id: 'completed', title: 'Done', color: 'bg-emerald-500' },
  ]);

  const addColumn = () => {
    const title = prompt("Enter column title:");
    if (title) {
      const id = title.toLowerCase().replace(/\s+/g, '-');
      setColumns([...columns, { id, title, color: 'bg-primary-400' }]);
    }
  };

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'tasks'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTasks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [user]);

  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'tasks', taskId), { 
        status: newStatus,
        updatedAt: serverTimestamp()
      });
    } catch (err: any) {
      console.error("Error updating task status:", err);
      // We could add a toast here if we had a toast system
    }
  };

  return (
    <MainLayout title="Kanban Board">
      <div className="flex gap-6 overflow-x-auto pb-6 h-[calc(100vh-180px)] items-start">
        {columns.map((column) => (
          <div key={column.id} className="min-w-[320px] w-[320px] bg-surface-lighter/30 rounded-3xl p-4 flex flex-col max-h-full border border-border-muted">
            {/* Column Header */}
            <div className="flex items-center justify-between mb-6 px-2">
              <div className="flex items-center gap-3">
                <span className={cn("w-2.5 h-2.5 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]", column.color)}></span>
                <h3 className="font-display font-bold text-text-bright">{column.title}</h3>
                <span className="bg-surface-dark px-2 py-0.5 rounded-md text-[10px] font-bold text-text-muted border border-border-muted">
                  {tasks.filter(t => t.status === column.id).length}
                </span>
              </div>
              <button 
                onClick={() => setIsFormOpen(true)}
                className="p-1 hover:bg-surface-lighter rounded-md text-text-muted transition-all"
              >
                <Plus size={18} />
              </button>
            </div>

            {/* Column Tasks */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
              <AnimatePresence mode="popLayout">
                {tasks
                  .filter((task) => task.status === column.id)
                  .map((task) => (
                    <motion.div
                      key={task.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      whileHover={{ y: -2 }}
                      className="bg-surface-lighter p-5 rounded-2xl shadow-xl border border-border-muted hover:shadow-2xl hover:border-primary-400 transition-all cursor-pointer group"
                      onClick={() => { setEditingTask(task); setIsFormOpen(true); }}
                    >
                      <div className="flex justify-between mb-3">
                        <div className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                          task.priority === 'high' ? 'bg-rose-950/30 text-rose-500' : 
                          task.priority === 'medium' ? 'bg-amber-950/30 text-amber-500' : 'bg-primary-950/30 text-primary-400'
                        )}>
                          {task.priority}
                        </div>
                        <div className="text-text-muted group-hover:text-primary-400 transition-all">
                          <Flag size={14} fill={task.priority === 'high' ? 'currentColor' : 'none'} />
                        </div>
                      </div>

                      <p className="font-medium text-text-bright mb-3 line-clamp-2">
                        {task.title}
                      </p>

                      <div className="flex items-center justify-between text-[11px] text-text-muted pt-3 border-t border-border-muted">
                        <div className="flex items-center gap-1.5 font-medium">
                          <Calendar size={12} />
                          {formatDate(task.dueDate)}
                        </div>
                        <div className="flex -space-x-1">
                          <div className="w-5 h-5 rounded-full bg-primary-900/50 border-2 border-surface-lighter flex items-center justify-center text-[8px] font-bold text-primary-400">
                             {user?.displayName?.charAt(0)}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </AnimatePresence>
            </div>
          </div>
        ))}

        {/* Global Add Column Button */}
        <button 
          onClick={addColumn}
          className="min-w-[320px] w-[320px] h-20 border-2 border-dashed border-border-muted rounded-3xl flex items-center justify-center gap-3 text-text-muted font-medium hover:border-primary-400/50 hover:text-primary-400 hover:bg-surface-lighter transition-all"
        >
          <Plus size={20} /> Add Column
        </button>
      </div>

      <TaskForm 
        isOpen={isFormOpen} 
        onClose={() => { setIsFormOpen(false); setEditingTask(null); }} 
        task={editingTask} 
      />
    </MainLayout>
  );
};

export default Kanban;
