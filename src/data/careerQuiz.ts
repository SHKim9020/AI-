import { OlfactivePreferenceResult, ScentFamily } from '../types/scent';

export interface QuizQuestion {
  id: number;
  question: string;
  category: string;
  options: {
    text: string;
    subtext: string;
    targetFamily: ScentFamily;
    aptitudeTrait: 'creativity' | 'scientificAnalysis' | 'sensoryPerception' | 'emotionalEmpathy';
  }[];
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: '내가 가장 편안함과 긍정적인 에너지를 얻는 공간은 어디인가요?',
    category: '선호 공간',
    options: [
      {
        text: '파도 소리가 들리는 탁 트인 에메랄드빛 해변가',
        subtext: '바람을 맞으며 자유와 해방감을 느끼는 곳',
        targetFamily: 'aquatic',
        aptitudeTrait: 'scientificAnalysis'
      },
      {
        text: '비 온 뒤 피톤치드가 뿜어져 나오는 울창한 침엽수림',
        subtext: '숨을 깊게 들이쉬며 마음을 고요하게 정화하는 곳',
        targetFamily: 'woody',
        aptitudeTrait: 'sensoryPerception'
      },
      {
        text: '햇살이 쏟아지는 아기자기한 꽃집이나 봄날의 정원',
        subtext: '화사하고 싱그러운 생명력에 둘러싸인 곳',
        targetFamily: 'floral',
        aptitudeTrait: 'emotionalEmpathy'
      },
      {
        text: '따스한 조명과 버터 냄새, 홍차 김이 피어오르는 아늑한 북카페',
        subtext: '포근한 담요처럼 편안한 온기를 느끼는 곳',
        targetFamily: 'gourmand',
        aptitudeTrait: 'creativity'
      }
    ]
  },
  {
    id: 2,
    question: '피곤하거나 지쳤을 때, 나를 가장 기분 좋게 리프레시해 주는 순간은?',
    category: '기분 전환',
    options: [
      {
        text: '얼음이 가득 찬 탄산수나 상큼한 레모네이드를 마실 때',
        subtext: '짜릿하고 깨끗한 청량감이 번질 때',
        targetFamily: 'citrus',
        aptitudeTrait: 'scientificAnalysis'
      },
      {
        text: '은은한 인센스나 아로마 허브 오일을 떨어뜨리고 명상할 때',
        subtext: '복잡한 생각을 비우고 차분해질 때',
        targetFamily: 'woody',
        aptitudeTrait: 'sensoryPerception'
      },
      {
        text: '감미로운 음악과 함께 감성적인 영화나 전시를 볼 때',
        subtext: '풍부한 감정이 마음에 차오를 때',
        targetFamily: 'floral',
        aptitudeTrait: 'emotionalEmpathy'
      },
      {
        text: '달콤한 바닐라 디저트를 먹으며 포근한 이불 속에 파묻힐 때',
        subtext: '안전하고 포근한 위로를 받을 때',
        targetFamily: 'musk',
        aptitudeTrait: 'creativity'
      }
    ]
  },
  {
    id: 3,
    question: '사계절 중 내가 오감(냄새, 촉감, 공기)으로 가장 사랑하는 계절의 순간은?',
    category: '자연 감각',
    options: [
      {
        text: '초여름 이른 아침, 서늘하면서도 쨍하게 맑은 새벽 공기',
        subtext: '무언가 새로운 모험이 시작될 것 같은 설렘',
        targetFamily: 'aquatic',
        aptitudeTrait: 'scientificAnalysis'
      },
      {
        text: '늦가을 바스락거리는 낙엽길과 차가운 흙의 깊은 내음',
        subtext: '시간의 성숙함과 쓸쓸하면서도 웅장한 깊이',
        targetFamily: 'woody',
        aptitudeTrait: 'sensoryPerception'
      },
      {
        text: '따스한 봄바람에 실려오는 은은한 꽃봉오리의 숨결',
        subtext: '가슴을 설레게 하는 사랑스러운 계절의 시작',
        targetFamily: 'floral',
        aptitudeTrait: 'emotionalEmpathy'
      },
      {
        text: '한겨울 눈 내리는 날, 벽난로 곁에서 풍기는 따스한 온기',
        subtext: '바깥의 추위와 대비되는 극상의 안락함',
        targetFamily: 'oriental',
        aptitudeTrait: 'creativity'
      }
    ]
  },
  {
    id: 4,
    question: '내가 좋아하는 패션 스타일이나 컬러 톤은?',
    category: '시각적 무드',
    options: [
      {
        text: '청량한 화이트 셔츠와 스포티한 블루, 미니멀한 실루엣',
        subtext: '깔끔하고 쿨하며 세련된 인상',
        targetFamily: 'citrus',
        aptitudeTrait: 'scientificAnalysis'
      },
      {
        text: '베이지, 브라운, 카키 계열의 내추럴 어스(Earth) 톤과 린넨 룩',
        subtext: '자연스럽고 편안하며 깊이 있는 분위기',
        targetFamily: 'woody',
        aptitudeTrait: 'sensoryPerception'
      },
      {
        text: '파스텔 핑크, 크림, 라벤더 컬러의 부드럽고 우아한 스타일',
        subtext: '다정하고 화사하며 로맨틱한 실루엣',
        targetFamily: 'floral',
        aptitudeTrait: 'emotionalEmpathy'
      },
      {
        text: '포근한 캐시미어 니트, 아이보리 머플러, 따스한 캐러멜 톤',
        subtext: '안기고 싶은 포근함과 고급스러운 부드러움',
        targetFamily: 'musk',
        aptitudeTrait: 'creativity'
      }
    ]
  },
  {
    id: 5,
    question: '만약 내가 AI 조향연구원이 되어 첫 프로젝트를 맡는다면?',
    category: '조향 미션',
    options: [
      {
        text: '우주 탐사선이나 미래 도시의 청량함을 담은 미래지향적 향기',
        subtext: 'AI 분자 알고리즘으로 설계하는 혁신적 조향',
        targetFamily: 'aquatic',
        aptitudeTrait: 'scientificAnalysis'
      },
      {
        text: '도심 속 지친 현대인들의 수면과 스트레스를 치료하는 삼림욕 향기',
        subtext: '뇌파와 생체 리듬을 안정시키는 기능성 조향',
        targetFamily: 'woody',
        aptitudeTrait: 'sensoryPerception'
      },
      {
        text: '첫사랑의 기억이나 소중한 영화 속 장면을 완벽히 번역한 예술적 향기',
        subtext: '스토리텔링과 문학적 감수성을 담아내는 조향',
        targetFamily: 'floral',
        aptitudeTrait: 'emotionalEmpathy'
      },
      {
        text: '기억 속 할머니의 베이커리나 어릴 적 추억을 소환하는 따스한 향기',
        subtext: '프루스트 효과를 극대화한 기억 소환 조향',
        targetFamily: 'gourmand',
        aptitudeTrait: 'creativity'
      }
    ]
  },
  {
    id: 6,
    question: '새로운 과제를 연구하거나 실험할 때 나의 가장 큰 강점은?',
    category: '연구 적성',
    options: [
      {
        text: '데이터와 수치를 논리적으로 비교하고 최적의 공식을 찾아내는 분석력',
        subtext: '비율과 원리의 조화를 중시함',
        targetFamily: 'citrus',
        aptitudeTrait: 'scientificAnalysis'
      },
      {
        text: '미세한 차이를 끝까지 캐치해내는 예리한 관찰력과 끈기',
        subtext: '남들이 지나치는 디테일을 발견함',
        targetFamily: 'woody',
        aptitudeTrait: 'sensoryPerception'
      },
      {
        text: '사람들의 감정과 마음에 깊이 공감하고 숨은 니즈를 읽는 공감력',
        subtext: '사람들에게 감동을 주는 포인트를 잘 앎',
        targetFamily: 'floral',
        aptitudeTrait: 'emotionalEmpathy'
      },
      {
        text: '서로 다른 아이디어를 기발하게 엮어 독창적인 이야기를 만드는 창의력',
        subtext: '새로운 콘셉트와 영감을 끊임없이 냄',
        targetFamily: 'oriental',
        aptitudeTrait: 'creativity'
      }
    ]
  }
];

