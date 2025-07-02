/** @format */

import { createClient } from "@supabase/supabase-js";

// Load environment variables
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Validate environment variables
function validateEnv() {
  if (!supabaseUrl) throw new Error('SUPABASE_URL is not defined in environment variables.');
  if (!supabaseKey) throw new Error('SUPABASE_KEY is not defined in environment variables.');
  if (!serviceRoleKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not defined in environment variables.');
}
validateEnv();

// Create Supabase clients
const supabase = createClient(supabaseUrl, supabaseKey);
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

module.exports = { supabase, supabaseAdmin };