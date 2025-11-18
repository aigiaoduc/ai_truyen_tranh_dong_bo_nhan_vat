import React, { useState, useCallback, useEffect } from 'react';
import StoryInputForm from './components/StoryInputForm';
import ResultsDisplay from './components/ResultsDisplay';
import ExportModal from './components/ExportModal';
import ApiKeyManager from './components/ApiKeyManager';
import { IllustrationStyle, StoryData, CharacterProfile, ProcessedScenePrompt } from './types';
import { generateStoryPrompts } from './services/geminiService';
import LogoIcon from './components/icons/LogoIcon';
import FacebookIcon from './components/icons/FacebookIcon';
import YoutubeIcon from './components/icons/YoutubeIcon';
import CoffeeIcon from './components/icons/CoffeeIcon';

const App: React.FC = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [inputType, setInputType] = useState<'idea' | 'story'>('idea');
  const [storyInput, setStoryInput] = useState<string>('');
  const [sceneCount, setSceneCount] = useState<number>(5);
  const [illustrationStyle, setIllustrationStyle] = useState<IllustrationStyle>('Mặc định');
  const [storyData, setStoryData] = useState<StoryData | null>(null);
  const [processedPrompts, setProcessedPrompts] = useState<ProcessedScenePrompt[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  const processApiResponse = useCallback((data: StoryData, style: IllustrationStyle): ProcessedScenePrompt[] => {
    const characterMap = new Map<string, CharacterProfile>(
        data.characterProfiles.map(p => [p.name.toUpperCase(), p])
    );

    const styleDescriptions: Record<IllustrationStyle, { vi: string, en: string }> = {
        'Mặc định': {
            vi: 'phong cách tranh kỹ thuật số sống động, đẹp mắt, màu sắc phong phú, chi tiết, phù hợp truyện thiếu nhi',
            en: 'vibrant, beautiful digital painting style with rich colors and details, suitable for children\'s storybooks'
        },
        'Anime / Manga': {
            vi: 'phong cách anime/manga Nhật Bản đặc trưng, nét vẽ rõ ràng, tô màu mảng (cel-shading), màu sắc tươi sáng, biểu cảm nhân vật cường điệu',
            en: 'characteristic Japanese anime/manga style, with clean line art, cel-shading, vibrant colors, and exaggerated character expressions'
        },
        'Màu nước': {
            vi: 'phong cách tranh màu nước nghệ thuật, với gam màu mềm mại, hiệu ứng loang màu và kết cấu giấy rõ rệt, tạo cảm giác nhẹ nhàng, trong trẻo',
            en: 'artistic watercolor painting style, with a soft color palette, visible color bleeding effects, and paper texture for a light and ethereal feel'
        },
        'Truyện tranh Mỹ': {
            vi: 'phong cách truyện tranh Mỹ cổ điển, với đường viền đen đậm, màu sắc mạnh mẽ, và sử dụng kỹ thuật chấm tram (halftone/Ben-Day dots) để tô bóng',
            en: 'classic American comic book style, with bold black outlines, strong colors, and the use of halftone dot shading (Ben-Day dots)'
        },
        'Tối giản': {
            vi: 'phong cách tối giản, sử dụng hình khối hình học cơ bản, mảng màu phẳng (flat design) và một bảng màu giới hạn, tập trung vào sự rõ ràng và thông điệp',
            en: 'minimalist style using basic geometric shapes, flat color fields (flat design), and a limited color palette, focusing on clarity and message'
        },
        'Hoạt hình 3D Pixar': {
            vi: 'phong cách hoạt hình 3D chất lượng cao như phim của Pixar, nhân vật biểu cảm, kết cấu bề mặt chi tiết, ánh sáng mềm mại và bố cục điện ảnh',
            en: 'high-quality 3D animation style like a Pixar film, with expressive characters, detailed surface textures, soft lighting, and cinematic composition'
        },
        'Chibi': {
            vi: 'phong cách chibi siêu biến dạng (super-deformed) đáng yêu, nhân vật có đầu to, thân hình nhỏ, các chi tiết được đơn giản hóa và biểu cảm cực kỳ dễ thương',
            en: 'cute, super-deformed chibi style, with characters having large heads, small bodies, simplified features, and extremely cute expressions'
        },
        'Tranh chì': {
            vi: 'phong cách phác thảo bằng bút chì nghệ thuật, **hoàn toàn đơn sắc (chỉ đen, trắng và các sắc độ xám)**, có thể thấy rõ nét bút chì, các kỹ thuật đan nét (hatching/cross-hatching) để tạo bóng. **TUYỆT ĐỐI KHÔNG CÓ MÀU SẮC**',
            en: 'artistic pencil sketch style, **strictly monochrome (only black, white, and shades of gray)**, with visible pencil strokes and hatching/cross-hatching techniques for shading. **ABSOLUTELY NO COLOR**'
        },
        'Cổ điển': {
            vi: 'phong cách cổ điển, hoài cổ, gợi nhớ đến tranh minh họa trong sách thiếu nhi đầu thế kỷ 20, với tông màu trầm, ngả màu nâu đỏ (sepia), và có một chút kết cấu nhiễu hạt (grainy texture)',
            en: 'vintage, nostalgic style, reminiscent of early 20th-century children\'s book illustrations, with a muted, sepia-toned color palette and a slightly grainy texture'
        }
    };

    const noTextRule = {
        vi: "YÊU CẦU TUYỆT ĐỐI: Hình ảnh KHÔNG ĐƯỢC chứa bất kỳ loại văn bản, chữ viết, ký tự, hoặc bong bóng thoại nào.",
        en: "ABSOLUTE REQUIREMENT: The image MUST NOT contain any kind of text, writing, letters, or speech bubbles."
    };

    const noSignatureRule = {
        vi: "YÊU CẦU QUAN TRỌNG: Hình ảnh không được chứa bất kỳ watermark, logo, hoặc tên nghệ sĩ.",
        en: "IMPORTANT REQUIREMENT: The image must not contain any watermarks, logos, or artist names."
    };

    const negativePrompt = {
        vi: "YẾU TỐ CẦN TRÁNH: biến dạng, dị dạng, tay chân thừa, ngón tay thừa, tay chân bị cắt xén, các bộ phận cơ thể bị trộn lẫn, giải phẫu không chính xác, 2 đầu, cơ thể méo mó, watermark.",
        en: "AVOID: deformed, malformed, extra limbs, extra fingers, cropped limbs, fused body parts, incorrect anatomy, two heads, distorted body, watermark."
    };

    return data.scenes.map(scene => {
        let prompt_vi = scene.visual_prompt_template.vi;
        let prompt_en = scene.visual_prompt_template.en;

        scene.characters_in_scene.forEach(charName => {
            const character = characterMap.get(charName.toUpperCase());
            if (character) {
                // Remove character name from the beginning of the description string
                const cleanDescriptionVi = character.description.replace(new RegExp(`^${character.name}\\s*là\\s*`, 'i'), '').trim();
                const cleanDescriptionEn = character.en_description.replace(new RegExp(`^${character.name}\\s*is\\s*`, 'i'), '').trim();

                const placeholder = new RegExp(`{${charName}}`, 'gi');
                prompt_vi = prompt_vi.replace(placeholder, `nhân vật có mô tả sau: "${cleanDescriptionVi}"`);
                prompt_en = prompt_en.replace(placeholder, `a character described as: "${cleanDescriptionEn}"`);
            }
        });
        
        const final_prompt_vi = `${prompt_vi}, ${styleDescriptions[style].vi}. ${noTextRule.vi}. ${noSignatureRule.vi}. ${negativePrompt.vi}`;
        const final_prompt_en = `${prompt_en}, in a ${styleDescriptions[style].en}. ${noTextRule.en}. ${noSignatureRule.en}. ${negativePrompt.en}`;

        return {
            sceneNumber: scene.sceneNumber,
            narrative: scene.narrative,
            prompts: {
                vi: final_prompt_vi,
                en: final_prompt_en,
            },
        };
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey) {
        setError("Vui lòng nhập và lưu API key của bạn trước khi tạo gợi ý.");
        return;
    }
    if (!storyInput.trim() || (inputType === 'idea' && sceneCount < 2)) return;

    setIsLoading(true);
    setError(null);
    setStoryData(null);
    setProcessedPrompts(null);

    try {
      const data = await generateStoryPrompts(storyInput, illustrationStyle, sceneCount, inputType, apiKey);
      const processed = processApiResponse(data, illustrationStyle);
      setStoryData(data);
      setProcessedPrompts(processed);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Đã xảy ra một lỗi không xác định.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 min-h-screen text-gray-200 font-sans selection:bg-indigo-500/30">
        <div 
            className="absolute top-0 left-0 w-full h-full bg-cover bg-center opacity-10" 
            style={{backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')"}}
        ></div>
        <ExportModal 
            isOpen={isExportModalOpen}
            onClose={() => setIsExportModalOpen(false)}
            prompts={processedPrompts}
        />
        <div className="relative container mx-auto px-4 py-8 md:py-12">
            <header className="text-center mb-10 md:mb-16">
                <div className="flex items-center justify-center gap-4 mb-4">
                    <LogoIcon className="w-12 h-12"/>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
                            Trình Tạo Kịch Bản Truyện
                        </span>
                    </h1>
                </div>
            <p className="text-lg text-slate-400 max-w-3xl mx-auto">
                Từ ý tưởng ban đầu, tạo ra cốt truyện, hồ sơ nhân vật nhất quán và các lệnh tạo ảnh chi tiết cho AI.
            </p>
            <div className="flex justify-center items-center gap-x-6 sm:gap-x-8 mt-6">
                <a href="https://www.facebook.com/tran.hong.quan.216221/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-400 hover:text-indigo-400 transition-colors duration-300 group">
                    <FacebookIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium hidden sm:inline">Facebook</span>
                </a>
                <a href="https://www.youtube.com/@quanh95" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-400 hover:text-indigo-400 transition-colors duration-300 group">
                    <YoutubeIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium hidden sm:inline">Youtube</span>
                </a>
                <a href="https://ung-ho-tac-gia.netlify.app/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-400 hover:text-indigo-400 transition-colors duration-300 group">
                    <CoffeeIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium hidden sm:inline">Ủng hộ cafe</span>
                </a>
            </div>
            </header>

            <main className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            <div className="lg:col-span-1 bg-slate-800/50 p-6 rounded-2xl border border-slate-700 shadow-2xl shadow-slate-900/50 backdrop-blur-sm">
                <div className="space-y-6">
                    <ApiKeyManager apiKey={apiKey} setApiKey={setApiKey} />
                    <div className="border-t border-slate-700/50"></div>
                    <StoryInputForm
                        storyInput={storyInput}
                        setStoryInput={setStoryInput}
                        sceneCount={sceneCount}
                        setSceneCount={setSceneCount}
                        illustrationStyle={illustrationStyle}
                        setIllustrationStyle={setIllustrationStyle}
                        onSubmit={handleSubmit}
                        isLoading={isLoading}
                        inputType={inputType}
                        setInputType={setInputType}
                        isApiKeySet={!!apiKey}
                    />
                </div>
            </div>
            <div className="lg:col-span-2">
                <ResultsDisplay
                storyData={storyData}
                processedPrompts={processedPrompts}
                isLoading={isLoading}
                error={error}
                onExportClick={() => setIsExportModalOpen(true)}
                />
            </div>
            </main>
            
            <footer className="text-center mt-16 text-slate-500 text-sm">
                <p>ứng dụng này được tạo bởi Hồng Quân</p>
            </footer>
        </div>
    </div>
  );
};

export default App;