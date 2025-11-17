import React from 'react';
import { StoryData, ProcessedScenePrompt } from '../types';
import Loader from './Loader';
import CharacterProfileCard from './CharacterProfileCard';
import ScenePromptCard from './ScenePromptCard';
import BookIcon from './icons/BookIcon';
import UserGroupIcon from './icons/UserGroupIcon';
import FilmIcon from './icons/FilmIcon';
import ExportIcon from './icons/ExportIcon';


interface ResultsDisplayProps {
  storyData: StoryData | null;
  processedPrompts: ProcessedScenePrompt[] | null;
  isLoading: boolean;
  error: string | null;
  onExportClick: () => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ storyData, processedPrompts, isLoading, error, onExportClick }) => {
  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-red-900/20 border border-red-500 rounded-lg">
        <h3 className="text-xl font-bold text-red-400">Đã xảy ra lỗi</h3>
        <p className="text-red-300 mt-2">{error}</p>
      </div>
    );
  }

  if (!storyData || !processedPrompts) {
    return (
      <div className="text-center p-12 border-2 border-dashed border-slate-700 rounded-lg">
        <BookIcon className="w-16 h-16 mx-auto text-slate-600" />
        <h3 className="text-xl font-semibold text-slate-400 mt-4">Câu chuyện và gợi ý của bạn sẽ xuất hiện ở đây</h3>
        <p className="text-slate-500 mt-2">Điền vào biểu mẫu trên và bắt đầu sáng tạo!</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-fade-in">
       <section>
          <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 flex items-center justify-between">
             <h3 className="text-2xl font-bold text-center text-indigo-300 flex-grow">{storyData.storyTitle}</h3>
             <button
                onClick={onExportClick}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors transform hover:-translate-y-0.5"
                title="Xuất toàn bộ câu lệnh"
             >
                <ExportIcon className="w-5 h-5" />
                <span>Xuất</span>
             </button>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-4">
            <BookIcon className="w-8 h-8 text-indigo-400" />
            <h2 className="text-3xl font-bold text-indigo-300">Cốt Truyện</h2>
        </div>
        <div className="space-y-4 bg-slate-900/50 p-4 rounded-lg border border-slate-700">
          {storyData.scenes.map((scene, index) => (
              <div key={index} className="p-3 border-b border-slate-800 last:border-b-0">
                  <h4 className="font-bold text-indigo-400">Cảnh {scene.sceneNumber}:</h4>
                  <p className="text-slate-300 mt-1">{scene.narrative.vi}</p>
              </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-4">
            <UserGroupIcon className="w-8 h-8 text-indigo-400" />
            <h2 className="text-3xl font-bold text-indigo-300">Hồ Sơ Nhân Vật</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {storyData.characterProfiles.map((char, index) => (
            <CharacterProfileCard key={index} character={char} />
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-4">
            <FilmIcon className="w-8 h-8 text-indigo-400" />
            <h2 className="text-3xl font-bold text-indigo-300">Lệnh Tạo Ảnh</h2>
        </div>
        <div className="space-y-4">
          {processedPrompts.map((scene) => (
            <ScenePromptCard key={scene.sceneNumber} scene={scene} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default ResultsDisplay;
