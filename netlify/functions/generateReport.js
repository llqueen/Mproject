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
    const { user, chosen_title } = req.body;

    if (!user || !chosen_title) {
      res.status(400).json({ error: 'User info and chosen title are required' });
      return;
    }

    const mdPromptSystem = `너는 실행가능한 '부업 시작 가이드' 리포트 생성기야. 단계별 행동 지시와 바로 사용할 수 있는 URL/템플릿/메시지를 제공해.`;
    const mdPromptUser = `사용자 정보: ${JSON.stringify(user)}\n선택된 부업: ${chosen_title}\n요구사항: PDF용 마크다운 텍스트로, 섹션 1) 개요 2) 준비 항목(5+) 3) 7단계 실행 플랜 4) 현실 수익 예측(1/3/6개월, KRW) 5) 즉시 사용 템플릿 6) 추천 링크(placeholder).`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: mdPromptSystem },
        { role: "user", content: mdPromptUser }
      ],
      temperature: 0.6
    });

    const markdown = completion.choices[0]?.message?.content ?? "# 리포트\n생성 실패 시 기본 템플릿을 사용하세요.";

    res.status(200).json({ markdown });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message ?? "Internal Server Error" });
  }
}
