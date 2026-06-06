const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = "https://lnrslwlwtdfzfnpfexoc.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxucnNsd2x3dGRmemZucGZleG9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0NzcyNjYsImV4cCI6MjA5NjA1MzI2Nn0.wBd6cO_M8Nbh7KS8ZBq1l6r0s2aPNprzVedlfzXHJdU";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  try {
    const { data, error } = await supabase.auth.getUser("dummy_token");
    console.log("getUser Data:", data);
    console.log("getUser Error:", error?.message);
  } catch (e) {
    console.error("Exception:", e.message);
  }
}
test();
