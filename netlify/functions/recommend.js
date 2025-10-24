import OpenAI from "openai";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

export default async function handler(req, res) {
  // CORS 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    const { skills, hours_per_week, online_or_offline = 'online', risk_level = 'low', age, occupation } = req.body;

    if (!skills) {
      res.status(400).json({ error: 'Skills are required' });
      return;
    }

    const system = `너는 현실적인 부업 추천 엔진이야. 추천은 실제 실행 가능하고 초보자도 시작할 수 있는 것만 고르고, 각 추천은 최대 2문장으로 간결하게 설명해줘.`;

    const user = `사용자 정보: 나이:${age ?? "?"}, 직업:${occupation ?? "?"}, 기술 키워드:${skills}, 주당 가용시간:${hours_per_week}, 선호형태:${online_or_offline}, 위험선호:${risk_level}`;

    const task = `1) 사용자 정보 기반으로 '지금 당장 시작 가능한' 부업 3가지를 선정해.\n2) 각 항목에 대해: 제목(한 단어), 예상 초기 진입 난이도(초급/중급/고급), 예상 월수익 범위(KRW), 1줄 실행 팁(10~15단어).\nJSON 배열로만 응답: [{"title":"","difficulty":"","monthly_estimate":"","one_line_tip":""}]`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: system },
        { role: "user", content: `${user}\n\n${task}` }
      ],
      temperature: 0.7
    });

    const text = completion.choices[0]?.message?.content ?? "[]";
    
    let items = [];
    try {
      items = JSON.parse(text);
    } catch (e) {
      // 실패 시 기본 추천
      items = [
        { title: "쿠팡파트너스", difficulty: "초급", monthly_estimate: "₩50,000~₩150,000", one_line_tip: "인기 키워드로 리뷰 작성 후 링크 걸어 판매 유도" },
        { title: "디지털템플릿", difficulty: "초급", monthly_estimate: "₩100,000~₩300,000", one_line_tip: "노션·엑셀 템플릿 제작 후 마켓에 등록" },
        { title: "프리랜서작업", difficulty: "중급", monthly_estimate: "₩200,000~₩500,000", one_line_tip: "크몽·프리랜서 플랫폼에 포트폴리오 올리고 소액 의뢰 수주" }
      ];
    }

    res.status(200).json({ items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message ?? "Internal Server Error" });
  }
}
