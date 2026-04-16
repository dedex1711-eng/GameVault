var SUPABASE_URL = "https://fqzgywnxmznghvqlnxjl.supabase.co";
var SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxemd5d254bXpuZ2h2cWxueGpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzNTY0NzcsImV4cCI6MjA5MTkzMjQ3N30.Cv8r70nYMoRyk_O3HFwxluOWaSMwVGko-uonxqvyA0Q";
var CLIENTES_API = SUPABASE_URL + "/rest/v1/clientes";

function supabaseHeaders(extra) {
  var h = {
    "apikey": SUPABASE_KEY,
    "Authorization": "Bearer " + SUPABASE_KEY,
    "Content-Type": "application/json"
  };
  if (extra) {
    for (var k in extra) h[k] = extra[k];
  }
  return h;
}
