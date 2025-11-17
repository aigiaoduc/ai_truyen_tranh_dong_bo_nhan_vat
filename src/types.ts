export type IllustrationStyle = 
  | 'Mặc định' 
  | 'Anime / Manga' 
  | 'Màu nước' 
  | 'Truyện tranh Mỹ' 
  | 'Tối giản' 
  | 'Hoạt hình 3D Pixar' 
  | 'Chibi' 
  | 'Tranh chì' 
  | 'Cổ điển';

export interface CharacterProfile {
  name: string;
  description: string; // Vietnamese description
  en_description: string; // English description
}

export interface Scene {
  sceneNumber: number;
  narrative: {
    vi: string;
    en: string;
  };
  visual_prompt_template: {
    vi: string;
    en: string;
  };
  characters_in_scene: string[];
}

export interface StoryData {
  storyTitle: string;
  characterProfiles: CharacterProfile[];
  scenes: Scene[];
}

// Type for the final, assembled prompts ready for display
export interface ProcessedScenePrompt {
    sceneNumber: number;
    narrative: {
        vi: string;
        en: string;
    };
    prompts: {
        vi: string;
        en: string;
    };
}