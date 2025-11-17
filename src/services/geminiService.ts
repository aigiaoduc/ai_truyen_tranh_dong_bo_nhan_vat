import { GoogleGenAI, Type } from "@google/genai";
import { StoryData, IllustrationStyle } from '../types';

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    storyTitle: {
      type: Type.STRING,
      description: "Một tiêu đề sáng tạo và hấp dẫn cho câu chuyện bằng tiếng Việt. Nếu tiêu đề được cung cấp trong kịch bản, hãy sử dụng nó."
    },
    characterProfiles: {
      type: Type.ARRAY,
      description: "Một mảng các nhân vật chính trong câu chuyện.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: {
            type: Type.STRING,
            description: "Tên nhân vật (viết hoa, không dấu, ví dụ: AN, MAI)."
          },
          description: {
            type: Type.STRING,
            description: "Thiết kế một 'Bản Vẽ Kỹ Thuật' chi tiết cho nhân vật bằng tiếng Việt, tập trung vào 3-4 'Đặc Điểm Nhận Diện Cốt Lõi' không bao giờ thay đổi. Mô tả phải gợi hình, độc đáo và có thể bao gồm một gợi ý ngắn về tính cách cốt lõi (ví dụ: tinh nghịch, nhút nhát). QUAN TRỌNG: Bắt đầu trực tiếp bằng mô tả, KHÔNG bao gồm tên nhân vật. Ví dụ nâng cao: 'cậu bé 10 tuổi có vóc dáng nhỏ nhắn, nổi bật với mái tóc bạch kim rối bù lúc nào cũng dựng đứng như bị điện giật, đôi mắt màu tím thạch anh sâu thẳm và luôn mặc một chiếc áo hoodie quá khổ màu xanh rêu có hình một con cáo đang ngủ'."
          },
          en_description: {
            type: Type.STRING,
            description: "Design a detailed 'Blueprint' for this character in English, focusing on 3-4 'Core Visual Anchors' that never change. The description must be evocative, unique, and can include a short hint about the core personality (e.g., mischievous, shy). IMPORTANT: Start directly with the description, DO NOT include the character's name. Advanced example: 'a small-framed 10-year-old boy, distinguished by messy platinum blond hair that always sticks up as if electrocuted, deep amethyst-colored eyes, and is always seen in an oversized, moss-green hoodie with a sleeping fox graphic'."
          }
        },
        required: ["name", "description", "en_description"]
      }
    },
    scenes: {
      type: Type.ARRAY,
      description: "Một mảng các cảnh chính trong câu chuyện.",
      items: {
        type: Type.OBJECT,
        properties: {
          sceneNumber: {
            type: Type.INTEGER,
            description: "Số thứ tự của cảnh."
          },
          narrative: {
            type: Type.OBJECT,
            properties: {
              vi: { type: Type.STRING, description: "Cốt truyện của cảnh bằng tiếng Việt, có thể bao gồm lời thoại. Nếu người dùng cung cấp kịch bản, giữ nguyên nội dung này." },
              en: { type: Type.STRING, description: "Bản dịch tiếng Anh của cốt truyện." }
            },
             required: ["vi", "en"]
          },
          visual_prompt_template: {
            type: Type.OBJECT,
            properties: {
              vi: { type: Type.STRING, description: "Mô tả HÌNH ẢNH của cảnh bằng tiếng Việt. KHÔNG chứa lời thoại. Sử dụng tên nhân vật trong dấu ngoặc nhọn làm placeholder, ví dụ: '{AN} đang nói chuyện với {MAI}'." },
              en: { type: Type.STRING, description: "Bản dịch tiếng Anh của mô tả hình ảnh, cũng sử dụng placeholder." }
            },
            required: ["vi", "en"]
          },
          characters_in_scene: {
            type: Type.ARRAY,
            description: "Một mảng tên các nhân vật có mặt trong cảnh này (phải khớp với tên trong characterProfiles).",
            items: { type: Type.STRING }
          }
        },
        required: ["sceneNumber", "narrative", "visual_prompt_template", "characters_in_scene"]
      }
    }
  },
  required: ["storyTitle", "characterProfiles", "scenes"]
};

