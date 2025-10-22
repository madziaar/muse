import { useContext, useCallback } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { translations } from '../lib/translations';
import { Language } from '../types';

// Helper for replacing placeholders like {name}
const interpolate = (str: string, params: Record<string, string | number>): string => {
  let result = str;
  for (const key in params) {
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), String(params[key]));
  }
  return result;
};


export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  const { language } = context;

  const t = useCallback((key: keyof typeof translations[Language], params?: Record<string, string | number>) => {
    const translationString = translations[language][key] || translations['en'][key];
    if (params) {
        return interpolate(translationString, params);
    }
    return translationString;
  }, [language]);

  return { t, language, setLanguage: context.setLanguage };
};