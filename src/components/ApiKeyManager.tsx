import React, { useState, useEffect } from 'react';
import KeyIcon from './icons/KeyIcon';
import ChevronDownIcon from './icons/ChevronDownIcon';
import { checkApiKey } from '../services/geminiService';

interface ApiKeyManagerProps {
  apiKey: string | null;
  setApiKey: (key: string | null) => void;
}

const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({ apiKey, setApiKey }) => {
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [checkStatus, setCheckStatus] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    // Automatically open the manager if no key is set on component mount
    if (!apiKey) {
      setIsOpen(true);
    }
  }, [apiKey]);

  const handleSave = () => {
    if (!inputValue.trim()) return;
    const keyToSave = inputValue.trim();
    localStorage.setItem('gemini_api_key', keyToSave);
    setApiKey(keyToSave);
    setSaveSuccess(true);
    setInputValue('');
    setCheckStatus(null);
    setTimeout(() => {
        setSaveSuccess(false);
        setIsOpen(false);
    }, 1500);
  };

  const handleDelete = () => {
    localStorage.removeItem('gemini_api_key');
    setApiKey(null);
    setIsOpen(true); // Re-open to allow entering a new key
  };

  const handleCheck = async () => {
    if (!inputValue.trim()) return;
    setIsChecking(true);
    setCheckStatus(null);
    try {
        const result = await checkApiKey(inputValue.trim());
        setCheckStatus(result);
        
        // Auto-save if valid
        if (result.success) {
             const keyToSave = inputValue.trim();
             localStorage.setItem('gemini_api_key', keyToSave);
             setApiKey(keyToSave);
             setSaveSuccess(true);
             setInputValue(''); 
             setTimeout(() => {
                setSaveSuccess(false);
                setIsOpen(false);
            }, 1500);
        }
    } catch (e) {
        setCheckStatus({ success: false, message: "Đã xảy ra lỗi cục bộ khi kiểm tra." });
    } finally {
        setIsChecking(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
        handleSave();
    }
  };

  const maskedKey = apiKey ? `${apiKey.slice(0, 4)}...${apiKey.slice(-4)}` : '';

  return (
    <div className="bg-slate-900/70 border-2 border-slate-600 rounded-lg transition-all duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 text-left"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <KeyIcon className="w-6 h-6 text-indigo-400" />
          <span className="text-lg font-semibold text-gray-100">Quản lý API Key</span>
        </div>
        <div className="flex items-center gap-2">
            {apiKey ? (
                 <span className="text-xs font-medium bg-green-900/70 text-green-300 px-2 py-0.5 rounded-full">Đã lưu</span>
            ) : (
                 <span className="text-xs font-medium bg-yellow-900/70 text-yellow-300 px-2 py-0.5 rounded-full">Bắt buộc</span>
            )}
            <ChevronDownIcon className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {isOpen && (
        <div className="p-4 border-t border-slate-600 space-y-4 animate-fade-in-down">
          {apiKey ? (
            <div className="space-y-3 text-center">
              <p className="text-sm text-slate-300">
                API Key của bạn đã được lưu:
              </p>
              <code className="text-base font-mono bg-slate-800 px-3 py-1 rounded-md text-indigo-300">{maskedKey}</code>
              <button
                onClick={handleDelete}
                className="w-full px-4 py-2 bg-red-600/80 text-white font-semibold rounded-md hover:bg-red-600 transition-colors"
              >
                Xóa API Key
              </button>
            </div>
          ) : (
            <div className="space-y-3">
               <p className="text-sm text-slate-400">
                Vui lòng nhập Gemini API Key của bạn. Key sẽ được lưu an toàn trong trình duyệt của bạn.
                <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline ml-1">
                    Lấy key ở đây.
                </a>
              </p>
              <input
                type="password"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value)
                  setCheckStatus(null)
                }}
                onKeyDown={handleKeyDown}
                placeholder="Dán API Key của bạn (ví dụ: AIza...)"
                className="w-full px-4 py-2 bg-slate-800 border border-slate-500 rounded-md text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <div className="flex items-center gap-2">
                  <button
                    onClick={handleCheck}
                    disabled={!inputValue.trim() || isChecking}
                    className="w-1/2 flex items-center justify-center px-4 py-2 bg-slate-600 text-white font-semibold rounded-md hover:bg-slate-700 disabled:bg-slate-500/80 disabled:cursor-not-allowed transition-colors"
                  >
                    {isChecking ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        'Kiểm tra Key'
                    )}
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={!inputValue.trim() || isChecking || (checkStatus !== null && !checkStatus.success)}
                    className="w-1/2 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 disabled:bg-slate-500/80 disabled:cursor-not-allowed transition-colors"
                  >
                    {saveSuccess ? 'Đã lưu!' : 'Lưu Key'}
                  </button>
              </div>
              {checkStatus && (
                <p className={`text-sm text-center pt-1 ${checkStatus.success ? 'text-green-400' : 'text-red-400'}`}>
                    {checkStatus.message}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ApiKeyManager;