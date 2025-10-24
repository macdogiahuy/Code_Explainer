import React, { useState, useEffect, useRef } from 'react';
import { Language, Explanation } from '../types';
import CodeInput from './CodeInput';
import ExplanationCard from './ExplanationCard';
import { ArrowLeftIcon, SparklesIcon } from './icons';

interface SubmittedQuery {
    prompt: string;
    code: string;
    language: Language;
}

interface ResultsViewProps {
    query: SubmittedQuery;
    explanations: Explanation;
    onReset: () => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({ query, explanations, onReset }) => {
    const [highlightedLine, setHighlightedLine] = useState<number | null>(null);
    const lineByLineRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = lineByLineRef.current;
        if (!container) return;
    
        const handleMouseOver = (event: MouseEvent) => {
            const target = (event.target as HTMLElement).closest('li[data-line]');
            if (target instanceof HTMLLIElement) {
                const line = target.dataset.line;
                if (line) {
                    const lineNumber = parseInt(line.split('-')[0], 10);
                    if (!isNaN(lineNumber)) {
                        setHighlightedLine(lineNumber);
                    }
                }
            }
        };
    
        const handleMouseOut = () => {
            setHighlightedLine(null);
        };
        
        container.addEventListener('mouseover', handleMouseOver);
        container.addEventListener('mouseout', handleMouseOut);
    
        return () => {
            container.removeEventListener('mouseover', handleMouseOver);
            container.removeEventListener('mouseout', handleMouseOut);
        };
    }, [explanations]);

    return (
        <div className="animate-fade-in">
            <header className="flex justify-between items-center mb-6 pb-4 border-b border-slate-700">
                <div className="flex items-center gap-3">
                    <SparklesIcon className="w-6 h-6 text-cyan-400" />
                    <p className="text-lg text-slate-300 font-medium">
                        <span className="font-bold text-slate-100">Request:</span> {query.prompt}
                    </p>
                </div>
                <button
                    onClick={onReset}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-cyan-300 bg-cyan-500/10 border border-cyan-400/30 rounded-full hover:bg-cyan-500/20 transition-colors"
                >
                    <ArrowLeftIcon className="w-4 h-4" />
                    Ask New Question
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" style={{ height: 'calc(100vh - 200px)', maxHeight: '700px' }}>
                {/* Left Panel: Code */}
                <div className="flex flex-col gap-4 h-full">
                    <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">{query.language} Code</h2>
                    <CodeInput
                        code={query.code}
                        highlightedLine={highlightedLine}
                        readOnly={true}
                    />
                </div>

                {/* Right Panel: Explanations */}
                <div className="flex flex-col gap-5 h-full overflow-y-auto pr-2">
                    <ExplanationCard title="Overall Explanation">
                        <p>{explanations.overallExplanation}</p>
                    </ExplanationCard>
                    <ExplanationCard title="Detailed Breakdown">
                        <p>{explanations.detailedBreakdown}</p>
                    </ExplanationCard>
                    <ExplanationCard title="Line-by-Line Explanation">
                        <div 
                            ref={lineByLineRef} 
                            className="prose prose-invert prose-sm max-w-none [&_li[data-line]]:cursor-pointer [&_li[data-line]]:transition-colors [&_li[data-line]]:p-1 [&_li[data-line]]:-m-1 [&_li[data-line]]:rounded-md hover:[&_li[data-line]]:bg-slate-700/50"
                            dangerouslySetInnerHTML={{ __html: explanations.lineByLineExplanation }} 
                        />
                    </ExplanationCard>
                </div>
            </div>
        </div>
    );
};

export default ResultsView;