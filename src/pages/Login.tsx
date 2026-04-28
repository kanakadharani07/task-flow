import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2, ArrowRight, Chrome } from 'lucide-react';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../lib/firebase';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    
    try {
      const provider = new GoogleAuthProvider();
      // Ensure popup is not blocked
      await signInWithPopup(auth, provider);
      navigate('/dashboard');
    } catch (err: any) {
      console.error("Login Error:", err);
      if (err.code === 'auth/popup-blocked') {
        setError('The popup was blocked by your browser. Please allow popups for this site.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('Google sign-in is not enabled. Please enable it in the Firebase Console (Authentication > Sign-in method).');
      } else {
        setError(err.message || 'An unexpected error occurred during Google sign-in.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err: any) {
      if (err.code === 'auth/operation-not-allowed') {
        setError('Email login is currently disabled. Please use "Sign in with Google" instead.');
      } else {
        setError('Invalid email or password. Please try again.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-dark flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-400 rounded-xl flex items-center justify-center text-surface-dark font-bold text-2xl shadow-lg shadow-primary-400/20">
              T
            </div>
            <span className="font-display font-bold text-2xl tracking-tight text-text-bright">TaskFlow</span>
          </Link>
        </div>

        <div className="bg-surface-lighter border border-border-muted rounded-3xl p-8 shadow-2xl shadow-black/40">
          <h2 className="font-display font-bold text-2xl text-text-bright mb-2">Welcome Back</h2>
          <p className="text-text-muted text-sm mb-8 italic">Log in to your account to continue managing tasks.</p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-text-muted/60 uppercase tracking-widest mb-2 font-sans">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted/40 group-focus-within:text-primary-400 transition-colors" size={18} />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-surface-dark/50 border border-border-muted/50 rounded-xl py-3 pl-12 pr-4 text-text-bright placeholder:text-text-muted/30 focus:outline-none focus:ring-2 focus:ring-primary-400/20 focus:border-primary-400/50 transition-all font-medium" 
                    placeholder="name@company.com" 
                    required 
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[11px] font-bold text-text-muted/60 uppercase tracking-widest font-sans">Password</label>
                  <button 
                    type="button"
                    onClick={() => alert("Password reset functionality is being set up. Please contact support if you're locked out.")}
                    className="text-[10px] font-bold text-primary-400 hover:text-primary-300 transition-colors uppercase tracking-tight"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted/40 group-focus-within:text-primary-400 transition-colors" size={18} />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-surface-dark/50 border border-border-muted/50 rounded-xl py-3 pl-12 pr-4 text-text-bright placeholder:text-text-muted/30 focus:outline-none focus:ring-2 focus:ring-primary-400/20 focus:border-primary-400/50 transition-all font-medium" 
                    placeholder="••••••••" 
                    required 
                  />
                </div>
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium rounded-xl flex items-start gap-3"
              >
                <div className="mt-0.5 min-w-max">
                  <ArrowRight size={14} className="rotate-180" />
                </div>
                <p className="leading-relaxed">{error}</p>
              </motion.div>
            )}

            <button 
              disabled={loading}
              className="w-full bg-primary-400 hover:bg-primary-300 text-surface-dark font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary-400/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <span className="flex items-center gap-2">Sign In <ArrowRight size={18} /></span>}
            </button>
          </form>

          <div className="mt-8 flex items-center gap-4">
            <div className="h-px bg-border-muted/30 flex-1"></div>
            <span className="text-[10px] font-bold text-text-muted/40 uppercase tracking-[0.2em] whitespace-nowrap">Secure Options</span>
            <div className="h-px bg-border-muted/30 flex-1"></div>
          </div>

          <button 
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="mt-8 w-full py-4 bg-surface-dark border border-border-muted rounded-xl flex items-center justify-center gap-3 text-text-bright font-bold hover:bg-surface-lighter transition-all shadow-xl active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
          >
            <Chrome size={20} className="text-primary-400" />
            Continue with Google
          </button>

          <div className="mt-8 pt-8 border-t border-border-muted/50 text-center">
            <p className="text-sm text-text-muted">
              Don't have an account? <Link to="/register" className="font-bold text-primary-400 hover:underline">Create one for free</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
