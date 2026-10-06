export type NoteType = 'top' | 'middle' | 'base';

export type ScentFamily = 
  | 'citrus' 
  | 'aquatic' 
  | 'floral' 
  | 'herbal' 
  | 'woody' 
  | 'oriental' 
  | 'gourmand' 
  | 'musk';

export interface Ingredient {
  id: string;
  nameKo: string;
  nameEn: string;
  type: NoteType;
  family: ScentFamily;
  familyKo: string;
  description: string;
  sensoryDescription: string;
  evocativeKeywords: string[];
  colorHex: string;
  intensity: number; // 1 to 5
  volatilityHours: number; // typical staying power
  chemCompound: string; // e.g. "Limonene", "Linalool", "Geraniol"
  pairingTips: string;
}

export interface FormulaDrop {
  ingredientId: string;
  drops: number;
}

export interface ScentRecipe {
  id: string;
  name: string;
  creatorName: string;
  conceptStory: string;
  sceneTitle?: string;
  selectedKeywords?: string[];
  drops: FormulaDrop[];
  totalDrops: number;
  topPercent: number;
  middlePercent: number;
  basePercent: number;
  primaryFamily: ScentFamily;
  createdAt: string;
  notesCommentary?: string;
  smellingEvaluation?: {
    freshness: number;
    elegance: number;
    depth: number;
    persistenceHours: number;
    studentFeedback?: string;
  };
}

export interface ScenePreset {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  promptExample: string;
  defaultKeywords: string[];
  availableKeywords: string[];
  recommendedIngredients: string[];
}

export interface AIConceptResult {
  perfumeName: string;
  perfumeNameEn: string;
  conceptSummary: string;
  storytelling: string;
  scentFamily: string;
  recommendedFormula: {
    ingredientId: string;
    ingredientName: string;
    type: NoteType;
    drops: number;
    reason: string;
  }[];
  perfumerAdvice: string;
  educationalTakeaway: string;
}

export interface OlfactivePreferenceResult {
  code: string;
  title: string;
  subtitle: string;
  description: string;
  recommendedFamilies: ScentFamily[];
  careerAptitudeScore: {
    creativity: number;
    scientificAnalysis: number;
    sensoryPerception: number;
    emotionalEmpathy: number;
  };
  recommendedIngredients: string[];
  careerPathAdvice: string;
}
