import React, { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useAppContext } from '../hooks/useAppContext';
import { summarizeText, generatePromptFromResearch } from '../services/ollamaService';
import { SearchIcon, WandIcon } from '../components/Icons';
import { LoadingSpinner } from '../components/LoadingSpinner';

/**
 * A feature that allows users to summarize a block of text and generate a prompt from the summary.
 *
 * @returns {JSX.Element} The rendered Summarizer component.
 */
export const Researcher: React.FC = () => {
    const { t } = useTranslation();
    const { addToast, setMusePrompt, setActiveTab } = useAppContext();
    const [textToSummarize, setTextToSummarize] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [result, setResult] = useState<{ text: string; sources: any[] } | null>(null);

    const handleSummarize = async () => {
        if (!textToSummarize.trim()) return;
        setIsLoading(true);
        setResult(null);
        try {
            const summaryResult = await summarizeText(textToSummarize);
            setResult(summaryResult);
        } catch (error) {
            addToast(String(error), 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGeneratePrompt = async () => {
        if (!result) return;
        setIsGenerating(true);
        try {
            const newPrompt = await generatePromptFromResearch(result.text);
            setMusePrompt(newPrompt);
            setActiveTab('tabMuse');
            addToast(t('toastSentToMuse'), 'success');
        } catch (error) {
            addToast(String(error), 'error');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="relative">
                <textarea
                    rows={5}
                    value={textToSummarize}
                    onChange={(e) => setTextToSummarize(e.target.value)}
                    placeholder={t('summarizerPlaceholder')}
                    className="w-full bg-gray-800 border-gray-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 text-gray-200 py-3 pl-5 pr-28"
                    disabled={isLoading}
                />
                <button
                    onClick={handleSummarize}
                    disabled={!textToSummarize.trim() || isLoading}
                    title={t('summarizerButtonTooltip')}
                    className="absolute top-1/2 right-2 transform -translate-y-1/2 flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600"
                >
                    <SearchIcon className="w-5 h-5" />
                    <span className="ml-2 hidden sm:block">{t('summarizerButton')}</span>
                </button>
            </div>
            
            {isLoading && <div className="pt-10"><LoadingSpinner /></div>}

            {result && (
                <div className="mt-8 animate-fade-in space-y-6">
                    <div>
                        <h3 className="text-xl font-bold mb-2">{t('summarizerResultsTitle')}</h3>
                        <div className="p-4 bg-gray-800/50 rounded-md border border-gray-700">
                            <p className="text-gray-300 whitespace-pre-wrap">{result.text}</p>
                        </div>
                    </div>
                    
                    <div className="text-center border-t border-gray-700 pt-6">
                         <h4 className="text-lg font-semibold mb-3">{t('summarizerTakeItFurther')}</h4>
                         <button
                            onClick={handleGeneratePrompt}
                            disabled={isGenerating}
                            title={t('summarizerGeneratePromptTooltip')}
                            className="inline-flex items-center justify-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-fuchsia-600 hover:bg-fuchsia-700 disabled:bg-gray-600"
                        >
                             {isGenerating ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <WandIcon className="w-5 h-5 mr-2" />}
                            {isGenerating ? t('summarizerGeneratePromptLoading') : t('summarizerGeneratePrompt')}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
