import { createBabyTips } from "./guides.js";
const keywords = {
    feeding: ["喂", "奶", "吃", "奶粉", "哺乳", "feed", "喂养"],
    sleep: ["睡", "nap", "夜", "醒", "睡眠", "入睡"],
    food: ["辅食", "吃什么", "食物", "米", "粥", "手抓"],
    risk: ["发热", "高烧", "红旗", "危险", "呼吸", "症状", "呕吐", "就医"],
    cry: ["哭", "闹", "安抚", "烦躁", "哄", "哭闹"]
};
const titles = {
    feeding: "喂养",
    sleep: "睡眠",
    food: "辅食",
    risk: "风险",
    cry: "哭闹"
};
const emojis = {
    feeding: "🍼",
    sleep: "😴",
    food: "🍚",
    risk: "⚠️",
    cry: "😭"
};
const detectTopics = (text) => {
    const normalized = text.toLowerCase();
    const matches = [];
    for (const topic of Object.keys(keywords)) {
        if (keywords[topic].some((keyword) => normalized.includes(keyword))) {
            matches.push(topic);
        }
    }
    return matches;
};
const chooseTopics = (found, tips) => {
    if (found.length > 0)
        return found;
    return ["feeding", "sleep", "risk"].filter((topic) => topic in tips);
};
export const buildBabyResponse = (text, ageMonths) => {
    const cleaned = (text ?? "").trim();
    const tips = createBabyTips(ageMonths);
    const topics = chooseTopics(detectTopics(cleaned), tips);
    const sections = topics.map((topic) => `${emojis[topic]} ${titles[topic]}：${tips[topic]}`);
    const header = `你描述的是 ${Math.max(0, Math.floor(ageMonths))} 个月的宝宝，我们根据你的提问整理了以下建议：`;
    const footer = cleaned
        ? `你刚才问的是：「${cleaned}」。如需更细节的行为、频次或症状，也欢迎继续补充。`
        : "请补充更多宝宝具体的表现，我可以帮你搭配更精准的建议。";
    return [header, ...sections, footer].join("\n\n");
};
