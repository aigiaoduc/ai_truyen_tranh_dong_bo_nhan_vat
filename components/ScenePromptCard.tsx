import React, { useState } from 'react';
import { ProcessedScenePrompt } from '../types';
import CopyIcon from './icons/CopyIcon';
import FilmIcon from './icons/FilmIcon';

interface ScenePromptCardProps {
  scene: ProcessedScenePrompt;
}

const ScenePromptCard: React.FC<ScenePromptCardProps> = ({ scene }) => {
  const [activeTab, setActiveTab] = useState<'vi' | 'en'>('vi');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = scene.prompts[activeTab];
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const currentPrompt = scene.prompts[activeTab];

  return (
    <div className="bg-slate-800/70 rounded-lg border border-slate-700 shadow-lg transition-all duration-300 hover:border-indigo-500 hover:shadow-indigo-500/20 relative group flex flex-col">
       <div className="p-4 border-b border-slate-700">
            <div className="flex items-start gap-3">
                <div className="flex flex-col items-center flex-shrink-0">
                    <FilmIcon className="w-7 h-7 text-indigo-400 mt-1" />
                    <span className="text-xs text-slate-400 font-bold mt-1">CẢNH {scene.sceneNumber}</span>
                </div>
                <div className="flex-1">
                    <h4 className="font-semibold text-indigo-300 mb-1">Cốt truyện:</h4>
                    <p className="text-slate-300 text-sm leading-relaxed">{scene.narrative.vi}</p>
                </div>
            </div>
       </div>

       <div className="p-4 flex-grow flex flex-col">
            <div className="flex items-center justify-between mb-2">
                <div className="flex border border-slate-700 rounded-md p-0.5 bg-slate-900/50">
                    <button onClick={() => setActiveTab('vi')} className={`px-3 py-1 text-xs font-semibold rounded ${activeTab === 'vi' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-700'} transition-colors`}>Tiếng Việt</button>
                    <button onClick={() => setActiveTab('en')} className={`px-3 py-1 text-xs font-semibold rounded ${activeTab === 'en' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-700'} transition-colors`}>English</button>
                </div>
                <button
                    onClick={handleCopy}
                    className="p-1.5 bg-slate-700/50 rounded-md text-slate-400 hover:bg-slate-600 hover:text-white transition-all duration-200"
                    aria-label="Sao chép lệnh"
                >
                    {copied ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    ) : (
                        <CopyIcon className="w-5 h-5" />
                    )}
                </button>
            </div>
             <div className="bg-slate-900/70 p-3 rounded-md border border-slate-700 text-sm text-slate-300 leading-relaxed flex-grow">
                <p>{currentPrompt}</p>
            </div>
       </div>
    </div>
  );
};

export default ScenePromptCard;