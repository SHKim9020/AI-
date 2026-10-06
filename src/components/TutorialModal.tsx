import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Compass, 
  FlaskConical, 
  BookmarkCheck, 
  GraduationCap, 
  CheckCircle2, 
  Droplet,
  Layers,
  Lightbulb
} from 'lucide-react';
import { ActiveTab } from './Header';
import { soundFx } from '../utils/audio';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab: (tab: ActiveTab) => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({
  isOpen,
  onClose,
  onNavigateToTab
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      stepNumber: '01',
      title: 'AI 조향연구원 웹앱에 오신 것을 환영합니다!',
      subtitle: '감성과 이미지를 향기로 번역하는 미래 융합 진로체험',
      icon: Sparkles,
      iconBg: 'from-amber-500 to-rose-600',
      description: `
'AI 조향연구원'은 전통적인 향수 조향 예술(Art of Perfumery)에 인공지능 빅데이터와 분자 화학 분석을 융합한 미래 신직업입니다.
본 플랫폼에서는 교실 수업과 자기주도 체험을 통해 감성 어휘를 향기로 표현하고, 가상 랩에서 자유롭게 배합해 시향해볼 수 있습니다.
      `,
      actionGuide: '아래 [다음 단계]를 눌러 핵심 기능 3가지를 차례대로 살펴보세요.',
      targetTab: 'workshop' as ActiveTab,
      highlightBadge: '소개 및 시작'
    },
    {
      stepNumber: '02',
      title: 'STEP 1 : 나의 향기 취향 진단하기',
      subtitle: '올팩티브 성향 & 진로 적성 탐색',
      icon: Compass,
      iconBg: 'from-cyan-500 to-blue-600',
      description: `
6가지 직관적인 문항(선호 공간, 힐링 방식, 자연의 촉감 등)을 통해 나의 고유한 올팩티브 타입(마린·시트러스 개척자, 우디 사색가, 플로럴 아티스트, 구르망 힐러)을 발견합니다.
진단이 완료되면 당신의 취향에 최적화된 맞춤형 추천 레시피가 자동으로 설계됩니다!
      `,
      actionGuide: '진단 후 [맞춤 레시피 가상 연구실로 전송] 버튼을 누르면 즉시 배합을 시작할 수 있습니다.',
      targetTab: 'quiz' as ActiveTab,
      highlightBadge: '핵심 기능 1'
    },
    {
      stepNumber: '03',
      title: 'STEP 2 : 슬라이드 조향 워크숍 (이미지를 말로 번역하기)',
      subtitle: '장면 선택 → 감성 단어 → AI 확장 → 시향 후 수정',
      icon: GraduationCap,
      iconBg: 'from-emerald-500 to-teal-700',
      description: `
KCCA 공식 P.O.Ai 커리큘럼을 웹앱으로 구현했습니다!
1) 바닷가나 숲길 같은 장면을 고르고,
2) '시원한', '맑은', '차분한' 등 감성 단어 카드를 매칭한 뒤,
3) AI에게 요청하면 향수 이름과 스토리텔링, 배합비를 제안합니다.
4) AI는 냄새를 직접 맡지 못하므로, 여러분이 직접 시향하고 비율을 검증합니다!
      `,
      actionGuide: '수업 워크시트처럼 감성 어휘와 조향 질문을 자유롭게 입력해보세요.',
      targetTab: 'workshop' as ActiveTab,
      highlightBadge: '슬라이드 실습'
    },
    {
      stepNumber: '04',
      title: 'STEP 3 : 가상 조향 연구실 & 시향 시뮬레이션',
      subtitle: '스포이트 드롭, 황금비율 피라미드 & 시간대별 발향',
      icon: FlaskConical,
      iconBg: 'from-teal-500 to-emerald-700',
      description: `
탑(Top 0~30분), 미들(Middle 30분~2시간), 베이스(Base 2시간+)의 다양한 향료를 스포이트로 한 방울씩 떨어뜨려 섞어보세요.
비커 액체 색상이 실시간으로 블렌딩되며, 가상 시향 시뮬레이션을 통해 0분 첫인상, 30분 하트노트, 2시간 잔향의 변화를 생생한 텍스트로 경험할 수 있습니다.
      `,
      actionGuide: '피라미드 황금비율 게이지와 AI 마스터 퍼퓨머의 실시간 조언을 확인하세요.',
      targetTab: 'lab' as ActiveTab,
      highlightBadge: '핵심 기능 2'
    },
    {
      stepNumber: '05',
      title: 'STEP 4 : 레시피북 저장 & 조향 포트폴리오 카드',
      subtitle: '나만의 향수 라벨 발급 & 인쇄하여 소장하기',
      icon: BookmarkCheck,
      iconBg: 'from-rose-500 to-amber-600',
      description: `
완성된 나만의 향수 레시피는 '레시피북'에 안전하게 영구 저장됩니다.
고급스러운 니치 향수 라벨 카드와 진로체험 인증서를 생성하여 인쇄(Print)하거나 이미지로 저장할 수 있습니다.
학교 수업 활동지 결과물 제출 및 친구들과 레시피를 공유할 때 활용해보세요.
      `,
      actionGuide: '언제든 [레시피북] 탭에서 저장된 향수를 다시 불러와 수정할 수 있습니다.',
      targetTab: 'portfolio' as ActiveTab,
      highlightBadge: '핵심 기능 3'
    }
  ];

  const current = steps[currentStep];
  const StepIcon = current.icon;

  const handleNext = () => {
    soundFx.playDrop();
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    soundFx.playDrop();
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleJumpToTab = (tab: ActiveTab) => {
    soundFx.playDrop();
    onNavigateToTab(tab);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-stone-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-stone-50/60">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900">
              {current.highlightBadge}
            </span>
            <span className="text-xs font-semibold text-stone-500">
              {currentStep + 1} / {steps.length} 단계
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
          {/* Step Icon & Title */}
          <div className="flex items-start gap-4">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${current.iconBg} text-white flex items-center justify-center shadow-md shrink-0`}>
              <StepIcon className="w-7 h-7" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-stone-400 tracking-wider">
                STEP {current.stepNumber}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-serif text-stone-900 mt-0.5">
                {current.title}
              </h3>
              <p className="text-xs sm:text-sm font-medium text-amber-700 mt-1">
                {current.subtitle}
              </p>
            </div>
          </div>

          {/* Description text */}
          <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200/70 text-xs sm:text-sm text-stone-700 leading-relaxed whitespace-pre-line">
            {current.description.trim()}
          </div>

          {/* Action Callout */}
          <div className="flex items-start gap-3 bg-amber-50/70 border border-amber-200 rounded-2xl p-4">
            <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-amber-900">
                💡 수행 가이드
              </div>
              <p className="text-xs text-amber-800 mt-0.5">
                {current.actionGuide}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="p-5 sm:p-6 border-t border-stone-100 bg-stone-50/60 flex items-center justify-between gap-3">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-600 text-xs font-semibold hover:bg-stone-100 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>이전</span>
          </button>

          <div className="flex items-center gap-1.5">
            {steps.map((_, idx) => (
              <span
                key={idx}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  idx === currentStep ? 'bg-amber-600 w-6' : 'bg-stone-200'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                onClick={() => handleJumpToTab(current.targetTab)}
                className="hidden sm:flex px-3.5 py-2.5 rounded-xl text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200 hover:bg-teal-100 transition-colors"
              >
                이 기능 바로가기
              </button>
            )}

            <button
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
            >
              <span>{currentStep === steps.length - 1 ? '체험 시작하기' : '다음 단계'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
