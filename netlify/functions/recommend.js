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

  // API 키 확인
  if (!process.env.OPENAI_API_KEY) {
    res.status(500).json({ error: 'OpenAI API key not configured' });
    return;
  }

  try {
    const { skills, hours_per_week, online_or_offline = 'online', risk_level = 'low', age, occupation } = req.body;

    if (!skills) {
      res.status(400).json({ error: 'Skills are required' });
      return;
    }

    // 기본 추천 반환 (AI 호출 없이)
    const items = [
      { title: "쿠팡파트너스", difficulty: "초급", monthly_estimate: "₩50,000~₩150,000", one_line_tip: "인기 키워드로 리뷰 작성 후 링크 걸어 판매 유도" },
      { title: "디지털템플릿", difficulty: "초급", monthly_estimate: "₩100,000~₩300,000", one_line_tip: "노션·엑셀 템플릿 제작 후 마켓에 등록" },
      { title: "프리랜서작업", difficulty: "중급", monthly_estimate: "₩200,000~₩500,000", one_line_tip: "크몽·프리랜서 플랫폼에 포트폴리오 올리고 소액 의뢰 수주" }
    ];

    res.status(200).json({ items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message ?? "Internal Server Error" });
  }
}
