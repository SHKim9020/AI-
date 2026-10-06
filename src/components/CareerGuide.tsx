import React from 'react';
import { 
  GraduationCap, 
  Lightbulb, 
  Sparkles, 
  Atom, 
  HeartHandshake, 
  Compass, 
  BookOpen, 
  HelpCircle,
  FileCheck2,
  Cpu,
  Layers
} from 'lucide-react';

export const CareerGuide: React.FC = () => {
  return (
    <div className="space-y-8 pb-12">
      {/* Hero Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
            미래 융합 신직업 탐구
          </span>
          <span className="text-xs text-stone-500">진로체험 수업 가이드</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-serif">
          AI 조향연구원 (AI Fragrance Researcher) 직업 탐구
        </h1>
        <p className="text-stone-600 text-xs sm:text-sm mt-1 max-w-3xl leading-relaxed">
          수천 년간 이어져 온 인간의 섬세한 후각 예술과 현대 인공지능(AI) 빅데이터, 화학 분석이 융합된 
          미래 조향 산업의 혁신 직무를 알아보고 교실 수업용 탐구 활동을 진행합니다.
        </p>
      </div>

      {/* 4 Core Competencies */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-stone-900 font-serif">
          🎯 AI 조향연구원의 4대 핵심 역량
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              👃
            </div>
            <h3 className="font-bold text-sm text-stone-900">
              후각 기억력 (Olfactive Memory)
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              수백 가지 천연 및 합성 향료의 고유한 냄새와 휘발 특성을 머릿속에 도서관처럼 분류하고 기억하는 감각 훈련.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
              <Atom className="w-5 h-5 text-teal-700" />
            </div>
            <h3 className="font-bold text-sm text-stone-900">
              향료 화학 & 분자 이해 (Chemistry)
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              탑, 미들, 베이스의 분자량과 비점(끓는점), 산화 반응과 지속력을 이해하여 이상적인 하모니를 계산하는 과학적 기초.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5 text-purple-700" />
            </div>
            <h3 className="font-bold text-sm text-stone-900">
              감성 번역 & 스토리텔링 (Translation)
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              슬라이드 핵심처럼 '시각적 이미지와 추억'을 말로 표현하고, 이를 다시 향료의 어코드(Accord)로 번역하는 예술적 감수성.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center font-bold">
              <Cpu className="w-5 h-5 text-cyan-700" />
            </div>
            <h3 className="font-bold text-sm text-stone-900">
              AI 프롬프트 & 데이터 사이언스
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              전 세계 향기 트렌드 빅데이터와 AI 알고리즘을 활용하여 새로운 향료 조합을 생성하고 시뮬레이션하는 디지털 협업 역량.
            </p>
          </div>
        </div>
      </div>

      {/* Educational Deep Dive: Slide Philosophy */}
      <div className="bg-gradient-to-br from-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-lg space-y-6">
        <div className="flex items-center gap-2 text-teal-300 text-xs font-bold uppercase tracking-wider">
          <Lightbulb className="w-4 h-4" />
          <span>수업 토론 주제 : AI와 인간 조향사의 공존</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-bold font-serif leading-snug">
          "왜 인공지능(AI)만으로는 완벽한 향수를 만들 수 없을까요?"
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-stone-300 leading-relaxed">
          <div className="p-5 rounded-2xl bg-white/10 border border-white/10 space-y-2">
            <h4 className="font-bold text-teal-200 text-sm">
              🤖 AI가 잘하는 일 (Data & Prediction)
            </h4>
            <p>
              AI는 수십만 개의 향수 화학 성분 데이터와 소비자 리뷰, 언어 패턴을 학습하여 특정 감성 단어('시원한', '맑은')에 가장 어울리는 분자 조합과 대략적인 비율을 1초 만에 제안할 수 있습니다.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/10 border border-white/10 space-y-2">
            <h4 className="font-bold text-amber-200 text-sm">
              👩‍🔬 인간 조향사만이 할 수 있는 일 (Smelling & Soul)
            </h4>
            <p>
              하지만 <strong>AI는 생체 후각 수용체(Olfactory Receptors)가 없으므로 실제 냄새를 맡지 못합니다.</strong> 
              온도, 습도, 사람의 체온에 따라 미세하게 변화하는 실제 향의 조화와 감동은 오직 인간 조향사의 섬세한 '시향'과 감성적 검증을 거쳐야만 완성됩니다.
            </p>
          </div>
        </div>
      </div>

      {/* Classroom Activity Worksheet (수업 활동지) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-stone-900 font-serif flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-emerald-600" />
              <span>진로체험 수업 활동지 & 성찰 질문 (Classroom Worksheet)</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              학생들이 웹앱 실습을 마친 후 교실에서 발표하거나 작성할 수 있는 핵심 질문입니다.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {[
            {
              q: '1. 내가 선택한 이미지(장면)에서 왜 그 감성 단어를 떠올렸나요?',
              guide: '시각적 색채나 공간의 온도감이 어떤 후각적 기억이나 감정을 자극했는지 설명해보세요.'
            },
            {
              q: '2. AI가 추천해 준 레시피와 내가 실제로 수정한 방울 수는 어떻게 다른가요?',
              guide: 'AI의 초기 제안에 비해 내가 더 강조하고 싶었던 노트(탑의 청량함 or 베이스의 잔향 등)를 적어보세요.'
            },
            {
              q: '3. 가상 시향 시뮬레이션에서 0분, 30분, 2시간의 향기 변화가 왜 일어나는지 과학적으로 설명해보세요.',
              guide: '향료 분자의 크기와 끓는점(휘발도) 차이에 따라 탑-미들-베이스로 나뉘는 원리를 정리해보세요.'
            },
            {
              q: '4. 만약 내가 미래에 AI 조향연구원이 된다면, 어떤 소중한 기억이나 사람을 위해 향수를 만들고 싶나요?',
              guide: '나만의 스토리텔링과 향수 콘셉트를 상상하여 자유롭게 적어보세요.'
            }
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1">
              <div className="text-xs font-bold text-stone-900">{item.q}</div>
              <p className="text-[11px] text-stone-500">{item.guide}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
