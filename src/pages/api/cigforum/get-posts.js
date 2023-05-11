import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE
);

function sortPosts(posts) {
  const sortedPosts = posts.sort((a, b) => {
    if (a.created_at < b.created_at) {
      return 1;
    } else if (a.created_at > b.created_at) {
      return -1;
    } else {
      return 0;
    }
  });
  return sortedPosts;
}

export default async function handler(req, res) {
  // get the last 1000 posts
  const { data, error } = await supabase.from("posts").select("*").limit(1000);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  //   censor the posts
  const censoredData = data.map((post) => {
    return {
      message: post.content,
      cignum: post.cignum,
      address: post.address.slice(0, 3) + "..." + post.address.slice(-3),
      created_at: post.created_at,
      id: post.id,
      parent_id: post.parent_id,
    };
  });
  const sortedPosts = sortPosts(censoredData);

  return res.status(200).json({ posts: sortedPosts });
}
