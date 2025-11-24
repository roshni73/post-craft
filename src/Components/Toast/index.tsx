import React from 'react';
import { useToast } from './ToastContext';
import type { ToastType } from './ToastContext';
import { X } from 'lucide-react';

const ToastItem: React.FC<{
  id: string;
  message: string;
  type: ToastType;
  onClose: (id: string) => void;
}> = ({ id, message, type, onClose }) => {
  const bgColors = {
    success: 'bg-green-500',
    error: 'bg-destructive',
    info: 'bg-blue-500',
  };

  return (
    <div
      className={`${bgColors[type]} text-white px-4 py-3 rounded shadow-lg flex items-center justify-between min-w-[300px] animate-in slide-in-from-right-full fade-in duration-300 mb-2`}
    >
      <span>{message}</span>
      <button onClick={() => onClose(id)} className="ml-4 hover:opacity-80 transition-opacity">
        <X size={18} />
      </button>
    </div>
  );
};

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={removeToast}
        />
      ))}
    </div>
  );
};

export * from './ToastContext';
