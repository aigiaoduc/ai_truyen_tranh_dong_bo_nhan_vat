import React, { useState } from 'react';
import SparkleIcon from './icons/SparkleIcon';
import InfoIcon from './icons/InfoIcon';
import GuideModal from './GuideModal';
import { IllustrationStyle } from '../types';

interface StoryInputFormProps {
  storyInput: string;
  setStoryInput: (value: string) => void;
  sceneCount: number;
  setSceneCount: (count: number) => void;
  illustrationStyle: IllustrationStyle;
  setIllustrationStyle: (style: IllustrationStyle) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  inputType: 'idea' | 'story';
  setInputType: (type: 'idea' | 'story') => void;
  isApiKeySet: boolean;
}

const styles: IllustrationStyle[] = [
    'Mặc định', 
    'Anime / Manga', 
    'Màu nước', 
    'Truyện tranh Mỹ', 
    'Tối giản', 
    'Hoạt hình 3D Pixar', 
    'Chibi', 
    'Tranh chì', 
    'Cổ điển'
];

const StoryInputForm: React.FC<StoryInputFormProps> = ({
  storyInput,
  setStoryInput,
  sceneCount,
  setSceneCount,
  illustrationStyle,
  setIllustrationStyle,
  onSubmit,
  isLoading,
  inputType,
  setInputType,
  isApiKeySet,
}) => {
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const isSubmitDisabled = !isApiKeySet || isLoading || !storyInput.trim() || (inputType === 'idea' && sceneCount < 2);

  const placeholderText = inputType === 'idea'
    ? "Ví dụ: Một chú sóc tò mò tên là Squeaky học về vòng tuần hoàn của nước."
    : "Nhập kịch bản câu chuyện của bạn tại đây...";

  return (
    <>
    <GuideModal isOpen={isGuideModalOpen} onClose={() => setIsGuideModalOpen(false)} />
    <form onSubmit={onSubmit} className="space-y-6">
       <div>
        <label className="block text-lg font-semibold text-gray-100 mb-2">
          Loại Đầu Vào
        </label>
        <div className="flex items-center bg-slate-900/70 border-2 border-slate-600 rounded-lg p-1 text-sm font-semibold">
          <button
            type="button"
            onClick={() => setInputType('idea')}
            className={`w-1/2 py-2 rounded-md transition-colors duration-300 ${inputType === 'idea' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-700'}`}
            disabled={isLoading}
            aria-pressed={inputType === 'idea'}
          >
            Ý Tưởng
          </button>
          <button
            type="button"
            onClick={() => setInputType('story')}
            className={`w-1/2 py-2 rounded-md transition-colors duration-300 ${inputType === 'story' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-700'}`}
            disabled={isLoading}
            aria-pressed={inputType === 'story'}
          >
            Câu Chuyện
          </button>
        </div>
      </div>
      
      {inputType === 'story' && (
        <div className="text-xs text-slate-400 p-3 bg-slate-900/50 rounded-md border border-slate-700 animate-fade-in">
          <p className="font-bold mb-1 text-slate-300">Định dạng nhanh:</p>
          <code className="whitespace-pre-wrap font-mono text-indigo-300/80">
            Tiêu đề: [Tiêu đề]{'\n'}
            [SCENE BREAK]{'\n'}
            Cảnh 1: [Nội dung]{'\n'}
            [SCENE BREAK]{'\n'}
            Cảnh 2: [Nội dung]
          </code>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-2">
            <label htmlFor="story-input" className="block text-lg font-semibold text-gray-100">
               {inputType === 'idea' ? 'Ý Tưởng Của Bạn' : 'Kịch Bản Câu Chuyện'}
            </label>
            {inputType === 'story' && (
                 <button 
                    type="button" 
                    onClick={() => setIsGuideModalOpen(true)}
                    className="flex items-center gap-1.5 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                    aria-label="Mở hướng dẫn định dạng"
                >
                    <InfoIcon className="w-4 h-4" />
                    <span>Hướng dẫn</span>
                 </button>
            )}
        </div>
        <textarea
          id="story-input"
          value={storyInput}
          onChange={(e) => setStoryInput(e.target.value)}
          placeholder={placeholderText}
          className="w-full h-48 p-4 bg-slate-900/70 border-2 border-slate-600 rounded-lg text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 resize-none shadow-inner"
          disabled={isLoading}
          aria-label={inputType === 'idea' ? 'Ý Tưởng Của Bạn' : 'Kịch Bản Câu Chuyện'}
        />
      </div>

       <div className={inputType === 'story' ? 'opacity-50' : ''}>
        <label htmlFor="scene-count" className="block text-lg font-semibold text-gray-100 mb-2">
          Số Lượng Cảnh
        </label>
        <input
            type="number"
            id="scene-count"
            value={sceneCount}
            onChange={(e) => setSceneCount(Number(e.target.value))}
            min="2"
            disabled={isLoading || inputType === 'story'}
            className="w-full px-4 py-3 bg-slate-900/70 border-2 border-slate-600 rounded-lg text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 disabled:cursor-not-allowed disabled:bg-slate-800/50"
        />
      </div>

      <div>
        <label htmlFor="style-select" className="block text-lg font-semibold text-gray-100 mb-2">
          Phong Cách Minh Họa
        </label>
        <div className="relative">
            <select
                id="style-select"
                value={illustrationStyle}
                onChange={(e) => setIllustrationStyle(e.target.value as IllustrationStyle)}
                disabled={isLoading}
                className="w-full appearance-none px-4 py-3 bg-slate-900/70 border-2 border-slate-600 rounded-lg text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
            >
                {styles.map((style) => (
                    <option key={style} value={style} className="bg-slate-800 text-white">
                        {style}
                    </option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
        </div>
      </div>
      <div>
        <button
            type="submit"
            disabled={isSubmitDisabled}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-indigo-600 text-white font-bold text-lg rounded-lg shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:text-slate-400 transform hover:-translate-y-1 transition-all duration-300 ease-in-out"
        >
            {isLoading ? (
            <>
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Đang tạo...</span>
            </>
            ) : (
            <>
                <SparkleIcon className="w-6 h-6" />
                Tạo Gợi Ý
            </>
            )}
        </button>
        {!isApiKeySet && (
            <p className="text-center text-red-400/80 text-sm mt-3 animate-pulse">
                Vui lòng nhập API key ở trên để bắt đầu.
            </p>
        )}
      </div>
    </form>
    </>
  );
};

export default StoryInputForm;
