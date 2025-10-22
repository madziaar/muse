import React, { useCallback } from 'react';
import { Tabs } from './components/Tabs';
import { Muse } from './features/Muse';
import { Explorer } from './features/Explorer';
import { Researcher } from './features/Researcher';
import { Analyzer } from './features/Analyzer';
import { Chat } from './features/Chat';
import { useAppContext } from './hooks/useAppContext';
import { useTranslation } from './hooks/useTranslation';
import { BrainCircuitIcon, CompassIcon, SearchIcon, VideoIcon, ChatIcon } from './components/Icons';
import { ToastContainer } from './components/ToastContainer';
import { useGenerationHistory } from './hooks/useGenerationHistory';
import { GeneratedContent, Tab } from './types';


function App() {
    const { activeTab, setActiveTab, toasts, dismissToast } = useAppContext();
    const { history, activeResult, addGeneration, setActiveById } = useGenerationHistory();
    const { t } = useTranslation();

    const tabs: Tab[] = [
        { key: 'tabMuse', name: t('tabMuse'), icon: <BrainCircuitIcon /> },
        { key: 'tabExplorer', name: t('tabExplorer'), icon: <CompassIcon /> },
        { key: 'tabResearcher', name: t('tabResearcher'), icon: <SearchIcon /> },
        { key: 'tabAnalyzer', name: t('tabAnalyzer'), icon: <VideoIcon /> },
        { key: 'tabChat', name: t('tabChat'), icon: <ChatIcon /> },
    ];

    const handleGenerationComplete = useCallback((content: GeneratedContent) => {
        addGeneration(content);
        setActiveTab('tabMuse');
    }, [addGeneration, setActiveTab]);
    
    const renderActiveTab = () => {
        switch (activeTab) {
            case 'tabExplorer':
                return <Explorer />;
            case 'tabResearcher':
                return <Researcher />;
            case 'tabAnalyzer':
                return <Analyzer />;
            case 'tabChat':
                return <Chat onGenerationComplete={handleGenerationComplete} />;
            case 'tabMuse':
            default:
                return <Muse 
                    history={history} 
                    activeResult={activeResult} 
                    addGeneration={addGeneration}
                    setActiveById={setActiveById}
                />;
        }
    };

    return (
        <>
            <ToastContainer toasts={toasts} dismissToast={dismissToast} />
            <div className="bg-gray-900 text-white min-h-screen">
                <header className="bg-gray-800/30 backdrop-blur-md sticky top-0 z-40">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <h1 className="text-2xl font-bold text-cyan-400">Riffusion Muse</h1>
                        </div>
                        <Tabs tabs={tabs} />
                    </div>
                </header>
                <main>
                    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                        {renderActiveTab()}
                    </div>
                </main>
            </div>
        </>
    );
}

export default App;