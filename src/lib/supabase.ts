import { createClient } from "@supabase/supabase-js";

// Récupère ces infos dans les Settings de ton projet Supabase (API Section)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
