// =====================================================
// SENHA DO ADMIN — troque para uma senha sua!
// =====================================================
const SENHA_ADMIN = "admin123";

// =====================================================
// Os clientes ficam salvos no localStorage do navegador
// Assim não precisa de servidor nem banco de dados
// =====================================================

// ===== ELEMENTOS =====
const adminLogin     = document.getElementById("adminLogin");
const adminPanel     = document.getElementById("adminPanel");
const adminSenha     = document.getElementById("adminSenha");
const btnAdminLogin  = document.getElementById("btnAdminLogin");
const adminError     = document.getElementById("adminError");
const btnSairAdmin   = document.getElementById("btnSairAdmin");

const clienteForm    = document.getElementById("clienteForm");
const formTitle      = document.getElementById("formTitle");
const editIndexInput = document.getElementById("editIndex");
const fNome          = document.getElementById("fNome");
const fEmail         = document.getElementById("fEmail");
const fSenha         = document.getElementById("fSenha");
const fPlano         = document.getElementById("fPlano");
const btnSalvar      = document.getElementById("btnSalvar");
const btnCancelarEdit= document.getElementById("btnCancelarEdit");

const tabelaBody     = document.getElementById("tabelaBody");
const totalClientes  = document.getElementById("totalClientes");
const listaVazia     = document.getElementById("listaVazia");
const searchInput    = document.getElementById("searchInput");
const btnExport      = document.getElementById("btnExport");
const toast          = document.getElementById("toast");

// ===== AUTH ADMIN =====
// Verifica se já está logado
if (sessionStorage.getItem("gv_admin") === "ok") {
  mostrarPainel();
}

btnAdminLogin.addEventListener("click", fazerLogin);
adminSenha.addEventListener("keydown", e => { if (e.key === "Enter") fazerLogin(); });

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
  renderTabela();
}

btnSairAdmin.addEventListener("click", () => {
  sessionStorage.removeItem("gv_admin");
  location.reload();
});

// ===== STORAGE =====
function getClientes() {
  return JSON.parse(localStorage.getItem("gv_clientes") || "[]");
}

function salvarClientes(lista) {
  localStorage.setItem("gv_clientes", JSON.stringify(lista));
  // Atualiza também o arquivo usuarios.js em memória (para o portal.js usar)
  gerarUsuariosJS(lista);
}

// Gera o conteúdo do usuarios.js e salva no localStorage
// O portal.js lê direto do localStorage
function gerarUsuariosJS(lista) {
  localStorage.setItem("gv_usuarios_json", JSON.stringify(lista));
}

// ===== FORMULÁRIO =====
clienteForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const nome  = fNome.value.trim();
  const email = fEmail.value.trim().toLowerCase();
  const senha = fSenha.value.trim();
  const plano = fPlano.value;
  const idx   = parseInt(editIndexInput.value);

  if (!nome || !email || !senha) return;

  const clientes = getClientes();

  // Verifica e-mail duplicado (exceto na edição do mesmo)
  const duplicado = clientes.findIndex(c => c.email === email);
  if (duplicado !== -1 && duplicado !== idx) {
    showToast("⚠️ Esse e-mail já está cadastrado!", "error");
    return;
  }

  if (idx === -1) {
    // Novo cliente
    clientes.push({ nome, email, senha, plano });
    showToast("✅ Cliente cadastrado com sucesso!");
  } else {
    // Editar
    clientes[idx] = { nome, email, senha, plano };
    showToast("✏️ Cliente atualizado!");
    cancelarEdicao();
  }

  salvarClientes(clientes);
  clienteForm.reset();
  editIndexInput.value = -1;
  renderTabela();
});

