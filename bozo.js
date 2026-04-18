var SENHA_ADMIN = "dede2428";

var adminLogin      = document.getElementById("adminLogin");
var adminPanel      = document.getElementById("adminPanel");
var adminSenha      = document.getElementById("adminSenha");
var btnAdminLogin   = document.getElementById("btnAdminLogin");
var adminError      = document.getElementById("adminError");
var btnSairAdmin    = document.getElementById("btnSairAdmin");
var clienteForm     = document.getElementById("clienteForm");
var formTitle       = document.getElementById("formTitle");
var editIndexInput  = document.getElementById("editIndex");
var fNome           = document.getElementById("fNome");
var fEmail          = document.getElementById("fEmail");
var fSenha          = document.getElementById("fSenha");
var fPlano          = document.getElementById("fPlano");
var btnSalvar       = document.getElementById("btnSalvar");
var btnCancelarEdit = document.getElementById("btnCancelarEdit");
var tabelaBody      = document.getElementById("tabelaBody");
var totalClientes   = document.getElementById("totalClientes");
var listaVazia      = document.getElementById("listaVazia");
var searchInput     = document.getElementById("searchInput");
var btnExport       = document.getElementById("btnExport");
var toast           = document.getElementById("toast");

var clientesCache = [];

// ===== AUTH ADMIN =====
if (sessionStorage.getItem("gv_admin") === "ok") {
  mostrarPainel();
}

btnAdminLogin.addEventListener("click", fazerLogin);
adminSenha.addEventListener("keydown", function(e) { if (e.key === "Enter") fazerLogin(); });

function fazerLogin() {
  if (adminSenha.value === SENHA_ADMIN) {
    sessionStorage.setItem("gv_admin", "ok");
    adminError.style.display = "none";
    mostrarPainel();
  } else {
    adminError.style.display = "block";
    adminSenha.value = "";
    adminSenha.focus();
  }
}

function mostrarPainel() {
  adminLogin.style.display = "none";
  adminPanel.style.display = "block";
  carregarClientes();
}

btnSairAdmin.addEventListener("click", function() {
  sessionStorage.removeItem("gv_admin");
  location.reload();
});

// ===== SUPABASE API =====
function carregarClientes() {
  mostrarLoading(true);
  fetch(CLIENTES_API + "?select=*&order=id.asc", {
    headers: supabaseHeaders()
  })
  .then(function(r) { return r.json(); })
  .then(function(data) {
    if (Array.isArray(data)) {
      clientesCache = data;
    } else {
      console.error("Erro Supabase:", data);
      showToast("Erro ao carregar. Verifique a tabela 'clientes' no Supabase.", "error");
      clientesCache = [];
    }
    renderTabela();
    mostrarLoading(false);
  })
  .catch(function(err) {
    console.error(err);
    showToast("Erro de conexao com o banco.", "error");
    mostrarLoading(false);
  });
}

// ===== FORMULARIO =====
clienteForm.addEventListener("submit", function(e) {
  e.preventDefault();

  var nome  = fNome.value.trim();
  var email = fEmail.value.trim().toLowerCase();
  var senha = fSenha.value.trim();
  var plano = fPlano.value;
  var idx   = parseInt(editIndexInput.value);

  if (!nome || !email || !senha) return;

  btnSalvar.disabled = true;
  btnSalvar.textContent = "Salvando...";

  if (idx === -1) {
    // INSERT
    fetch(CLIENTES_API, {
      method: "POST",
      headers: supabaseHeaders({ "Prefer": "return=representation" }),
      body: JSON.stringify({ nome: nome, email: email, senha: senha, plano: plano })
    })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      if (data.code) {
        if (data.code === "23505") {
          showToast("Esse e-mail ja esta cadastrado!", "error");
        } else {
          showToast("Erro: " + (data.message || "Tente novamente."), "error");
        }
      } else {
        clienteForm.reset();
        showToast("Cliente cadastrado!");
        carregarClientes();
      }
    })
    .catch(function() { showToast("Erro ao salvar.", "error"); })
    .finally(function() {
      btnSalvar.disabled = false;
      btnSalvar.textContent = "Salvar Cliente";
    });
  } else {
    // UPDATE
    var id = clientesCache[idx].id;
    fetch(CLIENTES_API + "?id=eq." + id, {
      method: "PATCH",
      headers: supabaseHeaders({ "Prefer": "return=representation" }),
      body: JSON.stringify({ nome: nome, email: email, senha: senha, plano: plano })
    })
    .then(function(r) { return r.json(); })
    .then(function() {
      cancelarEdicao();
      showToast("Cliente atualizado!");
      carregarClientes();
    })
    .catch(function() { showToast("Erro ao atualizar.", "error"); })
    .finally(function() {
      btnSalvar.disabled = false;
      btnSalvar.textContent = "Salvar Cliente";
    });
  }
});

