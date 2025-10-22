import { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';

/**
 * A custom hook to use the AppContext.
 *
 * @returns {AppContextType} The application context.
 */
export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
