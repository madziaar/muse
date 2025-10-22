import { Content } from "@google/genai";
// FIX: Replaced incorrect import with the definition of AppContextType to resolve a circular dependency and export errors.
import React from 'react';

export type Language = 'en' | 'pl';

export interface RiffusionParameters {
    denoising: number;
    prompt_strength: number;
    num_inference_steps: number;
    seed_image_id: string;
    scheduler?: string;
}

export interface GeneratedContent {
    id: string;
    originalIdea: string; // The original prompt used to generate this content
    riffusionPrompt: string;
    negativePrompt?: string;
    lyrics: string;
    songStructure: string;
    parameters: RiffusionParameters;
    generationMode: 'lyrics' | 'instrumental';
}

export interface ChatMessage {
    role: 'user' | 'model';
    parts: [{ text: string }];
}

export interface ToastNotification {
    id: number;
    message: string;
    type: 'success' | 'error' | 'info';
}

export type ActiveTab = 'tabMuse' | 'tabExplorer' | 'tabResearcher' | 'tabAnalyzer' | 'tabChat';

export interface AppContextType {
    musePrompt: string;
    setMusePrompt: React.Dispatch<React.SetStateAction<string>>;
    activeTab: ActiveTab;
    setActiveTab: React.Dispatch<React.SetStateAction<ActiveTab>>;
    toasts: ToastNotification[];
    addToast: (message: string, type: ToastNotification['type']) => void;
    dismissToast: (id: number) => void;
}

export interface Tab {
    key: AppContextType['activeTab'];
    name: string;
    icon: React.ReactNode;
}
