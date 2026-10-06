import { ScenePreset } from '../types/scent';

export const SCENE_PRESETS: ScenePreset[] = [
  {
    id: 'ocean_beach',
    title: '눈부신 에메랄드빛 여름 바닷가',
    subtitle: '백사장에 부서지는 청록색 파도와 시원한 바닷바람',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
    promptExample: '눈부신 바닷가의 느낌을 청량하고 차분한 향 콘셉트와 이름으로 표현해 줘.',
    defaultKeywords: ['시원한', '맑은', '차분한'],
    availableKeywords: ['시원한', '맑은', '차분한', '청량한', '광활한', '부서지는', '자유로운', '투명한'],
    recommendedIngredients: ['marine_aqua', 'bergamot', 'lavender', 'white_musk']
  },
  {
    id: 'rainy_forest',
    title: '비 온 뒤 촉촉한 편백나무 숲길',
    subtitle: '피톤치드 가득한 안개와 이슬 맺힌 흙내음',
    imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1000&q=80',
    promptExample: '비 온 뒤 싱그러운 숲길의 정화되는 공기와 흙내음을 향 콘셉트로 표현해 줘.',
    defaultKeywords: ['싱그러운', '정화되는', '차분한'],
    availableKeywords: ['싱그러운', '정화되는', '차분한', '청명한', '촉촉한', '평온한', '깊은', '신비로운'],
    recommendedIngredients: ['eucalyptus_mint', 'muguet', 'cedarwood', 'patchouli']
  },
  {
    id: 'afternoon_cafe',
    title: '햇살 드리운 아늑한 오후의 북카페',
    subtitle: '따스한 홍차 김과 오래된 책장, 캐러멜 시럽의 향기',
    imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1000&q=80',
    promptExample: '오후 햇살이 비치는 아늑한 북카페의 온기와 커피향을 조향 콘셉트로 표현해 줘.',
    defaultKeywords: ['따뜻한', '포근한', '달콤한'],
    availableKeywords: ['따뜻한', '포근한', '달콤한', '지적인', '아늑한', '다정한', '여유로운', '부드러운'],
    recommendedIngredients: ['black_tea_fig', 'vanilla', 'sandalwood', 'amber']
  },
  {
    id: 'rose_garden',
    title: '새벽 이슬 맺힌 비밀의 장미 정원',
    subtitle: '분홍빛 꽃잎과 서늘한 새벽 공기가 빚어내는 로맨스',
    imageUrl: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=1000&q=80',
    promptExample: '새벽 이슬 머금은 비밀의 장미 정원을 우아하고 몽환적인 향기로 표현해 줘.',
    defaultKeywords: ['우아한', '매혹적인', '싱그러운'],
    availableKeywords: ['우아한', '매혹적인', '싱그러운', '몽환적인', '로맨틱한', '순수한', '화사한', '달콤한'],
    recommendedIngredients: ['damask_rose', 'neroli', 'bergamot', 'white_musk']
  },
  {
    id: 'sunset_campfire',
    title: '노을 지는 호숫가의 모닥불 캠핑',
    subtitle: '자작나무 타는 장작 소리와 황금빛 온기',
    imageUrl: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=1000&q=80',
    promptExample: '노을 지는 저녁 모닥불의 따뜻한 스모키함과 포근함을 향 콘셉트로 표현해 줘.',
    defaultKeywords: ['따뜻한', '낭만적인', '깊은'],
    availableKeywords: ['따뜻한', '낭만적인', '깊은', '타오르는', '포근한', '안식처같은', '은은한', '자유로운'],
    recommendedIngredients: ['amber', 'cedarwood', 'sandalwood', 'grapefruit']
  },
  {
    id: 'citrus_orchard',
    title: '이탈리아 지중해 감귤 언덕',
    subtitle: '눈부신 태양 아래 갓 터지는 오렌지와 레몬 과즙',
    imageUrl: 'https://images.unsplash.com/photo-1521488665882-743138563527?auto=format&fit=crop&w=1000&q=80',
    promptExample: '지중해 햇살 아래 터지는 레몬과 오렌지 꽃의 생생한 과즙 향을 표현해 줘.',
    defaultKeywords: ['상쾌한', '생기발랄', '밝은'],
    availableKeywords: ['상쾌한', '생기발랄', '밝은', '달콤쌉싸름', '짜릿한', '비타민같은', '상큼한', '눈부신'],
    recommendedIngredients: ['lemon_lime', 'grapefruit', 'neroli', 'cedarwood']
  }
];

export const ALL_EMOTION_KEYWORDS = [
  '시원한', '맑은', '차분한', '싱그러운', '따뜻한', 
  '달콤한', '청량한', '광활한', '정화되는', '포근한', 
  '우아한', '매혹적인', '지적인', '낭만적인', '생기발랄', 
  '몽환적인', '신비로운', '순수한', '다정한', '깊은'
];
