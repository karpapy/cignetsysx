import { createClient } from "@supabase/supabase-js";
import blanks from "@/lib/blanks.json";
import { verifyMessage } from "ethers/lib/utils";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message, address, messageSigned } = req.body;

  if (!message) {
    return res.status(400).json({ error: "post needs message" });
  }
  const cignum = blanks[Math.floor(Math.random() * blanks.length)];

  const signer = verifyMessage(message, messageSigned);
  if (signer !== address) {
    return res.status(400).json({ error: "Invalid signature." });
  }

  //   check if post exists
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", req.body.id)
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  // ok now we can insert the post

  await supabase.from("posts").insert([
    {
      content: message,
      cignum,
      address,
      parent_id: req.body.id,
    },
  ]);

  return res.status(200).json({ success: true });
}
