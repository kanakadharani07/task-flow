import React, { useEffect, useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  TrendingUp, 
  ListTodo,
  Plus
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../lib/utils';
import TaskForm from '../components/tasks/TaskForm';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0
  });
  const [recentTasks, setRecentTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchDashboardData = async () => {
      try {
        setError(null);
        const tasksRef = collection(db, 'tasks');
        const q = query(tasksRef, where('userId', '==', user.uid));
        const snapshot = await getDocs(q);
        const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const now = new Date();
        const total = tasks.length;
        const completed = tasks.filter((t: any) => t.status === 'completed').length;
        const pending = tasks.filter((t: any) => t.status !== 'completed').length;
        const overdue = tasks.filter((t: any) => t.dueDate && new Date(t.dueDate.toDate ? t.dueDate.toDate() : t.dueDate) < now && t.status !== 'completed').length;

        setStats({ total, completed, pending, overdue });

        // Recent tasks
        const recentQ = query(tasksRef, where('userId', '==', user.uid), orderBy('updatedAt', 'desc'), limit(5));
        const recentSnapshot = await getDocs(recentQ);
        setRecentTasks(recentSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err: any) {
        console.error("Error fetching dashboard data:", err);
        setError(err.message || "Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const chartData = [
    { name: 'Mon', completed: 4 },
    { name: 'Tue', completed: 7 },
    { name: 'Wed', completed: 5 },
    { name: 'Thu', completed: 8 },
    { name: 'Fri', completed: 6 },
    { name: 'Sat', completed: 3 },
    { name: 'Sun', completed: 2 },
  ];

  const pieData = [
    { name: 'Completed', value: stats.completed, color: '#818cf8' },
    { name: 'Pending', value: stats.pending, color: '#334155' },
  ];

  const StatCard = ({ icon: Icon, title, value, color, delay }: any) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass-card p-6 rounded-2xl flex items-center justify-between group hover:border-primary-400/30 transition-all cursor-pointer"
    >
      <div>
        <p className="text-text-muted text-sm font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-display font-bold text-text-bright">{value}</h3>
      </div>
      <div className={cn("p-4 rounded-xl shadow-lg", color)}>
        <Icon size={24} className="text-surface-dark" />
      </div>
    </motion.div>
  );

  return (
    <MainLayout title="Dashboard">
      {/* Welcome Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-text-bright">Hello, {user?.displayName?.split(' ')[0] || 'User'}!</h2>
          <p className="text-text-muted">Here's what's happening with your projects today.</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="btn-primary flex items-center gap-2 self-start shadow-xl shadow-primary-400/20"
        >
          <Plus size={20} /> New Task
        </button>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-rose-950/30 border border-rose-900/40 text-rose-400 text-sm font-medium rounded-xl flex items-center gap-3">
          <AlertCircle size={20} />
          <div className="flex-1">
            <p className="font-bold">Access Issue Detected</p>
            <p className="text-xs opacity-80">{error}</p>
          </div>
          <button onClick={() => window.location.reload()} className="px-3 py-1 bg-surface-dark border border-border-muted rounded-lg text-xs font-bold hover:bg-surface-lighter">
            Retry
          </button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          icon={ListTodo} 
          title="Total Tasks" 
          value={stats.total} 
          color="bg-primary-400"
          delay={0.1}
        />
        <StatCard 
          icon={CheckCircle2} 
          title="Completed" 
          value={stats.completed} 
          color="bg-emerald-500"
          delay={0.2}
        />
        <StatCard 
          icon={Clock} 
          title="Pending" 
          value={stats.pending} 
          color="bg-amber-500"
          delay={0.3}
        />
        <StatCard 
          icon={AlertCircle} 
          title="Overdue" 
          value={stats.overdue} 
          color="bg-rose-500"
          delay={0.4}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Charts Section */}
        <div className="lg:col-span-2 space-y-8">
          {/* Completion Bar Chart */}
          <div className="glass-card p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display font-bold text-lg text-text-bright flex items-center gap-2">
                <TrendingUp size={20} className="text-primary-400" /> Activity Growth
              </h3>
              <select className="text-xs font-semibold bg-surface-lighter border-border-muted text-text-muted rounded-lg focus:ring-0 px-3 py-1.5">
                <option>This Week</option>
                <option>Last Week</option>
              </select>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#64748b' }} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#64748b' }} 
                  />
                  <Tooltip 
                    cursor={{ fill: '#1e293b50' }}
                    contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)' }}
                    itemStyle={{ color: '#f1f5f9' }}
                    labelStyle={{ color: '#94a3b8', fontWeight: 'bold', marginBottom: '4px' }}
                  />
                  <Bar dataKey="completed" fill="#818cf8" radius={[4, 4, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Tasks */}
          <div className="glass-card p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display font-bold text-lg text-text-bright">Recent Tasks</h3>
              <a href="/tasks" className="text-primary-400 text-xs font-bold hover:underline">View All</a>
            </div>
            <div className="space-y-4">
              {recentTasks.length > 0 ? recentTasks.map((task, i) => (
                <div key={task.id} className="flex items-center justify-between p-3 hover:bg-surface-lighter/50 rounded-xl transition-all border border-transparent hover:border-border-muted">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      task.priority === 'high' ? 'bg-rose-500' : task.priority === 'medium' ? 'bg-amber-500' : 'bg-primary-400'
                    )}></div>
                    <div>
                      <p className="text-sm font-semibold text-text-bright">{task.title}</p>
                      <p className="text-xs text-text-muted">Due: {formatDate(task.dueDate)}</p>
                    </div>
                  </div>
                  <div className={cn(
                    "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider",
                    task.status === 'completed' ? 'bg-emerald-950/30 text-emerald-400' : 'bg-primary-950/30 text-primary-400'
                  )}>
                    {task.status}
                  </div>
                </div>
              )) : (
                <div className="text-center py-10 text-text-muted text-sm italic">
                  No tasks found. Click "New Task" to get started.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Status Breakdown Section */}
        <div className="space-y-8">
          <div className="glass-card p-6 rounded-2xl flex flex-col items-center">
            <h3 className="font-display font-bold text-lg text-text-bright mb-6 self-start w-full">Task Status</h3>
            <div className="h-48 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                    itemStyle={{ color: '#f1f5f9' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <p className="text-2xl font-bold text-text-bright">{Math.round((stats.completed / (stats.total || 1)) * 100)}%</p>
                <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest">Done</p>
              </div>
            </div>
            <div className="w-full space-y-3 mt-6">
              {pieData.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-text-muted">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold text-text-bright">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Productivity Tip Card */}
          <div className="p-6 bg-primary-400 rounded-3xl text-surface-dark shadow-2xl shadow-primary-400/10 relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-all duration-700"></div>
            <h4 className="font-display font-bold text-lg mb-2 relative z-10">Smart Tip</h4>
            <p className="text-sm text-surface-dark font-medium mb-4 relative z-10 opait">
              Tasks with high priority should be tackled first in the morning to maximize your peak focus levels.
            </p>
            <button className="text-xs font-bold bg-surface-dark text-text-bright px-3 py-2 rounded-lg hover:shadow-lg transition-all relative z-10">
              Learn More
            </button>
          </div>
        </div>
      </div>
      
      <TaskForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </MainLayout>
  );
};

// Internal component helpers
const cn = (...inputs: any[]) => inputs.filter(Boolean).join(' ');
const Link = ({ to, children, className }: any) => <a href={to} className={className}>{children}</a>;

export default Dashboard;
