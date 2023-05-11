import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE
);

export default async function handler(req, res) {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", req.body.id)
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  const censoredData = {
    message: data.content,
    cignum: data.cignum,
    address: data.address.slice(0, 3) + "..." + data.address.slice(-3),
    created_at: data.created_at,
    id: data.id,
    parent_id: data.parent_id,
  };

  return res.status(200).json({ post: censoredData });
}
