import React from 'react';

interface ExplanationCardProps {
  title: string;
  children: React.ReactNode;
}

const ExplanationCard: React.FC<ExplanationCardProps> = ({ title, children }) => {
  return (
    <div className="bg-slate-800/60 backdrop-blur-sm border border-cyan-400/30 rounded-xl shadow-lg shadow-cyan-900/10 p-5 animate-fade-in">
      <h2 className="text-lg font-bold text-cyan-400 mb-3">{title}</h2>
      <div className="text-slate-300 text-sm leading-relaxed">
        {children}
      </div>
    </div>
  );
};

export default ExplanationCard;
