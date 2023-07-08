import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE
);

const getBannedWords = async () => {
  const { data, error } = await supabase.from("banned_words").select("*");

  if (error) {
    console.error("Error fetching data:", error);
    return [];
  }
  const bannedWords = data.map((row) => ({
    word: row.word,
  }));

  return bannedWords;
};

export default async function handler(req, res) {
  const words = await getBannedWords();
  return res.status(200).json({ words: words });
}