const getPromptForIdea = (storyIdea: string, style: IllustrationStyle, sceneCount: number): string => `
  BẠN LÀ MỘT ĐẠO DIỄN NGHỆ THUẬT VÀ BIÊN KỊCH TRUYỆN TRANH THIẾU NHI BẬC THẦY.
  Nhiệm vụ của bạn là biến một ý tưởng đơn giản thành một bộ tài sản sản xuất truyện tranh hoàn chỉnh, sẵn sàng cho họa sĩ minh họa.

  QUY TRÌNH LÀM VIỆC:
  1.  **PHÂN TÍCH TỔNG THỂ (BƯỚC QUAN TRỌNG NHẤT):**
      *   Trước tiên, hãy đọc kỹ ý tưởng câu chuyện để xác định **bối cảnh cốt lõi**:
          - **Chủ đề/Thể loại:** (ví dụ: phiêu lưu, khoa học viễn tưởng, lịch sử, cổ tích, đời thường).
          - **Thời đại/Bối cảnh:** (ví dụ: Việt Nam thế kỷ 15, tương lai cyberpunk, vương quốc phép thuật).
          - **Không khí/Tông màu:** (ví dụ: vui tươi, bí ẩn, cảm động, hùng tráng).
      *   Toàn bộ các bước sau phải tuân thủ nghiêm ngặt theo bối cảnh đã phân tích này để đảm bảo tính nhất quán và hợp lý. Ví dụ, nếu bối cảnh là lịch sử Việt Nam, trang phục và kiến trúc phải phản ánh đúng thời kỳ đó, không được hiện đại hóa.

  2.  **PHÁT TRIỂN CỐT TRUYỆN:**
      *   Cấu trúc: Câu chuyện phải có mở đầu (giới thiệu), thân bài (phát triển xung đột), và kết bài (giải quyết) rõ ràng.
      *   Phù hợp lứa tuổi: Nội dung phải trong sáng, dễ hiểu, và mang tính giáo dục hoặc giải trí tích cực cho trẻ em.
      *   Phân cảnh: Câu chuyện phải được chia thành chính xác ${sceneCount} cảnh.

  3.  **TẠO TÀI SẢN CHI TIẾT:**
      *   **Hồ sơ nhân vật (characterProfiles):**
          - Tên nhân vật phải ở dạng VIẾT HOA, KHÔNG DẤU (ví dụ: AN, LAN, BA).
          - Thiết kế một 'Bản Vẽ Kỹ Thuật' chi tiết, **bám sát bối cảnh đã phân tích**. Tạo ra một 'khóa nhân vật' (character lock) không thể nhầm lẫn. Tập trung vào 3-4 'Đặc Điểm Nhận Diện Cốt Lõi' (Core Visual Anchors) - những đặc điểm bất biến và độc đáo.
          - Thêm một câu mô tả ngắn gọn về TÍNH CÁCH cốt lõi.
          - QUAN TRỌNG: Phần mô tả ngoại hình KHÔNG ĐƯỢC BẮT ĐẦU BẰNG TÊN NHÂN VẬT. Cung cấp cả bản tiếng Việt và tiếng Anh.
      *   **Phân cảnh (scenes):**
          - **narrative:** Đây là phần kể chuyện dành cho người đọc, bao gồm diễn biến và có thể chứa lời thoại. Cung cấp bản tiếng Việt và tiếng Anh.
          - **visual_prompt_template:** Với vai trò là đạo diễn, hãy tạo một mô tả hình ảnh thuần túy, **nhất quán với bối cảnh**. **TUYỆT ĐỐI KHÔNG chứa lời thoại**. Mô tả phải bao gồm:
              - Hành động chính, biểu cảm, bối cảnh chi tiết (phù hợp thời đại/chủ đề).
              - **Chỉ đạo điện ảnh (Quan trọng):** Dựa vào cảm xúc của cảnh (ví dụ: căng thẳng, vui vẻ, buồn bã), hãy gợi ý các góc máy và ánh sáng cụ thể để tăng cường không khí. Ví dụ: 'góc máy thấp' để tạo cảm giác uy quyền, 'ánh sáng dịu, ấm áp' cho khoảnh khắc vui vẻ, 'ánh sáng kịch tính từ phía sau' cho cảnh bí ẩn.
              - Sử dụng placeholder tên nhân vật trong dấu ngoặc nhọn, ví dụ: "{AN} đang chạy trên bãi cỏ."
          - **characters_in_scene:** Liệt kê chính xác tên các nhân vật (dạng VIẾT HOA, KHÔNG DẤU) xuất hiện trong cảnh.
  
  Ý tưởng câu chuyện: "${storyIdea}"
  Phong cách minh họa mong muốn: "${style === 'Mặc định' ? 'Tranh kỹ thuật số sống động, đẹp mắt' : style}"

  Hãy tạo ra kết quả dưới dạng JSON theo schema đã cung cấp.
`;

