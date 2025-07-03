/** @format */
import { createClient } from "@supabase/supabase-js";

// ✅ Server-side admin client for use in API routes only (using Service Role Key). 
//This won't get the user session, so DB policies requiring user authentication won't work with this client.
//Just kept for reference here, the createPagesServerClient function is used in the API routes.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
