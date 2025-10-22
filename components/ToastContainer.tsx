import React from 'react';
import { ToastNotification } from '../types';
import { Toast } from './Toast';

interface ToastContainerProps {
  toasts: ToastNotification[];
  dismissToast: (id: number) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, dismissToast }) => {
  return (
    <div 
      className="fixed top-4 right-4 z-50 w-full max-w-xs space-y-3"
      aria-live="polite"
      role="status"
    >
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onDismiss={() => dismissToast(toast.id)} />
      ))}
    </div>
  );
};