const getPromptForStory = (storyScript: string, style: IllustrationStyle): string => `
  BẠN LÀ MỘT ĐẠO DIỄN SÁNG TẠO VÀ CHUYÊN GIA PHÂN TÍCH KỊCH BẢN.
  Nhiệm vụ của bạn là phân tích một kịch bản có sẵn và nâng cấp nó thành một bộ tài sản sản xuất truyện tranh hoàn chỉnh cho họa sĩ.

  QUY TRÌNH LÀM VIỆC:
  1.  **PHÂN TÍCH TỔNG THỂ (BƯỚC QUAN TRỌNG NHẤT):**
      *   Trước tiên, hãy đọc toàn bộ kịch bản để phân tích và suy luận ra **bối cảnh cốt lõi**:
          - **Chủ đề/Thể loại:** (ví dụ: phiêu lưu, khoa học viễn tưởng, lịch sử, cổ tích, đời thường).
          - **Thời đại/Bối cảnh:** (ví dụ: Việt Nam thế kỷ 15, tương lai cyberpunk, vương quốc phép thuật).
          - **Không khí/Tông màu:** (ví dụ: vui tươi, bí ẩn, cảm động, hùng tráng).
      *   Toàn bộ các bước sau phải tuân thủ nghiêm ngặt theo bối cảnh đã phân tích này để đảm bảo tính nhất quán và hợp lý. Ví dụ, nếu câu chuyện về một người lính trong lịch sử Việt Nam, trang phục và vũ khí phải phản ánh đúng thời kỳ đó.

  2.  **PHÂN TÍCH KỊCH BẢN CHI TIẾT:**
      *   Tuân thủ nghiêm ngặt định dạng kịch bản: Tiêu đề, [SCENE BREAK], Cảnh X.
      *   Xác định chính xác **Tiêu đề**, nội dung tường thuật của từng **Cảnh**, và tất cả **nhân vật** được nhắc đến. Chuẩn hóa tên nhân vật thành dạng VIẾT HOA, KHÔNG DẤU (ví dụ: AN, SÓC NÂU).

  3.  **TẠO TÀI SẢN SẢN XUẤT:**
      *   **Hồ sơ nhân vật (characterProfiles):**
          - **Suy luận thông minh:** Dựa trên các chi tiết trong kịch bản VÀ bối cảnh tổng thể đã phân tích, hãy sáng tạo một 'Bản Vẽ Kỹ Thuật' chi tiết cho mỗi nhân vật.
          - Tập trung vào 3-4 'Đặc Điểm Nhận Diện Cốt Lõi' độc đáo để tạo 'khóa nhân vật' (character lock).
          - QUAN TRỌNG: Phần mô tả KHÔNG ĐƯỢC BẮT ĐẦU BẰNG TÊN NHÂN VẬT. Cung cấp cả bản tiếng Việt và tiếng Anh.
      *   **Phân cảnh (scenes):**
          - **narrative:** Giữ nguyên 100% nội dung cốt truyện/lời thoại từ kịch bản người dùng cung cấp. Cung cấp bản dịch tiếng Anh chính xác.
          - **visual_prompt_template:** Với vai trò là đạo diễn, hãy chuyển thể narrative thành một chỉ dẫn hình ảnh chi tiết, **nhất quán với bối cảnh**. **TUYỆT ĐỐI KHÔNG chứa lời thoại hoặc văn bản**. Mô tả phải bao gồm:
              - Khoảnh khắc quan trọng, hành động & biểu cảm.
              - Bối cảnh & đạo cụ (phải phù hợp với thời đại/chủ đề đã phân tích).
              - **Chỉ đạo điện ảnh (Quan trọng):** Dựa vào cảm xúc của cảnh (ví dụ: căng thẳng, vui vẻ, buồn bã), hãy gợi ý các góc máy và ánh sáng cụ thể để tăng cường không khí. Ví dụ: 'góc máy thấp' để tạo cảm giác uy quyền, 'ánh sáng dịu, ấm áp' cho khoảnh khắc vui vẻ, 'ánh sáng kịch tính từ phía sau' cho cảnh bí ẩn.
              - Sử dụng placeholder tên nhân vật đã chuẩn hóa trong dấu ngoặc nhọn. Cung cấp bản dịch tiếng Anh.
          - **characters_in_scene:** Liệt kê chính xác tên các nhân vật (đã chuẩn hóa) xuất hiện trong cảnh đó.
  
  Kịch bản do người dùng cung cấp:
  """
  ${storyScript}
  """

  Phong cách minh họa mong muốn: "${style === 'Mặc định' ? 'Tranh kỹ thuật số sống động, đẹp mắt' : style}"

  Hãy phân tích và tạo ra kết quả dưới dạng JSON theo schema đã cung cấp.
`;

