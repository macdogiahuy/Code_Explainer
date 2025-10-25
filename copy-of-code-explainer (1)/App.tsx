import React, { useState, useCallback } from 'react';
import { Language, Explanation } from './types';
import { getCodeExplanation } from './services/geminiService';
import { BrainCircuitIcon, SearchIcon, CheckCircleIcon, SparklesIcon } from './components/icons';
import CodeInput from './components/CodeInput';
import LanguageSelector from './components/LanguageSelector';
import ResultsView from './components/ResultsView';

const DEFAULT_CODE = `def factorial(n):
    """
    This function calculates the factorial of a non-negative integer.
    """
    if n < 0:
        return "Factorial is not defined for negative numbers"
    elif n == 0:
        return 1
    else:
        result = 1
        for i in range(1, n + 1):
            result *= i
        return result

# Example usage:
print(factorial(5))`;

// --- Notification Component ---
interface NotificationProps {
    show: boolean;
    message: string;
    onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ show, message, onClose }) => {
    React.useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [show, onClose]);

    return (
        <div
            aria-live="assertive"
            className="fixed top-0 left-0 right-0 flex items-start justify-center p-4 z-50 pointer-events-none"
        >
            <div
                className={`transform transition-all duration-500 ease-out ${
                    show ? 'translate-y-5 opacity-100' : '-translate-y-full opacity-0'
                } flex items-center gap-3 w-full max-w-md p-4 rounded-xl shadow-lg bg-slate-800/90 backdrop-blur-sm border border-cyan-400/50 pointer-events-auto`}
            >
                <CheckCircleIcon className="w-6 h-6 text-green-400 flex-shrink-0" />
                <p className="text-sm font-medium text-slate-200">{message}</p>
            </div>
        </div>
    );
};

interface SubmittedQuery {
    prompt: string;
    code: string;
    language: Language;
}

const App: React.FC = () => {
    const [prompt, setPrompt] = useState<string>('Explain this code in detail.');
    const [code, setCode] = useState<string>(DEFAULT_CODE);
    const [language, setLanguage] = useState<Language>('Python');
    const [explanations, setExplanations] = useState<Explanation | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [showNotification, setShowNotification] = useState<boolean>(false);
    const [submittedQuery, setSubmittedQuery] = useState<SubmittedQuery | null>(null);


    const handleExplainCode = useCallback(async () => {
        if (!code.trim()) {
            setError("Please enter some code to explain.");
            return;
        }
        if (!prompt.trim()) {
            setError("Please enter what you want to do with the code.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setExplanations(null);
        
        const query = { prompt, code, language };
        setSubmittedQuery(query);

        try {
            const result = await getCodeExplanation(query.prompt, query.code, query.language);
            setExplanations(result);
            setShowNotification(true);
        } catch (e) {
            console.error(e);
            setError("Sorry, I couldn't process the code. Please check your API key and try again.");
            setSubmittedQuery(null); // Clear submitted query on error
        } finally {
            setIsLoading(false);
        }
    }, [prompt, code, language]);

    const handleReset = useCallback(() => {
        setExplanations(null);
        setError(null);
        setSubmittedQuery(null);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#100320] via-[#150529] to-[#1a0732] p-4 font-sans">
            <Notification
                show={showNotification}
                message="Explanation generated successfully!"
                onClose={() => setShowNotification(false)}
            />
            <main className="w-full max-w-7xl mx-auto bg-slate-900/50 backdrop-blur-xl border border-cyan-400/20 rounded-2xl shadow-2xl shadow-cyan-500/10 p-6 min-h-[90vh]">
                
                {explanations && submittedQuery && !isLoading ? (
                    <ResultsView 
                        query={submittedQuery}
                        explanations={explanations}
                        onReset={handleReset}
                    />
                ) : (
                    <>
                        <header className="flex justify-between items-center mb-6 pb-4 border-b border-slate-700">
                            <div className="flex items-center gap-3">
                                <BrainCircuitIcon className="w-8 h-8 text-cyan-400" />
                                <h1 className="text-2xl font-bold text-gray-100 tracking-wider">
                                    Code Explainer
                                </h1>
                            </div>
                            <button className="p-2 text-gray-400 hover:text-cyan-400 transition-colors rounded-full hover:bg-slate-700/50">
                                <SearchIcon className="w-6 h-6" />
                            </button>
                        </header>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Left Panel */}
                            <div className="flex flex-col gap-6">
                                <div>
                                    <label htmlFor="prompt-input" className="flex items-center gap-2 mb-3 text-sm font-medium text-slate-300">
                                        <SparklesIcon className="w-5 h-5 text-cyan-400" />
                                        What do you want to do with this code?
                                    </label>
                                    <input
                                        id="prompt-input"
                                        type="text"
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        placeholder="e.g., Find potential bugs, suggest improvements..."
                                        className="w-full px-4 py-3 text-sm bg-slate-800/60 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors"
                                    />
                                </div>
                                <LanguageSelector selectedLanguage={language} onSelectLanguage={setLanguage} />
                                <div className="h-[400px]">
                                    <CodeInput
                                        code={code}
                                        onCodeChange={setCode}
                                        highlightedLine={null}
                                    />
                                </div>
                            </div>

                            {/* Right Panel */}
                            <div className="flex flex-col gap-5 h-[400px]">
                                {isLoading ? (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="relative">
                                            <div className="h-24 w-24 rounded-full border-t-8 border-b-8 border-gray-200"></div>
                                            <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-cyan-500 animate-spin">
                                            </div>
                                        </div>
                                    </div>
                                ) : error ? (
                                    <div className="bg-red-900/50 border border-red-500 text-red-300 p-4 rounded-lg text-sm">
                                        {error}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-slate-800/40 rounded-xl border border-slate-700">
                                        <p className="text-slate-400 text-base">Your code explanations will appear here.</p>
                                        <p className="text-sm text-slate-500 mt-2">Enter a prompt and your code, then click "Generate" to get started.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <footer className="mt-8 pt-6 border-t border-slate-700 flex justify-center">
                            <button
                                onClick={handleExplainCode}
                                disabled={isLoading || !prompt.trim() || !code.trim()}
                                className="px-8 py-3 text-lg font-semibold text-white bg-cyan-500/20 border-2 border-cyan-400 rounded-full shadow-[0_0_15px_rgba(74,222,222,0.4)] hover:bg-cyan-500/40 hover:shadow-[0_0_25px_rgba(74,222,222,0.6)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                            >
                                {isLoading ? 'Thinking...' : 'Generate'}
                            </button>
                        </footer>
                    </>
                )}
            </main>
        </div>
    );
};

export default App;