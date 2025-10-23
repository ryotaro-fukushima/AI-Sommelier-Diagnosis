
import { GoogleGenAI } from "@google/genai";
import type { UserInfo } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getDrinkRecommendation(userInfo: UserInfo): Promise<string> {
  const model = 'gemini-2.5-flash';
  
  const prompt = `
あなたは、ユーザーのパーソナルな状況に合わせて今夜最高にぴったりな一杯を提案するプロフェッショナルなAIソムリエです。
あなたの主な任務は、以下のユーザー情報を総合的に判断し、最適なお酒を一つ選んで提案することです。

【ユーザー情報】
- 現在の体調と気分: ${userInfo.condition}
- 今日の忙しさ: ${userInfo.busyness}
- 今夜食べる予定の料理: ${userInfo.food}
- 普段のお酒の好み: ${userInfo.preference}

最終的な提案は、必ず以下のMarkdown形式のフォーマットに厳密に従って、日本語で提示してください。このフォーマットの前後に余計な文章は一切含めないでください。

🥂 【今夜のあなたに最適な一杯】診断結果！ 🥂
---
🍻 **診断名:** [提案するお酒の種類・ジャンル]

**【診断結果サマリー】**
- **今日のあなたの気分:** [AIが解釈したユーザーの気分や状態]
- **最適なアルコール度数:** [低め/普通/高めなど]
- **この後の活動:** [飲むことで得られる効果（例：リラックス、明日への活力）]

**【今日飲むべき一杯】**
### [提案するお酒の種類・ジャンル]
（例：爽快なハイボール）

**【提案理由と飲むヒント】**
[体調や気分に合致する理由、リラックス効果、飲む際のヒントなどを簡潔な文章で説明]

**【おすすめ銘柄の例】**
- [具体的な銘柄名やスタイルの例をシンプルに列挙]
- [具体的な銘柄名やスタイルの例をシンプルに列挙]
- [具体的な銘柄名やスタイルの例をシンプルに列挙]
`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "申し訳ありません、診断中にエラーが発生しました。もう一度お試しください。";
  }
}
