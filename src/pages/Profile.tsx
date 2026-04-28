import React, { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Calendar, Edit2, Camera, Loader2, Check } from 'lucide-react';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { motion } from 'framer-motion';

const Profile = () => {
  const { profile, user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    bio: profile?.bio || '',
    avatar: profile?.avatar || ''
  });

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      await updateProfile(user, { 
        displayName: formData.name,
        photoURL: formData.avatar 
      });

      await updateDoc(doc(db, 'users', user.uid), {
        name: formData.name,
        bio: formData.bio,
        avatar: formData.avatar
      });

      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout title="My Profile">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl overflow-hidden mb-8 border border-border-muted shadow-2xl"
        >
          <div className="h-40 bg-gradient-to-r from-primary-600/30 to-indigo-900/30 relative border-b border-border-muted/50">
             <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary-400/20 via-transparent to-transparent"></div>
          </div>
          <div className="px-8 pb-8 -mt-16 flex flex-col md:flex-row md:items-end gap-6 relative z-10">
            <div className="relative group">
              {profile?.avatar ? (
                <img 
                  src={profile.avatar} 
                  alt={profile.name} 
                  className="w-32 h-32 rounded-3xl border-4 border-surface-lighter shadow-2xl object-cover" 
                />
              ) : (
                <div className="w-32 h-32 rounded-3xl border-4 border-surface-lighter bg-surface-dark shadow-2xl flex items-center justify-center text-primary-400 text-4xl font-bold">
                  {profile?.name?.charAt(0)}
                </div>
              )}
              <button 
                onClick={() => alert("Image upload feature is coming soon!")}
                className="absolute bottom-2 right-2 p-2 bg-surface-lighter rounded-lg shadow-lg text-text-muted hover:text-primary-400 transition-all opacity-0 group-hover:opacity-100 border border-border-muted"
              >
                <Camera size={16} />
              </button>
            </div>

            <div className="flex-1">
              <h2 className="text-3xl font-display font-bold text-text-bright">{profile?.name}</h2>
              <p className="text-text-muted font-medium flex items-center gap-2 mt-1 italic">
                {profile?.bio || 'No bio yet.'}
              </p>
            </div>

            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="btn-secondary flex items-center gap-2 h-fit"
            >
              {isEditing ? <Check size={18} /> : <Edit2 size={18} />}
              {isEditing ? 'Save Changes' : 'Edit Profile'}
            </button>
          </div>
        </motion.div>

        {/* Details Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-6">
            <div className="glass-card p-6 rounded-2xl border-border-muted shadow-xl">
              <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-6">Account Info</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-surface-dark rounded-xl flex items-center justify-center text-text-muted border border-border-muted">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-text-muted/60 uppercase tracking-tight">Email</p>
                    <p className="text-sm font-semibold text-text-bright">{profile?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-surface-dark rounded-xl flex items-center justify-center text-text-muted border border-border-muted">
                    <Shield size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-text-muted/60 uppercase tracking-tight">Role</p>
                    <p className="text-sm font-semibold text-text-bright capitalize">{profile?.role}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="glass-card p-8 rounded-2xl h-full border-border-muted shadow-xl">
              <h3 className="text-lg font-display font-bold text-text-bright mb-8">Personal Information</h3>
              
              <form onSubmit={handleUpdate} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-text-muted mb-2">Display Name</label>
                    <input 
                      type="text" 
                      disabled={!isEditing}
                      value={formData.name || (profile?.name || '')}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="input-field disabled:bg-surface-dark/50 disabled:text-text-muted/50 disabled:border-border-muted/30" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-muted mb-2">Profile Image URL</label>
                    <input 
                      type="text" 
                      disabled={!isEditing}
                      value={formData.avatar || (profile?.avatar || '')}
                      onChange={e => setFormData({ ...formData, avatar: e.target.value })}
                      className="input-field disabled:bg-surface-dark/50 disabled:text-text-muted/50 disabled:border-border-muted/30" 
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text-muted mb-2">Bio</label>
                  <textarea 
                    rows={4} 
                    disabled={!isEditing}
                    value={formData.bio || (profile?.bio || '')}
                    onChange={e => setFormData({ ...formData, bio: e.target.value })}
                    className="input-field resize-none disabled:bg-surface-dark/50 disabled:text-text-muted/50 disabled:border-border-muted/30" 
                    placeholder="Tell us about yourself..."
                  />
                </div>

                {isEditing && (
                  <div className="flex justify-end gap-4 pt-4">
                    <button 
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={loading}
                      className="btn-primary min-w-[140px] flex items-center justify-center"
                    >
                      {loading ? <Loader2 className="animate-spin" size={18} /> : 'Save Changes'}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
