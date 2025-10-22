import React, { useEffect, useState } from 'react';
import { ToastNotification } from '../types';
import { TOAST_DURATION_MS } from '../lib/constants';

interface ToastProps {
    toast: ToastNotification;
    onDismiss: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setVisible(true); // Animate in
        const timer = setTimeout(() => {
            setVisible(false);
            setTimeout(onDismiss, 300); // Allow animation out
        }, TOAST_DURATION_MS);

        return () => clearTimeout(timer);
    }, [toast.id, onDismiss]);

    const typeClasses = {
        success: 'bg-green-600/80 border-green-500',
        error: 'bg-red-600/80 border-red-500',
        info: 'bg-blue-600/80 border-blue-500',
    };

    return (
        <div
            role="alert"
            className={`
                w-full p-4 text-white rounded-lg shadow-lg backdrop-blur-md border 
                transition-all duration-300 ease-in-out
                ${typeClasses[toast.type]}
                ${visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
            `}
        >
            <div className="flex items-start">
                <div className="flex-1 text-sm font-medium">{toast.message}</div>
                <button onClick={onDismiss} className="ml-4 -mr-1 -mt-1 p-1 rounded-full hover:bg-white/20">
                    &times;
                </button>
            </div>
        </div>
    );
};
