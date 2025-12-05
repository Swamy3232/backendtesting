import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://pyxujweejwvyphjmxaag.supabase.co";
// Use SERVICE ROLE key here (never expose this to frontend)
const supabaseServiceKey = "sb_publishable_m-lUbx-eEnhKYmXt0FkLQw_T-8llcsQ";

export const supabase = createClient(supabaseUrl, supabaseServiceKey);
