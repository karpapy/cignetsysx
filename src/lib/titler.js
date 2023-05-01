const possibleTitles = [
  "The Orate Gatsby 🎩",
  "GENESIS 🌌",
  "Unfanged Noumena 🧠",
  "The Catcher in the gye ⚾",
  "ECCLESIASTES 📜",
  "L'histoire de l'oeil 👁️",
  "L'histoire de d'eau 💧",
  "CIGCIGCIG 🚬",
  "kafkaesque 🦟",
  "CANDIDE 🍭",
  "Kolmogorov Complexity 🧮",
  "Cig attention is all you need 🧠",
  "RIP PAPPA 🙏",
  "Call me Ishmael 🐳",
  "mylady 🤔",
];

export const titler = () => {
  return possibleTitles[Math.floor(Math.random() * possibleTitles.length)];
};
