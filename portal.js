// ===== VERIFICAR SESSÃO =====
var sessao = sessionStorage.getItem("gv_user");
if (!sessao) {
  window.location.href = "login.html";
}

var usuario = JSON.parse(sessao);
var userPlano = usuario.plano || "basic";

// ===== DADOS DAS PÁGINAS =====
var PAGES = {
  pc: {
    title: "Instalação PC",
    icon: "🖥️",
    banner: { type: "green", icon: "🏆", text: "PC / Notebook roda até PS3, Xbox 360 e Nintendo Switch. <strong>Melhor opção para máxima compatibilidade!</strong>" },
    videos: [
      { label: "VÍDEO 1", title: "Conteúdo 1", desc: "Assista ao tutorial detalhado para completar sua configuração com sucesso.", url: "https://www.youtube.com/watch?v=BpRlqnSLIc0", thumb: "🖥️" }
    ],
    downloads: [
      { name: "Instalação PC – Pacote Completo", url: "https://drive.google.com/file/d/1mqsZGCleAMUQAC01XLI0kuZJRpFVc1DX/view?usp=sharing" },
      { name: "Relíquia Flix – Pack Turbinado: (esse é o melhor para pc/not)", url: "https://uploadnow.io/pt/share?utm_medium=bf5697b2-8845-4d36-ab7b-012d46b54a51" },
      { name: "Opção do sistema leve", url: "https://drive.google.com/file/d/109UvzaHgQixZzTGlQgwD_EE5r0VaAg40/view?usp=sharing" }
    ]
  },
  celular: {
    title: "Instalação Celular",
    icon: "📱",
    banner: { type: "purple", icon: "📱", text: "Celular roda jogos até o PS2, no máximo. Compatível com Retro, PS1 e PS2." },
    videos: [
      { label: "VÍDEO 1", title: "Conteúdo 1", desc: "Assista ao tutorial detalhado para completar sua configuração com sucesso.", url: "https://www.youtube.com/watch?v=mEtYnawrHm8", thumb: "📱" }
    ],
    downloads: [
      { name: "Instalação no Celular Android", url: "https://docs.google.com/document/d/12pmj6-ynQoYJO8P6MPak4kUfjjxN0M_TJZRb7O9Wxxo/edit?usp=sharing" },
      { name: "Como Jogar PS2 no Celular – Guia Definitivo + Novo Tutorial Completo", url: "https://www.youtube.com/watch?v=mEtYnawrHm8" },
      { name: "Jogue PS1 no Seu Celular com Duckstation Android – Guia Completo!", url: "https://www.youtube.com/watch?v=rgVAfHFv9hk" }
    ]
  },
  tvbox: {
    title: "Instalação TV Box",
    icon: "📦",
    banner: { type: "purple", icon: "📦", text: "TV Box roda no máximo até PS1. Ideal para jogos Retro e PS1." },
    videos: [
      { label: "VÍDEO 1", title: "Conteúdo 1", desc: "Assista ao tutorial detalhado para completar sua configuração com sucesso.", url: "https://www.youtube.com/watch?v=-pdp9RqGVeE", thumb: "📦" }
    ],
    downloads: [
      { name: "Instalação TV Box", url: "https://onedrive.live.com/?redeem=aHR0cHM6Ly8xZHJ2Lm1zL2YvYy9lNDVkYTA4YWU1NzJmNzIyL0VpTDNjdVdLb0YwZ2dPUXBOZ0FBQUFBQmwyTDFYR3R3TUhSRDc4RkRkRDhVcGc&id=E45DA08AE572F722%2113865&cid=E45DA08AE572F722" },
      { name: "Instalação TV Box – Sem Pen Drive", url: "https://www.youtube.com/watch?v=-pdp9RqGVeE" }
    ]
  },
  tvandroid: {
    title: "Instalação TV Android",
    icon: "📺",
    banner: { type: "orange", icon: "📺", text: "Smart TV Android roda somente jogos Retro. Indicado apenas para jogos clássicos." },
    videos: [
      { label: "VÍDEO 1", title: "Conteúdo 1", desc: "Assista ao tutorial detalhado para completar sua configuração com sucesso.", url: "https://www.youtube.com/watch?v=BpRlqnSLIc0", thumb: "📺" }
    ],
    downloads: [
      { name: "Instalação PC – Pacote Completo", url: "https://drive.google.com/file/d/1mqsZGCleAMUQAC01XLI0kuZJRpFVc1DX/view?usp=sharing" },
      { name: "Relíquia Flix – Pack Turbinado: (esse é o melhor para pc/not)", url: "https://uploadnow.io/pt/share?utm_medium=bf5697b2-8845-4d36-ab7b-012d46b54a51" },
      { name: "Opção do sistema leve", url: "https://drive.google.com/file/d/109UvzaHgQixZzTGlQgwD_EE5r0VaAg40/view?usp=sharing" }
    ]
  },
  ps3: {
    title: "Instalação PS3",
    icon: "🎮",
    banner: { type: "purple", icon: "🎮", text: "Conteúdo exclusivo para membros <strong>Premium</strong>. Instale jogos diretamente no seu PS3." },
    videos: [
      { label: "VÍDEO 1", title: "Conteúdo 1", desc: "Assista ao tutorial detalhado para completar sua configuração com sucesso.", url: "https://www.youtube.com/watch?v=2Mub-v210Kg", thumb: "🎮" }
    ],
    downloads: [
      { name: "Instalação PS3 – Guia Completo", url: "https://drive.google.com/file/d/1yFY26TcBvNYAFeJBLAa917XHvwdT_JXY/view?usp=sharing" },
      { name: "INSTALANDO O HEN 4.91 - SEM PENDRIVE - DIRETO NO PS3. (DESBLOQUEIO PS3)", url: "https://www.youtube.com/watch?v=2Mub-v210Kg" },
      { name: "COMO INSTALAR LOJAS ATUALIZADAS NO PLAYSTATION 3 HEN 4.91 | NOVO MÉTODO 2025", url: "https://www.youtube.com/watch?v=rjjEqG83UTA" }
    ]
  },
  projetor: {
    title: "Instalação Projetor",
    icon: "📽️",
    banner: { type: "purple", icon: "📽️", text: "Projetor roda somente jogos Retro. Indicado para experiências simples e clássicas." },
    videos: [
      { label: "VÍDEO 1", title: "Conteúdo 1", desc: "Assista ao tutorial detalhado para completar sua configuração com sucesso.", url: "https://www.youtube.com/watch?v=yoxXys0wqmce", thumb: "📽️" }
    ],
    downloads: [
      { name: "Instalação Projetor", url: "https://onedrive.live.com/?redeem=aHR0cHM6Ly8xZHJ2Lm1zL2YvcyFBaUwzY3VXS29GM2s0bkpZUFlBTUFmNk5kNXZL&id=E45DA08AE572F722%2112658&cid=E45DA08AE572F722" }
    ]
  },
  ps4: {
    title: "Instalação PS4",
    icon: "🎮",
    banner: { type: "purple", icon: "🎮", text: "Conteúdo <strong>COMPLETO</strong> para membros Premium. Versão de R$ 15 vem completa com PS4!" },
    videos: [
      { label: "VÍDEO 1", title: "Desbloqueio PS4", desc: "Tutorial completo para desbloquear e instalar jogos no PS4.", url: "https://www.youtube.com/watch?v=jeLBVHTDyEs", thumb: "🎮" },
      { label: "VÍDEO 2", title: "Instalação de Jogos", desc: "Como instalar e gerenciar jogos no PS4 desbloqueado.", url: "https://www.youtube.com/watch?v=hjk4nS-2Vdw", thumb: "🎮" }
    ],
    downloads: [
      { name: "Shadps4 Download", url: "https://shadps4.net/downloads/" },
      { name: "Pacote de Jogos PS4", url: "https://romsfun.com/roms/playstation-4/" }
    ]
  },
  ps5: {
    title: "Instalação PS5",
    icon: "🎮",
    banner: { type: "gold", icon: "🎮", text: "Conteúdo <strong>EXCLUSIVO</strong> para membros Premium. PS5 só aparece para contas premium!" },
    videos: [
      { label: "VÍDEO 1", title: "Desbloqueio PS5", desc: "Tutorial exclusivo para desbloquear o PS5 - método mais recente.", url: "https://www.youtube.com/watch?v=EPKKk_w-3iU", thumb: "🎮" }
    ],
    downloads: [
      { name: "Pcsx5 - Versão Exclusiva", url: "https://pcsx5.org" },
      { name: "Download Jogos PS5", url: "https://romslab.com/category/playstation-5/" }
    ]
  },
  suporte: { title: "Suporte", icon: "🛟", type: "support" }
};

