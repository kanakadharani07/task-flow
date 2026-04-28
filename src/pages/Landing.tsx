import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Trello, Zap, Shield, BarChart3, Users, ChevronRight, Play } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-surface-dark text-text-muted">
      {/* Navbar */}
      <nav className="h-20 flex items-center justify-between px-6 lg:px-20 border-b border-border-muted bg-surface-dark/70 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-400 rounded-xl flex items-center justify-center text-surface-dark font-bold text-2xl shadow-lg shadow-primary-400/20">
            T
          </div>
          <span className="font-display font-bold text-2xl tracking-tight text-text-bright">TaskFlow</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-text-muted">
          <a href="#features" className="hover:text-primary-400 transition-all">Features</a>
          <a href="#solutions" className="hover:text-primary-400 transition-all">Solutions</a>
          <a href="#pricing" className="hover:text-primary-400 transition-all">Pricing</a>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium text-text-muted hover:text-primary-400 px-4 py-2 transition-all">
            Sign In
          </Link>
          <Link to="/register" className="btn-primary flex items-center gap-2 shadow-lg shadow-primary-400/10">
            Get Started <ChevronRight size={16} />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-32 px-6 lg:px-20 text-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 bg-primary-950/30 text-primary-400 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-primary-900/50">
            Intelligent Task Management
          </span>
          <h1 className="font-display font-extrabold text-5xl lg:text-7xl text-text-bright leading-[1.1] mb-8 max-w-4xl mx-auto">
            Manage tasks with <span className="text-primary-400">Smart Intelligence</span> and Flow
          </h1>
          <p className="text-lg text-text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
            TaskFlow combines the simplicity of lists with the power of automation and visual insight. Build your dream workspace in minutes.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-primary-400 text-surface-dark rounded-xl font-bold text-lg hover:bg-primary-300 hover:shadow-[0_0_30px_rgba(129,140,248,0.3)] transition-all active:scale-95 shadow-lg shadow-primary-400/10">
              Start for Free
            </Link>
            <button className="w-full sm:w-auto px-8 py-4 bg-surface-lighter text-text-bright border border-border-muted rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-surface-dark transition-all active:scale-95 shadow-xl">
              <Play size={20} className="fill-text-bright text-text-bright" /> Watch Demo
            </button>
          </div>
        </motion.div>

        {/* Hero Visual */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-20 relative max-w-5xl mx-auto"
        >
          <div className="absolute inset-0 bg-primary-400/10 blur-[120px] -z-10 rounded-full"></div>
          <div className="bg-surface-lighter border border-border-muted rounded-3xl shadow-2xl p-4 overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary-400/5 to-transparent pointer-events-none group-hover:opacity-100 opacity-0 transition-opacity"></div>
            <img 
              src="https://picsum.photos/seed/dashboard/1600/900?blur=1" 
              alt="Dashboard Preview" 
              className="rounded-2xl border border-border-muted/50 w-full opacity-90 group-hover:opacity-100 transition-opacity"
              referrerPolicy="no-referrer"
            />
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 bg-surface-dark/50 px-6 lg:px-20 relative border-t border-border-muted/30">
        <div className="text-center mb-20">
          <h2 className="font-display font-bold text-4xl text-text-bright mb-4">Everything you need to ship faster</h2>
          <p className="text-text-muted">Powerful features that help you focus on what matters.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Trello, title: 'Kanban Boards', desc: 'Visualize your workflow with custom boards and drag-and-drop actions.' },
            { icon: Zap, title: 'AI Insights', desc: 'Get smart suggestions on deadlines and task priority powered by AI.' },
            { icon: BarChart3, title: 'Deep Analytics', desc: 'Track your productivity with beautiful, interactive charts and reports.' },
            { icon: Shield, title: 'Enterprise Security', desc: 'Your data is encrypted and protected with industry-leading security.' },
            { icon: Users, title: 'Real-time Collaboration', desc: 'Work with your team in real-time with instant updates and notifications.' },
            { icon: CheckCircle, title: 'Smart Checklists', desc: 'Break down complex tasks into manageable sub-tasks effortlessly.' },
          ].map((feature, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              className="p-8 bg-surface-lighter border border-border-muted rounded-3xl hover:shadow-2xl hover:border-primary-400/50 transition-all group"
            >
              <div className="w-12 h-12 bg-primary-950/40 rounded-2xl flex items-center justify-center text-primary-400 mb-6 border border-primary-900/50 shadow-lg shadow-primary-400/5 group-hover:scale-110 transition-transform">
                <feature.icon size={24} />
              </div>
              <h3 className="font-display font-bold text-xl text-text-bright mb-3 group-hover:text-primary-400 transition-colors">{feature.title}</h3>
              <p className="text-text-muted text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-border-muted px-6 lg:px-20 bg-surface-dark">
        <div className="flex flex-col md:flex-row justify-between gap-10">
          <div className="max-w-xs">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-primary-400 rounded-lg flex items-center justify-center text-surface-dark font-bold text-xl shadow-lg shadow-primary-400/20">
                T
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-text-bright">TaskFlow</span>
            </div>
            <p className="text-text-muted text-sm leading-relaxed">Building the future of smart workspaces for modern teams.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-10">
            <div>
              <h4 className="font-bold text-text-bright mb-6 uppercase text-xs tracking-widest">Product</h4>
              <ul className="space-y-4 text-sm text-text-muted">
                <li><a href="#" className="hover:text-primary-400 transition-all">Features</a></li>
                <li><a href="#" className="hover:text-primary-400 transition-all">Kanban</a></li>
                <li><a href="#" className="hover:text-primary-400 transition-all">Analytics</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-text-bright mb-6 uppercase text-xs tracking-widest">Company</h4>
              <ul className="space-y-4 text-sm text-text-muted">
                <li><a href="#" className="hover:text-primary-400 transition-all">About Us</a></li>
                <li><a href="#" className="hover:text-primary-400 transition-all">Careers</a></li>
                <li><a href="#" className="hover:text-primary-400 transition-all">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-text-bright mb-6 uppercase text-xs tracking-widest">Support</h4>
              <ul className="space-y-4 text-sm text-text-muted">
                <li><a href="#" className="hover:text-primary-400 transition-all">Help Center</a></li>
                <li><a href="#" className="hover:text-primary-400 transition-all">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary-400 transition-all">Terms</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-20 pt-10 border-t border-border-muted/30 text-center text-text-muted/60 text-xs">
          &copy; 2026 TaskFlow. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Landing;
