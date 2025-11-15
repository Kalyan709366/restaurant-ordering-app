import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://neyqzxbwdapmsqhqnion.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5leXF6eGJ3ZGFwbXNxaHFuaW9uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxNDA2NjMsImV4cCI6MjA3ODcxNjY2M30.i5YeDn_24twRMOZIWz_2LV19zEJD4W6UqhQ1q8RtpjE"
);