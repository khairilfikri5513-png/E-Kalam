export function getPlaceholderIcon(imageKey?: string) {
  if (!imageKey) return "📚";

  const icons: Record<string, string> = {
    // Unit 1
    chair: "🪑",
    door: "🚪",
    desk: "🖥️",
    cupboard: "🗄️",
    lamp: "💡",
    window: "🪟",
    board: "📋",
    fan: "🌀",
    eraser: "🧽",
    whiteboard: "⬜",
    broom: "🧹",
    basket: "🧺",
    book: "📘",

    // Unit 2
    glasses: "👓",
    shirt: "👕",
    pants: "👖",
    tie: "👔",
    belt: "🟫",
    dress: "👗",
    hijab: "🧕",
    handkerchief: "⬜",
    wallet: "👛",
    socks: "🧦",
    shoes: "👞",
    
    // Unit 4
    today: "📅",
    tomorrow: "➡️",
    yesterday: "⬅️",
    morning: "🌅",
    noon: "☀️",
    evening: "🌙",
    monday: "📘",
    tuesday: "📗",
    wednesday: "📙",
    thursday: "📒",
    friday: "🕌",
    saturday: "📆",
    sunday: "🌞"
  };

  return icons[imageKey] || "📚";
}
