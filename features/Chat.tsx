import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useAppContext } from '../hooks/useAppContext';
import { startChat, generateAssetsFromChatHistory } from '../services/geminiService';
import { ChatMessage, GeneratedContent } from '../types';
import { Chat as GeminiChat } from '@google/genai';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { WandIcon } from '../components/Icons';

/**
 * A chat component that allows users to interact with a Gemini chat bot to generate music ideas.
 *
 * @param {object} props - The component props.
 * @param {(content: GeneratedContent) => void} props.onGenerationComplete - The function to call when the generation is complete.
 * @returns {JSX.Element} The rendered Chat component.
 */
export const Chat: React.FC<{ onGenerationComplete: (content: GeneratedContent) => void }> = ({ onGenerationComplete }) => {
    const { t, language } = useTranslation();
    const { addToast } = useAppContext();
    const [chat, setChat] = useState<GeminiChat | null>(null);
    const [history, setHistory] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const initialHistory: ChatMessage[] = [{ role: 'model', parts: [{ text: t('chatWelcome') }] }];
        setHistory(initialHistory);
        const geminiHistory = initialHistory.map(m => ({ role: m.role, parts: m.parts }));
        const chatSession = startChat(language, geminiHistory);
        setChat(chatSession);
    }, [language, t]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [history]);

    const sendMessage = async (message: string) => {
        if (!chat || isLoading || !message.trim()) return;

        setIsLoading(true);
        const newUserMessage: ChatMessage = { role: 'user', parts: [{ text: message }] };
        setHistory(prev => [...prev, newUserMessage]);

        try {
            const result = await chat.sendMessage({ message });
            let responseText = result.text;

            if (responseText.includes('[COMPLETE]')) {
                responseText = responseText.replace('[COMPLETE]', '').trim();
                setIsComplete(true);
            }
            const newModelMessage: ChatMessage = { role: 'model', parts: [{ text: responseText }] };
            setHistory(prev => [...prev, newModelMessage]);
        } catch (error) {
            addToast(String(error), 'error');
            setHistory(prev => prev.slice(0, -1)); // Remove user message on error
        } finally {
            setIsLoading(false);
            setInput('');
        }
    };
    
    const handleFinalize = async () => {
        setIsLoading(true);
        try {
            const result = await generateAssetsFromChatHistory(history, language);
            onGenerationComplete(result);
        } catch (error) {
            addToast(String(error), 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const parseMessage = (text: string) => {
        const suggestionRegex = /\[SUGGESTION\](.*?)\[\/SUGGESTION\]/g;
        const parts = [];
        let lastIndex = 0;
        let match;

        while ((match = suggestionRegex.exec(text)) !== null) {
            if (match.index > lastIndex) {
                parts.push(text.substring(lastIndex, match.index));
            }
            parts.push(<button key={match.index} onClick={() => sendMessage(match[1])} title={t('chatSuggestionTooltip')} className="inline-block bg-cyan-800/50 text-cyan-300 border border-cyan-700 px-3 py-1 m-1 rounded-full text-sm hover:bg-cyan-700/50">{match[1]}</button>);
            lastIndex = match.index + match[0].length;
        }

        if (lastIndex < text.length) {
            parts.push(text.substring(lastIndex));
        }
        return parts;
    };


    return (
        <div className="max-w-3xl mx-auto h-[70vh] flex flex-col bg-gray-800/50 border border-gray-700 rounded-lg">
            <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto space-y-4">
                {history.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-lg p-3 rounded-lg ${msg.role === 'user' ? 'bg-cyan-800 text-white' : 'bg-gray-700 text-gray-300'}`}>
                            {parseMessage(msg.parts[0].text)}
                        </div>
                    </div>
                ))}
                {isLoading && (
                     <div className="flex justify-start">
                        <div className="max-w-lg p-3 rounded-lg bg-gray-700 text-gray-300">
                           <LoadingSpinner />
                        </div>
                    </div>
                )}
            </div>
            {isComplete && (
                <div className="p-4 border-t border-gray-700 text-center bg-gray-900/50">
                     <button
                        onClick={handleFinalize}
                        disabled={isLoading}
                        title={t('chatFinalizeTooltip')}
                        className="inline-flex items-center justify-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-fuchsia-600 hover:bg-fuchsia-700 disabled:bg-gray-600"
                    >
                        {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <WandIcon className="w-5 h-5 mr-2" />}
                        {isLoading ? t('chatFinalizing') : t('chatFinalize')}
                    </button>
                </div>
            )}
            <div className="p-4 border-t border-gray-700">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
                    placeholder={t('chatInputPlaceholder')}
                    className="w-full bg-gray-700 border-gray-600 rounded-full shadow-sm focus:ring-cyan-500 focus:border-cyan-500 text-gray-200 py-2 px-4"
                    disabled={isLoading || isComplete}
                />
            </div>
        </div>
    );
};
