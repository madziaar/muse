import React from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { AppContextType, Tab } from '../types';

/**
 * A component that displays a set of tabs for navigating between different views.
 *
 * @param {object} props - The component props.
 * @param {Tab[]} props.tabs - An array of tab objects to display.
 * @returns {JSX.Element} The rendered tabs component.
 */
export const Tabs: React.FC<{ tabs: Tab[] }> = ({ tabs }) => {
    const { activeTab, setActiveTab } = useAppContext();

    return (
        <div className="mb-6">
            <div className="sm:hidden">
                <select
                    id="tabs"
                    name="tabs"
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm rounded-md"
                    value={activeTab}
                    onChange={(e) => setActiveTab(e.target.value as AppContextType['activeTab'])}
                >
                    {tabs.map((tab) => (
                        <option key={tab.key} value={tab.key}>{tab.name}</option>
                    ))}
                </select>
            </div>
            <div className="hidden sm:block">
                <div className="border-b border-gray-700">
                    <nav className="-mb-px flex justify-center space-x-8" aria-label="Tabs">
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`${
                                    activeTab === tab.key
                                        ? 'border-cyan-500 text-cyan-400'
                                        : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
                                } group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200`}
                                aria-current={activeTab === tab.key ? 'page' : undefined}
                            >
                                <div className="mr-3 h-5 w-5">{tab.icon}</div>
                                <span>{tab.name}</span>
                            </button>
                        ))}
                    </nav>
                </div>
            </div>
        </div>
    );
};