import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://pyxujweejwvyphjmxaag.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5eHVqd2Vland2eXBoam14YWFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5MjM3ODYsImV4cCI6MjA4MDQ5OTc4Nn0.JoawKcnSLQO6tMYZWJZEEPNsqgggQeaeYJS8ilFA0q8";

export const supabase = createClient(supabaseUrl, supabaseKey);