export const ARCHETYPES: Record<string, OlfactivePreferenceResult> = {
  aquatic_citrus: {
    code: 'AC-PIONEER',
    title: '청량한 마린·시트러스 개척자',
    subtitle: '푸른 바다의 오존과 싱그러운 햇살을 데이터로 디자인하는 혁신가',
    description: '맑고 투명하며 지적인 호기심이 넘치는 당신! 답답한 것을 싫어하고 새로운 아이디어와 청량한 도전을 즐깁니다. AI 조향 기술을 통해 향료 분자의 휘발도와 상쾌한 오존 노트를 가장 스마트하게 설계할 수 있는 인재입니다.',
    recommendedFamilies: ['aquatic', 'citrus'],
    careerAptitudeScore: {
      creativity: 85,
      scientificAnalysis: 95,
      sensoryPerception: 88,
      emotionalEmpathy: 78
    },
    recommendedIngredients: ['marine_aqua', 'lemon_lime', 'bergamot', 'eucalyptus_mint'],
    careerPathAdvice: '향료 화학 연구원, AI 데이터 기반 조향 개발자, 기능성 쿨링 프래그런스 디렉터 등에 매우 적합합니다.'
  },
  woody_forest: {
    code: 'WF-PHILOSOPHER',
    title: '깊은 숲길의 우디·테라피 사색가',
    subtitle: '고요한 침엽수림과 세월을 품은 나무의 평화를 빚어내는 공간 연출가',
    description: '차분하고 묵직한 내면의 깊이를 지닌 당신! 일시적인 유행보다는 오랜 시간 변치 않는 클래식함과 자연의 진정성을 사랑합니다. 미세한 나무껍질 향과 흙내음의 밸런스를 잡아내어 지친 사람들을 치유하는 감각이 탁월합니다.',
    recommendedFamilies: ['woody', 'herbal'],
    careerAptitudeScore: {
      creativity: 82,
      scientificAnalysis: 89,
      sensoryPerception: 96,
      emotionalEmpathy: 87
    },
    recommendedIngredients: ['cedarwood', 'sandalwood', 'lavender', 'patchouli'],
    careerPathAdvice: '니치 퍼퓸 조향사, 공간 아로마 테라피스트, 환경 웰니스 조향 연구원에 최적화되어 있습니다.'
  },
  floral_romantic: {
    code: 'FR-STORYTELLER',
    title: '우아한 플로럴 로맨틱 스토리텔러',
    subtitle: '꽃잎 한 장에 담긴 기억과 인간의 감정을 언어로 번역하는 감성 아티스트',
    description: '섬세한 감수성과 높은 공감 능력을 지닌 당신! 이미지와 글귀 하나에서도 향기를 연상해낼 만큼 예술적 영감이 풍부합니다. AI가 제안한 키워드를 가장 아름다운 후각적 하모니로 발전시킬 수 있는 천부적인 감각을 지녔습니다.',
    recommendedFamilies: ['floral', 'gourmand'],
    careerAptitudeScore: {
      creativity: 94,
      scientificAnalysis: 76,
      sensoryPerception: 91,
      emotionalEmpathy: 98
    },
    recommendedIngredients: ['damask_rose', 'neroli', 'jasmine', 'muguet'],
    careerPathAdvice: '럭셔리 니치 향수 크리에이티브 디렉터, 브랜드 스토리텔러 & 프래그런스 마케터, 비스포크 맞춤 조향사로 성장할 잠재력이 큽니다.'
  },
  gourmand_amber: {
    code: 'GA-HEALER',
    title: '따스한 구르망·앰버 감성 힐러',
    subtitle: '부드러운 온기와 달콤한 위로의 감각을 전하는 포근한 향기 큐레이터',
    description: '따뜻하고 다정한 성품으로 주변 사람들을 안락하게 해주는 당신! 바닐라, 홍차, 부드러운 머스크처럼 온기를 품은 향조에 뛰어난 직관을 발휘합니다. 사람들의 향기 취향을 세심하게 읽어내어 맞춤형 레시피를 제안하는 능력이 뛰어납니다.',
    recommendedFamilies: ['gourmand', 'musk', 'oriental'],
    careerAptitudeScore: {
      creativity: 91,
      scientificAnalysis: 80,
      sensoryPerception: 87,
      emotionalEmpathy: 94
    },
    recommendedIngredients: ['white_musk', 'vanilla', 'black_tea_fig', 'amber'],
    careerPathAdvice: '퍼스널 향기 컨설턴트, 감성 코스메틱 R&D 연구원, 향기 테라피 교육 강사에 매우 잘 어울립니다.'
  }
};
