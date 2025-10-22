import React, { useState, useCallback, ChangeEvent } from 'react';
import { PromptInput } from '../components/PromptInput';
import { ResultCard } from '../components/ResultCard';
import { EmptyState } from '../components/EmptyState';
import { SkeletonCard } from '../components/SkeletonCard';
import { useAppContext } from '../hooks/useAppContext';
import { generateCreativeAssets, refineCreativeAssets, regenerateLyrics, regenerateParameters, regenerateRiffusionPrompt, regenerateSongStructure } from '../services/geminiService';
import { GeneratedContent, RiffusionParameters } from '../types';
import { useTranslation } from '../hooks/useTranslation';
import { Accordion } from '../components/Accordion';
import { ParameterSlider } from '../components/ParameterSlider';
import { WandIcon, DownloadIcon, UploadIcon, ClipboardListIcon } from '../components/Icons';
import { useDebounce } from '../hooks/useDebounce';

type GenerationMode = 'lyrics' | 'instrumental';

interface MuseProps {
    history: GeneratedContent[];
    activeResult: GeneratedContent | null;
    addGeneration: (newGeneration: GeneratedContent) => void;
    setActiveById: (id: string) => void;
}

export const Muse: React.FC<MuseProps> = ({ history, activeResult, addGeneration, setActiveById }) => {
    const { addToast, musePrompt } = useAppContext();
    const { t, language } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingPart, setIsLoadingPart] = useState<string | null>(null);
    const [generationMode, setGenerationMode] = useState<GenerationMode>('lyrics');

    // State for restored features
    const [isRefining, setIsRefining] = useState(false);
    const [refineQuery, setRefineQuery] = useState('');
    const [isRefineLoading, setIsRefineLoading] = useState(false);
    const [negativePrompt, setNegativePrompt] = useState('');
    const [advancedParams, setAdvancedParams] = useState<Partial<RiffusionParameters>>({});
    const [liveParameters, setLiveParameters] = useState<RiffusionParameters | null>(null);

    const debouncedParams = useDebounce(liveParameters, 300);

    React.useEffect(() => {
        if (activeResult) {
            setLiveParameters(activeResult.parameters);
        }
    }, [activeResult]);

    React.useEffect(() => {
        if (debouncedParams && activeResult && JSON.stringify(debouncedParams) !== JSON.stringify(activeResult.parameters)) {
             const newContent = { ...activeResult, parameters: debouncedParams, id: Date.now().toString() };
             addGeneration(newContent);
        }
    }, [debouncedParams, activeResult, addGeneration]);
    
    const handleGenerate = async () => {
        setIsLoading(true);
        try {
            const result = await generateCreativeAssets(musePrompt, language, generationMode, undefined, negativePrompt, advancedParams);
            addGeneration(result);
        } catch (error) {
            addToast(String(error), 'error');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleRegeneratePart = useCallback(async (part: keyof GeneratedContent | 'parameters', context: GeneratedContent) => {
        if (!context) return;
        setIsLoadingPart(part);
        try {
            let newPartValue;
            switch (part) {
                case 'riffusionPrompt':
                    newPartValue = await regenerateRiffusionPrompt(context, language);
                    break;
                case 'lyrics':
                    newPartValue = await regenerateLyrics(context, language);
                    break;
                case 'songStructure':
                    newPartValue = await regenerateSongStructure(context, language);
                    break;
                case 'parameters':
                    newPartValue = await regenerateParameters(context, language);
                    break;
                default:
                    throw new Error("Unknown part to regenerate");
            }
            const newContent = { ...context, [part]: newPartValue, id: Date.now().toString() };
            addGeneration(newContent);
        } catch (error) {
            addToast(String(error), 'error');
        } finally {
            setIsLoadingPart(null);
        }
    }, [addToast, language, addGeneration]);
    
    const handleRefine = async () => {
        if (!activeResult || !refineQuery.trim()) return;
        setIsRefineLoading(true);
        try {
            const refinedResult = await refineCreativeAssets(activeResult, refineQuery, language);
            addGeneration(refinedResult);
            setRefineQuery('');
            setIsRefining(false);
        } catch (error) {
            addToast(String(error), 'error');
        } finally {
            setIsRefineLoading(false);
        }
    };

    const handleParamSliderChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!liveParameters) return;
        const { name, value } = e.target;
        setLiveParameters({ ...liveParameters, [name]: parseFloat(value) });
    };

    const handleCopyAll = () => {
        if (!activeResult) return;
        const { riffusionPrompt, lyrics, songStructure, parameters } = activeResult;
        const fullText = `
## Riffusion Prompt
${riffusionPrompt}

## Lyrics / Guide
${lyrics}

## Structure
${songStructure}

## Parameters
${JSON.stringify(parameters, null, 2)}
        `;
        navigator.clipboard.writeText(fullText.trim()).then(() => {
            addToast('All content copied!', 'success');
        }).catch(err => addToast('Failed to copy content.', 'error'));
    };
    
    const handleSaveSession = () => {
        if (!activeResult) return;
        const sessionData = { activeResult, history };
        const blob = new Blob([JSON.stringify(sessionData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `riffusion-muse-session-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleLoadSession = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const sessionData = JSON.parse(event.target?.result as string);
                    if (sessionData.activeResult && sessionData.history) {
                        addGeneration(sessionData.activeResult); // This sets it active and adds to history
                    }
                } catch (err) {
                    addToast('Failed to load session file.', 'error');
                }
            };
            reader.readAsText(file);
        }
    };


    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700 shadow-lg mb-8">
                 <div className="flex items-center justify-between mb-4">
                    <div className="relative bg-gray-800 rounded-full p-1 flex">
                        <button onClick={() => setGenerationMode('lyrics')} className={`px-4 py-1.5 text-sm font-semibold rounded-full relative z-10 transition-colors duration-300 ${generationMode === 'lyrics' ? 'text-white' : 'text-gray-400'}`}>Lyrics</button>
                        <button onClick={() => setGenerationMode('instrumental')} className={`px-4 py-1.5 text-sm font-semibold rounded-full relative z-10 transition-colors duration-300 ${generationMode === 'instrumental' ? 'text-white' : 'text-gray-400'}`}>Instrumental</button>
                        <div className={`absolute top-1 bottom-1 bg-cyan-600 rounded-full transition-transform duration-300 ease-in-out ${generationMode === 'instrumental' ? 'transform translate-x-full' : ''}`} style={{ width: 'calc(50% - 4px)', margin: '0 2px' }}></div>
                    </div>
                     {history.length > 0 && (
                        <select 
                            onChange={(e) => setActiveById(e.target.value)} 
                            value={activeResult?.id || ''}
                            className="bg-gray-800 border-gray-600 rounded-md text-sm text-gray-300 focus:ring-cyan-500 focus:border-cyan-500"
                        >
                            {history.map(item => <option key={item.id} value={item.id}>{item.originalIdea.substring(0, 40)}...</option>)}
                        </select>
                    )}
                </div>
                <PromptInput onGenerate={handleGenerate} isLoading={isLoading} />
                 <Accordion title="Advanced Parameters">
                    <div className="space-y-4 pt-2">
                        <input type="text" value={negativePrompt} onChange={e => setNegativePrompt(e.target.value)} placeholder="Negative prompt (e.g., quiet, acoustic)" className="w-full bg-gray-800 border-gray-600 rounded-md p-2 text-sm" />
                        <div className="grid grid-cols-2 gap-4">
                            <input type="text" value={advancedParams.scheduler || ''} onChange={e => setAdvancedParams(p => ({...p, scheduler: e.target.value}))} placeholder="Scheduler (e.g., DDIM)" className="w-full bg-gray-800 border-gray-600 rounded-md p-2 text-sm" />
                            <input type="text" value={advancedParams.seed_image_id || ''} onChange={e => setAdvancedParams(p => ({...p, seed_image_id: e.target.value}))} placeholder="Seed ID (e.g., cosmic-train-77)" className="w-full bg-gray-800 border-gray-600 rounded-md p-2 text-sm" />
                        </div>
                    </div>
                </Accordion>
            </div>

            {isLoading && <SkeletonCard />}
            
            {!isLoading && activeResult && (
                <div className="space-y-6">
                    <ResultCard
                        content={activeResult}
                        onRegenerate={handleRegeneratePart}
                        isLoadingPart={isLoadingPart}
                    />
                    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 space-y-4">
                        <h3 className="font-bold text-lg text-gray-200">Tune Parameters</h3>
                        {liveParameters && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                               <ParameterSlider name="denoising" label="Denoising" value={liveParameters.denoising} onChange={handleParamSliderChange} min={0} max={1} step={0.01} tooltip="Higher values = more creative" />
                               <ParameterSlider name="prompt_strength" label="Prompt Strength" value={liveParameters.prompt_strength} onChange={handleParamSliderChange} min={0} max={1} step={0.01} tooltip="How much the prompt influences the output" />
                               <ParameterSlider name="num_inference_steps" label="Inference Steps" value={liveParameters.num_inference_steps} onChange={handleParamSliderChange} min={10} max={150} step={1} tooltip="Number of generation steps" />
                            </div>
                        )}
                        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-700">
                             <button onClick={() => setIsRefining(s => !s)} className="flex items-center gap-2 text-sm font-semibold text-cyan-400 hover:text-cyan-300">
                                <WandIcon className="w-5 h-5" /> Refine
                            </button>
                            <div className="flex items-center gap-2">
                                <button onClick={handleCopyAll} title="Copy All" className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-700"><ClipboardListIcon className="w-5 h-5"/></button>
                                <button onClick={handleSaveSession} title="Save Session" className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-700"><DownloadIcon className="w-5 h-5"/></button>
                                <label htmlFor="load-session" className="cursor-pointer p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-700"><UploadIcon className="w-5 h-5"/></label>
                                <input id="load-session" type="file" accept=".json" onChange={handleLoadSession} className="hidden" />
                            </div>
                        </div>
                         {isRefining && (
                            <div className="space-y-2 pt-2 animate-fade-in">
                                <textarea value={refineQuery} onChange={e => setRefineQuery(e.target.value)} placeholder="Your refinement instructions (e.g., 'make the lyrics more hopeful', 'add a guitar solo')" rows={2} className="w-full bg-gray-800 border-gray-600 rounded-md p-2 text-sm"/>
                                <div className="flex justify-end gap-2">
                                    <button onClick={() => setIsRefining(false)} className="px-3 py-1 text-sm rounded-md bg-gray-600 hover:bg-gray-500">Cancel</button>
                                    <button onClick={handleRefine} disabled={isRefineLoading} className="px-3 py-1 text-sm rounded-md bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600">{isRefineLoading ? 'Refining...' : 'Submit'}</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
            
            {!isLoading && !activeResult && <EmptyState />}
        </div>
    );
};