// ===== INICIALIZAR =====
var authGuard         = document.getElementById("authGuard");
var portalApp         = document.getElementById("portalApp");
var btnLogout         = document.getElementById("btnLogout");
var menuToggle        = document.getElementById("menuToggle");
var sidebar           = document.getElementById("sidebar");
var overlay           = document.getElementById("sidebarOverlay");
var pageContent       = document.getElementById("pageContent");
var userNameEl        = document.getElementById("userName");
var userPlanEl        = document.getElementById("userPlan");
var userAvatarEl      = document.getElementById("userAvatar");
var userAvatarSmallEl = document.getElementById("userAvatarSmall");

// Mostra o portal
authGuard.style.display = "none";
portalApp.style.display = "flex";

// Preenche dados do usuário
var firstName = usuario.nome ? usuario.nome.split(" ")[0] : usuario.email.split("@")[0];
var initial   = firstName[0].toUpperCase();

userNameEl.textContent        = firstName;
userPlanEl.textContent        = "MEMBRO " + userPlano.toUpperCase();
userAvatarEl.textContent      = initial;
userAvatarSmallEl.textContent = initial;

// Desbloqueia conteúdo premium baseado no plano
var navPs3 = document.getElementById("navPs3");
var navPs4 = document.getElementById("navPs4");
var navPs5 = document.getElementById("navPs5");

