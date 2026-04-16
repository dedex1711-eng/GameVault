// Lê clientes salvos pelo painel admin
function getUsuarios() {
  const salvo = localStorage.getItem("gv_usuarios_json");
  if (salvo) {
    try { return JSON.parse(salvo); } catch(e) { return []; }
  }
  return [];
}

const form        = document.getElementById("loginForm");
const emailInput  = document.getElementById("email");
const senhaInput  = document.getElementById("senha");
const errorEl     = document.getElementById("loginError");
const btnLogin    = document.getElementById("btnLogin");
const toggleSenha = document.getElementById("toggleSenha");

// Mostrar/ocultar senha
toggleSenha.addEventListener("click", function() {
  var tipo = senhaInput.type === "password" ? "text" : "password";
  senhaInput.type = tipo;
  toggleSenha.textContent = tipo === "password" ? "👁️" : "🙈";
});

// Se já está logado, redireciona direto
if (sessionStorage.getItem("gv_user")) {
  window.location.href = "portal.html";
}

// Submit do formulário
form.addEventListener("submit", function(e) {
  e.preventDefault();
  errorEl.style.display = "none";

  var email = emailInput.value.trim().toLowerCase();
  var senha = senhaInput.value;

  if (!email || !senha) {
    mostrarErro("Preencha o e-mail e a senha.");
    return;
  }

  btnLogin.disabled = true;
  btnLogin.textContent = "Verificando...";

  setTimeout(function() {
    var usuarios = getUsuarios();
    var usuario = null;

    for (var i = 0; i < usuarios.length; i++) {
      if (usuarios[i].email.toLowerCase() === email && usuarios[i].senha === senha) {
        usuario = usuarios[i];
        break;
      }
    }

    if (usuario) {
      sessionStorage.setItem("gv_user", JSON.stringify({
        email: usuario.email,
        nome: usuario.nome,
        plano: usuario.plano
      }));
      window.location.href = "portal.html";
    } else {
      mostrarErro("E-mail ou senha incorretos. Verifique os dados enviados pelo WhatsApp.");
      btnLogin.disabled = false;
      btnLogin.textContent = "Entrar no Portal";
    }
  }, 600);
});

function mostrarErro(msg) {
  errorEl.textContent = msg;
  errorEl.style.display = "block";
}
