var SUPABASE_URL = "https://fqzgywnxmznghvqlnxjl.supabase.co";
var SUPABASE_KEY = "sb_publishable_8aOx9fZN2rNchEEbt7N4cA_XyTYXdQw";
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
