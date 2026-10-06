import React, { useState, useMemo } from 'react';
import { 
  FlaskConical, 
  Droplet, 
  Plus, 
  Minus, 
  Trash2, 
  Sparkles, 
  RefreshCw, 
  BookmarkCheck, 
  BookOpen, 
  Wind, 
  Clock, 
  Info,
  CheckCircle2,
  Sliders,
  ChevronRight,
  Bot
} from 'lucide-react';
import { INGREDIENTS, INGREDIENT_MAP, SCENT_FAMILY_METADATA } from '../data/ingredients';
import { FormulaDrop, Ingredient, NoteType, ScentRecipe, ScentFamily } from '../types/scent';
import { soundFx } from '../utils/audio';

interface VirtualLabProps {
  formula: FormulaDrop[];
  setFormula: React.Dispatch<React.SetStateAction<FormulaDrop[]>>;
  recipeName: string;
  setRecipeName: (name: string) => void;
  conceptStory: string;
  setConceptStory: (story: string) => void;
  sceneTitle: string;
  keywords: string[];
  onSaveRecipe: (recipe: ScentRecipe) => void;
  onOpenLibrary: () => void;
}

export const VirtualLab: React.FC<VirtualLabProps> = ({
  formula,
  setFormula,
  recipeName,
  setRecipeName,
  conceptStory,
  setConceptStory,
  sceneTitle,
  keywords,
  onSaveRecipe,
  onOpenLibrary
}) => {
  const [selectedNoteTab, setSelectedNoteTab] = useState<'all' | NoteType>('all');
  const [isSimulatingSmell, setIsSimulatingSmell] = useState(false);
  const [smellStage, setSmellStage] = useState<'top' | 'middle' | 'base'>('top');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  // AI Advisor state
  const [isLoadingAdvisor, setIsLoadingAdvisor] = useState(false);
  const [advisorData, setAdvisorData] = useState<{
    balanceAnalysis: string;
    harmonyScore: number;
    scentImpression: string;
    adjustmentSuggestion: string;
    smellingTip: string;
  } | null>(null);

  // Total drops & percentages calculation
  const totalDrops = useMemo(() => {
    return formula.reduce((acc, curr) => acc + curr.drops, 0);
  }, [formula]);

  const noteStats = useMemo(() => {
    let top = 0;
    let mid = 0;
    let base = 0;
    formula.forEach(f => {
      const ing = INGREDIENT_MAP.get(f.ingredientId);
      if (ing) {
        if (ing.type === 'top') top += f.drops;
        if (ing.type === 'middle') mid += f.drops;
        if (ing.type === 'base') base += f.drops;
      }
    });
    const denom = totalDrops || 1;
    return {
      topDrops: top,
      midDrops: mid,
      baseDrops: base,
      topPercent: Math.round((top / denom) * 100),
      midPercent: Math.round((mid / denom) * 100),
      basePercent: Math.round((base / denom) * 100),
    };
  }, [formula, totalDrops]);

  // Family breakdown
  const familyBreakdown = useMemo(() => {
    const map: Partial<Record<ScentFamily, number>> = {};
    formula.forEach(f => {
      const ing = INGREDIENT_MAP.get(f.ingredientId);
      if (ing) {
        map[ing.family] = (map[ing.family] || 0) + f.drops;
      }
    });
    return map;
  }, [formula]);

  // Liquid color blend
  const blendedColor = useMemo(() => {
    if (formula.length === 0) return '#E2E8F0';
    let rSum = 0;
    let gSum = 0;
    let bSum = 0;
    let weightSum = 0;

    formula.forEach(f => {
      const ing = INGREDIENT_MAP.get(f.ingredientId);
      if (ing && ing.colorHex.startsWith('#')) {
        const hex = ing.colorHex.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        rSum += r * f.drops;
        gSum += g * f.drops;
        bSum += b * f.drops;
        weightSum += f.drops;
      }
    });

    if (weightSum === 0) return '#FDE68A';
    const rAvg = Math.round(rSum / weightSum);
    const gAvg = Math.round(gSum / weightSum);
    const bAvg = Math.round(bSum / weightSum);
    return `rgb(${rAvg}, ${gAvg}, ${bAvg})`;
  }, [formula]);

  // Handle drops change
  const handleUpdateDrops = (ingredientId: string, delta: number) => {
    soundFx.playDrop();
    setFormula(prev => {
      const existing = prev.find(p => p.ingredientId === ingredientId);
      if (!existing && delta > 0) {
        return [...prev, { ingredientId, drops: delta }];
      }
      return prev
        .map(p => {
          if (p.ingredientId === ingredientId) {
            const next = p.drops + delta;
            return next > 0 ? { ...p, drops: next } : null;
          }
          return p;
        })
        .filter(Boolean) as FormulaDrop[];
    });
  };

  const handleRemoveIngredient = (ingredientId: string) => {
    soundFx.playDrop();
    setFormula(prev => prev.filter(p => p.ingredientId !== ingredientId));
  };

  // Reset beaker
  const handleResetBeaker = () => {
    soundFx.playDrop();
    if (window.confirm('비커의 모든 향료를 비우시겠습니까?')) {
      setFormula([]);
      setAdvisorData(null);
    }
  };

  // Preset loading
  const loadPreset = (type: 'ocean' | 'forest' | 'tea') => {
    soundFx.playSpray();
    if (type === 'ocean') {
      setRecipeName('블루 오션 브리즈');
      setConceptStory('청록색 파도가 부서지는 청량한 바다와 따뜻한 화이트 머스크의 잔향');
      setFormula([
        { ingredientId: 'marine_aqua', drops: 7 },
        { ingredientId: 'bergamot', drops: 5 },
        { ingredientId: 'lavender', drops: 5 },
        { ingredientId: 'neroli', drops: 3 },
        { ingredientId: 'white_musk', drops: 4 },
        { ingredientId: 'cedarwood', drops: 3 },
      ]);
    } else if (type === 'forest') {
      setRecipeName('비 온 뒤 편백 숲길');
      setConceptStory('촉촉한 숲속의 안개와 피톤치드 흙내음의 치유');
      setFormula([
        { ingredientId: 'eucalyptus_mint', drops: 6 },
        { ingredientId: 'green_apple', drops: 4 },
        { ingredientId: 'muguet', drops: 5 },
        { ingredientId: 'cedarwood', drops: 6 },
        { ingredientId: 'patchouli', drops: 2 },
      ]);
    } else {
      setRecipeName('애프터눈 북카페 티');
      setConceptStory('오후 햇살 속 따뜻한 홍차와 달콤한 바닐라, 책장의 원목 향기');
      setFormula([
        { ingredientId: 'bergamot', drops: 4 },
        { ingredientId: 'black_tea_fig', drops: 8 },
        { ingredientId: 'vanilla', drops: 5 },
        { ingredientId: 'sandalwood', drops: 4 },
        { ingredientId: 'amber', drops: 3 },
      ]);
    }
  };

  // Smelling Simulation generator based on active ingredients
  const simulationText = useMemo(() => {
    if (formula.length === 0) {
      return {
        top: '비커에 아직 향료가 담기지 않았습니다. 향료를 추가하여 시향을 시작해보세요.',
        middle: '조향의 심장(Heart)이 될 미들 노트 향료를 추가해주세요.',
        base: '향을 오래 지속시켜줄 베이스 노트를 추가해주세요.',
        overallImpression: '향료 라이브러리에서 원하는 원료를 골라 담아보세요.',
        harmonySummary: '원료를 혼합하면 피라미드 밸런스가 자동으로 계산됩니다.'
      };
    }

    const topItems = formula.filter(f => INGREDIENT_MAP.get(f.ingredientId)?.type === 'top');
    const midItems = formula.filter(f => INGREDIENT_MAP.get(f.ingredientId)?.type === 'middle');
    const baseItems = formula.filter(f => INGREDIENT_MAP.get(f.ingredientId)?.type === 'base');

    const topNames = topItems.map(f => INGREDIENT_MAP.get(f.ingredientId)?.nameKo).join(', ') || '가벼운 공기';
    const midNames = midItems.map(f => INGREDIENT_MAP.get(f.ingredientId)?.nameKo).join(', ') || '은은한 테마';
    const baseNames = baseItems.map(f => INGREDIENT_MAP.get(f.ingredientId)?.nameKo).join(', ') || '희미한 잔향';

    // 0 min Top impression
    const topImpression = topItems.length > 0
      ? `분사 직후 0~15분 동안 알코올이 기화하며 [${topNames}]의 신선하고 산뜻한 분자가 폭발하듯 코끝을 깨웁니다. 첫인상이 매우 선명하며 공간에 싱그러운 생동감을 불어넣습니다.`
      : `탑 노트가 약하여 첫인상의 상쾌함이 다소 밋밋할 수 있습니다. 감귤류나 아쿠아틱 노트를 더해보세요.`;

    // 30 min Middle impression
    const midImpression = midItems.length > 0
      ? `30분~2시간 경과 후, 조향의 본질인 하트 노트 [${midNames}]가 풍성하게 피어오릅니다. 향수의 테마와 개성이 우아하게 발현되며 감성적인 여운을 깊게 남깁니다.`
      : `미들 노트의 볼륨감이 부족합니다. 플로럴이나 허벌 노트를 넣어 심장부의 정체성을 강화해보세요.`;

    // 2 hr+ Base impression
    const baseImpression = baseItems.length > 0
      ? `2시간 이후 피부와 섬유에 스며들어 남는 잔향은 [${baseNames}]의 묵직하고 따스한 온기입니다. 체온과 어우러지며 하루 종일 나만의 은은한 살결 냄새로 정착됩니다.`
      : `베이스 노트가 적어 향이 1~2시간 만에 빠르게 날아갈 수 있습니다. 머스크나 우디 보류제를 보강해보세요.`;

    // Overall Harmony
    let harmonySummary = '안정적인 3단계 피라미드 밸런스를 갖추고 있습니다.';
    if (noteStats.topPercent > 50) {
      harmonySummary = '탑 노트의 비중이 높아 첫 향이 매우 산뜻하지만 잔향 지속력이 짧을 수 있습니다.';
    } else if (noteStats.basePercent > 45) {
      harmonySummary = '베이스 노트의 비중이 묵직하여 지속력은 뛰어나지만 첫 개방감이 무거울 수 있습니다.';
    }

    return {
      top: topImpression,
      middle: midImpression,
      base: baseImpression,
      overallImpression: `이 향수는 [${topNames}]로 문을 열어 [${midNames}]의 심장을 지나 [${baseNames}]의 아늑한 온기로 귀결되는 아름다운 후각적 서사를 가집니다.`,
      harmonySummary
    };
  }, [formula, noteStats]);

  // Trigger Virtual Smelling
  const handleStartSmellSimulation = () => {
    soundFx.playSpray();
    setIsSimulatingSmell(true);
  };

  // Request AI Advisor
  const handleRequestAIAdvisor = async () => {
    if (formula.length === 0) return;
    setIsLoadingAdvisor(true);
    try {
      const formulaSummary = formula.map(f => {
        const ing = INGREDIENT_MAP.get(f.ingredientId);
        return `${ing?.nameKo || f.ingredientId} (${f.drops}방울)`;
      }).join(', ');

      const response = await fetch('/api/scent/ai-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formulaSummary,
          topPercent: noteStats.topPercent,
          middlePercent: noteStats.midPercent,
          basePercent: noteStats.basePercent,
          recipeName: recipeName || '가상 조향 레시피'
        }),
      });

      if (!response.ok) throw new Error('AI 자문 호출 실패');
      const data = await response.json();
      setAdvisorData(data);
      soundFx.playMagicChime();
    } catch (err) {
      console.error(err);
      setAdvisorData({
        balanceAnalysis: '현재 비율은 안정적인 피라미드 구조를 형성하고 있습니다.',
        harmonyScore: 88,
        scentImpression: '산뜻한 시작과 부드러운 하트 노트가 자연스럽게 이어집니다.',
        adjustmentSuggestion: '미들 노트의 지속력을 더 느끼고 싶다면 플로럴 또는 허브 향료를 1~2방울 추가해보세요.',
        smellingTip: '시향지를 코에 너무 밀착하지 말고 10cm 거리에서 가볍게 부채질하며 맡으세요.'
      });
    } finally {
      setIsLoadingAdvisor(false);
    }
  };

  // Save current formula
  const handleSaveToBook = () => {
    if (formula.length === 0) {
      alert('비커에 최소 1개 이상의 향료를 담아주세요.');
      return;
    }
    const finalRecipe: ScentRecipe = {
      id: 'recipe_' + Date.now(),
      name: recipeName || '나만의 비스포크 향수',
      creatorName: 'AI 조향연구원',
      conceptStory: conceptStory || simulationText.overallImpression,
      sceneTitle: sceneTitle || '가상 연구실 자유 조향',
      selectedKeywords: keywords.length > 0 ? keywords : ['조화로운', '매력적인'],
      drops: formula,
      totalDrops: totalDrops,
      topPercent: noteStats.topPercent,
      middlePercent: noteStats.midPercent,
      basePercent: noteStats.basePercent,
      primaryFamily: (Object.keys(familyBreakdown)[0] as ScentFamily) || 'citrus',
      createdAt: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }),
      notesCommentary: advisorData?.balanceAnalysis || simulationText.harmonySummary,
      smellingEvaluation: {
        freshness: 4,
        elegance: 4,
        depth: 4,
        persistenceHours: noteStats.basePercent > 30 ? 8 : 5,
        studentFeedback: advisorData?.adjustmentSuggestion || '가상 조향 연구실에서 배합 및 시향 검증 완료'
      }
    };

    onSaveRecipe(finalRecipe);
    soundFx.playMagicChime();
    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 3000);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner & Quick Presets */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-xs font-bold">
              가상 조향 시뮬레이터 (Virtual Scent Lab)
            </span>
            <span className="text-xs text-stone-500 font-mono">
              총 {totalDrops} 방울 배합 중
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-serif">
            피라미드 노트 조향 & 시향 시뮬레이션
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            탑·미들·베이스 향료를 스포이트로 떨어뜨려 다양한 비율로 혼합하고, 
            시간대별 발향 변화와 어울림을 실시간 가상 시향으로 테스트해보세요.
          </p>
        </div>

        {/* Classroom Quick Presets */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <span className="text-[11px] font-bold text-stone-400 block w-full sm:w-auto">
            수업용 추천 프리셋 :
          </span>
          <button
            onClick={() => loadPreset('ocean')}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-sky-50 text-sky-800 border border-sky-200 hover:bg-sky-100"
          >
            🌊 바다 바람
          </button>
          <button
            onClick={() => loadPreset('forest')}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
          >
            🌲 편백 숲길
          </button>
          <button
            onClick={() => loadPreset('tea')}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100"
          >
            ☕ 북카페 티
          </button>
        </div>
      </div>

      {/* Main Grid: Left Beaker & Pyramid Gauges / Right Blending Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Glass Beaker & Golden Ratio Pyramid (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Beaker Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs relative overflow-hidden flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
                <FlaskConical className="w-4 h-4 text-amber-600" />
                <span>가상 조향 비커 (Beaker)</span>
              </span>
              <button
                onClick={handleResetBeaker}
                className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1 p-1 hover:bg-rose-50 rounded-lg transition-colors"
                title="비커 비우기"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>비우기</span>
              </button>
            </div>

            {/* Glass Beaker Graphic with dynamic liquid */}
            <div className="relative w-44 h-64 border-4 border-stone-300 rounded-b-3xl border-t-0 bg-stone-50/50 shadow-inner flex flex-col justify-end p-2 overflow-hidden my-2">
              {/* Beaker Measurement Marks */}
              <div className="absolute left-2 top-6 text-[10px] font-mono text-stone-400">30 drops</div>
              <div className="absolute left-0 top-8 w-4 h-0.5 bg-stone-300" />
              <div className="absolute left-2 top-20 text-[10px] font-mono text-stone-400">20 drops</div>
              <div className="absolute left-0 top-22 w-4 h-0.5 bg-stone-300" />
              <div className="absolute left-2 top-36 text-[10px] font-mono text-stone-400">10 drops</div>
              <div className="absolute left-0 top-38 w-4 h-0.5 bg-stone-300" />

              {/* Dynamic Liquid */}
              <div
                className="w-full rounded-b-2xl transition-all duration-700 relative overflow-hidden shadow-md"
                style={{
                  height: `${Math.min(100, (totalDrops / 30) * 100)}%`,
                  backgroundColor: blendedColor,
                  opacity: totalDrops > 0 ? 0.85 : 0
                }}
              >
                {/* Gentle wave ripple reflection */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/30" />
                <div className="absolute top-0 inset-x-0 h-2 bg-white/40 blur-xs" />
              </div>

              {/* Beaker Empty state */}
              {totalDrops === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                  <Droplet className="w-6 h-6 text-stone-300 mb-2" />
                  <span className="text-xs text-stone-400 font-medium">비커가 비어있습니다.</span>
                  <span className="text-[11px] text-stone-400 mt-0.5">우측에서 향료를 추가하세요.</span>
                </div>
              )}
            </div>

            {/* Beaker Summary Stats */}
            <div className="w-full mt-4 pt-4 border-t border-stone-100 flex items-center justify-between text-xs">
              <span className="text-stone-500 font-medium">총 방울 수</span>
              <span className="text-stone-900 font-mono font-bold text-base">
                {totalDrops} drops
              </span>
            </div>

            {/* Smell Simulation Trigger Button */}
            <button
              onClick={handleStartSmellSimulation}
              disabled={totalDrops === 0}
              className="w-full mt-4 py-3 bg-teal-700 hover:bg-teal-800 disabled:opacity-40 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <Wind className="w-4 h-4" />
              <span>가상 시향 테스트 시작하기</span>
            </button>
          </div>

          {/* Golden Ratio Pyramid Bar */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-amber-600" />
                <span>피라미드 황금비율 분석 (Golden Ratio)</span>
              </span>
              <span className="text-[11px] text-stone-400">기준: 30:50:20</span>
            </div>

            {/* Stacked Progress Bar */}
            <div className="h-4 w-full bg-stone-100 rounded-full overflow-hidden flex shadow-inner">
              <div 
                className="bg-amber-400 transition-all duration-500" 
                style={{ width: `${noteStats.topPercent}%` }} 
                title={`탑 노트: ${noteStats.topPercent}%`}
              />
              <div 
                className="bg-rose-400 transition-all duration-500" 
                style={{ width: `${noteStats.midPercent}%` }} 
                title={`미들 노트: ${noteStats.midPercent}%`}
              />
              <div 
                className="bg-stone-600 transition-all duration-500" 
                style={{ width: `${noteStats.basePercent}%` }} 
                title={`베이스 노트: ${noteStats.basePercent}%`}
              />
            </div>

            {/* Note details */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200/60">
                <div className="text-[10px] text-amber-800 font-bold">TOP (상향)</div>
                <div className="text-base font-bold text-amber-950 font-mono mt-0.5">
                  {noteStats.topPercent}%
                </div>
                <div className="text-[10px] text-stone-500">{noteStats.topDrops} drops</div>
              </div>

              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200/60">
                <div className="text-[10px] text-rose-800 font-bold">MIDDLE (심장)</div>
                <div className="text-base font-bold text-rose-950 font-mono mt-0.5">
                  {noteStats.midPercent}%
                </div>
                <div className="text-[10px] text-stone-500">{noteStats.midDrops} drops</div>
              </div>

              <div className="p-2.5 rounded-xl bg-stone-100 border border-stone-200">
                <div className="text-[10px] text-stone-700 font-bold">BASE (하향)</div>
                <div className="text-base font-bold text-stone-900 font-mono mt-0.5">
                  {noteStats.basePercent}%
                </div>
                <div className="text-[10px] text-stone-500">{noteStats.baseDrops} drops</div>
              </div>
            </div>

            <div className="text-[11px] text-stone-500 bg-stone-50 p-2.5 rounded-xl border border-stone-200/70">
              💡 <strong>조향 상식</strong>: 오 드 퍼퓸(EDP)의 표준 밸런스는 탑 25~35%, 미들 40~50%, 베이스 20~30%가 가장 풍성하고 조화롭습니다.
            </div>
          </div>
        </div>

        {/* Right Column: Blending Bench Table & Smelling Results (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Formula Bench Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-stone-900 font-serif flex items-center gap-2">
                  <span>향료 배합 테이블 (Formulation Bench)</span>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  스포이트로 방울 수를 조절하거나 도감에서 새로운 원료를 추가하세요.
                </p>
              </div>

              <button
                onClick={onOpenLibrary}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
              >
                <BookOpen className="w-4 h-4" />
                <span>+ 향료 라이브러리에서 추가</span>
              </button>
            </div>

            {/* Note Filter Tabs */}
            <div className="flex items-center gap-1.5 border-b border-stone-100 pb-2">
              {[
                { id: 'all', label: '전체 배합' },
                { id: 'top', label: '탑 노트' },
                { id: 'middle', label: '미들 노트' },
                { id: 'base', label: '베이스 노트' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedNoteTab(tab.id as 'all' | NoteType)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                    selectedNoteTab === tab.id
                      ? 'bg-stone-900 text-white'
                      : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Active Formula List */}
            {formula.length === 0 ? (
              <div className="p-8 text-center rounded-2xl border-2 border-dashed border-stone-200 text-stone-400 space-y-3">
                <Droplet className="w-8 h-8 mx-auto text-stone-300" />
                <p className="text-xs">현재 배합된 향료가 없습니다.</p>
                <button
                  onClick={onOpenLibrary}
                  className="px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-semibold hover:bg-amber-700"
                >
                  향료 라이브러리 열기
                </button>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                {formula
                  .filter(f => {
                    const ing = INGREDIENT_MAP.get(f.ingredientId);
                    if (!ing) return false;
                    return selectedNoteTab === 'all' || ing.type === selectedNoteTab;
                  })
                  .map(f => {
                    const ing = INGREDIENT_MAP.get(f.ingredientId);
                    if (!ing) return null;
                    const percent = Math.round((f.drops / (totalDrops || 1)) * 100);

                    return (
                      <div
                        key={f.ingredientId}
                        className="p-3.5 rounded-2xl border border-stone-200/80 bg-stone-50/50 flex items-center justify-between gap-3 hover:bg-white hover:border-amber-200 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs"
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
                              <span className="text-xs font-bold text-stone-900">
                                {ing.nameKo}
                              </span>
                            </div>
                            <div className="text-[11px] text-stone-500 font-mono">
                              {ing.nameEn} · {ing.familyKo}
                            </div>
                          </div>
                        </div>

                        {/* Dropper +/- Control */}
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-xs font-mono font-bold text-stone-400 w-10 text-right">
                            {percent}%
                          </span>

                          <div className="flex items-center gap-1.5 bg-white border border-stone-200 rounded-xl p-1 shadow-xs">
                            <button
                              onClick={() => handleUpdateDrops(f.ingredientId, -1)}
                              className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-100"
                              title="1방울 감소"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-7 text-center font-mono font-bold text-xs text-stone-900">
                              {f.drops}
                            </span>
                            <button
                              onClick={() => handleUpdateDrops(f.ingredientId, 1)}
                              className="p-1.5 rounded-lg text-amber-700 hover:bg-amber-50"
                              title="1방울 추가"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <button
                            onClick={() => handleRemoveIngredient(f.ingredientId)}
                            className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg"
                            title="삭제"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>

          {/* VIRTUAL SMELLING SIMULATION RESULTS BOX */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Olfactive Simulation
                </span>
                <h3 className="text-lg font-bold text-stone-900 font-serif mt-1">
                  가상 시향 결과 & 시간대별 발향 어울림
                </h3>
              </div>

              {/* Time stages selector */}
              <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs font-medium">
                {[
                  { id: 'top', label: '0분 (Top)' },
                  { id: 'middle', label: '30분 (Heart)' },
                  { id: 'base', label: '2시간+ (Base)' }
                ].map(stage => (
                  <button
                    key={stage.id}
                    onClick={() => {
                      soundFx.playDrop();
                      setSmellStage(stage.id as 'top' | 'middle' | 'base');
                    }}
                    className={`px-3 py-1.5 rounded-lg transition-colors ${
                      smellStage === stage.id
                        ? 'bg-white text-stone-900 font-bold shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {stage.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Scent Description Box */}
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 text-xs sm:text-sm text-stone-700 leading-relaxed space-y-3">
              <div className="flex items-center gap-2 font-bold text-stone-900">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>
                  {smellStage === 'top' ? '0분~15분 탑 노트 첫인상' :
                   smellStage === 'middle' ? '30분~2시간 미들 하트 발향' :
                   '2시간 이후 베이스 노트 잔향'}
                </span>
              </div>
              <p className="font-serif italic text-stone-800">
                {smellStage === 'top' && simulationText.top}
                {smellStage === 'middle' && simulationText.middle}
                {smellStage === 'base' && simulationText.base}
              </p>
            </div>

            {/* Overall Scent Harmony Summary */}
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 text-xs text-stone-700 space-y-1">
              <div className="font-bold text-amber-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>종합적인 향의 느낌과 예상 어울림</span>
              </div>
              <p className="leading-relaxed">
                {simulationText.overallImpression}
              </p>
            </div>

            {/* AI Advisor Card (if loaded) */}
            {advisorData && (
              <div className="p-5 rounded-2xl bg-teal-50 border border-teal-200 text-xs space-y-2 animate-in fade-in">
                <div className="flex items-center justify-between text-teal-900 font-bold">
                  <span className="flex items-center gap-1.5">
                    <Bot className="w-4 h-4 text-teal-700" />
                    <span>AI 마스터 퍼퓨머 정밀 자문</span>
                  </span>
                  <span className="bg-teal-200 text-teal-900 px-2 py-0.5 rounded-full font-mono">
                    조화 점수 : {advisorData.harmonyScore}점
                  </span>
                </div>
                <p className="text-stone-700 leading-relaxed">
                  <strong>[밸런스 분석]</strong> {advisorData.balanceAnalysis}
                </p>
                <p className="text-stone-700 leading-relaxed">
                  <strong>[조율 팁]</strong> {advisorData.adjustmentSuggestion}
                </p>
                <p className="text-teal-800 text-[11px]">
                  💡 {advisorData.smellingTip}
                </p>
              </div>
            )}

            {/* Bottom Controls: AI Advisor call & Save */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={handleRequestAIAdvisor}
                disabled={isLoadingAdvisor || formula.length === 0}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-teal-300 text-teal-800 bg-teal-50 hover:bg-teal-100 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                {isLoadingAdvisor ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>AI 조향 자문 분석 중...</span>
                  </>
                ) : (
                  <>
                    <Bot className="w-3.5 h-3.5 text-teal-700" />
                    <span>AI 조향 자문 피드백 받기</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleSaveToBook}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <BookmarkCheck className="w-4 h-4" />
                  <span>레시피북에 저장하기</span>
                </button>
              </div>
            </div>

            {saveSuccessMsg && (
              <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 text-center animate-in fade-in">
                🎉 레시피가 성공적으로 저장되었습니다!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
