import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { ADMIN_PASSWORD } from '../constants';
import { ShieldAlert, KeyRound, ArrowLeft } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useApp();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      login('admin@sona.edu', 'Club Admin', UserRole.ADMIN);
      navigate('/admin');
    } else {
      setError('Access Denied: Invalid Security Key');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden">
      {/* Warning Stripes Background Effect - Subtle */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), repeating-linear-gradient(45deg, #000 25%, #fff 25%, #fff 75%, #000 75%, #000)', backgroundPosition: '0 0, 10px 10px', backgroundSize: '20px 20px' }}>
      </div>

      <div className="w-full max-w-sm bg-surface border border-gray-200 rounded-3xl p-10 shadow-soft relative z-10">
        <button onClick={() => navigate('/')} className="absolute top-6 left-6 text-secondary hover:text-primary transition-colors">
            <ArrowLeft size={20} />
        </button>

        <div className="flex flex-col items-center mb-8 pt-4">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4 text-red-500 animate-pulse">
            <ShieldAlert size={32} />
          </div>
          <h2 className="text-2xl font-bold text-primary">Admin Portal</h2>
          <p className="text-secondary text-xs mt-1 uppercase tracking-widest font-semibold">Restricted Access</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-primary uppercase tracking-wider">Security Key</label>
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                className="w-full bg-gray-50 border border-gray-200 text-primary rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all placeholder:text-gray-400 font-medium"
                placeholder="Enter Access Code"
              />
            </div>
            {error && <p className="text-red-500 text-xs font-bold animate-pulse">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-gray-800 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-gray-200"
          >
            Authenticate
          </button>
        </form>
      </div>
    </div>
  );
};