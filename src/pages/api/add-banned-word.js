import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE
);

const addBannedWord = async (word) => {
  const { data, error } = await supabase.from("banned_words").insert([
    {
      word,
    },
  ]);

  if (error) {
    console.error("Error add data:", error);
    return [];
  }
  return data;
};

export default async function handler(req, res) {
  const { word } = req.body;
  const data = await addBannedWord(word);
  return res.status(200).json({ data: data });
}
