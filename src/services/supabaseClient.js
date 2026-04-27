import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log("Initializing Supabase:", {
  url: supabaseUrl ? "✓ Set" : "✗ Missing",
  key: supabaseAnonKey ? "✓ Set" : "✗ Missing",
});

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
console.log("Supabase client created successfully");
