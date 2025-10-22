import React from 'react';

/**
 * A skeleton card component to be displayed while content is loading.
 *
 * @returns {JSX.Element} The rendered skeleton card.
 */
export const SkeletonCard: React.FC = () => {
    return (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 shadow-md animate-pulse">
            <div className="flex justify-between items-center mb-4">
                <div className="h-6 bg-gray-700 rounded w-1/3"></div>
                <div className="flex items-center space-x-2">
                    <div className="h-6 w-6 bg-gray-700 rounded-full"></div>
                    <div className="h-6 w-6 bg-gray-700 rounded-full"></div>
                </div>
            </div>
            <div className="space-y-3">
                <div className="h-4 bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            </div>
        </div>
    );
};
