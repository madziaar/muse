import React from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { BrainCircuitIcon } from './Icons';

/**
 * A component to be displayed when there is no content to show.
 *
 * @returns {JSX.Element} The rendered empty state component.
 */
export const EmptyState: React.FC = () => {
    const { t } = useTranslation();
    return (
        <div className="text-center py-20 px-6 text-gray-400 animate-fade-in">
            <BrainCircuitIcon className="mx-auto h-16 w-16 text-gray-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-300 mb-2">{t('emptyStateTitle')}</h2>
            <p className="max-w-2xl mx-auto">{t('emptyStateDescription')}</p>
        </div>
    );
};
