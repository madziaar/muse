import { useState, useCallback } from 'react';
import { GeneratedContent } from '../types';
import { MAX_HISTORY_SIZE } from '../lib/constants';

export const useGenerationHistory = () => {
    const [history, setHistory] = useState<GeneratedContent[]>([]);
    const [activeResult, setActiveResult] = useState<GeneratedContent | null>(null);

    const addGeneration = useCallback((newGeneration: GeneratedContent) => {
        setHistory(prev => [newGeneration, ...prev].slice(0, MAX_HISTORY_SIZE));
        setActiveResult(newGeneration);
    }, []);

    const setActiveById = useCallback((id: string) => {
        setHistory(prev => {
            const found = prev.find(item => item.id === id);
            if (found) {
                setActiveResult(found);
            }
            return prev;
        });
    }, []);

    return {
        history,
        activeResult,
        addGeneration,
        setActiveById,
    };
};