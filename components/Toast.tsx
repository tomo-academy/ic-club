import React, { useEffect } from 'react';
import { CheckCircle, XCircle, X, AlertTriangle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const styles = {
    success: { bg: 'bg-white', border: 'border-green-100', icon: 'bg-green-50 text-green-600', title: 'text-green-800' },
    error: { bg: 'bg-white', border: 'border-red-100', icon: 'bg-red-50 text-red-600', title: 'text-red-800' },
    warning: { bg: 'bg-white', border: 'border-yellow-100', icon: 'bg-yellow-50 text-yellow-600', title: 'text-yellow-800' },
    info: { bg: 'bg-white', border: 'border-blue-100', icon: 'bg-blue-50 text-blue-600', title: 'text-blue-800' },
  };

  const style = styles[type];

  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle size={20} />;
      case 'error': return <XCircle size={20} />;
      case 'warning': return <AlertTriangle size={20} />;
      default: return <Info size={20} />;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border ${style.bg} ${style.border}`}>
        <div className={`p-2 rounded-full flex-shrink-0 ${style.icon}`}>
          {getIcon()}
        </div>
        <div className="mr-4">
           <h4 className={`font-bold text-sm capitalize ${style.title}`}>
             {type}
           </h4>
           <p className="text-sm text-gray-600 font-medium">{message}</p>
        </div>
        <button onClick={onClose} className="ml-auto text-gray-400 hover:text-gray-600 transition-colors">
          <X size={18} />
        </button>
      </div>
    </div>
  );
};