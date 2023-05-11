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
  await supabase.from("posts").insert([
    {
      content: message,
      cignum,
      address,
    },
  ]);

  return res.status(200).json({ success: true });
}
