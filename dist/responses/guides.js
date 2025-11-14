const normalizeAge = (raw) => Math.max(0, Math.floor(raw ?? 0));
const feedingGuidance = (ageMonths) => {
    if (ageMonths <= 1)
        return "每天 8-12 次、每次 60-90ml，按需哺乳/配方奶，记录饱腹信号。";
    if (ageMonths <= 3)
        return "每天 6-8 次，逐步建立固定喂养节奏，保持拥抱和排气。";
    if (ageMonths <= 6)
        return "每天 5-6 次，奶量 150-180ml，可观察宝宝耐受再逐步加入糊状辅食。";
    return "逐渐将奶量控制在 600-800ml，辅食逐步多样化，晚间延长睡眠间隔。";
};
const sleepGuidance = (ageMonths) => {
    if (ageMonths <= 1)
        return "天天睡 16-18 小时，白天可短睡 30-60 分钟，安抚节奏还在建立。";
    if (ageMonths <= 3)
        return "14-17 小时睡眠，白天 4-5 次小睡，建议固定睡前信号降低过度疲劳。";
    if (ageMonths <= 6)
        return "13-15 小时睡眠，允许 3-4 个小睡，夜间逐渐建立独立睡眠环境。";
    return "12-14 小时睡眠，白天 2-3 次小睡，鼓励自我安抚并减少夜醒。";
};
const foodGuidance = (ageMonths) => {
    if (ageMonths < 6)
        return "继续母乳或配方奶为主，暂不添加辅食，观察宝宝吞咽与吸吮信号。";
    if (ageMonths === 6)
        return "可以从单一的米糊、蔬菜泥开始，先试一种食材再叠加，观察过敏。";
    if (ageMonths <= 9)
        return "逐渐加入肉泥、蛋黄泥、粥类，口感稍粗糙，让宝宝练习咀嚼。";
    return "进入多样化安排，鼓励自喂（手抓食物）、搭配蛋白与蔬菜，控制盐糖。";
};
const riskGuidance = (ageMonths) => {
    const base = "如果出现呼吸困难、持续高烧、高频呕吐、嗜睡或拒食超过 6 次，请优先就医。";
    if (ageMonths <= 6)
        return `${base} 新生儿期更需关注吃奶、尿布、体温浮动。`;
    if (ageMonths <= 24)
        return `${base} 学步/爆发期可能因感染、脱水或脱臼加重，别忽略运动与喝水。`;
    return `${base} 孩子在断奶阶段也可能因困倦或肠胃症状加剧。`;
};
const cryGuidance = (ageMonths) => {
    if (ageMonths <= 6)
        return "先排除饥饿、尿布、胀气，再尝试轻拍、白噪音或抱抱，建立安抚仪式。";
    if (ageMonths <= 18)
        return "哭闹可能与成长痛、分离焦虑或疲劳有关，维持规律作息与安抚语调。";
    return "大一些的宝宝可能在表达不满/渴望自理，边界设置 + 给予选择感可以缓解。";
};
export const createBabyTips = (ageMonths) => {
    const normalizedAge = normalizeAge(ageMonths);
    return {
        feeding: feedingGuidance(normalizedAge),
        sleep: sleepGuidance(normalizedAge),
        food: foodGuidance(normalizedAge),
        risk: riskGuidance(normalizedAge),
        cry: cryGuidance(normalizedAge)
    };
};
