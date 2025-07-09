/** @format */

import { supabaseAdmin } from "@/lib/supabaseAdmin";


export async function GET(req: Request) {
  const supabase = supabaseAdmin;
  const { searchParams } = new URL(req.url);

  const id = searchParams.get("id");
  const user_id = searchParams.get("user_id");

  if (!id || !user_id) {
    return new Response("Missing required parameters", { status: 400 });
  }

  const { data, error } = await supabase
    .from("resume_uploads")
    .select("parsed_text")
    .eq("id", id)
    .eq("user_id", user_id)
    .single();

  if (error) return new Response(error.message, { status: 500 });

  return Response.json(data);
}