// ===== TABELA =====
function renderTabela(filtro = "") {
  const clientes = getClientes();
  const filtrados = filtro
    ? clientes.filter(c =>
        c.nome.toLowerCase().includes(filtro) ||
        c.email.toLowerCase().includes(filtro)
      )
    : clientes;

  tabelaBody.innerHTML = "";

  if (clientes.length === 0) {
    listaVazia.style.display = "block";
    document.getElementById("tabelaClientes").style.display = "none";
  } else {
    listaVazia.style.display = "none";
    document.getElementById("tabelaClientes").style.display = "table";
  }

  filtrados.forEach((c, i) => {
    const realIdx = clientes.indexOf(c);
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="td-num">${realIdx + 1}</td>
      <td class="td-nome">${escHtml(c.nome)}</td>
      <td class="td-email">${escHtml(c.email)}</td>
      <td><span class="td-senha">${escHtml(c.senha)}</span></td>
      <td>
        <span class="badge-plano ${c.plano === 'premium' ? 'badge-premium' : 'badge-basic'}">
          ${c.plano.toUpperCase()}
        </span>
      </td>
      <td>
        <div class="td-acoes">
          <button class="btn-edit" onclick="editarCliente(${realIdx})">✏️ Editar</button>
          <button class="btn-del"  onclick="deletarCliente(${realIdx})">🗑️ Remover</button>
        </div>
      </td>
    `;
    tabelaBody.appendChild(tr);
  });

  const total = clientes.length;
  totalClientes.textContent = `${total} cliente${total !== 1 ? "s" : ""} cadastrado${total !== 1 ? "s" : ""}`;
}

// ===== EDITAR =====
window.editarCliente = function(idx) {
  const clientes = getClientes();
  const c = clientes[idx];
  if (!c) return;

  fNome.value  = c.nome;
  fEmail.value = c.email;
  fSenha.value = c.senha;
  fPlano.value = c.plano;
  editIndexInput.value = idx;

  formTitle.textContent = "✏️ Editando Cliente";
  btnSalvar.textContent = "💾 Atualizar Cliente";
  btnCancelarEdit.style.display = "inline-block";

  // Scroll para o formulário
  clienteForm.scrollIntoView({ behavior: "smooth", block: "start" });
  fNome.focus();
};

function cancelarEdicao() {
  formTitle.textContent = "➕ Cadastrar Novo Cliente";
  btnSalvar.textContent = "✅ Salvar Cliente";
  btnCancelarEdit.style.display = "none";
  editIndexInput.value = -1;
  clienteForm.reset();
}

btnCancelarEdit.addEventListener("click", cancelarEdicao);

// ===== DELETAR =====
window.deletarCliente = function(idx) {
  const clientes = getClientes();
  const c = clientes[idx];
  if (!confirm(`Remover o cliente "${c.nome}"?\nEssa ação não pode ser desfeita.`)) return;
  clientes.splice(idx, 1);
  salvarClientes(clientes);
  renderTabela(searchInput.value.toLowerCase());
  showToast("🗑️ Cliente removido.");
};

// ===== BUSCA =====
searchInput.addEventListener("input", () => {
  renderTabela(searchInput.value.toLowerCase().trim());
});

// ===== EXPORTAR =====
btnExport.addEventListener("click", () => {
  const clientes = getClientes();
  if (clientes.length === 0) {
    showToast("Nenhum cliente para exportar.", "error");
    return;
  }

  const linhas = clientes.map((c, i) =>
    `${i + 1}. ${c.nome} | ${c.email} | Senha: ${c.senha} | Plano: ${c.plano.toUpperCase()}`
  );

  const texto = "=== CLIENTES GAMEVAULT ===\n\n" + linhas.join("\n");

  navigator.clipboard.writeText(texto).then(() => {
    showToast("📋 Lista copiada para a área de transferência!");
  }).catch(() => {
    // Fallback
    const el = document.createElement("textarea");
    el.value = texto;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    showToast("📋 Lista copiada!");
  });
});

// ===== TOAST =====
let toastTimer;
function showToast(msg, tipo = "success") {
  toast.textContent = msg;
  toast.style.background = tipo === "error" ? "#dc2626" : "#1a1a2e";
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3000);
}

// ===== UTILS =====
function escHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
