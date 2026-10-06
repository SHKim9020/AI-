import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '10mb' }));

  // Initialize Gemini API instance if key is present
  const apiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;
  if (apiKey) {
    try {
      ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
      console.log('Gemini API client initialized successfully.');
    } catch (err) {
      console.warn('Failed to initialize Gemini client:', err);
    }
  } else {
    console.log('GEMINI_API_KEY not found; smart heuristic fragrance engine will be active as fallback.');
  }

  // Helper fallback for Scent Concept
  function generateFallbackConcept(sceneTitle: string, keywords: string[], customPrompt?: string) {
    const kwText = keywords.join(', ') || '싱그러운, 맑은, 차분한';
    let pName = '블루 오션 브리즈';
    let pNameEn = 'Azure Sea Whisper';
    let family = '아쿠아틱 마린 (Aquatic Fresh)';
    let summary = `바다의 시원함과 맑은 공기를 담아낸 청량한 조향 콘셉트입니다.`;
    let storytelling = `새하얀 백사장에 청록색 파도가 부서질 때 일어나는 상쾌한 물보라와, 햇살에 은은하게 마르는 미네랄 소금기를 포착했습니다. 첫 향은 눈이 번쩍 뜨이는 베르가못과 레몬의 활력으로 시작하여, 가슴 가득 시원한 파도와 차분한 라벤더의 안식을 거쳐 깨끗한 화이트 머스크의 살결 내음으로 편안하게 마무리됩니다.`;
    
    let recommendedFormula = [
      { ingredientId: 'marine_aqua', ingredientName: '마린 오션 & 씨솔트', type: 'top' as const, drops: 7, reason: '시원하고 청량한 바닷바람의 첫인상' },
      { ingredientId: 'bergamot', ingredientName: '베르가못', type: 'top' as const, drops: 5, reason: '지중해 햇살의 은은한 감귤빛 산뜻함' },
      { ingredientId: 'lavender', ingredientName: '프렌치 라벤더', type: 'middle' as const, drops: 5, reason: '차분하고 평온하게 가라앉혀주는 허브 안식' },
      { ingredientId: 'neroli', ingredientName: '네롤리 오렌지 블라썸', type: 'middle' as const, drops: 3, reason: '순수하고 맑은 꽃잎의 부드러움' },
      { ingredientId: 'white_musk', ingredientName: '화이트 머스크', type: 'base' as const, drops: 4, reason: '오래도록 남는 깨끗한 순면 린넨의 잔향' },
      { ingredientId: 'cedarwood', ingredientName: '시더우드 (삼나무)', type: 'base' as const, drops: 3, reason: '해변가 언덕의 마른 나무 같은 깊이감' },
    ];

    if (sceneTitle.includes('숲') || kwText.includes('정화') || kwText.includes('촉촉')) {
      pName = '포레스트 미스트 & 실반 딥';
      pNameEn = 'Sylvan Dew & Mist';
      family = '우디 허벌 (Woody Herbal)';
      summary = '비 온 뒤 숲속의 촉촉한 피톤치드와 흙내음을 번역한 힐링 테라피 향기입니다.';
      storytelling = '울창한 편백나무 숲에 비가 갠 직후, 이슬 맺힌 잎사귀 사이로 비치는 햇살과 젖은 흙의 원초적 생명력을 그렸습니다. 청명한 민트와 유칼립투스가 머리를 맑게 깨우고, 은방울꽃의 순수한 물방울이 지나가면 묵직한 시더우드와 패츌리가 마음에 든든한 평화를 선물합니다.';
      recommendedFormula = [
        { ingredientId: 'eucalyptus_mint', ingredientName: '유칼립투스 & 페퍼민트', type: 'top' as const, drops: 6, reason: '서늘하고 청명한 숲속 공기의 정화감' },
        { ingredientId: 'green_apple', ingredientName: '그린 애플 & 이슬 풀잎', type: 'top' as const, drops: 4, reason: '싱그러운 풋풋함과 이슬의 투명감' },
        { ingredientId: 'muguet', ingredientName: '뮤게 (은방울꽃)', type: 'middle' as const, drops: 5, reason: '촉촉한 숲속 바위틈에 피어난 하얀 꽃잎' },
        { ingredientId: 'lavender', ingredientName: '프렌치 라벤더', type: 'middle' as const, drops: 4, reason: '몸과 마음을 이완시키는 아로마틱 허브' },
        { ingredientId: 'cedarwood', ingredientName: '시더우드 (삼나무)', type: 'base' as const, drops: 5, reason: '피톤치드 가득한 깊은 숲 나무의 기둥' },
        { ingredientId: 'patchouli', ingredientName: '패츌리 (다크 어스)', type: 'base' as const, drops: 2, reason: '비에 젖은 대지의 신비로운 흙내음' },
      ];
    } else if (sceneTitle.includes('카페') || kwText.includes('따뜻한') || kwText.includes('달콤')) {
      pName = '애프터눈 블렌드 & 웜 캐시미어';
      pNameEn = 'Afternoon Tea & Amber Cashmere';
      family = '구르망 우디 (Gourmand Woody)';
      summary = '따스한 홍차 김과 달콤한 바닐라, 포근한 머스크가 깃든 아늑한 향기입니다.';
      storytelling = '창가로 오후 햇살이 쏟아지는 서재에서 갓 우려낸 홍차의 쌉싸래한 김과 달콤한 쿠키가 어우러지는 평화로운 순간입니다. 첫 모금의 상큼한 과즙에서 출발해 지적이고 우아한 블랙티와 무화과의 온기, 그리고 바닐라와 백단향의 달콤한 안식으로 이어집니다.';
      recommendedFormula = [
        { ingredientId: 'bergamot', ingredientName: '베르가못', type: 'top' as const, drops: 5, reason: '얼그레이 홍차 잎에 깃든 상큼한 오렌지 향' },
        { ingredientId: 'grapefruit', ingredientName: '핑크 그레이프프루트', type: 'top' as const, drops: 3, reason: '생기 있고 달콤쌉싸름한 활력' },
        { ingredientId: 'black_tea_fig', ingredientName: '블랙티 & 무화과', type: 'middle' as const, drops: 7, reason: '지적이고 그윽한 홍차와 무화과의 중심 테마' },
        { ingredientId: 'vanilla', ingredientName: '부르봉 바닐라', type: 'base' as const, drops: 4, reason: '달콤하고 벨벳처럼 부드러운 위로' },
        { ingredientId: 'sandalwood', ingredientName: '샌달우드 (백단향)', type: 'base' as const, drops: 4, reason: '책장과 오래된 원목 테이블의 온기' },
        { ingredientId: 'amber', ingredientName: '골든 앰버', type: 'base' as const, drops: 3, reason: '황금빛 햇살처럼 따뜻한 꿀빛 잔향' },
      ];
    } else if (sceneTitle.includes('장미') || kwText.includes('우아한') || kwText.includes('매혹')) {
      pName = '오로라 드 로즈';
      pNameEn = 'Aurora de Rose';
      family = '클래식 플로럴 (Floral Luxury)';
      summary = '새벽 이슬 머금은 장미와 화사한 네롤리의 매혹적인 앙상블입니다.';
      storytelling = '이른 새벽 찬란한 이슬을 머금은 장미 꽃잎이 피어나는 환상적인 정원의 순간을 포착했습니다. 산뜻한 베르가못의 첫인사 뒤로 여왕의 품격을 자랑하는 다마스크 로즈가 화려하게 만개하며, 화이트 머스크와 샌달우드가 귀족적인 부드러움을 남깁니다.';
      recommendedFormula = [
        { ingredientId: 'bergamot', ingredientName: '베르가못', type: 'top' as const, drops: 5, reason: '아침 이슬의 맑고 우아한 첫인상' },
        { ingredientId: 'damask_rose', ingredientName: '다마스크 로즈', type: 'middle' as const, drops: 8, reason: '풍성하고 매혹적인 장미 화원의 심장' },
        { ingredientId: 'neroli', ingredientName: '네롤리 오렌지 블라썸', type: 'middle' as const, drops: 4, reason: '순수하고 화사한 백색 꽃잎의 광채' },
        { ingredientId: 'white_musk', ingredientName: '화이트 머스크', type: 'base' as const, drops: 4, reason: '살결에 스며드는 파우더리한 순백의 잔향' },
        { ingredientId: 'sandalwood', ingredientName: '샌달우드 (백단향)', type: 'base' as const, drops: 3, reason: '꽃을 받쳐주는 고급스러운 원목 기둥' },
      ];
    }

    return {
      perfumeName: pName,
      perfumeNameEn: pNameEn,
      conceptSummary: summary,
      storytelling,
      scentFamily: family,
      recommendedFormula,
      perfumerAdvice: '시향지에 1방울 떨어뜨린 직후 30초(Top), 10분 후(Middle), 1시간 후(Base)의 향기 변화를 코로 직접 맡으며 메모해보세요.',
      educationalTakeaway: '💡 [진로 배움 포인트] AI는 화학 성분과 단어의 의미적 상관관계를 분석하여 콘셉트를 제안하지만, 인간의 고유한 후각 신경계와 개인의 감성적 반응은 AI가 직접 느낄 수 없습니다. 따라서 조향사의 실제 시향과 섬세한 미세 조율이 필수적입니다.'
    };
  }

  // 1. AI Scent Concept Generator Route
  app.post('/api/scent/ai-concept', async (req, res) => {
    try {
      const { sceneTitle, keywords, customPrompt, studentName } = req.body;
      const kwList = Array.isArray(keywords) ? keywords : [];

      if (!ai) {
        // Fallback engine
        const fallback = generateFallbackConcept(sceneTitle || '', kwList, customPrompt);
        return res.json(fallback);
      }

      const prompt = `
당신은 대한민국 최고의 'AI 전문 조향연구원(Master AI Perfumer & Fragrance Scientist)'이자 중고등학교 진로체험 수업의 멘토입니다.
학생들이 제공한 '장면(이미지)'과 '감성 단어'를 분석하여 향기 콘셉트로 번역하고 구체적인 조향 레시피를 제안해주세요.

[입력 정보]
- 선택한 장면/이미지: ${sceneTitle || '신비로운 자연의 풍경'}
- 선택한 감성 단어: ${kwList.join(', ') || '시원한, 맑은, 차분한'}
- 학생의 추가 질문/의도: ${customPrompt || '이 느낌을 멋진 향 콘셉트와 이름, 조향 비율로 번역해줘'}

[사용 가능한 조향 원료 ID 및 명칭 목록]
- Top Notes (탑 노트):
  * bergamot (베르가못)
  * lemon_lime (레몬 & 라임)
  * marine_aqua (마린 오션 & 씨솔트)
  * grapefruit (핑크 그레이프프루트)
  * eucalyptus_mint (유칼립투스 & 페퍼민트)
  * green_apple (그린 애플 & 이슬 풀잎)
- Middle Notes (미들 노트):
  * damask_rose (다마스크 로즈)
  * neroli (네롤리 오렌지 블라썸)
  * jasmine (자스민 삼박)
  * lavender (프렌치 라벤더)
  * muguet (뮤게 은방울꽃)
  * black_tea_fig (블랙티 & 무화과)
- Base Notes (베이스 노트):
  * white_musk (화이트 머스크)
  * sandalwood (샌달우드 백단향)
  * cedarwood (시더우드 삼나무)
  * amber (골든 앰버)
  * vanilla (부르봉 바닐라)
  * patchouli (패츌리 다크 어스)

총 방울 수는 20~30방울 내외로 설계하고, Top/Middle/Base 피라미드 비율의 밸런스를 맞춰주세요.
교육적 조언으로 "AI는 실제 향을 맡을 수 없으므로 인간 조향사의 시향과 검증이 왜 필요한지"를 반드시 포함해주세요.
`.trim();

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: '당신은 전문 조향연구원입니다. 이미지를 향기로 번역하는 섬세하고 시적인 표현력과 화학적 조향 과학 지식을 갖추고 있습니다. 항상 유효한 JSON 형식으로만 응답해야 합니다.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              perfumeName: { type: Type.STRING, description: '시적이고 매력적인 한글 향수 이름' },
              perfumeNameEn: { type: Type.STRING, description: '영문 향수 이름' },
              conceptSummary: { type: Type.STRING, description: '1~2문장의 핵심 조향 콘셉트 요약' },
              storytelling: { type: Type.STRING, description: '이미지와 감성 단어가 향기로 피어나는 생생한 스토리텔링 (3~5문장)' },
              scentFamily: { type: Type.STRING, description: '주요 올팩티브 계열 (예: 아쿠아틱 마린, 시트러스 플로럴, 우디 허벌)' },
              recommendedFormula: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    ingredientId: { type: Type.STRING, description: '제공된 목록의 ingredientId' },
                    ingredientName: { type: Type.STRING, description: '원료 한글 이름' },
                    type: { type: Type.STRING, description: 'top, middle, base 중 하나' },
                    drops: { type: Type.NUMBER, description: '추천 방울 수 (1~10)' },
                    reason: { type: Type.STRING, description: '이 원료를 선택한 감성적/화학적 이유' }
                  },
                  required: ['ingredientId', 'ingredientName', 'type', 'drops', 'reason']
                }
              },
              perfumerAdvice: { type: Type.STRING, description: '조향사가 학생에게 전하는 블렌딩 및 시향 실습 팁' },
              educationalTakeaway: { type: Type.STRING, description: 'AI와 인간 조향사의 협업 가치 및 실제 시향 검증의 중요성에 대한 교육적 메시지' }
            },
            required: ['perfumeName', 'perfumeNameEn', 'conceptSummary', 'storytelling', 'scentFamily', 'recommendedFormula', 'perfumerAdvice', 'educationalTakeaway']
          }
        }
      });

      const responseText = response.text || '';
      const parsed = JSON.parse(responseText);
      return res.json(parsed);
    } catch (error) {
      console.error('Error generating AI concept:', error);
      const fallback = generateFallbackConcept(req.body?.sceneTitle || '', req.body?.keywords || [], req.body?.customPrompt);
      return res.json(fallback);
    }
  });

  // 2. AI Scent Advisor (Live Lab Feedback)
  app.post('/api/scent/ai-advisor', async (req, res) => {
    try {
      const { formulaSummary, topPercent, middlePercent, basePercent, recipeName } = req.body;

      if (!ai) {
        let balanceAnalysis = '탑/미들/베이스 비율이 안정적인 피라미드 구조를 형성하고 있습니다.';
        let harmonyScore = 88;
        let suggestion = '미들 노트의 지속력을 더 느끼고 싶다면 플로럴 또는 허브 향료를 1~2방울 추가해보세요.';

        if (topPercent > 55) {
          balanceAnalysis = '탑 노트의 비중이 높아 첫 향이 매우 강렬하고 상쾌하지만, 30분 후 빠르게 날아갈 수 있습니다.';
          harmonyScore = 74;
          suggestion = '베이스 노트(머스크나 우디)를 2~3방울 보강하면 잔향의 지속력이 4시간 이상 길어집니다.';
        } else if (basePercent > 50) {
          balanceAnalysis = '베이스 노트의 비중이 묵직하여 지속력은 뛰어나지만, 첫인상의 산뜻함이 다소 무거울 수 있습니다.';
          harmonyScore = 78;
          suggestion = '시트러스나 아쿠아틱 노트를 2방울 추가해 향기의 서막을 가볍게 열어주세요.';
        }

        return res.json({
          balanceAnalysis,
          harmonyScore,
          scentImpression: `첫 분사 시 상쾌하게 열려 ${Math.round(middlePercent)}%의 볼륨감 있는 심장 향조로 이어지며, 포근한 잔향이 은은하게 감돕니다.`,
          adjustmentSuggestion: suggestion,
          smellingTip: '비커에 섞은 액을 시향지에 1방울 적신 후 허공에 3회 가볍게 흔들어 알코올을 날린 뒤 향을 맡아보세요.'
        });
      }

      const prompt = `
조향 연구실에서 학생이 제작 중인 향수 레시피를 분석하고 마스터 퍼퓨머의 친절하고 전문적인 피드백을 작성해주세요.
- 향수 이름: ${recipeName || '나만의 가상 향수'}
- 현재 성분 구성: ${formulaSummary}
- 탑 노트 비율: ${topPercent}%
- 미들 노트 비율: ${middlePercent}%
- 베이스 노트 비율: ${basePercent}%

[피드백 지침]
- 황금비율(탑 30~40%, 미들 40~50%, 베이스 20~30% 또는 프레시/오리엔탈 계열별 특성)과 비교 분석
- 하모니 점수 (60~98점 사이)
- 시간 경과에 따른 발향 변화 예측
- 구체적인 방울 수 조절 조언 1가지
- 시향 실습 팁
`.trim();

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: '당신은 상냥하고 전문적인 조향 랩 마스터입니다. 고등학생 및 일반인도 이해하기 쉬운 직관적인 피드백을 제공합니다.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              balanceAnalysis: { type: Type.STRING, description: '노트 간 밸런스 분석' },
              harmonyScore: { type: Type.NUMBER, description: '조화 점수 (0-100)' },
              scentImpression: { type: Type.STRING, description: '시간 흐름에 따른 향기 느낌' },
              adjustmentSuggestion: { type: Type.STRING, description: '개선 및 조율 제안' },
              smellingTip: { type: Type.STRING, description: '시향 시 주의사항 및 방법' }
            },
            required: ['balanceAnalysis', 'harmonyScore', 'scentImpression', 'adjustmentSuggestion', 'smellingTip']
          }
        }
      });

      const responseText = response.text || '';
      const parsed = JSON.parse(responseText);
      return res.json(parsed);
    } catch (err) {
      console.error('Error generating AI advisor feedback:', err);
      return res.json({
        balanceAnalysis: '현재 비율은 개성 있는 조향 구조를 보여주고 있습니다.',
        harmonyScore: 85,
        scentImpression: '산뜻한 시작과 부드러운 하트 노트가 자연스럽게 이어집니다.',
        adjustmentSuggestion: '원료 간의 화학적 궁합을 시험하기 위해 실제 시향지 테스트를 진행해보세요.',
        smellingTip: '시향지를 코에 너무 밀착하지 말고 10cm 거리에서 가볍게 부채질하며 맡으세요.'
      });
    }
  });

  // Mount Vite middleware in development or static files in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AI Perfumer Career App server running on port ${PORT}`);
  });
}

startServer();
