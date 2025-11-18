import React, { useState, useMemo } from 'react';
import { ProcessedScenePrompt } from '../types';
import CopyIcon from './icons/CopyIcon';
import CloseIcon from './icons/CloseIcon';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  prompts: ProcessedScenePrompt[] | null;
}

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, prompts }) => {
  const [activeTab, setActiveTab] = useState<'vi' | 'en'>('vi');
  const [copied, setCopied] = useState(false);

  const allPromptsText = useMemo(() => {
    if (!prompts) return '';
    // Change separator to a single newline character
    return prompts
      .map(p => p.prompts[activeTab])
      .join('\n');
  }, [prompts, activeTab]);

  const handleCopy = async () => {
    if (allPromptsText) {
      try {
        await navigator.clipboard.writeText(allPromptsText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.warn('Clipboard API failed, trying fallback...', err);
        try {
          const textArea = document.createElement("textarea");
          textArea.value = allPromptsText;
          textArea.style.position = "fixed";
          textArea.style.left = "-9999px";
          textArea.style.top = "0";
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          const successful = document.execCommand('copy');
          document.body.removeChild(textArea);
          if (successful) {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          } else {
             alert("Không thể sao chép. Vui lòng chọn và sao chép thủ công.");
          }
        } catch (fallbackErr) {
          console.error('Fallback copy failed', fallbackErr);
          alert("Không thể sao chép. Vui lòng chọn và sao chép thủ công.");
        }
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
        onClick={onClose}
    >
      <div 
        className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-slate-700">
          <h2 className="text-xl font-bold text-indigo-300">Xuất Toàn Bộ Lệnh</h2>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white transition-colors">
            <CloseIcon className="w-6 h-6" />
          </button>
        </header>
        
        <div className="p-4 flex-grow flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-3">
                <div className="flex border border-slate-700 rounded-md p-0.5 bg-slate-900/50">
                    <button onClick={() => setActiveTab('vi')} className={`px-3 py-1 text-sm font-semibold rounded ${activeTab === 'vi' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-700'} transition-colors`}>Tiếng Việt</button>
                    <button onClick={() => setActiveTab('en')} className={`px-3 py-1 text-sm font-semibold rounded ${activeTab === 'en' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-700'} transition-colors`}>English</button>
                </div>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-slate-300 font-semibold rounded-md hover:bg-slate-600 hover:text-white transition-colors disabled:opacity-50"
                    disabled={!allPromptsText}
                >
                    {copied ? (
                         <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Đã sao chép!</span>
                        </>
                    ) : (
                        <>
                            <CopyIcon className="w-5 h-5" />
                            <span>Sao Chép Tất Cả</span>
                        </>
                    )}
                </button>
            </div>
          <textarea
            readOnly
            value={allPromptsText}
            className="w-full h-[60vh] p-4 bg-slate-900/70 border border-slate-700 rounded-md text-slate-300 text-base resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
};

export default ExportModal;