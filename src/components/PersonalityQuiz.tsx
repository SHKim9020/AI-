import React, { useState } from 'react';
import { 
  Compass, 
  ArrowRight, 
  ArrowLeft, 
  RefreshCw, 
  Sparkles, 
  CheckCircle2, 
  FlaskConical, 
  BookmarkCheck, 
  Droplet,
  Sliders,
  Award,
  Zap,
  BookOpen
} from 'lucide-react';
import { QUIZ_QUESTIONS, ARCHETYPES } from '../data/careerQuiz';
import { INGREDIENT_MAP } from '../data/ingredients';
import { FormulaDrop, ScentFamily, ScentRecipe, OlfactivePreferenceResult } from '../types/scent';
import { soundFx } from '../utils/audio';

interface PersonalityQuizProps {
  onApplyRecipeToLab: (formula: FormulaDrop[], name: string, concept: string, sceneTitle: string, keywords: string[]) => void;
  onSaveRecipe: (recipe: ScentRecipe) => void;
}

export const PersonalityQuiz: React.FC<PersonalityQuizProps> = ({
  onApplyRecipeToLab,
  onSaveRecipe
}) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Editable recommendation drops state
  const [customFormula, setCustomFormula] = useState<FormulaDrop[]>([]);
  const [customName, setCustomName] = useState('');

  // Handle question answer
  const handleSelectOption = (optionIndex: number) => {
    soundFx.playDrop();
    const nextAnswers = [...answers];
    nextAnswers[currentQIndex] = optionIndex;
    setAnswers(nextAnswers);

    if (currentQIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      // Calculate results and synthesize recipe
      finishQuiz(nextAnswers);
    }
  };

  // Advanced recommendation algorithm
  const finishQuiz = (finalAnswers: number[]) => {
    soundFx.playMagicChime();
    setIsCompleted(true);

    // Count family preferences
    const familyCounts: Record<string, number> = {
      citrus: 0,
      aquatic: 0,
      floral: 0,
      herbal: 0,
      woody: 0,
      oriental: 0,
      gourmand: 0,
      musk: 0
    };

    finalAnswers.forEach((optIdx, qIdx) => {
      const q = QUIZ_QUESTIONS[qIdx];
      if (q && q.options[optIdx]) {
        const fam = q.options[optIdx].targetFamily;
        familyCounts[fam] = (familyCounts[fam] || 0) + 1;
      }
    });

    // Synthesize formula based on top preferences
    const isAquaticCitrus = (familyCounts.aquatic || 0) + (familyCounts.citrus || 0) >= 3;
    const isWoodyHerbal = (familyCounts.woody || 0) + (familyCounts.herbal || 0) >= 3;
    const isFloral = (familyCounts.floral || 0) >= 2;

    let initialDrops: FormulaDrop[] = [];
    let initialName = '';

    if (isAquaticCitrus) {
      initialName = '에메랄드 아쿠아 마린 펄';
      initialDrops = [
        { ingredientId: 'marine_aqua', drops: 7 },
        { ingredientId: 'lemon_lime', drops: 5 },
        { ingredientId: 'bergamot', drops: 4 },
        { ingredientId: 'lavender', drops: 4 },
        { ingredientId: 'white_musk', drops: 4 },
      ];
    } else if (isWoodyHerbal) {
      initialName = '침엽수림 피톤치드 딥 우드';
      initialDrops = [
        { ingredientId: 'eucalyptus_mint', drops: 5 },
        { ingredientId: 'green_apple', drops: 3 },
        { ingredientId: 'muguet', drops: 4 },
        { ingredientId: 'cedarwood', drops: 6 },
        { ingredientId: 'sandalwood', drops: 4 },
        { ingredientId: 'patchouli', drops: 2 },
      ];
    } else if (isFloral) {
      initialName = '로즈 벨벳 & 문라이트 자스민';
      initialDrops = [
        { ingredientId: 'bergamot', drops: 5 },
        { ingredientId: 'damask_rose', drops: 7 },
        { ingredientId: 'neroli', drops: 4 },
        { ingredientId: 'white_musk', drops: 4 },
        { ingredientId: 'sandalwood', drops: 3 },
      ];
    } else {
      // Warm gourmand / oriental
      initialName = '웜 캐시미어 앰버 & 바닐라';
      initialDrops = [
        { ingredientId: 'pink_pepper', drops: 3 },
        { ingredientId: 'bergamot', drops: 4 },
        { ingredientId: 'black_tea_fig', drops: 6 },
        { ingredientId: 'vanilla', drops: 5 },
        { ingredientId: 'amber', drops: 4 },
        { ingredientId: 'white_musk', drops: 3 },
      ];
    }

    setCustomName(initialName);
    setCustomFormula(initialDrops);
  };

  // Archetype profile
  const archetypeResult: OlfactivePreferenceResult = React.useMemo(() => {
    if (!isCompleted) return ARCHETYPES.aquatic_citrus;
    const firstAns = answers[0] ?? 0;
    if (firstAns === 0) return ARCHETYPES.aquatic_citrus;
    if (firstAns === 1) return ARCHETYPES.woody_forest;
    if (firstAns === 2) return ARCHETYPES.floral_romantic;
    return ARCHETYPES.gourmand_amber;
  }, [isCompleted, answers]);

  // Adjust drops
  const handleUpdateDrop = (id: string, delta: number) => {
    soundFx.playDrop();
    setCustomFormula(prev => prev.map(item => {
      if (item.ingredientId === id) {
        const next = Math.max(1, item.drops + delta);
        return { ...item, drops: next };
      }
      return item;
    }));
  };

  // Restart quiz
  const handleRestart = () => {
    soundFx.playDrop();
    setCurrentQIndex(0);
    setAnswers([]);
    setIsCompleted(false);
  };

  // Apply to Virtual Lab
  const handleApplyToLab = () => {
    soundFx.playSpray();
    onApplyRecipeToLab(
      customFormula,
      customName,
      archetypeResult.description,
      archetypeResult.title,
      ['맞춤형', '올팩티브', '시그니처']
    );
  };

  // Save to Recipe Book
  const handleSaveRecipeBook = () => {
    const totalDrops = customFormula.reduce((a, b) => a + b.drops, 0);
    const topDrops = customFormula.filter(f => INGREDIENT_MAP.get(f.ingredientId)?.type === 'top').reduce((a, b) => a + b.drops, 0);
    const midDrops = customFormula.filter(f => INGREDIENT_MAP.get(f.ingredientId)?.type === 'middle').reduce((a, b) => a + b.drops, 0);
    const baseDrops = customFormula.filter(f => INGREDIENT_MAP.get(f.ingredientId)?.type === 'base').reduce((a, b) => a + b.drops, 0);

    const recipe: ScentRecipe = {
      id: 'quiz_' + Date.now(),
      name: customName || '취향 진단 맞춤 향수',
      creatorName: 'AI 조향연구원',
      conceptStory: archetypeResult.description,
      sceneTitle: `[진단 결과] ${archetypeResult.title}`,
      selectedKeywords: ['취향맞춤', '올팩티브코드', archetypeResult.code],
      drops: customFormula,
      totalDrops,
      topPercent: Math.round((topDrops / (totalDrops || 1)) * 100),
      middlePercent: Math.round((midDrops / (totalDrops || 1)) * 100),
      basePercent: Math.round((baseDrops / (totalDrops || 1)) * 100),
      primaryFamily: archetypeResult.recommendedFamilies[0] || 'citrus',
      createdAt: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }),
      notesCommentary: archetypeResult.careerPathAdvice,
      smellingEvaluation: {
        freshness: 5,
        elegance: 5,
        depth: 4,
        persistenceHours: 7,
        studentFeedback: '취향 테스트 알고리즘을 통해 추천된 개인 맞춤형 황금비율 레시피'
      }
    };

    onSaveRecipe(recipe);
    soundFx.playMagicChime();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const currentQ = QUIZ_QUESTIONS[currentQIndex];

  return (
    <div className="space-y-8 pb-12">
      {/* Intro Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 text-xs font-bold">
              진로 적성 & 취향 진단
            </span>
            <span className="text-xs text-stone-500">
              총 {QUIZ_QUESTIONS.length}문항
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-serif">
            향기 취향 테스트 & AI 맞춤 조향 추천
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            나의 공간 감각, 라이프스타일, 감정 치유 방식을 분석하여 
            고유한 올팩티브 성향(Olfactive Archetype)과 맞춤형 조향 배합비를 제안합니다.
          </p>
        </div>

        {isCompleted && (
          <button
            onClick={handleRestart}
            className="px-4 py-2 border border-stone-200 text-stone-600 rounded-xl text-xs font-semibold hover:bg-stone-100 flex items-center gap-1.5 self-start md:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>테스트 다시하기</span>
          </button>
        )}
      </div>

      {!isCompleted ? (
        /* QUIZ IN PROGRESS */
        <div className="max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-8">
          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
              <span>{currentQ.category}</span>
              <span>{currentQIndex + 1} / {QUIZ_QUESTIONS.length}</span>
            </div>
            <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-cyan-600 transition-all duration-300"
                style={{ width: `${((currentQIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Text */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-cyan-700 font-mono tracking-wider">
              Q{currentQIndex + 1}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-stone-900 leading-snug">
              {currentQ.question}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                className="w-full text-left p-5 rounded-2xl border-2 border-stone-200 bg-stone-50/50 hover:border-cyan-500 hover:bg-cyan-50/40 transition-all duration-200 group flex items-start gap-4"
              >
                <div className="w-7 h-7 rounded-xl bg-white border border-stone-200 flex items-center justify-center font-bold text-xs text-stone-600 group-hover:border-cyan-500 group-hover:text-cyan-700 shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <div>
                  <div className="text-sm sm:text-base font-bold text-stone-900 group-hover:text-cyan-950">
                    {option.text}
                  </div>
                  <div className="text-xs text-stone-500 mt-1">
                    {option.subtext}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Back button */}
          {currentQIndex > 0 && (
            <button
              onClick={() => {
                soundFx.playDrop();
                setCurrentQIndex(currentQIndex - 1);
              }}
              className="text-xs font-semibold text-stone-500 hover:text-stone-800 flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>이전 질문으로</span>
            </button>
          )}
        </div>
      ) : (
        /* QUIZ RESULTS & HIGH-DIMENSIONAL RECOMMENDATION */
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Archetype Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-md bg-stone-100 text-stone-700">
                  CODE: {archetypeResult.code}
                </span>
                <span className="text-xs font-bold text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-full">
                  성향 분석 완료
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-extrabold text-stone-900 font-serif">
                  {archetypeResult.title}
                </h3>
                <p className="text-xs text-cyan-800 font-medium mt-1">
                  {archetypeResult.subtitle}
                </p>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 text-xs text-stone-700 leading-relaxed">
                {archetypeResult.description}
              </div>

              {/* Aptitude Radar Scores */}
              <div className="space-y-3 pt-2 border-t border-stone-100">
                <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                  조향 연구원 적성 지수
                </h4>

                <div className="space-y-2 text-xs">
                  <div>
                    <div className="flex justify-between text-[11px] text-stone-600 mb-1">
                      <span>과학적 분석력 (Chemical Analysis)</span>
                      <span className="font-mono font-bold text-stone-900">{archetypeResult.careerAptitudeScore.scientificAnalysis}점</span>
                    </div>
                    <div className="h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-600" style={{ width: `${archetypeResult.careerAptitudeScore.scientificAnalysis}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-stone-600 mb-1">
                      <span>예술적 창의력 (Artistic Creativity)</span>
                      <span className="font-mono font-bold text-stone-900">{archetypeResult.careerAptitudeScore.creativity}점</span>
                    </div>
                    <div className="h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-500" style={{ width: `${archetypeResult.careerAptitudeScore.creativity}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-stone-600 mb-1">
                      <span>후각 감각 예민도 (Sensory Perception)</span>
                      <span className="font-mono font-bold text-stone-900">{archetypeResult.careerAptitudeScore.sensoryPerception}점</span>
                    </div>
                    <div className="h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500" style={{ width: `${archetypeResult.careerAptitudeScore.sensoryPerception}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-stone-600 mb-1">
                      <span>감성 공감력 (Emotional Empathy)</span>
                      <span className="font-mono font-bold text-stone-900">{archetypeResult.careerAptitudeScore.emotionalEmpathy}점</span>
                    </div>
                    <div className="h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: `${archetypeResult.careerAptitudeScore.emotionalEmpathy}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Career Path Advice */}
              <div className="p-4 bg-cyan-50/70 border border-cyan-200/80 rounded-2xl text-xs space-y-1">
                <div className="font-bold text-cyan-950 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-cyan-700" />
                  <span>추천 진로 및 커리어 패스</span>
                </div>
                <p className="text-stone-700 leading-relaxed">
                  {archetypeResult.careerPathAdvice}
                </p>
              </div>
            </div>

            {/* Personalized Recipe Generator & Live Editor (2 cols) */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
                <div>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Bespoke Recommendation
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold font-serif text-stone-900 mt-1">
                    개인 맞춤형 추천 조향 레시피
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleApplyToLab}
                    className="px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <FlaskConical className="w-4 h-4" />
                    <span>가상 조향실로 가져가기</span>
                  </button>
                  <button
                    onClick={handleSaveRecipeBook}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <BookmarkCheck className="w-4 h-4" />
                    <span>레시피북 저장</span>
                  </button>
                </div>
              </div>

              {saveSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 text-center animate-in fade-in">
                  🎉 맞춤형 레시피가 성공적으로 저장되었습니다!
                </div>
              )}

              {/* Recipe Name Input */}
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  향수 이름 (수정 가능)
                </label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                />
              </div>

              {/* Recommended Drops Table with live +/- modification */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-stone-500 uppercase">
                  <span>추천 원료 및 방울 수 조절 (Live Tuning)</span>
                  <span>총 {customFormula.reduce((a, b) => a + b.drops, 0)} drops</span>
                </div>

                <div className="space-y-2">
                  {customFormula.map(f => {
                    const ing = INGREDIENT_MAP.get(f.ingredientId);
                    if (!ing) return null;

                    return (
                      <div
                        key={f.ingredientId}
                        className="p-3.5 rounded-2xl bg-stone-50/70 border border-stone-200 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0"
                            style={{ backgroundColor: ing.colorHex }}
                          >
                            <Droplet className="w-4 h-4 fill-white/80" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-0.2 rounded text-[9px] font-bold uppercase ${
                                ing.type === 'top' ? 'bg-amber-100 text-amber-800' :
                                ing.type === 'middle' ? 'bg-rose-100 text-rose-800' :
                                'bg-stone-200 text-stone-800'
                              }`}>
                                {ing.type}
                              </span>
                              <span className="font-bold text-stone-900">
                                {ing.nameKo}
                              </span>
                            </div>
                            <span className="text-[11px] text-stone-500">
                              {ing.sensoryDescription}
                            </span>
                          </div>
                        </div>

                        {/* Adjuster */}
                        <div className="flex items-center gap-1.5 bg-white border border-stone-200 rounded-xl p-1 shrink-0">
                          <button
                            onClick={() => handleUpdateDrop(f.ingredientId, -1)}
                            className="p-1 rounded-lg text-stone-500 hover:bg-stone-100"
                          >
                            -
                          </button>
                          <span className="w-6 text-center font-mono font-bold text-stone-900">
                            {f.drops}
                          </span>
                          <button
                            onClick={() => handleUpdateDrop(f.ingredientId, 1)}
                            className="p-1 rounded-lg text-amber-700 hover:bg-amber-50"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Explanatory accord */}
              <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200/70 text-xs text-stone-700 space-y-1">
                <div className="font-bold text-amber-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>맞춤형 하모니 어코드 해설</span>
                </div>
                <p className="leading-relaxed">
                  당신의 취향 진단 데이터에 최적화된 조합입니다. 상큼한 첫인상 뒤로 마음을 편안하게 해주는 심장 하트 노트가 자연스럽게 연결되며, 
                  오래도록 곁에 남는 부드러운 잔향을 남기도록 황금비율로 조율되었습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
