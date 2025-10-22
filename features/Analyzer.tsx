import React, { useState, useRef } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useAppContext } from '../hooks/useAppContext';
import { analyzeVideo } from '../services/geminiService';
import { MAX_VIDEO_FILE_SIZE_BYTES } from '../lib/constants';
import { VideoIcon, XCircleIcon, SparklesIcon } from '../components/Icons';

export const Analyzer: React.FC = () => {
    const { t } = useTranslation();
    const { addToast, setMusePrompt, setActiveTab } = useAppContext();
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [prompt, setPrompt] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > MAX_VIDEO_FILE_SIZE_BYTES) {
                addToast(t('toastVideoTooLarge', { size: MAX_VIDEO_FILE_SIZE_BYTES / 1024 / 1024 }), 'error');
                return;
            }
            setVideoFile(file);
            setResult(null);
        }
    };
    
    const handleAnalyze = async () => {
        if (!videoFile) {
            addToast(t('toastSelectVideo'), 'error');
            return;
        }
        if (!prompt.trim()) {
            addToast(t('toastEnterAnalysisPrompt'), 'error');
            return;
        }
        setIsAnalyzing(true);
        setResult(null);
        try {
            const analysisResult = await analyzeVideo(videoFile, prompt);
            setResult(analysisResult);
            addToast(t('toastAnalysisComplete'), 'success');
        } catch (error) {
             addToast(String(error), 'error');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleSendToMuse = () => {
        if (result) {
            setMusePrompt(result);
            // FIX: Use the literal tab key 'tabMuse' instead of the translated string from t('tabMuse').
            setActiveTab('tabMuse');
            addToast(t('toastSentToMuse'), 'success');
        }
    };

    const removeFile = () => {
        setVideoFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-center">{t('analyzerTitle')}</h2>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">{t('analyzerUploadLabel')}</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                            <VideoIcon className="mx-auto h-12 w-12 text-gray-500" />
                            <div className="flex text-sm text-gray-400">
                                <label htmlFor="file-upload" className="relative cursor-pointer bg-gray-800 rounded-md font-medium text-cyan-400 hover:text-cyan-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-900 focus-within:ring-cyan-500">
                                    <span>Upload a file</span>
                                    <input id="file-upload" ref={fileInputRef} name="file-upload" type="file" accept="video/*" className="sr-only" onChange={handleFileChange} />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">MP4, MOV, AVI up to 50MB</p>
                        </div>
                    </div>
                    {videoFile && (
                        <div className="mt-2 flex items-center justify-between bg-gray-800 p-2 rounded-md">
                            <p className="text-sm text-gray-300 truncate">{videoFile.name}</p>
                            <button onClick={removeFile} className="p-1 text-gray-400 hover:text-white" title={t('analyzerRemoveFile')}>
                                <XCircleIcon className="w-5 h-5"/>
                            </button>
                        </div>
                    )}
                </div>
                <div>
                    <textarea
                        rows={3}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder={t('analyzerPromptPlaceholder')}
                        className="block w-full bg-gray-800 border-gray-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm text-gray-200 p-2"
                        disabled={isAnalyzing}
                    />
                </div>
                <div className="text-center">
                    <button
                        onClick={handleAnalyze}
                        disabled={!videoFile || !prompt || isAnalyzing}
                        className="inline-flex items-center justify-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 min-w-[150px]"
                    >
                        {isAnalyzing ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <SparklesIcon className="w-5 h-5 mr-2" />}
                        {isAnalyzing ? t('analyzerButtonLoading') : t('analyzerButton')}
                    </button>
                </div>
            </div>

            {result && (
                <div className="mt-8 animate-fade-in">
                    <h3 className="text-xl font-bold mb-2">{t('analyzerResultTitle')}</h3>
                    <div className="p-4 bg-gray-800/50 rounded-md border border-gray-700">
                        <p className="text-gray-300 whitespace-pre-wrap">{result}</p>
                    </div>
                    <div className="mt-3 text-right">
                        <button onClick={handleSendToMuse} className="text-sm font-semibold text-cyan-400 hover:text-cyan-300">
                             {t('researcherUsePrompt')} &rarr;
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
