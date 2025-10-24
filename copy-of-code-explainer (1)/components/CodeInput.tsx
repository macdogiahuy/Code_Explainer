import React, { useState, useEffect, useRef } from 'react';

interface CodeInputProps {
  code: string;
  onCodeChange?: (code: string) => void;
  highlightedLine: number | null;
  readOnly?: boolean;
}

const CodeInput: React.FC<CodeInputProps> = ({ code, onCodeChange = () => {}, highlightedLine, readOnly = false }) => {
  const [lineCount, setLineCount] = useState(1);
  const lineCounterRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const lines = code.split('\n').length;
    setLineCount(lines > 0 ? lines : 1);
  }, [code]);

  const handleScroll = () => {
    if (lineCounterRef.current && textAreaRef.current) {
      lineCounterRef.current.scrollTop = textAreaRef.current.scrollTop;
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Tab' && !readOnly) {
        event.preventDefault();
        const { selectionStart, selectionEnd, value } = event.currentTarget;
        const newValue = value.substring(0, selectionStart) + '    ' + value.substring(selectionEnd);
        onCodeChange(newValue);

        // This is a bit of a hack to move the cursor after the inserted tabs
        setTimeout(() => {
            if(textAreaRef.current) {
                textAreaRef.current.selectionStart = textAreaRef.current.selectionEnd = selectionStart + 4;
            }
        }, 0);
    }
  };


  return (
    <div className="flex font-mono text-sm bg-slate-800/60 border border-slate-700 rounded-xl overflow-hidden h-full min-h-[24rem]">
      <div
        ref={lineCounterRef}
        className="line-numbers flex flex-col items-end p-4 text-slate-500 bg-slate-900/50 select-none overflow-y-hidden"
      >
        {Array.from({ length: lineCount }, (_, i) => {
            const lineNumber = i + 1;
            const isHighlighted = highlightedLine === lineNumber;
            return (
                <span
                    key={i}
                    className={`px-2 rounded transition-colors duration-200 ${
                        isHighlighted ? 'bg-cyan-400/20 text-cyan-300' : ''
                    }`}
                >
                    {lineNumber}
                </span>
            )
        })}
      </div>
      <textarea
        ref={textAreaRef}
        value={code}
        onChange={(e) => onCodeChange(e.target.value)}
        onScroll={handleScroll}
        onKeyDown={handleKeyDown}
        className="flex-grow p-4 bg-transparent text-slate-200 resize-none focus:outline-none leading-normal"
        spellCheck="false"
        wrap="off"
        readOnly={readOnly}
      />
    </div>
  );
};

export default CodeInput;