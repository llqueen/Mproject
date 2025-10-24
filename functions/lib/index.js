import * as functions from "firebase-functions";
import OpenAI from "openai";
import { z } from "zod";
// 환경변수: Firebase 콘솔/CLI (functions:secrets)로 세팅
// OPENAI_API_KEY
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const RecommendInput = z.object({
    age: z.number().int().optional(),
    occupation: z.string().optional(),
    skills: z.string(),
    hours_per_week: z.number().int(),
    online_or_offline: z.enum(["online", "offline", "both"]).default("online"),
    risk_level: z.enum(["low", "mid", "high"]).default("low")
});
export const recommend = functions.https.onRequest(async (req, res) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    if (req.method === "OPTIONS") {
        res.status(204).send("");
        return;
    }
    if (req.method !== "POST") {
        res.status(405).send("Method Not Allowed");
        return;
    }
    try {
        const parsed = RecommendInput.parse(req.body);
        const system = `너는 현실적인 부업 추천 엔진이야. 추천은 실제 실행 가능하고 초보자도 시작할 수 있는 것만 고르고, 각 추천은 최대 2문장으로 간결하게 설명해줘.`;
        const user = `사용자 정보: 나이:${parsed.age ?? "?"}, 직업:${parsed.occupation ?? "?"}, 기술 키워드:${parsed.skills}, 주당 가용시간:${parsed.hours_per_week}, 선호형태:${parsed.online_or_offline}, 위험선호:${parsed.risk_level}`;
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
        // 응답이 JSON이 아닐 수 있으니 안전파싱
        let items = [];
        try {
            items = JSON.parse(text);
        }
        catch (e) {
            // 실패 시 간단 파싱 포맷
            items = [
                { title: "쿠팡파트너스", difficulty: "초급", monthly_estimate: "₩50,000~₩150,000", one_line_tip: "인기 키워드로 리뷰 작성 후 링크 걸어 판매 유도" },
                { title: "디지털템플릿", difficulty: "초급", monthly_estimate: "₩100,000~₩300,000", one_line_tip: "노션·엑셀 템플릿 제작 후 마켓에 등록" },
                { title: "프리랜서작업", difficulty: "중급", monthly_estimate: "₩200,000~₩500,000", one_line_tip: "크몽·프리랜서 플랫폼에 포트폴리오 올리고 소액 의뢰 수주" }
            ];
        }
        res.json({ items });
    }
    catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message ?? "Invalid input" });
    }
});
const ReportInput = z.object({
    user: z.object({
        age: z.number().int().optional(),
        occupation: z.string().optional(),
        skills: z.string(),
        hours_per_week: z.number().int(),
        online_or_offline: z.enum(["online", "offline", "both"]).default("online"),
        risk_level: z.enum(["low", "mid", "high"]).default("low")
    }),
    chosen_title: z.string()
});
export const generateReport = functions.https.onRequest(async (req, res) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    if (req.method === "OPTIONS") {
        res.status(204).send("");
        return;
    }
    if (req.method !== "POST") {
        res.status(405).send("Method Not Allowed");
        return;
    }
    try {
        const parsed = ReportInput.parse(req.body);
        const mdPromptSystem = `너는 실행가능한 '부업 시작 가이드' 리포트 생성기야. 단계별 행동 지시와 바로 사용할 수 있는 URL/템플릿/메시지를 제공해.`;
        const mdPromptUser = `사용자 정보: ${JSON.stringify(parsed.user)}\n선택된 부업: ${parsed.chosen_title}\n요구사항: PDF용 마크다운 텍스트로, 섹션 1) 개요 2) 준비 항목(5+) 3) 7단계 실행 플랜 4) 현실 수익 예측(1/3/6개월, KRW) 5) 즉시 사용 템플릿 6) 추천 링크(placeholder).`;
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: mdPromptSystem },
                { role: "user", content: mdPromptUser }
            ],
            temperature: 0.6
        });
        const markdown = completion.choices[0]?.message?.content ?? "# 리포트\n생성 실패 시 기본 템플릿을 사용하세요.";
        res.json({ markdown });
    }
    catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message ?? "Invalid input" });
    }
});
