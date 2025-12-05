import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://pyxujweejwvyphjmxaag.supabase.co";
// Use your SECRET key here, never expose it to frontend
const supabaseSecretKey = "sb_secret_Jqm1U"; 

export const supabase = createClient(supabaseUrl, supabaseSecretKey);
