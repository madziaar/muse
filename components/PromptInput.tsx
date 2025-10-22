import React, { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { GenerateIcon, RefreshIcon, XCircleIcon } from './Icons';
import { getNewIdeas, suggestTags } from '../services/geminiService';
import { useDebounce } from '../hooks/useDebounce';
import { useAppContext } from '../hooks/useAppContext';

interface PromptInputProps {
    onGenerate: () => void;
    isLoading: boolean;
}

export const PromptInput: React.FC<PromptInputProps> = ({ onGenerate, isLoading }) => {
    const { t } = useTranslation();
    const { musePrompt, setMusePrompt, addToast } = useAppContext();
    const [ideas, setIdeas] = useState<string[]>([]);
    const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
    const [isSuggesting, setIsSuggesting] = useState(false);

    const debouncedPrompt = useDebounce(musePrompt, 500);

    const fetchNewIdeas = async () => {
        try {
            const newIdeas = await getNewIdeas();
            setIdeas(newIdeas);
        } catch (error) {
            addToast(String(error), 'error');
        }
    };

    useEffect(() => {
        fetchNewIdeas();
    }, []);

    useEffect(() => {
        const fetchTags = async () => {
            if (debouncedPrompt.trim().length > 10) {
                setIsSuggesting(true);
                try {
                    const tags = await suggestTags(debouncedPrompt);
                    setSuggestedTags(tags);
                } catch (error) {
                    // Fail silently, not critical
                    console.error("Failed to suggest tags:", error);
                } finally {
                    setIsSuggesting(false);
                }
            } else {
                setSuggestedTags([]);
            }
        };
        fetchTags();
    }, [debouncedPrompt]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
            e.preventDefault();
            if (musePrompt.trim()) {
                onGenerate();
            }
        }
    };

    const addTagToPrompt = (tag: string) => {
        setMusePrompt(prev => {
            const newPrompt = prev.trim();
            if (newPrompt.length === 0) return tag;
            if (newPrompt.endsWith(',')) return `${newPrompt} ${tag}`;
            return `${newPrompt}, ${tag}`;
        });
    };

    return (
        <div className="relative">
            <textarea
                value={musePrompt}
                onChange={(e) => setMusePrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={3}
                className="block w-full bg-gray-800 border-gray-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm text-gray-200 p-4 pr-32"
                placeholder={t('musePromptPlaceholder')}
            />
            {musePrompt && (
                 <button onClick={() => setMusePrompt('')} className="absolute top-3 right-24 p-1 text-gray-400 hover:text-white" title={t('clearInput')}>
                    <XCircleIcon className="w-5 h-5"/>
                </button>
            )}
            <button
                onClick={onGenerate}
                disabled={!musePrompt.trim() || isLoading}
                title={musePrompt.trim() ? t('museGenerateTooltip') : t('museGenerateDisabledTooltip')}
                className="absolute top-1/2 right-4 transform -translate-y-1/2 flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600"
            >
                {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                    <>
                        <GenerateIcon className="w-5 h-5 mr-2" />
                        {t('museGenerate')}
                    </>
                )}
            </button>
            
            <div className="mt-4">
                {suggestedTags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                         {suggestedTags.map(tag => (
                            <button 
                                key={tag} 
                                onClick={() => addTagToPrompt(tag)}
                                className="px-2 py-1 bg-gray-700 text-gray-300 text-xs font-mono rounded hover:bg-gray-600"
                            >
                                + {tag}
                            </button>
                        ))}
                    </div>
                )}
                <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-400">{t('museTryOne')}</span>
                    <div className="flex flex-wrap gap-2 items-center">
                        {ideas.slice(0, 3).map((idea, i) => (
                             <button
                                key={i}
                                onClick={() => setMusePrompt(idea)}
                                className="px-2 py-1 bg-gray-700/50 text-cyan-400 rounded-md hover:bg-gray-700"
                             >
                                {idea}
                            </button>
                        ))}
                        <button onClick={fetchNewIdeas} title={t('museNewIdeasTooltip')} className="p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-gray-700">
                            <RefreshIcon className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