if (userPlano === "premium") {
  // Premium tem acesso a tudo: PS3, PS4 e PS5
  if (navPs3) { navPs3.classList.add("unlocked"); navPs3.classList.remove("nav-item-premium"); navPs3.style.display = "flex"; }
  if (navPs4) { navPs4.classList.add("unlocked"); navPs4.classList.remove("nav-item-premium"); navPs4.style.display = "flex"; }
  if (navPs5) { navPs5.classList.add("unlocked"); navPs5.classList.remove("nav-item-premium"); navPs5.style.display = "flex"; }
} else {
  // Basic não tem acesso a PS3, PS4 nem PS5
  if (navPs3) navPs3.style.display = "none";
  if (navPs4) navPs4.style.display = "none";
  if (navPs5) navPs5.style.display = "none";
}

// Renderiza página inicial
renderPage("pc");

// ===== NAVEGAÇÃO =====
var navItems = document.querySelectorAll(".nav-item[data-page]");
for (var n = 0; n < navItems.length; n++) {
  navItems[n].addEventListener("click", function(e) {
    e.preventDefault();
    var page = this.getAttribute("data-page");
    
    // Controle de acesso para conteúdo premium
    if ((page === "ps3" || page === "ps4" || page === "ps5") && userPlano !== "premium") {
      return;
    }
    
    renderPage(page);
    closeSidebar();
  });
}

function renderPage(pageKey) {
  // Atualiza nav ativo
  var items = document.querySelectorAll(".nav-item");
  for (var i = 0; i < items.length; i++) items[i].classList.remove("active");
  var activeNav = document.querySelector(".nav-item[data-page='" + pageKey + "']");
  if (activeNav) activeNav.classList.add("active");

  var data = PAGES[pageKey];
  if (!data) return;

  if (data.type === "support") {
    pageContent.innerHTML = renderSupport();
    return;
  }

  pageContent.innerHTML = renderInstallPage(data);
}

