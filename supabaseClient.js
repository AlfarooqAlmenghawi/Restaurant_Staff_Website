import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ekbfrruixxmwmlsuqkku.supabase.co"; // Replace with your Supabase URL
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrYmZycnVpeHhtd21sc3Vxa2t1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMTkzMDE0NywiZXhwIjoyMDQ3NTA2MTQ3fQ.FwbO9reCHqMWk7iZlrcJ6unzpdU_uIbBNiizyL4q3ZA"; // Replace with your Supabase Anon Key
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