// ===== TABELA =====
function renderTabela(filtro) {
  filtro = filtro || "";
  var lista = filtro
    ? clientesCache.filter(function(c) {
        return c.nome.toLowerCase().includes(filtro) || c.email.toLowerCase().includes(filtro);
      })
    : clientesCache;

  tabelaBody.innerHTML = "";
  var tabela = document.getElementById("tabelaClientes");

  if (clientesCache.length === 0) {
    listaVazia.style.display = "block";
    tabela.style.display = "none";
  } else {
    listaVazia.style.display = "none";
    tabela.style.display = "table";
  }

  lista.forEach(function(c, i) {
    var realIdx = clientesCache.indexOf(c);
    var tr = document.createElement("tr");
    tr.innerHTML =
      '<td class="td-num">' + (i + 1) + '</td>' +
      '<td class="td-nome">' + esc(c.nome) + '</td>' +
      '<td class="td-email">' + esc(c.email) + '</td>' +
      '<td><span class="td-senha">' + esc(c.senha) + '</span></td>' +
      '<td><span class="badge-plano ' + (c.plano === "premium" ? "badge-premium" : "badge-basic") + '">' + c.plano.toUpperCase() + '</span></td>' +
      '<td><div class="td-acoes">' +
        '<button class="btn-edit" onclick="editarCliente(' + realIdx + ')">Editar</button>' +
        '<button class="btn-del" onclick="deletarCliente(' + realIdx + ')">Remover</button>' +
        '<button class="btn-send" onclick="enviarAcesso(' + realIdx + ')">&#128140; Enviar</button>' +
      '</div></td>';
    tabelaBody.appendChild(tr);
  });

  var total = clientesCache.length;
  totalClientes.textContent = total + " cliente" + (total !== 1 ? "s" : "") + " cadastrado" + (total !== 1 ? "s" : "");
}

// ===== EDITAR =====
window.editarCliente = function(idx) {
  var c = clientesCache[idx];
  if (!c) return;
  fNome.value  = c.nome;
  fEmail.value = c.email;
  fSenha.value = c.senha;
  fPlano.value = c.plano;
  editIndexInput.value = idx;
  formTitle.textContent = "Editando Cliente";
  btnSalvar.textContent = "Atualizar Cliente";
  btnCancelarEdit.style.display = "inline-block";
  clienteForm.scrollIntoView({ behavior: "smooth", block: "start" });
  fNome.focus();
};

function cancelarEdicao() {
  formTitle.textContent = "Cadastrar Novo Cliente";
  btnSalvar.textContent = "Salvar Cliente";
  btnCancelarEdit.style.display = "none";
  editIndexInput.value = -1;
  clienteForm.reset();
}

btnCancelarEdit.addEventListener("click", cancelarEdicao);

// ===== DELETAR =====
window.deletarCliente = function(idx) {
  var c = clientesCache[idx];
  if (!confirm('Remover o cliente "' + c.nome + '"?')) return;

  fetch(CLIENTES_API + "?id=eq." + c.id, {
    method: "DELETE",
    headers: supabaseHeaders()
  })
  .then(function() {
    showToast("Cliente removido.");
    carregarClientes();
  })
  .catch(function() { showToast("Erro ao remover.", "error"); });
};

