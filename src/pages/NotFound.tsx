import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-surface-dark flex items-center justify-center p-6 text-text-muted">
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-24 h-24 bg-surface-lighter rounded-3xl flex items-center justify-center text-primary-400 mx-auto mb-8 shadow-2xl border border-border-muted">
            <span className="font-display font-black text-5xl italic tracking-tighter">404</span>
          </div>
          <h1 className="font-display font-bold text-4xl text-text-bright mb-4">Flow interrupted.</h1>
          <p className="text-text-muted mb-10 leading-relaxed italic">
            The page you're looking for has moved to a different workspace or doesn't exist anymore.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
             <Link to="/" className="flex-1 btn-secondary flex items-center justify-center gap-2">
                <ArrowLeft size={18} /> Landing
             </Link>
             <Link to="/dashboard" className="flex-1 btn-primary flex items-center justify-center gap-2">
                <Home size={18} /> Dashboard
             </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
