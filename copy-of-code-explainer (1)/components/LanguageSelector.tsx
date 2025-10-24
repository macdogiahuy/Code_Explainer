
import React from 'react';
import { Language } from '../types';

interface LanguageSelectorProps {
  selectedLanguage: Language;
  onSelectLanguage: (language: Language) => void;
}

const LANGUAGES: Language[] = ['Python', 'JavaScript', 'Java', 'C++'];

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ selectedLanguage, onSelectLanguage }) => {
  return (
    <div>
      <div className="flex space-x-2 p-1 bg-slate-800/60 rounded-full border border-slate-700">
        {LANGUAGES.map((lang) => (
          <button
            key={lang}
            onClick={() => onSelectLanguage(lang)}
            className={`w-full px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-50
              ${selectedLanguage === lang
                ? 'bg-cyan-500 text-slate-900 shadow-md'
                : 'text-slate-300 hover:bg-slate-700/50'
              }`}
          >
            {lang}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;