// ===== BUSCA =====
searchInput.addEventListener("input", function() {
  renderTabela(searchInput.value.toLowerCase().trim());
});

// ===== EXPORTAR =====
btnExport.addEventListener("click", function() {
  if (clientesCache.length === 0) { showToast("Nenhum cliente.", "error"); return; }
  var linhas = clientesCache.map(function(c, i) {
    return (i+1) + ". " + c.nome + " | " + c.email + " | Senha: " + c.senha + " | Plano: " + c.plano.toUpperCase();
  });
  var texto = "=== CLIENTES GAMEVAULT ===\n\n" + linhas.join("\n");
  navigator.clipboard.writeText(texto)
    .then(function() { showToast("Lista copiada!"); })
    .catch(function() { showToast("Erro ao copiar.", "error"); });
});

// ===== LOADING =====
function mostrarLoading(show) {
  btnSalvar.disabled = show;
  if (show) {
    tabelaBody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:30px;color:#6b6b8a;">Carregando...</td></tr>';
  }
}

// ===== ENVIAR ACESSO =====
window.enviarAcesso = function(idx) {
  var c = clientesCache[idx];
  if (!c) return;
  if (!confirm('Enviar e-mail de acesso para "' + c.nome + '" (' + c.email + ')?')) return;

  var btn = document.querySelectorAll('.btn-send')[idx];
  if (btn) { btn.disabled = true; btn.textContent = 'Enviando...'; }

  fetch("https://fqzgywnxmznghvqlnxjl.supabase.co/functions/v1/enviar-acesso", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxemd5d254bXpuZ2h2cWxueGpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzNTY0NzcsImV4cCI6MjA5MTkzMjQ3N30.Cv8r70nYMoRyk_O3HFwxluOWaSMwVGko-uonxqvyA0Q"
    },
    body: JSON.stringify({ nome: c.nome, email: c.email, senha: c.senha, plano: c.plano })
  })
  .then(function(r) { return r.json(); })
  .then(function(data) {
    if (data.ok) {
      showToast("E-mail enviado para " + c.email + "!");
    } else {
      showToast("Erro: " + (data.error || "Tente novamente."), "error");
    }
  })
  .catch(function() { showToast("Erro ao enviar e-mail.", "error"); })
  .finally(function() {
    if (btn) { btn.disabled = false; btn.textContent = '&#128140; Enviar'; }
  });
};
var toastTimer;
function showToast(msg, tipo) {
  toast.textContent = msg;
  toast.style.background = tipo === "error" ? "#dc2626" : "#1a1a2e";
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function() { toast.classList.remove("show"); }, 3000);
}

// ===== REGISTRAR WEBHOOK PIMPOU =====
document.getElementById("btnRegistrarWebhook").addEventListener("click", function() {
  var btn = document.getElementById("btnRegistrarWebhook");
  var statusEl = document.getElementById("webhookStatus");
  btn.disabled = true;
  btn.textContent = "Registrando...";
  statusEl.textContent = "";

  fetch("https://fqzgywnxmznghvqlnxjl.supabase.co/functions/v1/registrar-webhook", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxemd5d254bXpuZ2h2cWxueGpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzNTY0NzcsImV4cCI6MjA5MTkzMjQ3N30.Cv8r70nYMoRyk_O3HFwxluOWaSMwVGko-uonxqvyA0Q"
    }
  })
  .then(function(r) { return r.json(); })
  .then(function(data) {
    if (data.success) {
      statusEl.textContent = "Webhook registrado com sucesso!";
      statusEl.style.color = "#16a34a";
      showToast("Webhook registrado! Pagamentos serao automatizados.");
    } else {
      statusEl.textContent = data.message || data.error || "Verifique as credenciais.";
      statusEl.style.color = "#dc2626";
      showToast("Erro: " + (data.message || data.error), "error");
    }
  })
  .catch(function(err) {
    statusEl.textContent = "Erro de conexao.";
    statusEl.style.color = "#dc2626";
    showToast("Erro de conexao.", "error");
  })
  .finally(function() {
    btn.disabled = false;
    btn.textContent = "Registrar Webhook Pimpou";
  });
});

function esc(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
