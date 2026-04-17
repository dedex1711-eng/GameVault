// ===== CONFIGURAÇÃO PIX =====
var PIX_CHAVE = "83998929124";
var PIX_NOME  = "GameVault";
var PIX_CIDADE = "Joao Pessoa";
var WHATSAPP   = "5583998929124";

var PLANOS = {
  basic:   { nome: "Plano Basic",   valor: 10.00, label: "R$ 10,00" },
  premium: { nome: "Plano Premium", valor: 15.00, label: "R$ 15,00" }
};

// ===== GERAR PAYLOAD PIX (EMV) =====
function gerarPixPayload(chave, nome, cidade, valor, txid) {
  function campo(id, val) {
    var len = String(val.length).padStart(2, "0");
    return id + len + val;
  }

  function crc16(str) {
    var crc = 0xFFFF;
    for (var i = 0; i < str.length; i++) {
      crc ^= str.charCodeAt(i) << 8;
      for (var j = 0; j < 8; j++) {
        crc = (crc & 0x8000) ? (crc << 1) ^ 0x1021 : crc << 1;
      }
    }
    return ((crc & 0xFFFF).toString(16).toUpperCase()).padStart(4, "0");
  }

  var merchantAccountInfo = campo("00", "BR.GOV.BCB.PIX") + campo("01", chave);
  var valorStr = valor.toFixed(2);
  var nomeClean = nome.normalize("NFD").replace(/[\u0300-\u036f]/g, "").substring(0, 25);
  var cidadeClean = cidade.normalize("NFD").replace(/[\u0300-\u036f]/g, "").substring(0, 15);
  var txidClean = (txid || "***").substring(0, 25);

  var payload =
    campo("00", "01") +
    campo("26", merchantAccountInfo) +
    campo("52", "0000") +
    campo("53", "986") +
    campo("54", valorStr) +
    campo("58", "BR") +
    campo("59", nomeClean) +
    campo("60", cidadeClean) +
    campo("62", campo("05", txidClean)) +
    "6304";

  return payload + crc16(payload);
}

// ===== CRIAR MODAL =====
function criarModal() {
  if (document.getElementById("pixModal")) return;

  var modal = document.createElement("div");
  modal.id = "pixModal";
  modal.innerHTML = [
    '<div class="pix-overlay" id="pixOverlay">',
    '  <div class="pix-modal">',
    '    <button class="pix-close" id="pixClose">&times;</button>',
    '    <div class="pix-header">',
    '      <div class="pix-logo">&#127918; Game<span>Vault</span></div>',
    '      <h2 id="pixPlanNome">Plano Basic</h2>',
    '      <div class="pix-valor" id="pixValor">R$ 10,00</div>',
    '    </div>',
    '    <div class="pix-steps">',
    '      <div class="pix-step active" id="step1">',
    '        <h3>1. Seus dados</h3>',
    '        <div class="pix-form">',
    '          <input type="text" id="pixNome" placeholder="Seu nome completo" />',
    '          <input type="email" id="pixEmail" placeholder="Seu e-mail" />',
    '          <button class="pix-btn" id="btnGerarPix">Gerar QR Code Pix</button>',
    '        </div>',
    '        <div class="pix-form-error" id="pixFormError"></div>',
    '      </div>',
    '      <div class="pix-step" id="step2">',
    '        <h3>2. Pague com Pix</h3>',
    '        <p class="pix-instrucao">Escaneie o QR Code ou copie o codigo abaixo</p>',
    '        <div class="pix-qr" id="pixQR"></div>',
    '        <div class="pix-copia-cola">',
    '          <input type="text" id="pixCodigo" readonly />',
    '          <button class="pix-btn-copy" id="btnCopiar">Copiar</button>',
    '        </div>',
    '        <div class="pix-timer">Aguardando pagamento... <span id="pixTimer">10:00</span></div>',
    '        <button class="pix-btn pix-btn-pago" id="btnPaguei">&#10003; Ja Paguei!</button>',
    '      </div>',
    '    </div>',
    '  </div>',
    '</div>'
  ].join("");

  document.body.appendChild(modal);
  adicionarEstilosModal();
  bindModalEvents();
}

