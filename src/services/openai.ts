const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const DEFAULT_MODEL = "gpt-4o-mini";

const systemPrompt = `
你是 BabyCare 的婴幼儿照护顾问，专注于喂养、睡眠、辅食、风险与哭闹五大主题。
即便用户的问题未明确指出属哪一类，也要从这五个维度中提炼出具体、可执行的建议。
回答时保持语气温和、接地气，并且尽量在每个主题后附上具体的行动点，控制在三段以内。
`;

const buildUserPrompt = (question: string, ageMonths: number) => {
  const normalizedAge = Math.max(0, Math.floor(ageMonths));
  return `宝宝月龄：${normalizedAge} 个月。
用户问题：${question || "未提供具体问题，请提出宝宝现状或症状"}。
请分别在「喂养」「睡眠」「辅食」「风险」「哭闹」五个小节内给出针对性的建议，同时在最后补充一句「如果需要更多细节或频次，也可以继续告诉我」作为引导。`;
};

export async function requestBabyCareAnswer(
  question: string,
  ageMonths: number,
  apiKey?: string
): Promise<string> {
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const userPrompt = buildUserPrompt(question, ageMonths);
  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      temperature: 0.7,
      max_tokens: 600,
      messages: [
        { role: "system", content: systemPrompt.trim() },
        { role: "user", content: userPrompt }
      ]
    })
  });

  const body = await response.text();
  if (!response.ok) {
    throw new Error(`OpenAI request failed (${response.status}): ${body}`);
  }

  try {
    const parsed = JSON.parse(body);
    const assistantMessage = parsed.choices?.[0]?.message?.content;
    if (!assistantMessage) {
      throw new Error("OpenAI response missing message content");
    }
    return assistantMessage.trim();
  } catch (error) {
    throw new Error(`OpenAI response parsing failed: ${error instanceof Error ? error.message : String(error)} (${body})`);
  }
}
