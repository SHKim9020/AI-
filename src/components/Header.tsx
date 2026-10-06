import React from 'react';
import { 
  Sparkles, 
  FlaskConical, 
  Compass, 
  BookmarkCheck, 
  GraduationCap, 
  Volume2, 
  VolumeX, 
  BookOpen
} from 'lucide-react';
import { soundFx } from '../utils/audio';

export type ActiveTab = 'workshop' | 'lab' | 'quiz' | 'portfolio' | 'career';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  savedCount: number;
  soundEnabled: boolean;
  setSoundEnabled: (v: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  savedCount,
  soundEnabled,
  setSoundEnabled,
}) => {
  const toggleSound = () => {
    soundFx.enabled = !soundEnabled;
    setSoundEnabled(!soundEnabled);
    if (!soundEnabled) {
      soundFx.playDrop();
    }
  };

  const navItems = [
    {
      id: 'workshop' as ActiveTab,
      label: 'AI 조향 워크숍',
      icon: Sparkles,
      badge: '실습'
    },
    {
      id: 'lab' as ActiveTab,
      label: '가상 조향 연구실',
      icon: FlaskConical
    },
    {
      id: 'quiz' as ActiveTab,
      label: '향기 취향 진단',
      icon: Compass
    },
    {
      id: 'portfolio' as ActiveTab,
      label: '레시피북 & 포트폴리오',
      icon: BookmarkCheck,
      count: savedCount
    },
    {
      id: 'career' as ActiveTab,
      label: '진로 탐구 가이드',
      icon: GraduationCap
    }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/90 shadow-2xs">
      {/* Top Banner for Classroom Context */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-cyan-900 text-amber-100 text-xs py-1.5 px-4 font-sans flex items-center justify-between">
        <div className="flex items-center gap-2 mx-auto sm:mx-0 overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-200 border border-amber-300/30 shrink-0">
            진로체험 수업용
          </span>
          <span className="truncate">
            🎓 <strong>P.O.Ai 조향 교육 모델</strong>: 감성과 이미지를 향기로 번역하고 시뮬레이션하는 미래 융합 진로 플랫폼
          </span>
        </div>
        <div className="hidden lg:flex items-center gap-3 text-emerald-200 text-xs shrink-0 whitespace-nowrap">
          <span>KCCA 공식 커리큘럼 연계</span>
          <span className="text-emerald-400/60">|</span>
          <span>후각 감각 + AI 데이터 과학</span>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo Brand */}
          <div 
            onClick={() => setActiveTab('workshop')} 
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-600 via-rose-500 to-teal-700 flex items-center justify-center text-white shadow-md shadow-amber-900/10 group-hover:scale-105 transition-transform duration-300">
              <FlaskConical className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-stone-900 group-hover:text-amber-700 transition-colors whitespace-nowrap">
                  AromaAI Lab
                </span>
                <span className="text-[11px] font-bold tracking-wider text-rose-700 bg-rose-50 border border-rose-200/60 px-2 py-0.5 rounded-md uppercase whitespace-nowrap">
                  AI 조향연구원
                </span>
              </div>
              <p className="text-xs text-stone-500 hidden sm:block whitespace-nowrap">
                이미지를 말로 번역하는 가상 조향 연구소 & 진로체험
              </p>
            </div>
          </div>

          {/* Navigation Tabs - Perfectly Aligned, No Wrapping, No Indentation */}
          <nav className="hidden md:flex items-center gap-1 bg-stone-100/90 p-1.5 rounded-2xl border border-stone-200/80 shrink-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    soundFx.playDrop();
                    setActiveTab(item.id);
                  }}
                  className={`whitespace-nowrap shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-white text-stone-900 shadow-xs font-bold'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 font-medium'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-600' : 'text-stone-400'}`} />
                  <span className="whitespace-nowrap tracking-tight">{item.label}</span>
                  {item.badge && (
                    <span className="whitespace-nowrap text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded-md font-bold shrink-0">
                      {item.badge}
                    </span>
                  )}
                  {typeof item.count === 'number' && item.count > 0 && (
                    <span className="whitespace-nowrap px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-bold shrink-0 leading-none">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Controls */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={toggleSound}
              title={soundEnabled ? '효과음 끄기' : '효과음 켜기'}
              className="p-2.5 rounded-xl text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors border border-stone-200/80 cursor-pointer"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <VolumeX className="w-4 h-4 text-stone-400" />
              )}
            </button>
            <button
              onClick={() => {
                soundFx.playDrop();
                setActiveTab('portfolio');
              }}
              className="hidden xl:flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 transition-colors whitespace-nowrap cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-amber-700 shrink-0" />
              <span>내 보관함 ({savedCount})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden overflow-x-auto border-t border-stone-200 bg-stone-50/90 px-3 py-2 flex items-center gap-1.5 no-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                soundFx.playDrop();
                setActiveTab(item.id);
              }}
              className={`shrink-0 whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold ${
                isActive
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white text-stone-700 border border-stone-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{item.label}</span>
              {typeof item.count === 'number' && item.count > 0 && (
                <span className="text-[10px] bg-rose-500 text-white rounded-full px-1.5 py-0.2">
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
};