export const checkApiKey = async (apiKey: string): Promise<{ success: boolean; message: string }> => {
  if (!apiKey || !apiKey.trim()) {
    return { success: false, message: "API Key không được để trống." };
  }
  try {
    const ai = new GoogleGenAI({ apiKey });
    // Use a simple, low-cost model and a short prompt to validate the key
    await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: 'hi',
    });
    return { success: true, message: "API Key hợp lệ và hoạt động!" };
  } catch (error) {
    console.error("Lỗi kiểm tra API Key:", error);
     if (error instanceof Error && (error.message.includes('API key not valid') || error.message.includes('API_KEY_INVALID'))) {
        return { success: false, message: "API Key không hợp lệ." };
    }
    return { success: false, message: "Không thể xác thực API Key. Vui lòng kiểm tra lại." };
  }
};


export const generateStoryPrompts = async (storyInput: string, style: IllustrationStyle, sceneCount: number, inputType: 'idea' | 'story', apiKey: string): Promise<StoryData> => {
  if (!apiKey) {
    throw new Error("API Key bị thiếu. Vui lòng cung cấp một Gemini API Key hợp lệ.");
  }
  
  const ai = new GoogleGenAI({ apiKey });
  const model = 'gemini-2.5-flash';
  
  const prompt = inputType === 'idea'
    ? getPromptForIdea(storyInput, style, sceneCount)
    : getPromptForStory(storyInput, style);

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("Cấu trúc dữ liệu nhận về từ API không hợp lệ. Phản hồi trống.");
    }
    const parsedData = JSON.parse(jsonText.trim());

    if (!parsedData.storyTitle || !parsedData.characterProfiles || !parsedData.scenes) {
        throw new Error("Cấu trúc dữ liệu nhận về từ API không hợp lệ. Phản hồi không chứa các trường bắt buộc.");
    }

    return parsedData as StoryData;
  } catch (error) {
    console.error("Lỗi khi gọi Gemini API:", error);
    if (error instanceof Error) {
        if (error.message.includes('API key not valid') || error.message.includes('API_KEY_INVALID')) {
            throw new Error("API key không hợp lệ. Vui lòng kiểm tra lại key của bạn trong phần Quản lý API Key.");
        }
        if (error.message.includes('400')) {
             throw new Error("Yêu cầu không hợp lệ. Điều này có thể do định dạng kịch bản sai. Vui lòng kiểm tra lại và thử lại.");
        }
         if (error instanceof SyntaxError) {
             throw new Error("Không thể phân tích phản hồi từ API. Phản hồi có thể không phải là JSON hợp lệ.");
        }
        throw new Error(`Không thể tạo gợi ý câu chuyện do lỗi từ API: ${error.message}`);
    }
    throw new Error("Không thể tạo gợi ý câu chuyện. Đã xảy ra lỗi không xác định.");
  }
};