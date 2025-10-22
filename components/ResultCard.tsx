import React, { useState } from 'react';
import { GeneratedContent } from '../types';
import { useTranslation } from '../hooks/useTranslation';
import { QuoteIcon, LyricsIcon, SlidersIcon, StructureIcon, RefreshIcon, CopyIcon, CheckIcon } from './Icons';
import { VisualStructure } from './VisualStructure';

interface ResultCardProps {
    content: GeneratedContent;
    onRegenerate: (part: keyof GeneratedContent | 'parameters', context: GeneratedContent) => Promise<void>;
    isLoadingPart: string | null;
}

export const ResultCard: React.FC<ResultCardProps> = ({ content, onRegenerate, isLoadingPart }) => {
    const { t } = useTranslation();
    const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});

    const handleCopy = (text: string, key: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopiedStates({ ...copiedStates, [key]: true });
            setTimeout(() => setCopiedStates(prev => ({ ...prev, [key]: false })), 2000);
        }).catch(err => {
            console.error(t('toastCopyFailed'), err);
        });
    };
    
    const renderContentBlock = (title: string, icon: React.ReactNode, contentKey: keyof GeneratedContent | 'parameters', textToCopy: string, children: React.ReactNode) => (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 shadow-md">
            <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-3">
                    <div className="text-cyan-400">{icon}</div>
                    <h3 className="font-bold text-lg text-gray-200">{title}</h3>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => onRegenerate(contentKey, content)}
                        disabled={!!isLoadingPart}
                        title={t('regenerateSection')}
                        className="p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-gray-700 disabled:opacity-50"
                    >
                        {isLoadingPart === contentKey ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <RefreshIcon className="w-5 h-5"/>}
                    </button>
                    <button
                        onClick={() => handleCopy(textToCopy, contentKey)}
                        title={t('copyToClipboard')}
                        className="p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-gray-700"
                    >
                        {copiedStates[contentKey] ? <CheckIcon className="w-5 h-5 text-green-400" /> : <CopyIcon className="w-5 h-5" />}
                    </button>
                </div>
            </div>
            {children}
        </div>
    );
    
    return (
        <div className="space-y-6 animate-fade-in">
            {renderContentBlock('Riffusion Prompt', <QuoteIcon />, 'riffusionPrompt', content.riffusionPrompt, (
                <p className="text-gray-300 font-mono text-sm leading-relaxed">{content.riffusionPrompt}</p>
            ))}
            
            {renderContentBlock(
                content.generationMode === 'lyrics' ? 'Lyrics' : 'Instrumental Guide',
                <LyricsIcon />,
                'lyrics',
                content.lyrics,
                <div className="text-gray-300 whitespace-pre-wrap max-h-96 overflow-y-auto text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: content.lyrics.replace(/\((.*?)\)/g, '<span class="text-gray-400 italic">($1)</span>') }}></div>
            )}
            
            {renderContentBlock('Song Structure', <StructureIcon />, 'songStructure', content.songStructure, (
                <VisualStructure structure={content.songStructure} />
            ))}

            {renderContentBlock('Parameters', <SlidersIcon />, 'parameters', JSON.stringify(content.parameters, null, 2), (
                <div className="space-y-4">
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                         <div className="font-mono text-sm">
                             <span className="text-gray-400">Seed ID: </span>
                             <span className="text-fuchsia-400 font-bold">{content.parameters.seed_image_id}</span>
                         </div>
                         {content.parameters.scheduler && (
                             <div className="font-mono text-sm">
                                 <span className="text-gray-400">Scheduler: </span>
                                 <span className="text-fuchsia-400 font-bold">{content.parameters.scheduler}</span>
                             </div>
                         )}
                    </div>
                </div>
            ))}
        </div>
    );
};
