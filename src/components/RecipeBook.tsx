import React, { useState } from 'react';
import { 
  BookOpen, 
  Trash2, 
  Printer, 
  FlaskConical, 
  Sparkles, 
  Clock, 
  Droplet, 
  Award, 
  Search, 
  Layers,
  CheckCircle2,
  Share2
} from 'lucide-react';
import { INGREDIENT_MAP } from '../data/ingredients';
import { ScentRecipe, FormulaDrop } from '../types/scent';
import { soundFx } from '../utils/audio';

interface RecipeBookProps {
  recipes: ScentRecipe[];
  onDeleteRecipe: (id: string) => void;
  onLoadRecipeToLab: (formula: FormulaDrop[], name: string, concept: string, sceneTitle: string, keywords: string[]) => void;
}

export const RecipeBook: React.FC<RecipeBookProps> = ({
  recipes,
  onDeleteRecipe,
  onLoadRecipeToLab
}) => {
  const [selectedRecipe, setSelectedRecipe] = useState<ScentRecipe | null>(recipes[0] || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [printMode, setPrintMode] = useState(false);

  const filteredRecipes = recipes.filter(r => {
    const q = searchQuery.toLowerCase().trim();
    return !q || r.name.toLowerCase().includes(q) || r.conceptStory.toLowerCase().includes(q);
  });

  const handlePrint = () => {
    soundFx.playDrop();
    window.print();
  };

  const handleLoad = (r: ScentRecipe) => {
    soundFx.playSpray();
    onLoadRecipeToLab(
      r.drops,
      r.name,
      r.conceptStory,
      r.sceneTitle || '저장된 레시피',
      r.selectedKeywords || []
    );
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 print:hidden">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-xs font-bold">
              조향 포트폴리오 아카이브
            </span>
            <span className="text-xs text-stone-500 font-mono">
              총 {recipes.length}개의 레시피
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-serif">
            나만의 레시피북 & 진로 포트폴리오
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            AI 조향 워크숍 및 가상 연구실에서 직접 설계한 나만의 향수 레시피를 영구 보관하고, 
            공식 조향 라벨 카드와 인증서로 인쇄하여 수업 활동지로 제출할 수 있습니다.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {selectedRecipe && (
            <button
              onClick={handlePrint}
              className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>포트폴리오 카드 인쇄</span>
            </button>
          )}
        </div>
      </div>

      {recipes.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 space-y-4">
          <BookOpen className="w-12 h-12 text-stone-300 mx-auto" />
          <h3 className="text-lg font-bold text-stone-800 font-serif">
            아직 저장된 향수 레시피가 없습니다.
          </h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            [AI 조향 워크숍] 또는 [가상 조향 연구실]에서 향료를 배합하고 '레시피북에 저장하기'를 눌러보세요.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Recipe List (4 cols) */}
          <div className="lg:col-span-4 space-y-3 print:hidden">
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="레시피 이름 검색..."
                className="w-full pl-9 pr-4 py-2.5 text-xs bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20"
              />
            </div>

            <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
              {filteredRecipes.map(r => {
                const isSelected = selectedRecipe?.id === r.id;
                return (
                  <div
                    key={r.id}
                    onClick={() => {
                      soundFx.playDrop();
                      setSelectedRecipe(r);
                    }}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                      isSelected
                        ? 'border-rose-600 bg-rose-50/40 shadow-xs'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold text-rose-700 bg-rose-100/70 px-2 py-0.5 rounded uppercase">
                          {r.primaryFamily}
                        </span>
                        <h4 className="text-sm font-bold text-stone-900 mt-1">
                          {r.name}
                        </h4>
                        <div className="text-[11px] text-stone-400 font-mono mt-0.5">
                          {r.createdAt} · {r.totalDrops} drops
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm(`'${r.name}' 레시피를 삭제하시겠습니까?`)) {
                            onDeleteRecipe(r.id);
                            if (selectedRecipe?.id === r.id) {
                              setSelectedRecipe(recipes.find(x => x.id !== r.id) || null);
                            }
                          }
                        }}
                        className="p-1.5 text-stone-300 hover:text-rose-600 rounded-lg"
                        title="삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-xs text-stone-600 mt-2 line-clamp-2">
                      {r.conceptStory}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Recipe Printable Card (8 cols) */}
          {selectedRecipe && (
            <div className="lg:col-span-8 space-y-4">
              {/* Action Toolbar */}
              <div className="flex items-center justify-between print:hidden">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  포트폴리오 카드 상세 미리보기
                </span>
                <button
                  onClick={() => handleLoad(selectedRecipe)}
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <FlaskConical className="w-4 h-4" />
                  <span>이 레시피를 가상 연구실로 불러오기</span>
                </button>
              </div>

              {/* Luxury Fragrance Label Certificate */}
              <div 
                id="printable-portfolio-card"
                className="bg-white rounded-3xl p-8 sm:p-10 border-2 border-stone-800 shadow-xl relative overflow-hidden print:border print:shadow-none print:m-0 print:p-6"
              >
                {/* Decorative borders & Watermark */}
                <div className="border border-stone-300 p-6 sm:p-8 rounded-2xl relative bg-stone-50/30">
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 text-stone-300 font-serif text-[10px] uppercase tracking-widest">
                    AromaAI Studio Cert. # {selectedRecipe.id.slice(-6)}
                  </div>

                  {/* Header */}
                  <div className="text-center pb-6 border-b border-stone-200">
                    <span className="text-[11px] font-bold tracking-widest uppercase text-amber-800">
                      PARFUM SUR MESURE · AI JO-HYANG RESEARCH
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-extrabold font-serif text-stone-900 mt-2 tracking-tight">
                      {selectedRecipe.name}
                    </h2>
                    <p className="text-xs font-mono text-stone-500 mt-1">
                      Designed by. {selectedRecipe.creatorName} · {selectedRecipe.createdAt}
                    </p>
                  </div>

                  {/* Story & Concept */}
                  <div className="py-6 border-b border-stone-200 text-center space-y-2">
                    <p className="text-xs sm:text-sm font-serif italic text-stone-800 max-w-xl mx-auto leading-relaxed">
                      "{selectedRecipe.conceptStory}"
                    </p>
                    {selectedRecipe.selectedKeywords && selectedRecipe.selectedKeywords.length > 0 && (
                      <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
                        {selectedRecipe.selectedKeywords.map(kw => (
                          <span
                            key={kw}
                            className="text-[11px] px-2 py-0.5 rounded-full bg-stone-200/70 text-stone-700 font-medium"
                          >
                            #{kw}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Pyramid Proportions */}
                  <div className="py-6 border-b border-stone-200 grid grid-cols-3 text-center gap-4">
                    <div>
                      <span className="text-[10px] font-bold text-amber-800 block uppercase">TOP NOTE</span>
                      <span className="text-lg font-bold font-mono text-stone-900">{selectedRecipe.topPercent}%</span>
                      <span className="text-[10px] text-stone-400 block">첫인상 (0~30분)</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-rose-800 block uppercase">MIDDLE NOTE</span>
                      <span className="text-lg font-bold font-mono text-stone-900">{selectedRecipe.middlePercent}%</span>
                      <span className="text-[10px] text-stone-400 block">심장부 (30분~2시간)</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-stone-700 block uppercase">BASE NOTE</span>
                      <span className="text-lg font-bold font-mono text-stone-900">{selectedRecipe.basePercent}%</span>
                      <span className="text-[10px] text-stone-400 block">지속 잔향 (2시간+)</span>
                    </div>
                  </div>

                  {/* Formula Breakdown Table */}
                  <div className="py-6 space-y-3">
                    <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider text-center">
                      원료 배합 상세표 (Formulation Recipe Drops)
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {selectedRecipe.drops.map((d, i) => {
                        const ing = INGREDIENT_MAP.get(d.ingredientId);
                        if (!ing) return null;
                        return (
                          <div
                            key={i}
                            className="flex items-center justify-between p-2 rounded-lg bg-white border border-stone-200/80"
                          >
                            <div className="flex items-center gap-2">
                              <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                                ing.type === 'top' ? 'bg-amber-100 text-amber-800' :
                                ing.type === 'middle' ? 'bg-rose-100 text-rose-800' :
                                'bg-stone-200 text-stone-800'
                              }`}>
                                {ing.type}
                              </span>
                              <span className="font-bold text-stone-900">{ing.nameKo}</span>
                            </div>
                            <span className="font-mono font-bold text-stone-700">{d.drops} drops</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Student Feedback & Verification */}
                  {selectedRecipe.smellingEvaluation?.studentFeedback && (
                    <div className="pt-4 border-t border-stone-200 text-xs text-stone-600 bg-stone-100/50 p-3 rounded-xl">
                      <span className="font-bold text-stone-800 block mb-0.5">
                        📝 조향 연구생 시향 검증 메모:
                      </span>
                      {selectedRecipe.smellingEvaluation.studentFeedback}
                    </div>
                  )}

                  {/* Footer Stamp */}
                  <div className="mt-8 pt-6 border-t border-stone-200 flex items-center justify-between text-xs text-stone-400">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-amber-600" />
                      <span className="font-bold text-stone-700">KCCA P.O.Ai 인증 진로체험 수료 포트폴리오</span>
                    </div>
                    <span className="font-mono">VERIFIED BY HUMAN PERFUMER</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
