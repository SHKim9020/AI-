import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Sparkles, 
  Droplet, 
  Plus, 
  Check, 
  Filter, 
  BookOpen, 
  Clock, 
  Zap, 
  Info,
  Atom
} from 'lucide-react';
import { INGREDIENTS, SCENT_FAMILY_METADATA } from '../data/ingredients';
import { Ingredient, NoteType, ScentFamily } from '../types/scent';
import { soundFx } from '../utils/audio';

interface FragranceLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddIngredientToLab: (ingredientId: string, drops?: number) => void;
  currentLabIngredientIds: string[];
}

export const FragranceLibraryModal: React.FC<FragranceLibraryModalProps> = ({
  isOpen,
  onClose,
  onAddIngredientToLab,
  currentLabIngredientIds
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNoteFilter, setSelectedNoteFilter] = useState<'all' | NoteType>('all');
  const [selectedFamilyFilter, setSelectedFamilyFilter] = useState<'all' | ScentFamily>('all');
  const [inspectedIngredient, setInspectedIngredient] = useState<Ingredient | null>(INGREDIENTS[0]);

  if (!isOpen) return null;

  // Filtering
  const filteredIngredients = INGREDIENTS.filter(item => {
    const matchesNote = selectedNoteFilter === 'all' || item.type === selectedNoteFilter;
    const matchesFamily = selectedFamilyFilter === 'all' || item.family === selectedFamilyFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      item.nameKo.toLowerCase().includes(q) ||
      item.nameEn.toLowerCase().includes(q) ||
      item.familyKo.toLowerCase().includes(q) ||
      item.chemCompound.toLowerCase().includes(q) ||
      item.evocativeKeywords.some(kw => kw.toLowerCase().includes(q));

    return matchesNote && matchesFamily && matchesSearch;
  });

  const handleAdd = (item: Ingredient) => {
    soundFx.playDrop();
    onAddIngredientToLab(item.id, 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-5xl w-full border border-stone-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-stone-100 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-serif text-stone-900">
                조향 원료 라이브러리 (Olfactive Fragrance Library)
              </h2>
              <p className="text-xs text-stone-500">
                전문 조향에서 사용되는 탑, 미들, 베이스 주요 향료의 화학 성분과 감성 이미지 도감
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters and Search Bar */}
        <div className="p-4 sm:p-5 border-b border-stone-100 bg-white space-y-3">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="향료명, 감성 키워드, 화학성분 검색..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>

            {/* Note Filter Pills */}
            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto no-scrollbar">
              {[
                { id: 'all', label: '전체 노트' },
                { id: 'top', label: '탑 (Top 0~30분)' },
                { id: 'middle', label: '미들 (Heart ~2시간)' },
                { id: 'base', label: '베이스 (Base 2시간+)' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedNoteFilter(tab.id as 'all' | NoteType)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-colors ${
                    selectedNoteFilter === tab.id
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Family Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
            <button
              onClick={() => setSelectedFamilyFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold shrink-0 ${
                selectedFamilyFilter === 'all'
                  ? 'bg-stone-800 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              전체 계열 ({INGREDIENTS.length})
            </button>
            {(Object.keys(SCENT_FAMILY_METADATA) as ScentFamily[]).map(fam => {
              const meta = SCENT_FAMILY_METADATA[fam];
              const isSelected = selectedFamilyFilter === fam;
              return (
                <button
                  key={fam}
                  onClick={() => setSelectedFamilyFilter(fam)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold shrink-0 flex items-center gap-1 ${
                    isSelected
                      ? 'bg-stone-800 text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  <span>{meta.icon}</span>
                  <span>{meta.labelKo.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Body: Split View (List + Detailed Profile) */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {/* List Area */}
          <div className="w-full md:w-3/5 overflow-y-auto p-4 sm:p-5 border-r border-stone-100 space-y-3">
            {filteredIngredients.length === 0 ? (
              <div className="text-center py-12 text-stone-400 text-xs">
                검색 조건에 맞는 조향 원료가 없습니다.
              </div>
            ) : (
              filteredIngredients.map(item => {
                const isInLab = currentLabIngredientIds.includes(item.id);
                const isInspected = inspectedIngredient?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setInspectedIngredient(item)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start justify-between gap-3 ${
                      isInspected 
                        ? 'border-amber-600 bg-amber-50/40 shadow-xs' 
                        : 'border-stone-200/80 bg-white hover:border-amber-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs"
                        style={{ backgroundColor: item.colorHex }}
                      >
                        <Droplet className="w-5 h-5 fill-white/80" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            item.type === 'top' ? 'bg-amber-100 text-amber-800' :
                            item.type === 'middle' ? 'bg-rose-100 text-rose-800' :
                            'bg-stone-200 text-stone-800'
                          }`}>
                            {item.type}
                          </span>
                          <span className="text-xs text-stone-500 font-medium">
                            {item.familyKo}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-stone-900 mt-0.5">
                          {item.nameKo}
                        </h4>
                        <p className="text-[11px] text-stone-500 font-mono">
                          {item.nameEn}
                        </p>
                        <p className="text-xs text-stone-600 mt-1 line-clamp-1">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 flex flex-col items-end gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAdd(item);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                          isInLab
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-stone-900 text-white hover:bg-amber-600'
                        }`}
                      >
                        {isInLab ? (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>1방울 더</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>연구실 담기</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Detailed Inspector Panel */}
          {inspectedIngredient && (
            <div className="w-full md:w-2/5 overflow-y-auto p-5 sm:p-6 bg-stone-50/60 space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold tracking-wider uppercase text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full">
                  향료 프로파일 상세 정보
                </span>
                <span className="text-xs font-mono text-stone-400">
                  ID: {inspectedIngredient.id}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-stone-900 font-serif">
                  {inspectedIngredient.nameKo}
                </h3>
                <p className="text-xs font-mono text-stone-500 mt-0.5">
                  {inspectedIngredient.nameEn}
                </p>
              </div>

              {/* Chemical & Volatility Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white rounded-xl border border-stone-200 text-xs">
                  <div className="flex items-center gap-1.5 text-stone-400 mb-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>휘발 지속력</span>
                  </div>
                  <div className="font-bold text-stone-800">
                    약 {inspectedIngredient.volatilityHours} 시간
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-stone-200 text-xs">
                  <div className="flex items-center gap-1.5 text-stone-400 mb-1">
                    <Zap className="w-3.5 h-3.5" />
                    <span>발향 강도</span>
                  </div>
                  <div className="font-bold text-amber-700">
                    {'★'.repeat(inspectedIngredient.intensity)}{'☆'.repeat(5 - inspectedIngredient.intensity)} ({inspectedIngredient.intensity}/5)
                  </div>
                </div>
              </div>

              {/* Chemical Compound Info */}
              <div className="p-3.5 bg-white rounded-xl border border-stone-200 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-stone-700">
                  <Atom className="w-3.5 h-3.5 text-indigo-600" />
                  <span>주요 후각 분자 화학 성분</span>
                </div>
                <p className="text-stone-600 font-mono text-[11px]">
                  {inspectedIngredient.chemCompound}
                </p>
              </div>

              {/* Sensory Description & Imagery */}
              <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200/70 text-xs space-y-1.5">
                <div className="font-bold text-amber-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>연상되는 후각적 이미지</span>
                </div>
                <p className="text-stone-700 leading-relaxed font-serif italic">
                  "{inspectedIngredient.sensoryDescription}"
                </p>
              </div>

              {/* Evocative Keywords */}
              <div>
                <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-2">
                  감성 키워드
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {inspectedIngredient.evocativeKeywords.map(kw => (
                    <span
                      key={kw}
                      className="px-2.5 py-1 bg-white border border-stone-200 rounded-lg text-xs font-medium text-stone-700"
                    >
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Pairing Tips */}
              <div className="p-3.5 bg-white rounded-xl border border-stone-200 text-xs space-y-1">
                <div className="font-bold text-teal-900 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-teal-600" />
                  <span>마스터 퍼퓨머의 조향 조합 팁</span>
                </div>
                <p className="text-stone-600 leading-relaxed">
                  {inspectedIngredient.pairingTips}
                </p>
              </div>

              {/* Direct Add Button */}
              <button
                onClick={() => handleAdd(inspectedIngredient)}
                className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>가상 연구실 비커에 1방울 추가</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
