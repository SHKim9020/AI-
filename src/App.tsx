import React, { useState, useEffect } from 'react';
import { Header, ActiveTab } from './components/Header';
import { WorkshopStepFlow } from './components/WorkshopStepFlow';
import { VirtualLab } from './components/VirtualLab';
import { PersonalityQuiz } from './components/PersonalityQuiz';
import { RecipeBook } from './components/RecipeBook';
import { CareerGuide } from './components/CareerGuide';
import { TutorialModal } from './components/TutorialModal';
import { FragranceLibraryModal } from './components/FragranceLibraryModal';
import { FormulaDrop, ScentRecipe } from './types/scent';
import { soundFx } from './utils/audio';
import { HelpCircle, BookOpen, Sparkles } from 'lucide-react';

const INITIAL_RECIPES: ScentRecipe[] = [
  {
    id: 'sample_ocean_breeze',
    name: '블루 오션 브리즈 (Azure Sea Whisper)',
    creatorName: '김민우 조향연구원',
    conceptStory: '청록색 파도가 부서지는 청량한 바다와 따뜻한 화이트 머스크의 살결 잔향. 시원한 첫인상 뒤로 포근한 안식이 찾아옵니다.',
    sceneTitle: '눈부신 에메랄드빛 여름 바닷가',
    selectedKeywords: ['시원한', '맑은', '차분한', '청량한'],
    drops: [
      { ingredientId: 'marine_aqua', drops: 7 },
      { ingredientId: 'bergamot', drops: 5 },
      { ingredientId: 'lavender', drops: 5 },
      { ingredientId: 'neroli', drops: 3 },
      { ingredientId: 'white_musk', drops: 4 },
      { ingredientId: 'cedarwood', drops: 3 },
    ],
    totalDrops: 27,
    topPercent: 44,
    middlePercent: 30,
    basePercent: 26,
    primaryFamily: 'aquatic',
    createdAt: '2026년 10월 6일',
    notesCommentary: '안정적인 3단계 피라미드 밸런스. 마린과 베르가못의 첫인상이 시원합니다.',
    smellingEvaluation: {
      freshness: 5,
      elegance: 4,
      depth: 4,
      persistenceHours: 6,
      studentFeedback: '슬라이드 실습에서 바닷가 사진을 보고 번역한 첫 번째 공식 작품입니다.'
    }
  },
  {
    id: 'sample_rainy_forest',
    name: '포레스트 미스트 & 실반 딥',
    creatorName: '이서연 조향연구원',
    conceptStory: '비 온 뒤 숲속의 촉촉한 피톤치드와 이슬 머금은 은방울꽃, 깊은 대지의 평화.',
    sceneTitle: '비 온 뒤 촉촉한 편백나무 숲길',
    selectedKeywords: ['싱그러운', '정화되는', '차분한'],
    drops: [
      { ingredientId: 'eucalyptus_mint', drops: 6 },
      { ingredientId: 'green_apple', drops: 4 },
      { ingredientId: 'muguet', drops: 5 },
      { ingredientId: 'cedarwood', drops: 6 },
      { ingredientId: 'patchouli', drops: 2 },
    ],
    totalDrops: 23,
    topPercent: 43,
    middlePercent: 22,
    basePercent: 35,
    primaryFamily: 'woody',
    createdAt: '2026년 10월 6일',
    notesCommentary: '피톤치드와 시더우드의 묵직한 나무 온기가 돋보입니다.',
    smellingEvaluation: {
      freshness: 4,
      elegance: 5,
      depth: 5,
      persistenceHours: 8,
      studentFeedback: '머리를 맑게 해주는 공부용 힐링 향수로 추천합니다.'
    }
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('workshop');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);

  // Active lab formula state
  const [labFormula, setLabFormula] = useState<FormulaDrop[]>([
    { ingredientId: 'marine_aqua', drops: 6 },
    { ingredientId: 'bergamot', drops: 4 },
    { ingredientId: 'lavender', drops: 5 },
    { ingredientId: 'white_musk', drops: 4 },
    { ingredientId: 'cedarwood', drops: 3 },
  ]);
  const [recipeName, setRecipeName] = useState('블루 오션 브리즈');
  const [conceptStory, setConceptStory] = useState('눈부신 바닷가의 시원함과 깨끗한 화이트 머스크의 잔향');
  const [sceneTitle, setSceneTitle] = useState('눈부신 에메랄드빛 여름 바닷가');
  const [keywords, setKeywords] = useState<string[]>(['시원한', '맑은', '차분한']);

  // Saved recipes
  const [savedRecipes, setSavedRecipes] = useState<ScentRecipe[]>(() => {
    try {
      const stored = localStorage.getItem('ai_scent_saved_recipes');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return INITIAL_RECIPES;
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ai_scent_saved_recipes', JSON.stringify(savedRecipes));
    } catch {
      // ignore
    }
  }, [savedRecipes]);

  // Handle applying a recipe from workshop or quiz into the lab
  const handleApplyRecipeToLab = (
    formula: FormulaDrop[],
    name: string,
    concept: string,
    scene: string,
    kws: string[]
  ) => {
    setLabFormula(formula);
    setRecipeName(name);
    setConceptStory(concept);
    setSceneTitle(scene);
    setKeywords(kws);
    setActiveTab('lab');
  };

  // Save recipe
  const handleSaveRecipe = (newRecipe: ScentRecipe) => {
    setSavedRecipes(prev => {
      const filtered = prev.filter(r => r.id !== newRecipe.id);
      return [newRecipe, ...filtered];
    });
  };

  // Delete recipe
  const handleDeleteRecipe = (id: string) => {
    setSavedRecipes(prev => prev.filter(r => r.id !== id));
  };

  // Add ingredient from library modal into active lab
  const handleAddIngredientToLab = (ingredientId: string, drops: number = 1) => {
    setLabFormula(prev => {
      const existing = prev.find(p => p.ingredientId === ingredientId);
      if (existing) {
        return prev.map(p => p.ingredientId === ingredientId ? { ...p, drops: p.drops + drops } : p);
      }
      return [...prev, { ingredientId, drops }];
    });
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedCount={savedRecipes.length}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {/* Floating Help / Quick Action Strip */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                soundFx.playDrop();
                setIsTutorialOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold shadow-xs transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 shrink-0" />
              <span>단계별 튜토리얼 보기</span>
            </button>

            <button
              onClick={() => {
                soundFx.playDrop();
                setIsLibraryOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 font-bold shadow-2xs transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-amber-600 shrink-0" />
              <span>조향 원료 도감 열기</span>
            </button>
          </div>

          <div className="text-stone-400 hidden sm:flex items-center gap-1.5 font-medium whitespace-nowrap">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>AI 향료 데이터와 인간 조향사의 시향 감각이 협업하는 공간</span>
          </div>
        </div>

        {/* Tab Content Panels */}
        {activeTab === 'workshop' && (
          <WorkshopStepFlow
            onApplyRecipeToLab={handleApplyRecipeToLab}
            onSaveRecipe={handleSaveRecipe}
            activeLabFormula={labFormula}
          />
        )}

        {activeTab === 'lab' && (
          <VirtualLab
            formula={labFormula}
            setFormula={setLabFormula}
            recipeName={recipeName}
            setRecipeName={setRecipeName}
            conceptStory={conceptStory}
            setConceptStory={setConceptStory}
            sceneTitle={sceneTitle}
            keywords={keywords}
            onSaveRecipe={handleSaveRecipe}
            onOpenLibrary={() => setIsLibraryOpen(true)}
          />
        )}

        {activeTab === 'quiz' && (
          <PersonalityQuiz
            onApplyRecipeToLab={handleApplyRecipeToLab}
            onSaveRecipe={handleSaveRecipe}
          />
        )}

        {activeTab === 'portfolio' && (
          <RecipeBook
            recipes={savedRecipes}
            onDeleteRecipe={handleDeleteRecipe}
            onLoadRecipeToLab={handleApplyRecipeToLab}
          />
        )}

        {activeTab === 'career' && (
          <CareerGuide />
        )}
      </main>

      {/* Modals */}
      <TutorialModal
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
        onNavigateToTab={(tab) => setActiveTab(tab)}
      />

      <FragranceLibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        onAddIngredientToLab={handleAddIngredientToLab}
        currentLabIngredientIds={labFormula.map(f => f.ingredientId)}
      />

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white/60 py-6 text-center text-xs text-stone-500 mt-12 print:hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <strong>AromaAI Studio</strong> · AI 조향연구원 진로체험 & 가상 조향 연구소
          </div>
          <div className="text-stone-400">
            KCCA 커리큘럼 P.O.Ai 모델 기반 · 교육용 가상 시뮬레이션
          </div>
        </div>
      </footer>
    </div>
  );
}
