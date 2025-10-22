import React, { useState, useMemo } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useAppContext } from '../hooks/useAppContext';
import { genres } from '../data/genres';
import { tags } from '../data/tags';
import { Accordion } from '../components/Accordion';
import { XCircleIcon } from '../components/Icons';

const MAX_TAGS_DISPLAY = 200;

export const Explorer: React.FC = () => {
    const { t } = useTranslation();
    const { addToast, setMusePrompt, setActiveTab } = useAppContext();
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredTags = useMemo(() => {
        if (!searchQuery) {
            return tags.slice(0, MAX_TAGS_DISPLAY);
        }
        return tags.filter(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [searchQuery]);

    const toggleTag = (tag: string) => {
        setSelectedTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    const handleSendToMuse = () => {
        if (selectedTags.length === 0) {
            addToast(t('toastSelectTagsFirst'), 'error');
            return;
        }
        setMusePrompt(selectedTags.join(', '));
        setActiveTab('tabMuse');
        addToast(t('toastSentToMuse'), 'success');
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <h3 className="text-lg font-bold mb-3">{t('explorerYourPrompt')}</h3>
                    <div className="p-3 bg-gray-900 rounded-md min-h-[6rem] text-gray-300 flex flex-wrap gap-2 items-start">
                        {selectedTags.length > 0 ? selectedTags.map(tag => (
                            <span key={tag} className="flex items-center gap-1.5 bg-cyan-800/50 text-cyan-300 px-2 py-1 rounded text-sm">
                                {tag}
                                <button onClick={() => toggleTag(tag)} title={t('explorerRemoveTagTooltip', { tag })}>
                                    <XCircleIcon className="w-4 h-4" />
                                </button>
                            </span>
                        )) : <p className="text-gray-500">{t('explorerPromptPlaceholder')}</p>}
                    </div>
                     <div className="mt-4 flex justify-end gap-3">
                        <button onClick={() => setSelectedTags([])} className="text-sm font-semibold text-gray-400 hover:text-white">{t('explorerClear')}</button>
                        <button onClick={handleSendToMuse} className="text-sm font-semibold text-cyan-400 hover:text-cyan-300">{t('explorerSendToMuse')} &rarr;</button>
                    </div>
                </div>

                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <h3 className="text-lg font-bold mb-3">{t('explorerTagFinder')}</h3>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t('explorerTagSearchPlaceholder', { tagCount: tags.length.toLocaleString() })}
                        className="w-full bg-gray-800 border-gray-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 text-gray-200 p-2 mb-3"
                    />
                    <div className="flex flex-wrap gap-2 max-h-80 overflow-y-auto">
                        {filteredTags.map(tag => (
                            <button key={tag} onClick={() => toggleTag(tag)} title={t('explorerAddTagTooltip', {tag})} className={`px-2 py-1 rounded text-xs transition-colors ${selectedTags.includes(tag) ? 'bg-cyan-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
                                {tag}
                            </button>
                        ))}
                    </div>
                     {!searchQuery && <p className="text-xs text-gray-500 mt-2">{t('explorerShowingFirstTags')}</p>}
                </div>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 max-h-[80vh] overflow-y-auto">
                <h3 className="text-lg font-bold mb-3">{t('explorerGenreExplorer')}</h3>
                {genres.map(genre => (
                    <Accordion key={genre.name} title={genre.name}>
                        <div className="flex flex-wrap gap-2">
                             <button onClick={() => toggleTag(genre.name.toLowerCase())} title={t('explorerAddTagTooltip', {tag: genre.name.toLowerCase()})} className={`px-2 py-1 rounded text-xs font-bold transition-colors ${selectedTags.includes(genre.name.toLowerCase()) ? 'bg-cyan-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
                                {genre.name}
                            </button>
                            {genre.subgenres.map(sub => (
                                <button key={sub} onClick={() => toggleTag(sub.toLowerCase())} title={t('explorerAddTagTooltip', {tag: sub.toLowerCase()})} className={`px-2 py-1 rounded text-xs transition-colors ${selectedTags.includes(sub.toLowerCase()) ? 'bg-cyan-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
                                    {sub}
                                </button>
                            ))}
                        </div>
                    </Accordion>
                ))}
            </div>
        </div>
    );
};