function renderInstallPage(data) {
  var bannerHtml = "";
  if (data.banner) {
    bannerHtml = '<div class="info-banner ' + data.banner.type + '">' +
      '<span>' + data.banner.icon + '</span>' +
      '<span>' + data.banner.text + '</span>' +
      '</div>';
  }

  var videosHtml = "";
  for (var i = 0; i < data.videos.length; i++) {
    var v = data.videos[i];
    videosHtml += '<div class="video-card">' +
      '<div class="video-info">' +
        '<div class="video-label">' + v.label + '</div>' +
        '<h3 class="video-title">' + v.title + '</h3>' +
        '<p class="video-desc">' + v.desc + '</p>' +
        '<a href="' + v.url + '" target="_blank" rel="noopener noreferrer" class="btn-watch">▶ ASSISTIR TUTORIAL →</a>' +
      '</div>' +
      '<div class="video-thumb">' + v.thumb + '</div>' +
    '</div>';
  }

  var downloadsHtml = "";
  for (var j = 0; j < data.downloads.length; j++) {
    var d = data.downloads[j];
    downloadsHtml += '<div class="download-card">' +
      '<div class="download-info">' +
        '<div class="download-label">LINK ' + (j + 1) + '</div>' +
        '<div class="download-name">' + d.name + '</div>' +
      '</div>' +
      '<a href="' + d.url + '" target="_blank" rel="noopener noreferrer" class="btn-download">⬇ BAIXAR</a>' +
    '</div>';
  }

  return '<div class="page-header">' +
      '<div class="page-header-bar"></div>' +
      '<h1 class="page-title">' + data.icon + ' ' + data.title + '</h1>' +
    '</div>' +
    bannerHtml +
    '<div class="content-section">' +
      '<div class="section-header">' +
        '<div class="section-title"><span class="section-title-icon">▶</span> CONTEÚDOS DE APOIO</div>' +
        '<div class="verified-badge">✅ VERIFICADO</div>' +
      '</div>' +
      videosHtml +
    '</div>' +
    '<div class="content-section">' +
      '<div class="section-header">' +
        '<div class="section-title"><span class="section-title-icon">≡</span> DOWNLOADS</div>' +
      '</div>' +
      '<div class="downloads-list">' + downloadsHtml + '</div>' +
    '</div>';
}

function renderSupport() {
  return '<div class="page-header">' +
      '<div class="page-header-bar"></div>' +
      '<h1 class="page-title">🛟 Suporte</h1>' +
    '</div>' +
    '<div class="support-grid">' +
      '<div class="support-card">' +
        '<div class="support-icon">💬</div>' +
        '<h3>WhatsApp</h3>' +
        '<p>Fale diretamente com nossa equipe de suporte pelo WhatsApp. Respondemos rapidamente!</p>' +
        '<a href="https://wa.me/5583998929124" target="_blank" rel="noopener noreferrer" class="btn-support">📲 Abrir WhatsApp</a>' +
      '</div>' +
      '<div class="support-card">' +
        '<div class="support-icon">📖</div>' +
        '<h3>Tutoriais em Vídeo</h3>' +
        '<p>Acesse os tutoriais de instalação para cada dispositivo no menu lateral.</p>' +
        '<button class="btn-support" style="background:#7c3aed;border:none;cursor:pointer;" onclick="renderPage(\'pc\')">🎬 Ver Tutoriais</button>' +
      '</div>' +
      '<div class="support-card">' +
        '<div class="support-icon">❓</div>' +
        '<h3>Dúvidas Frequentes</h3>' +
        '<p>Consulte as perguntas mais comuns sobre instalação e uso do sistema.</p>' +
        '<a href="index.html#faq" target="_blank" class="btn-support" style="background:#0ea5e9;">📋 Ver FAQ</a>' +
      '</div>' +
    '</div>';
}

// ===== LOGOUT =====
btnLogout.addEventListener("click", function() {
  sessionStorage.removeItem("gv_user");
  window.location.href = "login.html";
});

// ===== MOBILE SIDEBAR =====
menuToggle.addEventListener("click", function() {
  sidebar.classList.toggle("open");
  overlay.classList.toggle("open");
});

overlay.addEventListener("click", closeSidebar);

function closeSidebar() {
  sidebar.classList.remove("open");
  overlay.classList.remove("open");
}
