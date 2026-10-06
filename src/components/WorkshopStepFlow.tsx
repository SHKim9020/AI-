import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  RefreshCw, 
  FlaskConical, 
  Layers, 
  Lightbulb, 
  BookOpen, 
  HelpCircle, 
  FileText, 
  Droplet,
  ExternalLink,
  Bot,
  User,
  HeartHandshake
} from 'lucide-react';
import { SCENE_PRESETS, ALL_EMOTION_KEYWORDS } from '../data/scenes';
import { ScenePreset, AIConceptResult, FormulaDrop, ScentRecipe } from '../types/scent';
import { soundFx } from '../utils/audio';

interface WorkshopStepFlowProps {
  onApplyRecipeToLab: (formula: FormulaDrop[], name: string, concept: string, sceneTitle: string, keywords: string[]) => void;
  onSaveRecipe: (recipe: ScentRecipe) => void;
  activeLabFormula: FormulaDrop[];
}

export const WorkshopStepFlow: React.FC<WorkshopStepFlowProps> = ({
  onApplyRecipeToLab,
  onSaveRecipe,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedScene, setSelectedScene] = useState<ScenePreset>(SCENE_PRESETS[0]);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>(SCENE_PRESETS[0].defaultKeywords);
  const [customKeywordInput, setCustomKeywordInput] = useState('');
  const [studentPrompt, setStudentPrompt] = useState(SCENE_PRESETS[0].promptExample);
  const [studentName, setStudentName] = useState('조향 연구생');
  
  // AI Concept states
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiResult, setAiResult] = useState<AIConceptResult | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  // Step 4 Evaluation states
  const [smellingScore, setSmellingScore] = useState({
    freshness: 4,
    elegance: 5,
    depth: 4,
    persistenceHours: 6,
    studentReason: 'AI가 추천한 바다와 베르가못의 첫 향이 마린 콘셉트에 잘 맞아서 그대로 채택했고, 잔향을 부드럽게 만들기 위해 화이트 머스크를 1방울 더 넣고 싶어요.'
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Handle scene selection
  const handleSelectScene = (scene: ScenePreset) => {
    soundFx.playDrop();
    setSelectedScene(scene);
    setSelectedKeywords(scene.defaultKeywords);
    setStudentPrompt(scene.promptExample);
  };

  // Toggle keyword selection
  const toggleKeyword = (kw: string) => {
    soundFx.playDrop();
    if (selectedKeywords.includes(kw)) {
      if (selectedKeywords.length > 1) {
        setSelectedKeywords(selectedKeywords.filter(k => k !== kw));
      }
    } else {
      if (selectedKeywords.length < 5) {
        setSelectedKeywords([...selectedKeywords, kw]);
      }
    }
  };

  const addCustomKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customKeywordInput.trim();
    if (trimmed && !selectedKeywords.includes(trimmed)) {
      soundFx.playDrop();
      setSelectedKeywords([...selectedKeywords, trimmed]);
      setCustomKeywordInput('');
    }
  };

  // Generate AI Scent Concept
  const handleGenerateAIConcept = async () => {
    setIsLoadingAI(true);
    setApiError(null);
    try {
      const response = await fetch('/api/scent/ai-concept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sceneTitle: selectedScene.title,
          keywords: selectedKeywords,
          customPrompt: studentPrompt,
          studentName
        }),
      });

      if (!response.ok) {
        throw new Error('AI 콘셉트 생성 중 문제가 발생했습니다.');
      }

      const data: AIConceptResult = await response.json();
      setAiResult(data);
      soundFx.playMagicChime();
      setCurrentStep(3);
    } catch (err) {
      console.error(err);
      setApiError('AI 서버 응답을 가져오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsLoadingAI(false);
    }
  };

  // Move recipe to Lab
  const handleSendToLab = () => {
    if (!aiResult) return;
    const formula: FormulaDrop[] = aiResult.recommendedFormula.map(item => ({
      ingredientId: item.ingredientId,
      drops: item.drops
    }));

    onApplyRecipeToLab(
      formula,
      aiResult.perfumeName,
      aiResult.conceptSummary,
      selectedScene.title,
      selectedKeywords
    );
    soundFx.playSpray();
    setCurrentStep(4);
  };

  // Final Save to Recipe Book
  const handleFinalSave = () => {
    if (!aiResult) return;
    const totalDrops = aiResult.recommendedFormula.reduce((acc, curr) => acc + curr.drops, 0);
    const topDrops = aiResult.recommendedFormula.filter(i => i.type === 'top').reduce((a, c) => a + c.drops, 0);
    const midDrops = aiResult.recommendedFormula.filter(i => i.type === 'middle').reduce((a, c) => a + c.drops, 0);
    const baseDrops = aiResult.recommendedFormula.filter(i => i.type === 'base').reduce((a, c) => a + c.drops, 0);

    const recipe: ScentRecipe = {
      id: 'recipe_' + Date.now(),
      name: aiResult.perfumeName,
      creatorName: studentName || '학생 조향연구원',
      conceptStory: aiResult.storytelling,
      sceneTitle: selectedScene.title,
      selectedKeywords: selectedKeywords,
      drops: aiResult.recommendedFormula.map(i => ({ ingredientId: i.ingredientId, drops: i.drops })),
      totalDrops: totalDrops || 20,
      topPercent: Math.round((topDrops / (totalDrops || 1)) * 100),
      middlePercent: Math.round((midDrops / (totalDrops || 1)) * 100),
      basePercent: Math.round((baseDrops / (totalDrops || 1)) * 100),
      primaryFamily: 'aquatic',
      createdAt: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }),
      notesCommentary: aiResult.perfumerAdvice,
      smellingEvaluation: {
        freshness: smellingScore.freshness,
        elegance: smellingScore.elegance,
        depth: smellingScore.depth,
        persistenceHours: smellingScore.persistenceHours,
        studentFeedback: smellingScore.studentReason
      }
    };

    onSaveRecipe(recipe);
    soundFx.playMagicChime();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Slide Context Banner (Visual Reference to User's Classroom Slide) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-amber-100/40 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-md bg-teal-100 text-teal-800 text-xs font-bold">
                KCCA 공식 커리큘럼 P.O.Ai
              </span>
              <span className="text-xs text-stone-500">진로체험 탐구 모델</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight font-serif">
              조향 수업: 이미지를 말로 번역하기
            </h1>
            <p className="text-stone-600 text-sm mt-1 max-w-2xl leading-relaxed">
              시각적 장면에서 피어나는 감성을 언어로 포착하고, AI의 표현 확장과 가상 시뮬레이션을 거쳐 
              인간 조향사의 섬세한 시향과 검증으로 완성하는 융합 조향 프로세스입니다.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-stone-50 border border-stone-200 rounded-2xl p-3 shrink-0">
            <User className="w-5 h-5 text-amber-700" />
            <div>
              <div className="text-[11px] text-stone-500 font-medium">참여 학생 이름</div>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="예: 김민우 학생"
                className="text-xs font-semibold text-stone-800 bg-transparent focus:outline-none focus:border-b focus:border-amber-600"
              />
            </div>
          </div>
        </div>

        {/* 4-Step Progress Indicator (Exactly replicating the slide's visual flow) */}
        <div className="mt-8 pt-6 border-t border-stone-200/80">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 items-stretch">
            {[
              { num: 1, title: '장면 선택', desc: '풍경 & 시각적 영감', step: 1 },
              { num: 2, title: '감성 단어', desc: '후각적 어휘 매칭', step: 2 },
              { num: 3, title: 'AI와 표현 확장', desc: '향 콘셉트 & 레시피 제안', step: 3 },
              { num: 4, title: '시향 후 수정', desc: '비율 조율 & 전문가 검토', step: 4 }
            ].map((s) => {
              const isCurrent = currentStep === s.step;
              const isPassed = currentStep > s.step;
              return (
                <button
                  key={s.num}
                  onClick={() => {
                    soundFx.playDrop();
                    setCurrentStep(s.step as 1 | 2 | 3 | 4);
                  }}
                  className={`text-left p-4 rounded-2xl transition-all duration-200 border-2 relative flex flex-col justify-between cursor-pointer min-h-[96px] ${
                    isCurrent
                      ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                      : isPassed
                      ? 'bg-emerald-50 text-emerald-950 border-emerald-200 hover:bg-emerald-100/60'
                      : 'bg-white text-stone-700 border-stone-200 hover:border-amber-300 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      isCurrent ? 'bg-white/25 text-white' : isPassed ? 'bg-emerald-200 text-emerald-900' : 'bg-stone-100 text-stone-600 border border-stone-200'
                    }`}>
                      {s.num}단계
                    </span>
                    {isPassed && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                  </div>
                  <div>
                    <div className={`font-bold text-sm tracking-tight whitespace-nowrap ${isCurrent ? 'text-white' : 'text-stone-900'}`}>
                      {s.title}
                    </div>
                    <div className={`text-xs mt-1 leading-snug whitespace-nowrap overflow-hidden text-ellipsis ${isCurrent ? 'text-amber-100' : 'text-stone-500'}`}>
                      {s.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* STEP 1: 장면 선택 (Scene Selection) */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-stone-900 font-serif flex items-center gap-2">
                <span>1단계 : 장면(이미지) 선택하기</span>
                <span className="text-xs font-sans font-normal text-stone-500 bg-stone-100 px-2.5 py-1 rounded-full">
                  영감을 주는 순간을 선택하세요
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                조향사는 한 장의 사진이나 풍경의 빛, 공기, 온도, 분위기를 오감으로 해석하여 향기로 번역합니다.
              </p>
            </div>
            <button
              onClick={() => {
                soundFx.playDrop();
                setCurrentStep(2);
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition-colors"
            >
              <span>다음: 감성 단어 선택</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SCENE_PRESETS.map((scene) => {
              const isSelected = selectedScene.id === scene.id;
              return (
                <div
                  key={scene.id}
                  onClick={() => handleSelectScene(scene)}
                  className={`group rounded-2xl overflow-hidden cursor-pointer border-2 transition-all duration-300 relative bg-white shadow-xs ${
                    isSelected 
                      ? 'border-amber-600 ring-4 ring-amber-500/20 shadow-md' 
                      : 'border-stone-200 hover:border-amber-300 hover:shadow-md'
                  }`}
                >
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={scene.imageUrl}
                      alt={scene.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    
                    {isSelected && (
                      <div className="absolute top-3 right-3 bg-amber-500 text-white p-1.5 rounded-full shadow-md">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                    )}

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <div className="text-xs font-medium text-amber-200">
                        {scene.subtitle}
                      </div>
                      <div className="text-base font-bold font-serif">
                        {scene.title}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white">
                    <div className="text-[11px] font-semibold text-stone-500 mb-2">
                      대표 감성 단어
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {scene.defaultKeywords.map((kw) => (
                        <span
                          key={kw}
                          className="px-2 py-0.5 bg-stone-100 text-stone-700 rounded-md text-xs font-medium"
                        >
                          #{kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Prompt Preview Box replicating the question example on the slide */}
          <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-1">
                💬 슬라이드 질문 예시 연계
              </div>
              <p className="text-stone-800 text-sm font-medium">
                "{selectedScene.promptExample}"
              </p>
              <p className="text-stone-500 text-xs mt-1">
                이 질문과 장면 데이터를 3단계에서 AI 조향연구원 모델에게 전달하여 콘셉트와 레시피를 도출합니다.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: 감성 단어 (Sensory & Emotion Keywords) */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-stone-900 font-serif flex items-center gap-2">
                <span>2단계 : 감성 단어 선택하기</span>
                <span className="text-xs font-sans font-normal text-stone-500 bg-stone-100 px-2.5 py-1 rounded-full">
                  최대 5개 선택 ({selectedKeywords.length}/5)
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                선택한 장면 [{selectedScene.title}]에서 연상되는 느낌을 구체적인 감성 어휘 카드로 연결해보세요.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2 border border-stone-200 text-stone-600 rounded-xl text-xs font-semibold hover:bg-stone-100"
              >
                이전: 장면 변경
              </button>
              <button
                onClick={handleGenerateAIConcept}
                disabled={isLoadingAI || selectedKeywords.length === 0}
                className="flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition-colors"
              >
                {isLoadingAI ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>AI 조향연구원 분석 중...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-200" />
                    <span>AI와 표현 확장 실행하기</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Selected Scene Banner */}
          <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
            <img
              src={selectedScene.imageUrl}
              alt={selectedScene.title}
              className="w-16 h-16 rounded-xl object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="text-xs text-amber-700 font-bold">선택된 조향 장면</div>
              <div className="text-base font-bold text-stone-900 truncate">{selectedScene.title}</div>
              <div className="text-xs text-stone-500 truncate">{selectedScene.subtitle}</div>
            </div>
          </div>

          {/* Emotion Word Cards (Matching slide's tactile paper card motifs) */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                감성 단어 카드 컬렉션
              </span>
              <span className="text-xs text-stone-500">
                카드를 클릭하여 선택하거나 해제할 수 있습니다.
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {ALL_EMOTION_KEYWORDS.map((kw) => {
                const isSelected = selectedKeywords.includes(kw);
                return (
                  <button
                    key={kw}
                    onClick={() => toggleKeyword(kw)}
                    className={`p-4 rounded-2xl border-2 text-center transition-all duration-200 relative group ${
                      isSelected
                        ? 'border-amber-600 bg-amber-50/80 text-amber-950 font-bold shadow-xs scale-102'
                        : 'border-stone-200 bg-stone-50/50 text-stone-700 hover:border-amber-300 hover:bg-stone-50'
                    }`}
                  >
                    <div className="text-base mb-1">
                      {isSelected ? '✨' : '🌿'}
                    </div>
                    <div className="text-sm tracking-wide">
                      {kw}
                    </div>
                    {isSelected && (
                      <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-600" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Custom Keyword Input */}
            <form onSubmit={addCustomKeyword} className="mt-6 pt-6 border-t border-stone-100 flex gap-2">
              <input
                type="text"
                value={customKeywordInput}
                onChange={(e) => setCustomKeywordInput(e.target.value)}
                placeholder="목록에 없는 나만의 감성 단어 직접 입력 (예: 별빛처럼, 아련한)"
                className="flex-1 px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-stone-800 text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-stone-900"
              >
                단어 추가
              </button>
            </form>
          </div>

          {/* Student Question & Intent Box */}
          <div className="bg-stone-100/80 p-5 rounded-2xl border border-stone-200 space-y-2">
            <label className="block text-xs font-bold text-stone-700">
              💬 AI 조향연구원에게 보낼 질문 & 제작 의도 (수업 질문지 작성)
            </label>
            <input
              type="text"
              value={studentPrompt}
              onChange={(e) => setStudentPrompt(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              placeholder="예: 바닷가의 느낌을 향 콘셉트와 이름으로 표현해 줘."
            />
            <p className="text-[11px] text-stone-500">
              슬라이드 예시처럼 조향사의 질문을 구체화할수록 AI가 깊이 있는 스토리텔링과 향료 배합비를 도출합니다.
            </p>
          </div>
        </div>
      )}

      {/* STEP 3: AI와 표현 확장 (AI Concept Proposal & Expansion) */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-stone-900 font-serif flex items-center gap-2">
                <span>3단계 : AI 향 콘셉트 제안 & 표현 확장</span>
                <span className="text-xs font-sans font-normal text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                  AI 조향 분석 완료
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                AI가 장면의 시각 정보와 감성 단어를 후각 분자 및 조향 스토리텔링으로 번역한 결과입니다.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleGenerateAIConcept}
                disabled={isLoadingAI}
                className="px-3.5 py-2 border border-stone-200 text-stone-600 rounded-xl text-xs font-semibold hover:bg-stone-100 flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingAI ? 'animate-spin' : ''}`} />
                <span>재분석</span>
              </button>
              <button
                onClick={handleSendToLab}
                className="flex items-center gap-2 px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition-colors"
              >
                <FlaskConical className="w-4 h-4" />
                <span>가상 조향실로 레시피 보내기</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {apiError && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs">
              {apiError}
            </div>
          )}

          {aiResult && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Concept Tablet Card (Matching the tablet in the slide) */}
              <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm relative">
                <div className="flex items-start justify-between gap-4 mb-6 pb-6 border-b border-stone-100">
                  <div>
                    <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {aiResult.scentFamily}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-serif mt-2">
                      {aiResult.perfumeName}
                    </h3>
                    <div className="text-xs text-stone-500 font-mono mt-0.5">
                      {aiResult.perfumeNameEn}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-stone-400 block">설계자</span>
                    <span className="text-xs font-bold text-stone-700">{studentName} 조향연구원</span>
                  </div>
                </div>

                {/* Summary & Storytelling */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">
                      콘셉트 설명 (Concept Summary)
                    </h4>
                    <p className="text-stone-800 text-sm leading-relaxed font-medium">
                      {aiResult.conceptSummary}
                    </p>
                  </div>

                  <div className="bg-stone-50/80 p-5 rounded-2xl border border-stone-100">
                    <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>이미지를 향기로 번역한 스토리텔링</span>
                    </h4>
                    <p className="text-stone-700 text-sm leading-relaxed whitespace-pre-line">
                      {aiResult.storytelling}
                    </p>
                  </div>
                </div>

                {/* Recommended Formula Table */}
                <div className="mt-6 pt-6 border-t border-stone-100">
                  <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-3 flex items-center justify-between">
                    <span>AI 추천 조향 배합비 (Formula Drops)</span>
                    <span className="text-stone-500 font-normal">총 {aiResult.recommendedFormula.reduce((a, b) => a + b.drops, 0)}방울 기준</span>
                  </h4>

                  <div className="space-y-2">
                    {aiResult.recommendedFormula.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-xl bg-stone-50/60 border border-stone-200/60 text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            item.type === 'top' ? 'bg-amber-100 text-amber-800' :
                            item.type === 'middle' ? 'bg-rose-100 text-rose-800' :
                            'bg-stone-200 text-stone-800'
                          }`}>
                            {item.type}
                          </span>
                          <span className="font-bold text-stone-900">{item.ingredientName}</span>
                          <span className="text-stone-500 hidden sm:inline text-[11px]">- {item.reason}</span>
                        </div>
                        <div className="flex items-center gap-1.5 font-mono font-bold text-teal-800 shrink-0">
                          <Droplet className="w-3.5 h-3.5 text-teal-600 fill-teal-600" />
                          <span>{item.drops} drops</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Educational Mentor Sidebar (Slide Roleplay Model) */}
              <div className="space-y-4">
                {/* Master Perfumer Advice */}
                <div className="bg-amber-50/70 border border-amber-200/80 rounded-3xl p-6 shadow-xs">
                  <div className="flex items-center gap-2.5 text-amber-900 font-bold text-sm mb-3">
                    <Bot className="w-5 h-5 text-amber-700" />
                    <span>조향 연구원의 전문 피드백</span>
                  </div>
                  <p className="text-xs text-stone-700 leading-relaxed">
                    {aiResult.perfumerAdvice}
                  </p>
                </div>

                {/* Educational Takeaway (Crucial Slide Takeaway) */}
                <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-3xl p-6 shadow-xs">
                  <div className="flex items-center gap-2.5 text-emerald-900 font-bold text-sm mb-3">
                    <Lightbulb className="w-5 h-5 text-emerald-700" />
                    <span>수업 핵심 배움 (Educational Takeaway)</span>
                  </div>
                  <p className="text-xs text-stone-700 leading-relaxed font-medium">
                    {aiResult.educationalTakeaway}
                  </p>
                  <div className="mt-3 text-[11px] text-emerald-800 bg-white/70 p-2.5 rounded-xl border border-emerald-200/60">
                    💡 <strong>슬라이드 핵심 문구</strong>: "AI는 실제 향을 맡지 못하므로 시향과 전문가 검토가 필수적입니다."
                  </div>
                </div>

                {/* Quick Next Button */}
                <button
                  onClick={handleSendToLab}
                  className="w-full py-4 bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <FlaskConical className="w-5 h-5" />
                  <span>4단계: 시향 및 비율 수정하기</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* STEP 4: 시향 후 수정 (Smelling & Refinement) */}
      {currentStep === 4 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-stone-900 font-serif flex items-center gap-2">
                <span>4단계 : 시향 후 수정 & 진로 포트폴리오 완성</span>
                <span className="text-xs font-sans font-normal text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full">
                  실제 시향 검증 단계
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                슬라이드의 핵심: "조향사는 향료의 특성을 설명하고, 학생은 콘셉트와 실제 느낌을 비교해 수정합니다."
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleFinalSave}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>나만의 레시피북에 저장</span>
              </button>
            </div>
          </div>

          {savedSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold flex items-center justify-between">
              <span>🎉 레시피가 성공적으로 저장되었습니다! '레시피북 & 포트폴리오' 탭에서 인쇄하거나 확인할 수 있습니다.</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Virtual Smelling Strip & Time Evolution */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm space-y-6">
              <div>
                <h3 className="text-base font-bold text-stone-900 font-serif flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-600" />
                  <span>가상 시향지 (Olfactive Scent Strip) 시간별 발향 시뮬레이션</span>
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  시향지에 1방울 적신 후 시간 경과에 따라 피어나는 탑, 미들, 베이스의 변화를 관찰합니다.
                </p>
              </div>

              {/* Time stages */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-900 mb-2">
                    <span>1) 0분 ~ 15분</span>
                    <span className="text-[10px] bg-amber-200 px-1.5 py-0.5 rounded">탑 노트</span>
                  </div>
                  <div className="text-xs text-stone-700 font-medium mb-1">
                    첫인상과 강렬한 산뜻함
                  </div>
                  <p className="text-[11px] text-stone-500">
                    알코올이 날아가며 감귤, 민트, 마린 등 가벼운 분자가 즉각적으로 코끝을 자극합니다.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200/80">
                  <div className="flex items-center justify-between text-xs font-bold text-rose-900 mb-2">
                    <span>2) 30분 ~ 2시간</span>
                    <span className="text-[10px] bg-rose-200 px-1.5 py-0.5 rounded">미들 노트</span>
                  </div>
                  <div className="text-xs text-stone-700 font-medium mb-1">
                    향기의 심장(Heart) 테마
                  </div>
                  <p className="text-[11px] text-stone-500">
                    꽃잎, 허브, 홍차 등이 조화를 이루며 이 향수만의 고유한 서사와 정체성이 만개합니다.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-stone-100 border border-stone-200">
                  <div className="flex items-center justify-between text-xs font-bold text-stone-900 mb-2">
                    <span>3) 2시간 ~ 24시간</span>
                    <span className="text-[10px] bg-stone-200 px-1.5 py-0.5 rounded">베이스 노트</span>
                  </div>
                  <div className="text-xs text-stone-700 font-medium mb-1">
                    은은하고 깊은 잔향
                  </div>
                  <p className="text-[11px] text-stone-500">
                    나무, 머스크, 앰버가 피부와 옷깃에 남아 따뜻하고 부드러운 여운을 선사합니다.
                  </p>
                </div>
              </div>

              {/* Student Evaluation Form */}
              <div className="space-y-4 pt-4 border-t border-stone-100">
                <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                  학생 시향 평가 & 선택 이유 기록표 (수업 활동지)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-stone-600 block mb-1">
                      청량감 / 싱그러움 (1~5점) : {smellingScore.freshness}점
                    </label>
                    <input
                      type="range"
                      min={1}
                      max={5}
                      value={smellingScore.freshness}
                      onChange={(e) => setSmellingScore({ ...smellingScore, freshness: Number(e.target.value) })}
                      className="w-full accent-amber-600 cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-stone-600 block mb-1">
                      우아함 / 조화로움 (1~5점) : {smellingScore.elegance}점
                    </label>
                    <input
                      type="range"
                      min={1}
                      max={5}
                      value={smellingScore.elegance}
                      onChange={(e) => setSmellingScore({ ...smellingScore, elegance: Number(e.target.value) })}
                      className="w-full accent-rose-600 cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-stone-600 block mb-1">
                      깊이감 / 무게감 (1~5점) : {smellingScore.depth}점
                    </label>
                    <input
                      type="range"
                      min={1}
                      max={5}
                      value={smellingScore.depth}
                      onChange={(e) => setSmellingScore({ ...smellingScore, depth: Number(e.target.value) })}
                      className="w-full accent-stone-700 cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-stone-600 block mb-1">
                      예상 지속시간 : 약 {smellingScore.persistenceHours}시간
                    </label>
                    <input
                      type="range"
                      min={2}
                      max={12}
                      value={smellingScore.persistenceHours}
                      onChange={(e) => setSmellingScore({ ...smellingScore, persistenceHours: Number(e.target.value) })}
                      className="w-full accent-teal-600 cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    📝 조향 선택 이유 및 수정 메모 (수업 결과물 제출용)
                  </label>
                  <textarea
                    rows={3}
                    value={smellingScore.studentReason}
                    onChange={(e) => setSmellingScore({ ...smellingScore, studentReason: e.target.value })}
                    className="w-full p-3 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    placeholder="AI 콘셉트와 실제 시향 느낌을 비교하고, 어떤 이유로 이 조합을 채택/수정했는지 적어보세요."
                  />
                </div>
              </div>
            </div>

            {/* Roleplay Guide Sidebar (조향사 vs 학생 역할) */}
            <div className="space-y-4">
              <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
                  <HeartHandshake className="w-5 h-5 text-amber-600" />
                  <span>조향 수업 역할 분담 가이드</span>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/70 text-xs text-stone-700 space-y-1">
                  <div className="font-bold text-amber-900 flex items-center gap-1.5">
                    <span>👩‍🔬 조향사(멘토) 역할</span>
                  </div>
                  <p>준비한 향료의 휘발도, 화학적 특성과 향조 차이를 알기 쉽게 설명해 줍니다.</p>
                </div>

                <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200/70 text-xs text-stone-700 space-y-1">
                  <div className="font-bold text-teal-900 flex items-center gap-1.5">
                    <span>🧑‍🎓 학생 역할</span>
                  </div>
                  <p>AI가 제안한 콘셉트와 실제 시향지 느낌을 비교하고 원하는 취향에 맞춰 방울 수를 조정합니다.</p>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-600 space-y-1">
                  <div className="font-bold text-stone-900">
                    📋 최종 수업 결과물
                  </div>
                  <p>나만의 조향 콘셉트 카드 + 선택 이유가 담긴 포트폴리오를 인쇄 또는 소장합니다.</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  onClick={handleFinalSave}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>레시피북에 저장하기</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
