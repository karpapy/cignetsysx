import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (!req.body.id) {
    return res.status(400).json({ error: "ID required." });
  }
  const { data: parentData, error: parentError } = await supabase
    .from("posts")
    .select("*")
    .eq("id", req.body.id)
    .single();

  if (parentError) {
    return res.status(500).json({ error: parentError.message });
  }

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("parent_id", req.body.id)
    .limit(1000);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  const censoredData = data.map((post) => {
    return {
      message: post.content,
      cignum: post.cignum,
      address: post.address.slice(0, 3) + "..." + post.address.slice(-3),
      created_at: post.created_at,
      id: post.id,
    };
  });

  return res.status(200).json({ posts: censoredData });
}
