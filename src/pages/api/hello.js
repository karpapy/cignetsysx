import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { caption, cignum } = req.body;

  if (!caption || !cignum) {
    return res.status(400).json({ error: "Caption and cignum required." });
  }

  await supabase.from("gens").insert([
    {
      caption,
      cignum,
    },
  ]);

  return res.status(200).json({ success: true });
}
