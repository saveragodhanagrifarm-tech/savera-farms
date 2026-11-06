'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50 flex flex-col gap-3 max-w-sm w-full px-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start p-4 rounded-2xl shadow-floating border backdrop-blur-md transition-all duration-300 transform translate-y-0 ${
            toast.type === 'success'
              ? 'bg-savera-dark/95 border-savera-green/40 text-white'
              : toast.type === 'error'
              ? 'bg-red-900/95 border-red-500/40 text-white'
              : 'bg-savera-brown/95 border-savera-saffron/40 text-white'
          }`}
        >
          <div className="mr-3 mt-0.5">
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-savera-lightGreen" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-400" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-savera-saffron" />}
          </div>
          <div className="flex-1">
            <h4 className="text-xs font-bold tracking-wide uppercase opacity-90">{toast.title}</h4>
            <p className="text-xs mt-0.5 opacity-90 leading-snug">{toast.message}</p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="ml-2 text-white/60 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
