/** @format */

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

// ✅ Browser client for use in the frontend
export const createClient = () => createClientComponentClient();
