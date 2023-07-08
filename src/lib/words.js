export const banWord = async (word) => {
  try {
    fetch("/api/add-banned-word", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ word: word }),
    });
  } catch (e) {
    console.error(e);
  }
};

export const getBannedWords = async () => {
  const res = await fetch("/api/get-banned-words");
  const { words } = await res.json();
  return words;
};

export function checkPass(inputString, encodedString) {
  const base64Input = Buffer.from(inputString).toString("base64");
  const decodedString = Buffer.from(encodedString, "base64").toString("utf-8");
  return inputString === decodedString;
}
