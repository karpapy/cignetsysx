import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE
);

const fetchGenData = async () => {
  const { data, error } = await supabase.rpc("get_gen_data_by_day");

  if (error) {
    console.error("Error fetching data:", error);
    return [];
  }
  const genData = data.map((row) => ({
    name: row.created_at.split("T")[0],
    renders: row.renders,
  }));
  return genData;
};
export default async function handler(req, res) {
  const genData = await fetchGenData();
  return res.status(200).json({ genData: genData });
}
