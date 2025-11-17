import React from 'react';
import CloseIcon from './icons/CloseIcon';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="guide-modal-title"
    >
      <div 
        className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-slate-700">
          <h2 id="guide-modal-title" className="text-xl font-bold text-indigo-300">Hướng Dẫn Định Dạng Kịch Bản</h2>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white transition-colors" aria-label="Đóng">
            <CloseIcon className="w-6 h-6" />
          </button>
        </header>
        
        <div className="p-6 text-slate-300 space-y-4 overflow-y-auto">
            <p>
                Để AI có thể hiểu chính xác kịch bản của bạn, vui lòng tuân thủ định dạng dưới đây. Cấu trúc này giúp AI phân biệt rõ ràng giữa tiêu đề và các cảnh riêng biệt.
            </p>

            <div>
                <h3 className="font-bold text-lg text-indigo-400 mb-2">Cấu trúc chung</h3>
                <ul className="list-disc list-inside space-y-2 pl-2">
                    <li><strong className="text-slate-100">Dòng đầu tiên:</strong> Luôn bắt đầu bằng <code className="bg-slate-900/70 text-indigo-300 px-1 py-0.5 rounded">Tiêu đề:</code> theo sau là tiêu đề câu chuyện.</li>
                    <li><strong className="text-slate-100">Dấu phân cách:</strong> Sử dụng <code className="bg-slate-900/70 text-indigo-300 px-1 py-0.5 rounded">[SCENE BREAK]</code> trên một dòng riêng để ngăn cách tiêu đề và các cảnh với nhau.</li>
                    <li><strong className="text-slate-100">Nội dung cảnh:</strong> Mỗi cảnh bắt đầu bằng <code className="bg-slate-900/70 text-indigo-300 px-1 py-0.5 rounded">Cảnh [Số]:</code> theo sau là nội dung của cảnh đó.</li>
                </ul>
            </div>

            <div>
                 <h3 className="font-bold text-lg text-indigo-400 mb-2">Ví dụ cụ thể</h3>
                 <div className="bg-slate-900/70 p-4 rounded-md border border-slate-700 text-sm font-mono whitespace-pre-wrap">
                    <span className="text-gray-400">Tiêu đề: Chú Sóc Tò Mò</span><br/>
                    <span className="text-purple-400">[SCENE BREAK]</span><br/>
                    <span className="text-gray-400">Cảnh 1: Sóc Nâu đang ngồi trên một cành cây, tò mò nhìn một giọt sương đọng trên chiếc lá. Khu rừng buổi sáng thật yên tĩnh.</span><br/>
                    <span className="text-purple-400">[SCENE BREAK]</span><br/>
                    <span className="text-gray-400">Cảnh 2: Giọt sương bắt đầu lăn xuống lá. Sóc Nâu ngạc nhiên nhảy lùi lại. Chú chưa bao giờ thấy điều gì như vậy.</span><br/>
                    <span className="text-purple-400">[SCENE BREAK]</span><br/>
                    <span className="text-gray-400">Cảnh 3: Bác Cú Mèo bay đến và giải thích cho Sóc Nâu về vòng tuần hoàn của nước. Sóc Nâu lắng nghe một cách chăm chú.</span>
                 </div>
            </div>

            <div className="pt-2 text-xs text-slate-400">
                <p><strong>Lưu ý:</strong> AI sẽ tự động xác định các nhân vật (ví dụ: Sóc Nâu, Bác Cú Mèo) và tạo hồ sơ cho chúng. Bạn chỉ cần tập trung vào việc viết nội dung câu chuyện.</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default GuideModal;