function adicionarEstilosModal() {
  if (document.getElementById("pixStyles")) return;
  var style = document.createElement("style");
  style.id = "pixStyles";
  style.textContent = [
    ".pix-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.75);z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px;}",
    ".pix-modal{background:#fff;border-radius:20px;padding:32px 28px;width:100%;max-width:420px;position:relative;max-height:90vh;overflow-y:auto;}",
    ".pix-close{position:absolute;top:14px;right:18px;background:none;border:none;font-size:1.6rem;cursor:pointer;color:#888;line-height:1;}",
    ".pix-header{text-align:center;margin-bottom:24px;}",
    ".pix-logo{font-family:'Rajdhani',sans-serif;font-size:1.4rem;font-weight:700;color:#1a1a2e;margin-bottom:8px;}",
    ".pix-logo span{color:#7c3aed;}",
    ".pix-header h2{font-size:1.1rem;font-weight:700;color:#1a1a2e;margin-bottom:6px;}",
    ".pix-valor{font-size:2rem;font-weight:700;color:#7c3aed;}",
    ".pix-step{display:none;} .pix-step.active{display:block;}",
    ".pix-step h3{font-size:1rem;font-weight:700;color:#1a1a2e;margin-bottom:16px;text-align:center;}",
    ".pix-form{display:flex;flex-direction:column;gap:12px;}",
    ".pix-form input{border:1px solid #e2e2ec;border-radius:8px;padding:12px 14px;font-size:0.95rem;outline:none;font-family:inherit;}",
    ".pix-form input:focus{border-color:#7c3aed;box-shadow:0 0 0 3px rgba(124,58,237,0.1);}",
    ".pix-btn{background:#7c3aed;color:#fff;border:none;border-radius:8px;padding:13px;font-size:1rem;font-weight:700;cursor:pointer;transition:background 0.2s;}",
    ".pix-btn:hover{background:#6d28d9;}",
    ".pix-form-error{color:#dc2626;font-size:0.85rem;margin-top:8px;text-align:center;}",
    ".pix-instrucao{text-align:center;color:#6b6b8a;font-size:0.88rem;margin-bottom:16px;}",
    ".pix-qr{display:flex;justify-content:center;margin-bottom:16px;}",
    ".pix-qr img{width:200px;height:200px;border:2px solid #e2e2ec;border-radius:12px;padding:8px;}",
    ".pix-copia-cola{display:flex;gap:8px;margin-bottom:16px;}",
    ".pix-copia-cola input{flex:1;border:1px solid #e2e2ec;border-radius:8px;padding:10px 12px;font-size:0.75rem;color:#6b6b8a;outline:none;background:#f8f8fc;}",
    ".pix-btn-copy{background:#e2e2ec;color:#1a1a2e;border:none;border-radius:8px;padding:10px 14px;font-size:0.82rem;font-weight:700;cursor:pointer;white-space:nowrap;transition:background 0.2s;}",
    ".pix-btn-copy:hover{background:#d0d0e0;}",
    ".pix-timer{text-align:center;color:#6b6b8a;font-size:0.85rem;margin-bottom:16px;}",
    ".pix-timer span{font-weight:700;color:#dc2626;}",
    ".pix-btn-pago{width:100%;background:#16a34a;margin-top:4px;}",
    ".pix-btn-pago:hover{background:#15803d;}"
  ].join("");
  document.head.appendChild(style);
}

var timerInterval = null;
var planoAtual = "basic";
var nomeCliente = "";
var emailCliente = "";

function bindModalEvents() {
  document.getElementById("pixClose").addEventListener("click", fecharModal);
  document.getElementById("pixOverlay").addEventListener("click", function(e) {
    if (e.target === this) fecharModal();
  });

  document.getElementById("btnGerarPix").addEventListener("click", function() {
    nomeCliente  = document.getElementById("pixNome").value.trim();
    emailCliente = document.getElementById("pixEmail").value.trim();
    var errEl = document.getElementById("pixFormError");

    if (!nomeCliente || !emailCliente) {
      errEl.textContent = "Preencha seu nome e e-mail.";
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailCliente)) {
      errEl.textContent = "E-mail invalido.";
      return;
    }
    errEl.textContent = "";
    mostrarQR();
  });

  document.getElementById("btnCopiar").addEventListener("click", function() {
    var codigo = document.getElementById("pixCodigo").value;
    navigator.clipboard.writeText(codigo).then(function() {
      document.getElementById("btnCopiar").textContent = "Copiado!";
      setTimeout(function() { document.getElementById("btnCopiar").textContent = "Copiar"; }, 2000);
    });
  });

  document.getElementById("btnPaguei").addEventListener("click", function() {
    fecharModal();
    var plano = PLANOS[planoAtual];
    var msg = encodeURIComponent(
      "Ola! Acabei de pagar o " + plano.nome + " (" + plano.label + ") pelo Pix.\n" +
      "Nome: " + nomeCliente + "\n" +
      "E-mail: " + emailCliente + "\n\n" +
      "Aguardo a liberacao do meu acesso!"
    );
    window.open("https://wa.me/" + WHATSAPP + "?text=" + msg, "_blank");
  });
}

function mostrarQR() {
  var plano = PLANOS[planoAtual];
  var txid = "GV" + Date.now().toString().slice(-10);
  var payload = gerarPixPayload(PIX_CHAVE, PIX_NOME, PIX_CIDADE, plano.valor, txid);

  // QR Code via API gratuita
  var qrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" + encodeURIComponent(payload);

  document.getElementById("pixQR").innerHTML = '<img src="' + qrUrl + '" alt="QR Code Pix" />';
  document.getElementById("pixCodigo").value = payload;

  // Troca step
  document.getElementById("step1").classList.remove("active");
  document.getElementById("step2").classList.add("active");

  // Timer 10 minutos
  iniciarTimer(600);
}

function iniciarTimer(segundos) {
  clearInterval(timerInterval);
  var restante = segundos;
  function atualizar() {
    var m = Math.floor(restante / 60);
    var s = restante % 60;
    var el = document.getElementById("pixTimer");
    if (el) el.textContent = String(m).padStart(2,"0") + ":" + String(s).padStart(2,"0");
    if (restante <= 0) {
      clearInterval(timerInterval);
      if (el) el.textContent = "Expirado";
    }
    restante--;
  }
  atualizar();
  timerInterval = setInterval(atualizar, 1000);
}

function fecharModal() {
  clearInterval(timerInterval);
  var overlay = document.getElementById("pixOverlay");
  if (overlay) overlay.style.display = "none";
}

// ===== ABRIR MODAL =====
window.abrirCheckout = function(plano) {
  planoAtual = plano;
  criarModal();

  var p = PLANOS[plano];
  document.getElementById("pixPlanNome").textContent = p.nome;
  document.getElementById("pixValor").textContent = p.label;
  document.getElementById("pixNome").value = "";
  document.getElementById("pixEmail").value = "";
  document.getElementById("pixFormError").textContent = "";
  document.getElementById("step1").classList.add("active");
  document.getElementById("step2").classList.remove("active");
  document.getElementById("pixOverlay").style.display = "flex";
};
