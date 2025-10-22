import React from 'react';

export const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
);
