import React, { createContext, useState, useMemo, useCallback } from 'react';
import { AppContextType, ToastNotification } from '../types';

/**
 * The application context.
 *
 * @type {React.Context<AppContextType | undefined>}
 */
export const AppContext = createContext<AppContextType | undefined>(undefined);

/**
 * The provider for the application context.
 *
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The child components.
 * @returns {JSX.Element} The rendered provider.
 */
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [musePrompt, setMusePrompt] = useState<string>('');
    const [activeTab, setActiveTab] = useState<AppContextType['activeTab']>('tabMuse');
    const [toasts, setToasts] = useState<ToastNotification[]>([]);

    const addToast = useCallback((message: string, type: ToastNotification['type']) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
    }, []);

    const dismissToast = useCallback((id: number) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const value = useMemo(() => ({
        musePrompt,
        setMusePrompt,
        activeTab,
        setActiveTab,
        addToast,
        toasts,
        dismissToast,
    }), [musePrompt, activeTab, addToast, toasts]);

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};