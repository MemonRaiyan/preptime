'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Mail, Lock, User, CheckCircle2, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { loginUser, registerUser } = useApp();
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (activeTab === 'signup' && !name) {
      setError('Please enter your name.');
      return;
    }

    if (activeTab === 'login') {
      const successLogin = loginUser(email, password);
      if (successLogin) {
        setSuccess('Logged in successfully!');
        setTimeout(() => {
          onClose();
          // Reset form
          setEmail('');
          setPassword('');
          setSuccess(null);
        }, 1000);
      } else {
        setError('Invalid email or password. Please try again.');
      }
    } else {
      const successSignup = registerUser(email, password, name);
      if (successSignup) {
        setSuccess('Account created and logged in!');
        setTimeout(() => {
          onClose();
          // Reset form
          setEmail('');
          setPassword('');
          setName('');
          setSuccess(null);
        }, 1000);
      } else {
        setError('Email already exists. Try logging in.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col p-6 space-y-6 animate-scale-up">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black text-slate-900 dark:text-white">
            {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
          <button
            onClick={() => { setActiveTab('login'); setError(null); }}
            className={`py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'login'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            Log In
          </button>
          <button
            onClick={() => { setActiveTab('signup'); setError(null); }}
            className={`py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'signup'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Feedback Alert */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center space-x-2.5 text-xs text-rose-600 dark:text-rose-400">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center space-x-2.5 text-xs text-emerald-600 dark:text-emerald-400 animate-pulse">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {activeTab === 'signup' && (
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Dr. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl pl-10 pr-4 py-3 text-slate-900 dark:text-white outline-none focus:border-teal-500"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="email"
                placeholder="doctor@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl pl-10 pr-4 py-3 text-slate-900 dark:text-white outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl pl-10 pr-4 py-3 text-slate-900 dark:text-white outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 rounded-2xl shadow-lg transition-all"
          >
            {activeTab === 'login' ? 'Sign In to My Account' : 'Register & Start Preparation'}
          </button>
        </form>

        <div className="text-center text-3xs text-slate-400">
          Your credentials and prep logs are safely saved locally on this browser.
        </div>

      </div>
    </div>
  );
};
