var form        = document.getElementById("loginForm");
var emailInput  = document.getElementById("email");
var senhaInput  = document.getElementById("senha");
var errorEl     = document.getElementById("loginError");
var btnLogin    = document.getElementById("btnLogin");
var toggleSenha = document.getElementById("toggleSenha");

toggleSenha.addEventListener("click", function() {
  var tipo = senhaInput.type === "password" ? "text" : "password";
  senhaInput.type = tipo;
  toggleSenha.textContent = tipo === "password" ? "👁️" : "🙈";
});

if (sessionStorage.getItem("gv_user")) {
  window.location.href = "portal.html";
}

form.addEventListener("submit", function(e) {
  e.preventDefault();
  errorEl.style.display = "none";

  var email = emailInput.value.trim().toLowerCase();
  var senha = senhaInput.value;

  if (!email || !senha) { mostrarErro("Preencha o e-mail e a senha."); return; }

  btnLogin.disabled = true;
  btnLogin.textContent = "Verificando...";

  fetch(CLIENTES_API + "?email=eq." + encodeURIComponent(email) + "&senha=eq." + encodeURIComponent(senha) + "&select=*", {
    headers: supabaseHeaders()
  })
  .then(function(r) { return r.json(); })
  .then(function(data) {
    if (Array.isArray(data) && data.length > 0) {
      var usuario = data[0];
      sessionStorage.setItem("gv_user", JSON.stringify({
        email: usuario.email,
        nome: usuario.nome,
        plano: usuario.plano
      }));
      window.location.href = "portal.html";
    } else {
      mostrarErro("E-mail ou senha incorretos.");
      btnLogin.disabled = false;
      btnLogin.textContent = "Entrar no Portal";
    }
  })
  .catch(function() {
    mostrarErro("Erro de conexao. Tente novamente.");
    btnLogin.disabled = false;
    btnLogin.textContent = "Entrar no Portal";
  });
});

function mostrarErro(msg) {
  errorEl.textContent = msg;
  errorEl.style.display = "block";
}
