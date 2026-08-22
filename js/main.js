// ════════════════════════════════════════════════
//  EDITA TUS CANCIONES AQUÍ ↓ URL de YouTube o mp3
// ════════════════════════════════════════════════
const CANCIONES = [
  { titulo: "Hollow Memory", artista: "9JackJack8", tag: "dreamcore", url: "https://cdn.pixabay.com/download/audio/2026/08/11/audio_ad420da63d.mp3?filename=9jackjack8-hollow-memory-nostalgic-dreamcore-beat-584029.mp3" },
  { titulo: "Loft", artista: "9JackJack8", tag: "ethereal", url: "https://cdn.pixabay.com/download/audio/2026/06/08/audio_394eae53a8.mp3?filename=9jackjack8-loft-dreamcore-ethereal-548568.mp3" },
  { titulo: "Room After Room", artista: "9JackJack8", tag: "liminal", url: "https://cdn.pixabay.com/download/audio/2026/07/07/audio_52695ffae9.mp3?filename=9jackjack8-room-after-room-dreamcore-563636.mp3" },
  { titulo: "Floating Corridor", artista: "9JackJack8", tag: "ambient", url: "https://cdn.pixabay.com/download/audio/2026/08/19/audio_c258261645.mp3?filename=9jackjack8-floating-corridor-ambient-liminal-cloady-588376.mp3" },
  { titulo: "Weightless Lullaby", artista: "9JackJack8", tag: "espacio", url: "https://cdn.pixabay.com/download/audio/2026/08/07/audio_e59600edbd.mp3?filename=9jackjack8-weightless-lullaby-space-ambient-581563.mp3" },
  { titulo: "Broken Ride", artista: "9JackJack8", tag: "onírico", url: "https://cdn.pixabay.com/download/audio/2026/08/03/audio_d9d3bc3318.mp3?filename=9jackjack8-broken-ride-unsettling-dreamcore-579621.mp3" },
  { titulo: "Dreamwave", artista: "9JackJack8", tag: "sueño", url: "https://cdn.pixabay.com/download/audio/2026/07/16/audio_2dc86ee310.mp3?filename=9jackjack8-dreamwave-568690.mp3" },
  { titulo: "Dreamy Glass", artista: "9JackJack8", tag: "aerowave", url: "https://cdn.pixabay.com/download/audio/2026/07/01/audio_bb42725807.mp3?filename=9jackjack8-dreamy-glass-aerowave-556871.mp3" },
];

const esTactil = window.matchMedia("(pointer: coarse)").matches;
/* se consulta en vivo: respeta el sistema y el interruptor del panel ⚙ */
function sinAnimacion() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
  return document.documentElement.dataset.sinAnimaciones === "1";
}

function toast(mensaje) {
  const contenedor = document.getElementById("toasts");
  if (!contenedor) return;
  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = mensaje;
  contenedor.appendChild(t);
  setTimeout(() => t.remove(), 2800);
}

document.querySelectorAll("[data-year]").forEach((el) => {
  el.textContent = new Date().getFullYear();
});

let visitas = 0;
try {
  visitas = parseInt(localStorage.getItem("visitas") || "0", 10) + 1;
  localStorage.setItem("visitas", String(visitas));
} catch {}
const numVisitas = document.getElementById("num-visitas");
if (numVisitas) numVisitas.textContent = visitas.toLocaleString("es");

const barraScroll = document.getElementById("barra-scroll");

if (barraScroll) {
  addEventListener(
    "scroll",
    () => {
      const h = document.documentElement;
      const total = h.scrollHeight - h.clientHeight;
      barraScroll.style.width = (total > 0 ? (h.scrollTop / total) * 100 : 0) + "%";
    },
    { passive: true }
  );
}

let temaGuardado = "";
try {
  temaGuardado = localStorage.getItem("tema") || "";
} catch {}
if (temaGuardado) document.documentElement.dataset.tema = temaGuardado;

/* el ambiente del tema guardado vuelve con la página */
addEventListener("load", () => aplicarEfectoTema(temaGuardado));

/* tema eclipse: solo aparece si encontraste el secreto */
let hayTemaSecreto = false;
try {
  hayTemaSecreto = localStorage.getItem("tema-secreto") === "1";
} catch {}
if (hayTemaSecreto) {
  document.querySelectorAll(".temas").forEach((grupo) => {
    if (grupo.querySelector('[data-tema="eclipse"]')) return;
    const btnEclipse = document.createElement("button");
    btnEclipse.type = "button";
    btnEclipse.className = "tema";
    btnEclipse.dataset.tema = "eclipse";
    btnEclipse.style.setProperty("--c", "#c9a3ff");
    btnEclipse.title = "Eclipse ✦ exclusivo";
    btnEclipse.setAttribute("aria-label", "Tema eclipse");
    grupo.appendChild(btnEclipse);
  });
}

document.querySelectorAll(".tema").forEach((btn) => {
  if ((document.documentElement.dataset.tema || "") === btn.dataset.tema) {
    document.querySelectorAll(".tema").forEach((b) => b.classList.toggle("activo", b === btn));
  }

  btn.addEventListener("click", () => {
    const t = btn.dataset.tema;
    if (t) document.documentElement.dataset.tema = t;
    else delete document.documentElement.dataset.tema;

    try {
      localStorage.setItem("tema", t);
    } catch {}

    document.querySelectorAll(".tema").forEach((b) => b.classList.toggle("activo", b === btn));
    aplicarEfectoTema(t);
    toast(t ? `✦ Tema ${t} activado` : "✦ Tema oro activado");
  });
});

/* ── Personalización: modo noche/día + fondo propio ── */
function aplicarFondo(url) {
  let capa = document.getElementById("fondo-personalizado");
  if (!url) {
    if (capa) capa.remove();
    return;
  }
  if (!capa) {
    capa = document.createElement("div");
    capa.id = "fondo-personalizado";
    document.body.appendChild(capa);
  }
  capa.style.backgroundImage =
    'linear-gradient(rgba(8,6,16,.72), rgba(8,6,16,.86)), url("' + url.replace(/"/g, "%22") + '")';
}

let modoGuardado = "";
let fondoGuardado = "";
let eventoGuardado = "";
try {
  modoGuardado = localStorage.getItem("modo") || "";
  fondoGuardado = localStorage.getItem("fondo-url") || "";
  eventoGuardado = localStorage.getItem("evento") || "";
} catch {}
if (modoGuardado === "claro") document.documentElement.dataset.modo = "claro";
if (fondoGuardado && /^(https?:|data:image)/i.test(fondoGuardado)) aplicarFondo(fondoGuardado);
if (["eclipse", "fugaces", "aurora"].includes(eventoGuardado)) {
  document.documentElement.dataset.evento = eventoGuardado;
}

/* ── Preferencias del panel ⚙ (todo se guarda en localStorage) ── */
const CLAVES_PREFS = [
  "color-principal",
  "intensidad",
  "ver-reproductor",
  "autoplay",
  "volumen",
  "aleatorio",
  "repetir",
  "sin-animaciones",
  "sin-efectos",
  "texto",
  "estilo",
  "compacto",
];
const PREFS = {};
CLAVES_PREFS.forEach((k) => {
  try {
    PREFS[k] = localStorage.getItem(k) || "";
  } catch {}
});

const COLOR_BASE = "#e9c46a";

function aplicarColorPrincipal(hex) {
  if (!/^#[0-9a-fA-F]{6}$/.test(hex)) return;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const raiz = document.documentElement.style;
  raiz.setProperty("--accent", hex);
  raiz.setProperty("--borde", "rgba(" + r + ", " + g + ", " + b + ", 0.25)");
  raiz.setProperty("--glow", "rgba(" + r + ", " + g + ", " + b + ", 0.35)");
}

function aplicarPref(k) {
  const raiz = document.documentElement;
  const v = PREFS[k];
  if (k === "sin-animaciones") {
    if (v === "1") raiz.dataset.sinAnimaciones = "1";
    else delete raiz.dataset.sinAnimaciones;
  } else if (k === "sin-efectos") {
    if (v === "1") raiz.dataset.sinEfectos = "1";
    else delete raiz.dataset.sinEfectos;
  } else if (k === "intensidad") {
    if (v) raiz.dataset.intensidad = v;
    else delete raiz.dataset.intensidad;
  } else if (k === "texto") {
    if (v) raiz.dataset.texto = v;
    else delete raiz.dataset.texto;
  } else if (k === "estilo") {
    if (v) raiz.dataset.estilo = v;
    else delete raiz.dataset.estilo;
  } else if (k === "compacto") {
    if (v === "1") raiz.dataset.compacto = "1";
    else delete raiz.dataset.compacto;
  } else if (k === "ver-reproductor") {
    const fab = document.getElementById("fab-musica");
    if (fab) fab.classList.toggle("oculto", v === "0");
  } else if (k === "color-principal") {
    if (/^#[0-9a-fA-F]{6}$/.test(v)) {
      aplicarColorPrincipal(v);
      delete raiz.dataset.tema; /* el color propio le gana al tema */
    }
  }
  document.dispatchEvent(new CustomEvent("prefs-cambio", { detail: k }));
}
CLAVES_PREFS.forEach(aplicarPref);

(function initPersonalizacion() {
  const nav = document.querySelector(".nav");
  if (!nav || document.getElementById("btn-settings")) return;

  const btnSettings = document.createElement("button");
  btnSettings.id = "btn-settings";
  btnSettings.type = "button";
  btnSettings.className = "btn-settings";
  btnSettings.title = "Personalizar";
  btnSettings.textContent = "⚙";
  nav.appendChild(btnSettings);

  const panel = document.createElement("div");
  panel.id = "panel-settings";
  panel.hidden = true;
  panel.innerHTML =
    "<header><b>⚙️ Configuración</b>" +
    '<button id="cerrar-settings" type="button" title="Cerrar">×</button></header>' +

    /* ── 🎨 Apariencia ── */
    '<span class="ps-titulo">🎨 Apariencia</span>' +
    '<span class="ps-etiqueta">Tema</span>' +
    '<div class="ps-fila">' +
    '<button type="button" class="ps-op modo-op" data-modo="">🌙 Oscuro</button>' +
    '<button type="button" class="ps-op modo-op" data-modo="claro">☀️ Claro</button>' +
    "</div>" +
    '<span class="ps-etiqueta">Color principal</span>' +
    '<div class="ps-fila">' +
    '<button type="button" class="chip-color" data-color="#e9c46a" style="--c:#e9c46a" title="Oro"></button>' +
    '<button type="button" class="chip-color" data-color="#b78cff" style="--c:#b78cff" title="Lila"></button>' +
    '<button type="button" class="chip-color" data-color="#f5a8cb" style="--c:#f5a8cb" title="Rosa"></button>' +
    '<button type="button" class="chip-color" data-color="#8ecdf7" style="--c:#8ecdf7" title="Hielo"></button>' +
    '<input id="input-color-personal" type="color" value="#e9c46a" title="Color personalizado">' +
    "</div>" +
    '<span class="ps-etiqueta">Intensidad de animaciones</span>' +
    '<div class="ps-fila">' +
    '<button type="button" class="ps-op cfg-op" data-config="intensidad" data-valor="tranquila">Tranquila</button>' +
    '<button type="button" class="ps-op cfg-op" data-config="intensidad" data-valor="">Normal</button>' +
    '<button type="button" class="ps-op cfg-op" data-config="intensidad" data-valor="viva">Viva</button>' +
    "</div>" +
    '<span class="ps-etiqueta">Evento del cielo</span>' +
    '<div class="ps-fila">' +
    '<button type="button" class="ps-op ev-op" data-evento="">✦ Calma</button>' +
    '<button type="button" class="ps-op ev-op" data-evento="eclipse">🌑 Eclipse</button>' +
    "</div>" +
    '<div class="ps-fila" style="margin-top:.5rem">' +
    '<button type="button" class="ps-op ev-op" data-evento="fugaces">⭐ Fugaces</button>' +
    '<button type="button" class="ps-op ev-op" data-evento="aurora">🌌 Aurora</button>' +
    "</div>" +
    '<span class="ps-etiqueta">Fondo propio (URL)</span>' +
    '<input id="input-fondo-url" type="url" placeholder="pega el URL de una imagen…" spellcheck="false">' +
    '<div class="ps-fila" style="margin-top:.5rem">' +
    '<button type="button" id="btn-aplicar-fondo" class="ps-op">Aplicar</button>' +
    '<button type="button" id="btn-quitar-fondo" class="ps-op">Quitar</button>' +
    "</div>" +

    /* ── 🎵 Reproductor ── */
    '<span class="ps-titulo">🎵 Reproductor</span>' +
    '<span class="ps-etiqueta">Mostrar reproductor</span>' +
    '<div class="ps-fila">' +
    '<button type="button" class="ps-op cfg-op" data-config="ver-reproductor" data-valor="">Visible</button>' +
    '<button type="button" class="ps-op cfg-op" data-config="ver-reproductor" data-valor="0">Oculto</button>' +
    "</div>" +
    '<span class="ps-etiqueta">Autoplay</span>' +
    '<div class="ps-fila">' +
    '<button type="button" class="ps-op cfg-op" data-config="autoplay" data-valor="1">ON</button>' +
    '<button type="button" class="ps-op cfg-op" data-config="autoplay" data-valor="">OFF</button>' +
    "</div>" +
    '<span class="ps-etiqueta">Volumen predeterminado: <b id="etq-volumen"></b></span>' +
    '<input id="rango-volumen" type="range" min="0" max="100" step="5">' +
    '<span class="ps-etiqueta">Reproducción aleatoria</span>' +
    '<div class="ps-fila">' +
    '<button type="button" class="ps-op cfg-op" data-config="aleatorio" data-valor="1">ON</button>' +
    '<button type="button" class="ps-op cfg-op" data-config="aleatorio" data-valor="">OFF</button>' +
    "</div>" +
    '<span class="ps-etiqueta">Repetir canciones</span>' +
    '<div class="ps-fila">' +
    '<button type="button" class="ps-op cfg-op" data-config="repetir" data-valor="1">ON</button>' +
    '<button type="button" class="ps-op cfg-op" data-config="repetir" data-valor="">OFF</button>' +
    "</div>" +

    /* ── ✨ Interfaz ── */
    '<span class="ps-titulo">✨ Interfaz</span>' +
    '<span class="ps-etiqueta">Animaciones</span>' +
    '<div class="ps-fila">' +
    '<button type="button" class="ps-op cfg-op" data-config="sin-animaciones" data-valor="">ON</button>' +
    '<button type="button" class="ps-op cfg-op" data-config="sin-animaciones" data-valor="1">OFF</button>' +
    "</div>" +
    '<span class="ps-etiqueta">Efectos visuales</span>' +
    '<div class="ps-fila">' +
    '<button type="button" class="ps-op cfg-op" data-config="sin-efectos" data-valor="">ON</button>' +
    '<button type="button" class="ps-op cfg-op" data-config="sin-efectos" data-valor="1">OFF</button>' +
    "</div>" +
    '<span class="ps-etiqueta">Tamaño del texto</span>' +
    '<div class="ps-fila">' +
    '<button type="button" class="ps-op cfg-op" data-config="texto" data-valor="">Normal</button>' +
    '<button type="button" class="ps-op cfg-op" data-config="texto" data-valor="grande">Grande</button>' +
    '<button type="button" class="ps-op cfg-op" data-config="texto" data-valor="enorme">Enorme</button>' +
    "</div>" +
    '<span class="ps-etiqueta">Estilo de la página</span>' +
    '<div class="ps-fila">' +
    '<button type="button" class="ps-op cfg-op" data-config="estilo" data-valor="">Clásico</button>' +
    '<button type="button" class="ps-op cfg-op" data-config="estilo" data-valor="sobrio">Sobrio</button>' +
    "</div>" +

    /* ── 🔧 Extras ── */
    '<span class="ps-titulo">🔧 Extras</span>' +
    '<span class="ps-etiqueta">Modo compacto</span>' +
    '<div class="ps-fila">' +
    '<button type="button" class="ps-op cfg-op" data-config="compacto" data-valor="1">ON</button>' +
    '<button type="button" class="ps-op cfg-op" data-config="compacto" data-valor="">OFF</button>' +
    "</div>" +
    '<div class="ps-fila" style="margin-top:.9rem">' +
    '<button type="button" id="btn-restablecer" class="ps-op peligro">Restaurar predeterminados</button>' +
    "</div>" +
    '<p class="ps-nota">💾 Todo se guarda solo en este navegador.</p>';
  document.body.appendChild(panel);

  function marcarModo() {
    const actual = document.documentElement.dataset.modo || "";
    panel.querySelectorAll(".modo-op").forEach((b) => {
      b.classList.toggle("activo", (b.dataset.modo || "") === actual);
    });
  }

  function guardarPref(k, v) {
    PREFS[k] = v;
    try {
      if (v) localStorage.setItem(k, v);
      else localStorage.removeItem(k);
    } catch {}
    aplicarPref(k);
    marcarConfig();
  }

  panel.querySelectorAll(".cfg-op").forEach((b) => {
    b.addEventListener("click", () => {
      guardarPref(b.dataset.config, b.dataset.valor || "");
      toast("✦ Guardado");
    });
  });

  function marcarConfig() {
    panel.querySelectorAll(".cfg-op").forEach((b) => {
      b.classList.toggle(
        "activo",
        (PREFS[b.dataset.config] || "") === (b.dataset.valor || "")
      );
    });
  }

  function marcarColor() {
    const guardado = PREFS["color-principal"] || "";
    panel.querySelectorAll(".chip-color").forEach((chip) => {
      chip.classList.toggle("activo", chip.dataset.color === guardado);
    });
    inputColor.value = guardado || COLOR_BASE;
  }

  panel.querySelectorAll(".chip-color").forEach((chip) => {
    chip.addEventListener("click", () => {
      delete document.documentElement.dataset.tema;
      try {
        localStorage.removeItem("tema");
      } catch {}
      guardarPref("color-principal", chip.dataset.color);
      toast("✦ Color cambiado");
    });
  });

  const inputColor = panel.querySelector("#input-color-personal");
  inputColor.addEventListener("input", () => {
    delete document.documentElement.dataset.tema;
    try {
      localStorage.removeItem("tema");
    } catch {}
    guardarPref("color-principal", inputColor.value);
  });

  const rangoVolumen = panel.querySelector("#rango-volumen");
  const etqVolumen = panel.querySelector("#etq-volumen");

  function pintarVolumen() {
    const n = parseInt(PREFS.volumen || "80", 10) || 0;
    rangoVolumen.value = String(n);
    etqVolumen.textContent = n + "%";
  }

  rangoVolumen.addEventListener("input", () => {
    PREFS.volumen = rangoVolumen.value;
    try {
      localStorage.setItem("volumen", rangoVolumen.value);
    } catch {}
    etqVolumen.textContent = rangoVolumen.value + "%";
    document.dispatchEvent(new CustomEvent("prefs-cambio", { detail: "volumen" }));
  });

  function abrir() {
    panel.hidden = !panel.hidden;
    if (!panel.hidden) {
      marcarModo();
      marcarEvento();
      marcarConfig();
      marcarColor();
      pintarVolumen();
      input.value = fondoGuardado;
    }
  }

  const input = panel.querySelector("#input-fondo-url");

  btnSettings.addEventListener("click", abrir);
  panel.querySelector("#cerrar-settings").addEventListener("click", () => {
    panel.hidden = true;
  });

  const NOMBRES_EVENTOS = {
    "": "✦ Cielo en calma",
    eclipse: "🌑 Eclipse total — mira el cielo",
    fugaces: "⭐ Estrellas fugaces cruzando el cielo",
    aurora: "🌌 Aurora boreal encendida",
  };

  let temporizadorEvento = null;

  panel.querySelectorAll(".ev-op").forEach((b) => {
    b.addEventListener("click", () => {
      const v = b.dataset.evento || "";
      marcarEvento(v);
      try {
        localStorage.setItem("evento", v);
      } catch {}
      eventoGuardado = v;
      clearTimeout(temporizadorEvento);
      toast("✦ el cielo está cambiando…");
      /* un pequeño retraso para que la escena entre sin cortes */
      temporizadorEvento = setTimeout(() => {
        if (v) document.documentElement.dataset.evento = v;
        else delete document.documentElement.dataset.evento;
        toast(NOMBRES_EVENTOS[v] || "✦ Evento cambiado");
      }, 1600);
    });
  });

  function marcarEvento(pendiente) {
    const actual =
      pendiente !== undefined
        ? pendiente
        : document.documentElement.dataset.evento || "";
    panel.querySelectorAll(".ev-op").forEach((b) => {
      b.classList.toggle("activo", (b.dataset.evento || "") === actual);
    });
  }

  panel.querySelectorAll(".modo-op").forEach((b) => {
    b.addEventListener("click", () => {
      if (b.dataset.modo) document.documentElement.dataset.modo = b.dataset.modo;
      else delete document.documentElement.dataset.modo;
      try {
        localStorage.setItem("modo", b.dataset.modo);
      } catch {}
      modoGuardado = b.dataset.modo;
      marcarModo();
      toast(b.dataset.modo ? "☀️ Modo día activado" : "🌙 Modo noche activado");
    });
  });

  panel.querySelector("#btn-aplicar-fondo").addEventListener("click", () => {
    const url = input.value.trim();
    if (!/^https?:\/\/|^data:image/i.test(url)) {
      toast("pon un URL de imagen válido ✦");
      return;
    }
    aplicarFondo(url);
    fondoGuardado = url;
    try {
      localStorage.setItem("fondo-url", url);
    } catch {}
    toast("✦ Fondo aplicado");
  });

  panel.querySelector("#btn-quitar-fondo").addEventListener("click", () => {
    aplicarFondo(null);
    fondoGuardado = "";
    input.value = "";
    try {
      localStorage.removeItem("fondo-url");
    } catch {}
    toast("✦ Fondo quitado");
  });

  panel.querySelector("#btn-restablecer").addEventListener("click", () => {
    try {
      CLAVES_PREFS.forEach((k) => localStorage.removeItem(k));
      localStorage.removeItem("modo");
      localStorage.removeItem("fondo-url");
      localStorage.removeItem("tema");
      localStorage.removeItem("evento");
    } catch {}
    location.reload();
  });
})();

/* ── Nota del DM en el pie de página ── */
const footerSitio = document.querySelector(".site-footer");
if (footerSitio && !footerSitio.querySelector(".dm-nota")) {
  const notaDm = document.createElement("p");
  notaDm.className = "dm-nota";
  notaDm.innerHTML =
    "✦ ¿tienes ideas de qué agregarle a esta página? escríbelas al <b>DM @ineedherbb</b> — sí, en serio, las leo todas";
  footerSitio.appendChild(notaDm);
}

/* ── Detalles vivos: saludo, ayuda y pestaña ── */
let visitasN = 1;
try {
  visitasN = parseInt(localStorage.getItem("visitas") || "1", 10) || 1;
} catch {}

setTimeout(() => {
  try {
    if (!sessionStorage.getItem("saludo-dado") && visitasN > 1) {
      sessionStorage.setItem("saludo-dado", "si");
      toast(`✦ qué bueno verte de vuelta — visita nº ${visitasN}`);
    }
  } catch {}
}, 3400);

document.addEventListener("keydown", (e) => {
  if (!/input|textarea/i.test(e.target.tagName) && e.key === "?") {
    toast("⌨️ M = música · ? = ayuda · ⚙ arriba = personalizar");
  }
});

const tituloOriginal = document.title;
document.addEventListener("visibilitychange", () => {
  document.title = document.hidden
    ? "✦ vuelve, la noche te espera…"
    : tituloOriginal;
});

const cielo = document.getElementById("cielo");

if (cielo && !sinAnimacion()) {
  const factorPantalla = Math.min(
    1.45,
    Math.max(1, (window.innerWidth * window.innerHeight) / (1440 * 800))
  );

  for (let i = 0; i < Math.round(130 * factorPantalla); i++) {
    const estrella = document.createElement("span");
    estrella.className = "estrella";
    const azarColor = Math.random();
    if (azarColor < 0.14) estrella.classList.add("lila");
    else if (azarColor < 0.24) estrella.classList.add("rosa");
    else if (azarColor < 0.32) estrella.classList.add("hielo");
    const tamano = Math.random() * 1.8 + 0.8;
    estrella.style.width = estrella.style.height = `${tamano}px`;
    estrella.style.left = `${Math.random() * 100}%`;
    estrella.style.top = `${Math.random() * 100}%`;
    estrella.style.setProperty("--d", `${Math.random() * 3 + 2}s`);
    estrella.style.animationDelay = `${Math.random() * 3}s`;
    estrella.style.opacity = String(Math.random() * 0.55 + 0.25);
    cielo.appendChild(estrella);
  }

  for (let i = 0; i < Math.round(16 * factorPantalla); i++) {
    const estrella = document.createElement("span");
    estrella.className = "estrella-grande";
    estrella.style.left = `${Math.random() * 100}%`;
    estrella.style.top = `${Math.random() * 70}%`;
    estrella.style.setProperty("--d", `${Math.random() * 4 + 3}s`);
    estrella.style.animationDelay = `${Math.random() * 4}s`;
    if (i % 3 === 0) estrella.classList.add("tibia");
    else if (i % 3 === 1) estrella.classList.add("fria");
    cielo.appendChild(estrella);
  }
}

["sol", "eclipse-noche"].forEach((id) => {
  const capa = document.createElement("div");
  capa.id = id;
  document.body.appendChild(capa);
});

const castillo = document.createElement("div");
castillo.id = "castillo";
castillo.setAttribute("aria-hidden", "true");
castillo.innerHTML =
  '<svg viewBox="0 0 1440 240" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">' +
  "<defs>" +
  '<linearGradient id="ciudad-grad" x1="0" y1="0" x2="0" y2="1">' +
  '<stop offset="0" stop-color="var(--ciudad-alta)"/>' +
  '<stop offset="1" stop-color="var(--ciudad-baja)"/>' +
  "</linearGradient>" +
  "</defs>" +

  // fila lejana de la ciudad (profundidad, mínima)
  '<g fill="var(--ciudad-baja)" opacity="0.75">' +
  '<rect x="600" y="142" width="54" height="66"/>' +
  '<polygon points="892,146 974,146 933,112"/>' +
  "</g>" +

  // colina base
  '<path d="M0 240 L0 210 Q280 196 640 205 Q1020 215 1440 200 L1440 240 Z" fill="var(--colina)"/>' +

  // ciudad principal (pocos edificios, mucho aire)
  '<g fill="url(#ciudad-grad)">' +
  // torre A solitaria
  '<rect x="132" y="112" width="46" height="100"/>' +
  '<polygon points="126,112 184,112 155,80"/>' +
  // edificio almenado lejano
  '<rect x="290" y="104" width="100" height="108"/>' +
  '<line x1="287" y1="101" x2="393" y2="101" stroke="url(#ciudad-grad)" stroke-width="12" stroke-dasharray="15 11"/>' +
  // torre B delgada
  '<rect x="402" y="92" width="36" height="120"/>' +
  '<polygon points="396,92 444,92 420,56"/>' +
  // muralla izquierda
  '<rect x="532" y="174" width="106" height="38"/>' +
  '<line x1="529" y1="172" x2="641" y2="172" stroke="url(#ciudad-grad)" stroke-width="11" stroke-dasharray="14 10"/>' +
  // torretas del gran castillo
  '<rect x="642" y="112" width="44" height="100"/>' +
  '<polygon points="635,112 693,112 664,78"/>' +
  '<rect x="814" y="112" width="44" height="100"/>' +
  '<polygon points="807,112 865,112 836,78"/>' +
  // torreón central grande
  '<rect x="700" y="88" width="100" height="124"/>' +
  '<line x1="697" y1="85" x2="803" y2="85" stroke="url(#ciudad-grad)" stroke-width="13" stroke-dasharray="16 12"/>' +
  // aguja central con bandera
  '<rect x="733" y="40" width="34" height="50"/>' +
  '<polygon points="726,40 774,40 750,10"/>' +
  // muralla derecha
  '<rect x="860" y="176" width="94" height="36"/>' +
  '<line x1="857" y1="174" x2="957" y2="174" stroke="url(#ciudad-grad)" stroke-width="11" stroke-dasharray="14 10"/>' +
  // torre C
  '<rect x="968" y="122" width="48" height="90"/>' +
  '<polygon points="961,122 1023,122 992,86"/>' +
  // casita única a lo lejos
  '<rect x="1132" y="128" width="58" height="84"/>' +
  '<polygon points="1125,128 1197,128 1161,98"/>' +
  // palacio almenado derecha
  '<rect x="1216" y="110" width="88" height="102"/>' +
  '<line x1="1213" y1="107" x2="1307" y2="107" stroke="url(#ciudad-grad)" stroke-width="12" stroke-dasharray="15 11"/>' +
  // torre D lejana derecha
  '<rect x="1318" y="98" width="50" height="114"/>' +
  '<polygon points="1311,98 1375,98 1343,62"/>' +
  "</g>" +

  // asta y bandera en la aguja central
  '<line x1="750" y1="10" x2="750" y2="0" stroke="#3a3352" stroke-width="2"/>' +
  '<path class="banderin" d="M751 0 L792 7 L751 15 Z" fill="#b78cff" opacity="0.85"/>' +

  // puerta del gran castillo
  '<path d="M731 214 v-24 a19 19 0 0 1 38 0 v24 Z" fill="#05030c"/>' +

  // ventanas encendidas de la ciudad
  "<g>" +
  '<rect class="ventana" x="148" y="128" width="8" height="12" rx="4"/>' +
  '<rect class="ventana" x="148" y="156" width="8" height="12" rx="4"/>' +
  '<rect class="ventana" x="310" y="120" width="8" height="12" rx="4"/>' +
  '<rect class="ventana" x="340" y="140" width="8" height="12" rx="4"/>' +
  '<rect class="ventana" x="370" y="120" width="8" height="12" rx="4"/>' +
  '<rect class="ventana" x="413" y="110" width="7" height="11" rx="3.5"/>' +
  '<rect class="ventana" x="657" y="130" width="7" height="11" rx="3.5"/>' +
  '<rect class="ventana" x="657" y="158" width="7" height="11" rx="3.5"/>' +
  '<rect class="ventana" x="836" y="130" width="7" height="11" rx="3.5"/>' +
  '<rect class="ventana" x="836" y="158" width="7" height="11" rx="3.5"/>' +
  '<rect class="ventana" x="720" y="108" width="8" height="12" rx="4"/>' +
  '<rect class="ventana" x="763" y="104" width="8" height="12" rx="4"/>' +
  '<rect class="ventana" x="772" y="140" width="8" height="12" rx="4"/>' +
  '<rect class="ventana" x="985" y="140" width="8" height="12" rx="4"/>' +
  '<rect class="ventana" x="1152" y="144" width="7" height="11" rx="3.5"/>' +
  '<rect class="ventana" x="1240" y="126" width="8" height="12" rx="4"/>' +
  '<rect class="ventana" x="1272" y="150" width="8" height="12" rx="4"/>' +
  '<rect class="ventana" x="1336" y="116" width="8" height="12" rx="4"/>' +
  "</g>" +
  "</svg>";
document.body.appendChild(castillo);

const CAPAS_PARALLAX = [
  { el: document.getElementById("cielo"), fx: -0.05, fy: -0.05 },
  { el: document.getElementById("orbes"), fx: -0.11, fy: -0.11 },
  { el: document.getElementById("luna"), fx: -0.16, fy: -0.08 },
  { el: castillo, fx: -0.09, fy: -0.03 },
];

let ratonPx = 0;
let ratonPy = 0;
let rafParallax = null;

function aplicarParallax() {
  if (sinAnimacion()) return;
  const y = scrollY;

  CAPAS_PARALLAX.forEach(({ el, fx, fy }) => {
    if (!el) return;
    const dx = esTactil ? 0 : ratonPx * fx * 40;
    const dy = esTactil ? 0 : ratonPy * fy * 40;
    el.style.transform = `translate(${dx}px, ${y * fy}px)`;
  });

  rafParallax = null;
}

function pedirParallax() {
  if (!rafParallax) rafParallax = requestAnimationFrame(aplicarParallax);
}

addEventListener("scroll", pedirParallax, { passive: true });
aplicarParallax();

if (!esTactil && !sinAnimacion()) {
  addEventListener("mousemove", (e) => {
    ratonPx = e.clientX / innerWidth - 0.5;
    ratonPy = e.clientY / innerHeight - 0.5;
    pedirParallax();
  });
}

const contenedorOrbes = document.getElementById("orbes");
const CLASES_ORBE = ["lila", "oro", "rosa"];

if (contenedorOrbes && !sinAnimacion()) {
  for (let i = 0; i < 8; i++) {
    const orbe = document.createElement("span");
    orbe.className = `orbe ${CLASES_ORBE[i % 3]}`;
    const tamano = Math.random() * 80 + 40;
    orbe.style.width = orbe.style.height = `${tamano}px`;
    orbe.style.left = `${Math.random() * 100}%`;
    orbe.style.animationDuration = `${Math.random() * 26 + 22}s`;
    orbe.style.animationDelay = `${Math.random() * -30}s`;
    contenedorOrbes.appendChild(orbe);
  }
}

/* ── Efecto ambiental propio de cada tema ──
   oro → polvo de estrellas · lila → burbujas
   rosa → pétalos · hielo → copos de nieve */
const EFECTO_TEMA = { "": "polvo", lila: "burbuja", rosa: "petalo", hielo: "copo", eclipse: "burbuja" };
const RANGO_DURACION = {
  polvo: [14, 26],
  burbuja: [18, 30],
  petalo: [11, 19],
  copo: [9, 17],
};
const RANGO_TAMANO = {
  polvo: [3, 5],
  burbuja: [22, 54],
  petalo: [11, 17],
  copo: [4, 9],
};

let contenedorEfectoTema = document.getElementById("efecto-tema");
if (!contenedorEfectoTema) {
  contenedorEfectoTema = document.createElement("div");
  contenedorEfectoTema.id = "efecto-tema";
  document.body.appendChild(contenedorEfectoTema);
}

function aplicarEfectoTema(tema) {
  contenedorEfectoTema.innerHTML = "";
  if (sinAnimacion()) return;

  const clase = EFECTO_TEMA[tema || ""];
  if (!clase) return;

  const esMovil = window.innerWidth < 768;
  const cantidad = esMovil ? 7 : clase === "burbuja" ? 10 : 14;
  const [durMin, durMax] = RANGO_DURACION[clase];
  const [tamMin, tamMax] = RANGO_TAMANO[clase];

  for (let i = 0; i < cantidad; i++) {
    const p = document.createElement("span");
    p.className = clase;
    p.style.left = `${Math.random() * 100}%`;
    p.style.width = p.style.height = `${Math.random() * (tamMax - tamMin) + tamMin}px`;
    p.style.animationDuration = `${Math.random() * (durMax - durMin) + durMin}s`;
    p.style.animationDelay = `${Math.random() * -20}s`;
    p.style.setProperty("--dx", `${Math.random() * 70 - 35}px`);
    contenedorEfectoTema.appendChild(p);
  }
}

aplicarEfectoTema(document.documentElement.dataset.tema || "");

const COLORES_LUZ = ["#e9c46a", "#b78cff", "#f5a8cb"];

function lanzarLuciernaga() {
  if (sinAnimacion()) return;
  if (document.querySelectorAll(".luciernaga").length > 8) return;

  const luz = document.createElement("span");
  luz.className = "luciernaga";
  const color = COLORES_LUZ[Math.floor(Math.random() * 3)];
  luz.style.left = `${Math.random() * 100}%`;
  luz.style.background = color;
  luz.style.boxShadow = `0 0 8px ${color}, 0 0 18px ${color}`;
  luz.style.setProperty("--deriva", `${Math.random() * 90 - 45}px`);
  luz.style.setProperty("--op", String(Math.random() * 0.5 + 0.35));
  luz.style.animationDuration = `${Math.random() * 10 + 12}s`;
  document.body.appendChild(luz);
  setTimeout(() => luz.remove(), 23000);
}

if (!sinAnimacion()) setInterval(lanzarLuciernaga, 2600);

function lanzarEstrellaFugaz() {
  if (!cielo || sinAnimacion()) return;
  const fugaz = document.createElement("span");
  fugaz.className = "estrella-fugaz";
  fugaz.style.top = `${Math.random() * 35}%`;
  fugaz.style.left = `${Math.random() * 45}%`;
  cielo.appendChild(fugaz);
  setTimeout(() => fugaz.remove(), 2100);
}

function lluviaDeEstrellas(cantidad) {
  if (!cielo || sinAnimacion()) return;
  let n = 0;
  const intervalo = setInterval(() => {
    lanzarEstrellaFugaz();
    lanzarEstrellaFugaz();
    if (++n >= cantidad) clearInterval(intervalo);
  }, 120);
}

/* estrellas fugaces solo durante su evento, bien visibles */
(function programarFugaces() {
  setTimeout(() => {
    if (document.documentElement.dataset.evento === "fugaces") {
      lanzarEstrellaFugaz();
      if (Math.random() > 0.5) lanzarEstrellaFugaz();
    }
    programarFugaces();
  }, Math.random() * 2800 + 1500);
})();

/* de vez en cuando cruza una fugaz tenue, aunque no haya evento */
(function fugacesAmbientales() {
  setTimeout(() => {
    if (!document.hidden && !sinAnimacion() && document.documentElement.dataset.evento !== "fugaces" && cielo) {
      const fugaz = document.createElement("span");
      fugaz.className = "estrella-fugaz tenue";
      fugaz.style.top = `${Math.random() * 30}%`;
      fugaz.style.left = `${Math.random() * 50}%`;
      cielo.appendChild(fugaz);
      setTimeout(() => fugaz.remove(), 2400);
    }
    fugacesAmbientales();
  }, Math.random() * 26000 + 16000);
})();

const frases = [
  "hay canciones que te regresan a lugares que ya no existen",
  "aquí el internet todavía es pequeño y tranquilo",
  "los buenos recuerdos también necesitan un lugar donde vivir",
  "quédate un rato, no hay prisa",
];
const typingEl = document.getElementById("typing");

if (typingEl) {
  let fraseIdx = 0;
  let letraIdx = 0;
  let borrando = false;

  (function teclear() {
    const frase = frases[fraseIdx];
    letraIdx += borrando ? -1 : 1;
    typingEl.textContent = frase.slice(0, letraIdx);

    let espera = borrando ? 32 : 68;

    if (!borrando && letraIdx === frase.length) {
      borrando = true;
      espera = 2400;
    } else if (borrando && letraIdx === 0) {
      borrando = false;
      fraseIdx = (fraseIdx + 1) % frases.length;
      espera = 550;
    }

    setTimeout(teclear, espera);
  })();
}

const actividadEl = document.getElementById("actividad");

if (actividadEl) {
  const madrugada = new Date().getHours() >= 0 && new Date().getHours() < 6;
  const estadosBase = [
    "🎮 jugando Roblox",
    "👻 viendo a Freddy por la camara",
    "🪂 cayendo de la battle bus",
    "🎧 escuchando música",
    "🌙 modo noche activado",
    "✦ perdiendo el tiempo bonito",
  ];
  const estados = madrugada
    ? ["🌙 probablemente despierto a las 3 AM", "🎧 música bajita, luces apagadas", "💻 programando sin tener sueño", ...estadosBase]
    : estadosBase;

  let estadoIdx = Math.floor(Math.random() * estados.length);
  actividadEl.textContent = estados[estadoIdx];

  setInterval(() => {
    actividadEl.classList.add("cambiando");
    setTimeout(() => {
      estadoIdx = (estadoIdx + 1) % estados.length;
      actividadEl.textContent = estados[estadoIdx];
      actividadEl.classList.remove("cambiando");
    }, 300);
  }, 5000);

  /* micro-animación al pasar el mouse */
  actividadEl.addEventListener("pointerenter", () => {
    actividadEl.style.transform = "translateX(4px)";
  });
  actividadEl.addEventListener("pointerleave", () => {
    actividadEl.style.transform = "";
  });
}

/* ---------- zona horaria del visitante (sin permisos, solo el navegador) ---------- */
(function zonaHoraria() {
  const horaLocalEl = document.getElementById("hora-local");
  let tz = "";
  try {
    tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  } catch {}

  function fraseSegunHora(h) {
    if (h >= 0 && h < 6) return "🌙 deberías estar durmiendo";
    if (h < 12) return "☀️ buenos días";
    if (h < 19) return "🌤 buenas tardes";
    return "🌌 buenas noches";
  }

  function tic() {
    const ahora = new Date();
    if (!horaLocalEl) return;
    const horaTxt = ahora.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    const lugar = tz ? tz.split("/").pop().replace(/_/g, " ") : "tu zona";
    horaLocalEl.hidden = false;
    horaLocalEl.textContent = `${fraseSegunHora(ahora.getHours())} · 🕐 ${horaTxt} en ${lugar}`;
    horaLocalEl.title = tz || "";
  }

  if (horaLocalEl) {
    tic();
    setInterval(tic, 20000);
  }
})();

const btnCorazon = document.getElementById("btn-corazon");
const numCorazones = document.getElementById("num-corazones");

if (btnCorazon && numCorazones) {
  try {
    numCorazones.textContent = localStorage.getItem("corazones") || "0";
  } catch {}

  btnCorazon.addEventListener("click", (e) => {
    let total = parseInt(numCorazones.textContent.replace(/\D/g, ""), 10) || 0;
    total++;
    numCorazones.textContent = total.toLocaleString("es");
    try {
      localStorage.setItem("corazones", String(total));
    } catch {}

    btnCorazon.classList.add("pum");
    setTimeout(() => btnCorazon.classList.remove("pum"), 150);

    const corazon = document.createElement("span");
    corazon.className = "corazon-volador";
    corazon.textContent = ["💜", "🤍", "💗"][Math.floor(Math.random() * 3)];
    corazon.style.left = e.clientX + "px";
    corazon.style.top = e.clientY + "px";
    document.body.appendChild(corazon);
    setTimeout(() => corazon.remove(), 1000);
  });
}

const btnCompartir = document.getElementById("btn-compartir");

if (btnCompartir) {
  btnCompartir.addEventListener("click", async () => {
    const datos = { title: document.title, url: location.href };

    try {
      if (navigator.share) {
        await navigator.share(datos);
      } else {
        await navigator.clipboard.writeText(location.href);
        toast("Enlace copiado al portapapeles ✦");
      }
    } catch {}
  });
}

const avatarTilt = document.getElementById("avatar-tilt");

if (avatarTilt && !esTactil && !sinAnimacion()) {
  avatarTilt.addEventListener("mousemove", (e) => {
    const rect = avatarTilt.getBoundingClientRect();
    const dx = (e.clientX - rect.left) / rect.width - 0.5;
    const dy = (e.clientY - rect.top) / rect.height - 0.5;
    avatarTilt.style.transform = `perspective(600px) rotateY(${dx * 20}deg) rotateX(${-dy * 20}deg) scale(1.05)`;
  });

  avatarTilt.addEventListener("mouseleave", () => {
    avatarTilt.style.transform = "";
  });

  avatarTilt.style.transition = "transform 0.15s ease-out";
}

let clicksAvatar = 0;

avatarTilt?.addEventListener("click", () => {
  if (++clicksAvatar === 5) {
    clicksAvatar = 0;
    lluviaDeEstrellas(14);
    toast("✦ Has desatado una lluvia de estrellas");
  }
});

function crearChispas(x, y, n) {
  if (sinAnimacion()) return;

  for (let i = 0; i < n; i++) {
    const chispa = document.createElement("span");
    chispa.className = "chispa";
    chispa.style.left = x + "px";
    chispa.style.top = y + "px";
    chispa.style.background = ["#e9c46a", "#b78cff", "#f5a8cb"][i % 3];
    chispa.style.boxShadow = `0 0 10px ${chispa.style.background}`;
    document.body.appendChild(chispa);

    const angulo = (Math.PI * 2 * i) / n + Math.random();
    const distancia = 30 + Math.random() * 40;

    requestAnimationFrame(() => {
      chispa.style.transform = `translate(${Math.cos(angulo) * distancia}px, ${Math.sin(angulo) * distancia}px) scale(0)`;
      chispa.style.opacity = "0";
    });

    setTimeout(() => chispa.remove(), 650);
  }
}

addEventListener("pointerdown", (e) => {
  if (sinAnimacion() || e.button !== 0) return;
  crearChispas(e.clientX, e.clientY, 8);
});

function lluviaDeCorazones(cantidad) {
  if (sinAnimacion()) return;
  let n = 0;
  const intervalo = setInterval(() => {
    const corazon = document.createElement("span");
    corazon.className = "corazon-volador";
    corazon.textContent = ["💜", "🤍", "💗"][Math.floor(Math.random() * 3)];
    corazon.style.left = Math.random() * innerWidth + "px";
    corazon.style.top = innerHeight * (0.6 + Math.random() * 0.3) + "px";
    document.body.appendChild(corazon);
    setTimeout(() => corazon.remove(), 1000);
    if (++n >= cantidad) clearInterval(intervalo);
  }, 90);
}

function fuegosArtificiales() {
  if (sinAnimacion()) return;
  let n = 0;
  const intervalo = setInterval(() => {
    crearChispas(
      innerWidth * (0.15 + Math.random() * 0.7),
      innerHeight * (0.1 + Math.random() * 0.45),
      12
    );
    if (++n >= 6) clearInterval(intervalo);
  }, 190);
}

const SECUENCIA_KONAMI = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a",
];
let progresoKonami = 0;

addEventListener("keydown", (e) => {
  const tecla = e.key.length === 1 ? e.key.toLowerCase() : e.key;

  progresoKonami =
    tecla === SECUENCIA_KONAMI[progresoKonami] ? progresoKonami + 1 :
    tecla === SECUENCIA_KONAMI[0] ? 1 : 0;

  if (progresoKonami === SECUENCIA_KONAMI.length) {
    progresoKonami = 0;
    lluviaDeEstrellas(40);
    toast("✧ Secuencia secreta encontrada");
  }
});

const btnDiscord = document.getElementById("btn-discord");

if (btnDiscord) {
  btnDiscord.addEventListener("click", async (e) => {
    e.preventDefault();
    const texto = document.getElementById("discord-user").textContent.trim();
    try {
      await navigator.clipboard.writeText(texto.replace("@", ""));
      toast(`Usuario ${texto} copiado`);
    } catch {}
  });
}

/* ── Pistas para madrugar: tarjetas que disparan el reproductor ── */
const pistasGrid = document.getElementById("pistas-grid");

if (pistasGrid && typeof CANCIONES !== "undefined") {
  CANCIONES.forEach((cancion, i) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "pista";
    card.innerHTML =
      `<span class="pista-numero">${String(i + 1).padStart(2, "0")}</span>` +
      `<span class="pista-texto"><b>${cancion.titulo}</b><small>${(cancion.tag || "beat").trim()}</small></span>` +
      '<span class="pista-play">▶</span>';
    card.addEventListener("click", () => {
      document.querySelectorAll(".pista.sonando-ahora").forEach((p) => p.classList.remove("sonando-ahora"));
      card.classList.add("sonando-ahora");
      document.dispatchEvent(new CustomEvent("tocar-cancion", { detail: i }));
      toast(`♪ ${partes[0].trim()}`);
    });
    pistasGrid.appendChild(card);
  });
}

/* ── Botones de acción del hero ── */
const btnEscuchar = document.getElementById("btn-escuchar");
if (btnEscuchar) {
  btnEscuchar.addEventListener("click", () => {
    const fab = document.getElementById("fab-musica");
    if (fab) fab.click();
  });
}

const btnCopiarDc = document.getElementById("btn-copiar-dc");
if (btnCopiarDc) {
  btnCopiarDc.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText("ineedherbb");
      toast("✦ discord copiado — escríbeme sin miedo");
    } catch {}
  });
}

const btnIrMuro = document.getElementById("btn-ir-muro");
if (btnIrMuro) {
  btnIrMuro.addEventListener("click", () => {
    const muro = document.getElementById("muro-notas");
    if (muro) muro.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => document.getElementById("input-muro")?.focus({ preventScroll: true }), 650);
  });
}

/* ── Muro de notas (se guarda en tu navegador) ── */
const formMuro = document.getElementById("form-muro");
const inputMuro = document.getElementById("input-muro");
const muroNotas = document.getElementById("muro-notas");

function leerNotas() {
  try {
    const arr = JSON.parse(localStorage.getItem("muro-notas") || "[]");
    return Array.isArray(arr) ? arr.slice(0, 12) : [];
  } catch {}
  return [];
}

function pintarMuro() {
  if (!muroNotas) return;
  const notas = leerNotas();
  muroNotas.innerHTML = "";

  if (!notas.length) {
    const vacio = document.createElement("p");
    vacio.className = "muro-vacio";
    vacio.textContent = "aún no hay notas en el muro — sé la primera ✦";
    muroNotas.appendChild(vacio);
    return;
  }

  notas.forEach((nota, i) => {
    const div = document.createElement("div");
    div.className = "nota";

    if (nota.n) {
      const autor = document.createElement("small");
      autor.className = "nota-autor";
      autor.textContent = `✦ ${nota.n}`;
      div.appendChild(autor);
    }

    const texto = document.createElement("span");
    texto.textContent = nota.t;
    div.appendChild(texto);

    const fecha = document.createElement("b");
    fecha.textContent = nota.f || "";
    div.appendChild(fecha);

    const borrar = document.createElement("button");
    borrar.type = "button";
    borrar.className = "borrar-nota";
    borrar.textContent = "×";
    borrar.title = "Quitar nota";
    borrar.setAttribute("aria-label", "Quitar esta nota");
    borrar.addEventListener("click", () => {
      const actuales = leerNotas();
      actuales.splice(i, 1);
      try {
        localStorage.setItem("muro-notas", JSON.stringify(actuales));
      } catch {}
      pintarMuro();
    });
    div.appendChild(borrar);

    muroNotas.appendChild(div);
  });
}

if (formMuro && inputMuro && muroNotas) {
  pintarMuro();

  formMuro.addEventListener("submit", (e) => {
    e.preventDefault();
    const texto = inputMuro.value.trim();
    if (!texto) return;

    const inputNombre = document.getElementById("input-nombre");
    const autor = inputNombre ? inputNombre.value.trim().slice(0, 24) : "";

    const notas = leerNotas();
    notas.unshift({
      n: autor,
      t: texto,
      f: new Date().toLocaleDateString("es", { day: "numeric", month: "short" }),
    });

    try {
      localStorage.setItem("muro-notas", JSON.stringify(notas.slice(0, 12)));
      if (autor) localStorage.setItem("tu-nombre", autor);
    } catch {}

    inputMuro.value = "";
    pintarMuro();
    toast("✦ nota pegada en el muro");

    /* pista suave: la primera nota también cuenta como secreto */
    marcarDescubrimiento("nota");
  });
}

/* recuerda el nombre del visitante entre visitas */
(function recordarNombre() {
  const inp = document.getElementById("input-nombre");
  if (!inp) return;
  try {
    inp.value = localStorage.getItem("tu-nombre") || "";
  } catch {}
})();

/* ── Volver arriba (botón flotante + enlace del footer) ── */
const btnArriba = document.getElementById("btn-arriba");

if (btnArriba) {
  const alternarArriba = () => {
    btnArriba.classList.toggle("visible", scrollY > 600);
  };
  addEventListener("scroll", alternarArriba, { passive: true });
  alternarArriba();

  btnArriba.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));
}

const linkArriba = document.getElementById("link-arriba");
if (linkArriba) {
  linkArriba.addEventListener("click", (e) => {
    e.preventDefault();
    scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ── Onda al pulsar botones importantes ── */
document.querySelectorAll(".btn-accion, .muro-form button").forEach((boton) => {
  boton.addEventListener("pointerdown", (e) => {
    const rect = boton.getBoundingClientRect();
    const onda = document.createElement("span");
    const tamano = Math.max(rect.width, rect.height);
    onda.className = "onda";
    onda.style.width = onda.style.height = `${tamano}px`;
    onda.style.left = `${e.clientX - rect.left - tamano / 2}px`;
    onda.style.top = `${e.clientY - rect.top - tamano / 2}px`;
    boton.appendChild(onda);
    setTimeout(() => onda.remove(), 600);
  });
});

const objetivosAnimados = document.querySelectorAll(".reveal");

objetivosAnimados.forEach((el, i) => {
  el.style.transitionDelay = `${i * 70}ms`;
});

if ("IntersectionObserver" in window) {
  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add("visible");
          observador.unobserve(entrada.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  objetivosAnimados.forEach((el) => observador.observe(el));
} else {
  objetivosAnimados.forEach((el) => el.classList.add("visible"));
}

const fabMusica = document.getElementById("fab-musica");
const panel = document.getElementById("panel-musica");
const audio = document.getElementById("audio");
const nombreCancion = document.getElementById("cancion-nombre");
const estadoCancion = document.getElementById("cancion-estado");
const listaUI = document.getElementById("lista-canciones");
const eq = document.getElementById("eq");

if (fabMusica && panel && audio && listaUI) {
  const btnPlay = document.getElementById("play-pausa");
  const btnAnterior = document.getElementById("anterior");
  const btnSiguiente = document.getElementById("siguiente");
  const volumen = document.getElementById("volumen");
  const nowPlaying = document.getElementById("now-playing");
  const nowNombre = document.getElementById("now-nombre");

  let indiceActual = -1;
  let iframeYT = null;

  function volumenPredeterminado() {
    const n = parseInt(PREFS.volumen || "80", 10);
    if (isNaN(n)) return 0.8;
    return Math.min(1, Math.max(0, n / 100));
  }

  audio.volume = volumenPredeterminado();
  audio.loop = PREFS.repetir === "1";
  volumen.value = String(Math.round(volumenPredeterminado() * 100));

  document.addEventListener("prefs-cambio", (e) => {
    if (e.detail === "volumen") {
      audio.volume = volumenPredeterminado();
      volumen.value = PREFS.volumen || "80";
    } else if (e.detail === "repetir") {
      audio.loop = PREFS.repetir === "1";
    }
  });

  /* autoplay: arranca con el primer toque o tecla del visitante */
  if (PREFS.autoplay === "1") {
    const arrancarMusica = () => {
      document.removeEventListener("pointerdown", arrancarMusica);
      document.removeEventListener("keydown", arrancarMusica);
      if (indiceActual === -1) reproducir(0);
    };
    document.addEventListener("pointerdown", arrancarMusica);
    document.addEventListener("keydown", arrancarMusica);
  }

  /* recuerda qué sonaba la última vez (sin autoplay, solo el nombre) */
  try {
    const ultima = parseInt(localStorage.getItem("ultima-cancion") || "", 10);
    if (!isNaN(ultima) && CANCIONES[ultima]) {
      estadoCancion.textContent = `última vez sonó: ${CANCIONES[ultima].titulo}`;
    }
  } catch {}

  /* aleatorio y repetir como botones rápidos del panel (se guardan) */
  const btnToggleAleatorio = document.getElementById("toggle-aleatorio");
  const btnToggleRepetir = document.getElementById("toggle-repetir");

  function pintarToggles() {
    if (btnToggleAleatorio) {
      btnToggleAleatorio.classList.toggle("activado", PREFS.aleatorio === "1");
    }
    if (btnToggleRepetir) {
      btnToggleRepetir.classList.toggle("activado", PREFS.repetir === "1");
    }
  }
  pintarToggles();

  function alternarPref(clave, emoji, nombre) {
    PREFS[clave] = PREFS[clave] === "1" ? "" : "1";
    try {
      if (PREFS[clave] === "1") localStorage.setItem(clave, "1");
      else localStorage.removeItem(clave);
    } catch {}
    pintarToggles();
    toast(PREFS[clave] === "1" ? `${emoji} ${nombre} activado` : `${emoji} ${nombre} desactivado`);
  }

  if (btnToggleAleatorio) {
    btnToggleAleatorio.addEventListener("click", () => alternarPref("aleatorio", "🎲", "aleatorio"));
  }

  if (btnToggleRepetir) {
    btnToggleRepetir.addEventListener("click", () => {
      alternarPref("repetir", "🔁", "repetir");
      audio.loop = PREFS.repetir === "1";
    });
  }

  /* guarda el volumen al soltar el control */
  volumen.addEventListener("change", () => {
    PREFS.volumen = volumen.value;
    try {
      localStorage.setItem("volumen", volumen.value);
    } catch {}
  });

  /* siguiente índice respetando la reproducción aleatoria */
  function siguienteIndice(fallback) {
    if (PREFS.aleatorio === "1" && CANCIONES.length > 1) {
      let n = indiceActual;
      while (n === indiceActual) {
        n = Math.floor(Math.random() * CANCIONES.length);
      }
      return n;
    }
    return fallback;
  }

function esYouTube(url) {
  return /youtu\.?be/.test(url);
}

function idDeYouTube(url) {
  const m = url.match(/(?:youtu\.be\/|v=|shorts\/|live\/|embed\/)([\w-]{11})/);
  return m ? m[1] : null;
}

CANCIONES.forEach((cancion, i) => {
  const li = document.createElement("li");
  li.textContent = `${i + 1}. ${cancion.titulo}`;
  li.addEventListener("click", () => reproducir(i));
  listaUI.appendChild(li);
});

function marcarActiva(i) {
  listaUI.querySelectorAll("li").forEach((li, idx) => {
    li.classList.toggle("activa", idx === i);
  });
}

function detenerYouTube() {
  if (iframeYT) {
    iframeYT.remove();
    iframeYT = null;
  }
}

function sonando(estaSonando) {
  eq.classList.toggle("sonando", estaSonando);
  btnPlay.textContent = estaSonando ? "⏸" : "▶";
  const vinilo = document.getElementById("vinilo");
  if (vinilo) vinilo.classList.toggle("girando", estaSonando);
}

/* ---------- vinilo + barra de progreso ---------- */
function pintarVinilo(cancion) {
  const vinilo = document.getElementById("vinilo");
  if (!vinilo || !cancion) return;
  let hash = 0;
  for (const ch of cancion.titulo) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  const h = hash % 360;
  vinilo.style.background = `radial-gradient(circle at 50% 50%, #1a1726 0 18%, #0d0b14 18% 100%)`;
  const etiqueta = vinilo.querySelector(".vinilo-etiqueta");
  if (etiqueta) {
    etiqueta.style.background = `conic-gradient(from ${hash % 90}deg, hsl(${h} 55% 58%), hsl(${(h + 60) % 360} 60% 45%), hsl(${h} 55% 58%))`;
    etiqueta.style.color = "#0d0b14";
  }
}

function fmtTiempo(seg) {
  if (!isFinite(seg) || seg < 0) seg = 0;
  const m = Math.floor(seg / 60);
  const s = Math.floor(seg % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

(function barraProgreso() {
  const barra = document.getElementById("barra-progreso");
  const relleno = document.getElementById("relleno-progreso");
  const tActual = document.getElementById("t-actual");
  const tTotal = document.getElementById("t-total");
  if (!barra || !relleno) return;

  audio.addEventListener("timeupdate", () => {
    const dur = audio.duration || 0;
    relleno.style.width = dur ? `${((audio.currentTime / dur) * 100).toFixed(2)}%` : "0%";
    if (tActual) tActual.textContent = fmtTiempo(audio.currentTime);
    if (tTotal) tTotal.textContent = fmtTiempo(dur);
  });

  function buscar(clientX) {
    const r = barra.getBoundingClientRect();
    const frac = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
    if (isFinite(audio.duration) && audio.duration > 0) {
      audio.currentTime = frac * audio.duration;
    }
  }

  let arrastrando = false;
  barra.addEventListener("pointerdown", (e) => {
    arrastrando = true;
    buscar(e.clientX);
  });
  addEventListener("pointermove", (e) => {
    if (arrastrando) buscar(e.clientX);
  });
  addEventListener("pointerup", () => {
    arrastrando = false;
  });
})();

function reproducir(i) {
  if (!CANCIONES.length) return;
  indiceActual = ((i % CANCIONES.length) + CANCIONES.length) % CANCIONES.length;

  try {
    localStorage.setItem("ultima-cancion", String(indiceActual));
  } catch {}

  const cancion = CANCIONES[indiceActual];
  marcarActiva(indiceActual);
  nombreCancion.textContent = cancion.titulo;
  const artistaEl = document.getElementById("cancion-artista");
  if (artistaEl) {
    artistaEl.textContent = `♪ ${cancion.artista || "artista desconocido"} · ${cancion.tag || ""}`;
  }
  nowNombre.textContent = `${cancion.titulo} — ${cancion.artista || ""}`;
  nowPlaying.hidden = false;
  estadoCancion.textContent = "cargando…";
  pintarVinilo(cancion);

  detenerYouTube();

  if (esYouTube(cancion.url)) {
    const id = idDeYouTube(cancion.url);

    if (!id) {
      estadoCancion.textContent = "URL de YouTube no válida";
      sonando(false);
      return;
    }

    iframeYT = document.createElement("iframe");
    iframeYT.src = `https://www.youtube.com/embed/${id}?autoplay=1&loop=1&playlist=${id}`;
    iframeYT.allow = "autoplay";
    iframeYT.style.cssText =
      "position:fixed;width:1px;height:1px;left:-9999px;top:-9999px;border:0;";
    document.body.appendChild(iframeYT);
    audio.pause();
    sonando(true);
    estadoCancion.textContent = "reproduciendo ♪";
  } else {
    audio.src = cancion.url;
    audio.play().then(() => sonando(true)).catch(() => {
      estadoCancion.textContent = "no se pudo cargar esa URL";
      sonando(false);
    });
  }
}

btnPlay.addEventListener("click", () => {
  if (indiceActual === -1) {
    reproducir(0);
    return;
  }

  if (esYouTube(CANCIONES[indiceActual].url)) {
    reproducir(indiceActual);
    return;
  }

  if (audio.paused) {
    audio.play().catch(() => {});
  } else {
    audio.pause();
  }
});

btnAnterior.addEventListener("click", () =>
  reproducir(siguienteIndice(indiceActual <= 0 ? CANCIONES.length - 1 : indiceActual - 1))
);

btnSiguiente.addEventListener("click", () => reproducir(siguienteIndice(indiceActual + 1)));

audio.addEventListener("play", () => sonando(true));
audio.addEventListener("pause", () => sonando(false));

/* al terminar una canción, sigue la siguiente (o una al azar) */
audio.addEventListener("ended", () => reproducir(siguienteIndice(indiceActual + 1)));

volumen.addEventListener("input", () => {
  audio.volume = parseInt(volumen.value, 10) / 100;
});

fabMusica.addEventListener("click", () => {
  panel.hidden = !panel.hidden;
});

document.getElementById("cerrar-panel").addEventListener("click", () => {
  panel.hidden = true;
});

addEventListener("keydown", (e) => {
    const escribiendo = /input|textarea/i.test(e.target.tagName);
    if (!escribiendo && e.key.toLowerCase() === "m") {
      panel.hidden = !panel.hidden;
    }
  });

  /* las tarjetas de "pistas para madrugar" disparan canciones */
  document.addEventListener("tocar-cancion", (e) => {
    panel.hidden = false;
    reproducir(e.detail);
  });
}

if (!esTactil) {
  const nucleo = document.createElement("div");
  nucleo.className = "cursor-nucleo";
  document.body.appendChild(nucleo);

  const anillo = document.createElement("div");
  anillo.className = "cursor-anillo";
  document.body.appendChild(anillo);

  let objetivoX = innerWidth / 2;
  let objetivoY = innerHeight / 2;
  let nucleoX = objetivoX;
  let nucleoY = objetivoY;
  let anilloX = objetivoX;
  let anilloY = objetivoY;
  let activo = false;
  let ultimoDestello = 0;
  const DESTELLOS = ["✦", "✧", "·"];
  const COLORES = ["#e9c46a", "#b78cff", "#f5a8cb"];

  addEventListener("mousemove", (e) => {
    objetivoX = e.clientX;
    objetivoY = e.clientY;

    if (!activo) {
      nucleoX = anilloX = objetivoX;
      nucleoY = anilloY = objetivoY;
      activo = true;
      nucleo.classList.add("visible-cursor");
      anillo.classList.add("visible-cursor");
    }

    const ahora = performance.now();
    if (ahora - ultimoDestello > 55) {
      ultimoDestello = ahora;
      const d = document.createElement("span");
      d.className = "destello";
      d.textContent = DESTELLOS[Math.floor(Math.random() * DESTELLOS.length)];
      d.style.color = COLORES[Math.floor(Math.random() * COLORES.length)];
      d.style.fontSize = `${Math.random() * 7 + 7}px`;
      d.style.transform = `translate(${objetivoX}px, ${objetivoY}px)`;
      document.body.appendChild(d);
      setTimeout(() => d.remove(), 750);
    }
  });

  document.documentElement.addEventListener("mouseleave", () => {
    activo = false;
    nucleo.classList.remove("visible-cursor");
    anillo.classList.remove("visible-cursor");
  });

  addEventListener("mouseover", (e) => {
    const interactivo = e.target.closest("a, button, input, textarea, .pm-lista li");
    anillo.classList.toggle("activo", Boolean(interactivo));
  });

  addEventListener("pointerdown", (e) => {
    anilloX = objetivoX = e.clientX;
    anilloY = objetivoY = e.clientY;
    nucleoX = e.clientX;
    nucleoY = e.clientY;
    anillo.classList.add("pulso");
    setTimeout(() => anillo.classList.remove("pulso"), 520);
  });

  (function seguirCursor() {
    nucleoX += (objetivoX - nucleoX) * 0.4;
    nucleoY += (objetivoY - nucleoY) * 0.4;
    anilloX += (objetivoX - anilloX) * 0.28;
    anilloY += (objetivoY - anilloY) * 0.28;

    nucleo.style.transform = `translate(${nucleoX}px, ${nucleoY}px)`;
    anillo.style.transform = `translate(${anilloX}px, ${anilloY}px)`;

    requestAnimationFrame(seguirCursor);
  })();
}

/* ---------- navegación entre entradas del blog + extras ---------- */
const ENTRADAS_BLOG = [
  { url: "bienvenida.html", titulo: "Bienvenidos a mi rincón" },
  { url: "canciones-que-recuerdan.html", titulo: "Canciones que recuerdan" },
  { url: "mi-lado-gamer.html", titulo: "Mi lado gamer" },
];

(function montarExtrasBlog() {
  const pagina = location.pathname.split("/").pop() || "index.html";
  const idx = ENTRADAS_BLOG.findIndex((e) => e.url === pagina);
  if (idx < 0) return;

  const cont = document.getElementById("nav-entradas");
  if (cont) {
    const prev = idx > 0 ? ENTRADAS_BLOG[idx - 1] : null;
    const next = idx < ENTRADAS_BLOG.length - 1 ? ENTRADAS_BLOG[idx + 1] : null;
    cont.innerHTML =
      (prev
        ? `<a href="${prev.url}">&larr; anterior<b>${prev.titulo}</b></a>`
        : '<span class="vacio"></span>') +
      (next
        ? `<a href="${next.url}">siguiente &rarr;<b>${next.titulo}</b></a>`
        : '<span class="vacio"></span>');
  }

  const meta = document.querySelector(".articulo-meta");
  const articulo = document.querySelector("main article");
  if (meta && articulo) {
    const palabras = articulo.textContent.trim().split(/\s+/).length;
    const mins = Math.max(1, Math.round(palabras / 180));
    meta.insertAdjacentHTML(
      "beforeend",
      `<span class="badge-lectura">☕ ${mins} min de lectura</span>`
    );

    const btn = document.createElement("button");
    btn.className = "btn-compartir-post";
    btn.type = "button";
    btn.textContent = "⧉ copiar enlace";
    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(location.href);
        toast("enlace de la entrada copiado ✦");
      } catch {
        toast("no pude copiar el enlace :(");
      }
    });
    meta.appendChild(btn);
  }
})();

/* ═══════════════ MI PEQUEÑO ARCHIVO ═══════════════ */
const ARCHIVO = {
  juegos: {
    icono: "🎮",
    titulo: "juegos",
    items: [
      { t: "Doors (Roblox)", d: "me asusto y vuelvo a entrar" },
      { t: "Fortnite", d: "caer de la battle bus nunca cansa" },
      { t: "FNAF", d: "las noches 4 y 5 me quitaron un año de vida" },
    ],
  },
  canciones: {
    icono: "🎧",
    titulo: "en repeat",
    items: [
      { t: "todo lo de 9JackJack8", d: "dreamcore puro" },
      { t: "lofi para llorar tranquilo", d: "playlist infinita" },
    ],
  },
  capturas: {
    icono: "🖼️",
    titulo: "capturas",
    items: [
      { t: "cielo morado de las 5 AM", d: "en alguna partida random" },
      { t: "chat de voz 7 horas", d: "nadie quería colgar" },
    ],
  },
  proyectos: {
    icono: "💻",
    titulo: "proyectos",
    items: [
      { t: "esta página", d: "mi pequeño rincón" },
      { t: "experimentos HTML", d: "cosas que quizá nunca salgan" },
    ],
  },
  viendo: {
    icono: "📺",
    titulo: "viendo",
    items: [
      { t: "vídeos de internet antiguo", d: "webs de los 2000 perdidas" },
      { t: "gameplays con luces bajas", d: "de fondo, siempre" },
    ],
  },
  pensamientos: {
    icono: "📜",
    titulo: "random",
    items: [
      { t: "¿las páginas extrañan a quien las hizo?", d: "" },
      { t: "la noche es el mejor horario para existir", d: "" },
    ],
  },
  sitios: {
    icono: "🔗",
    titulo: "sitios",
    items: [
      { t: "neal.fun", u: "https://neal.fun", d: "internet jugando" },
      { t: "windows93.net", u: "https://windows93.net", d: "nostalgia pura" },
      { t: "theuselessweb.com", u: "https://theuselessweb.com", d: "rincones raros" },
    ],
  },
};

(function montarArchivo() {
  const tabsNav = document.getElementById("archivo-tabs");
  const grid = document.getElementById("archivo-grid");
  if (!tabsNav || !grid) return;

  let actual = "juegos";
  try {
    const g = localStorage.getItem("archivo-tab");
    if (g && ARCHIVO[g]) actual = g;
  } catch {}

  Object.keys(ARCHIVO).forEach((clave) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "archivo-tab";
    b.dataset.cat = clave;
    b.textContent = `${ARCHIVO[clave].icono} ${ARCHIVO[clave].titulo}`;
    b.setAttribute("role", "tab");
    b.addEventListener("click", () => {
      actual = clave;
      try {
        localStorage.setItem("archivo-tab", clave);
      } catch {}
      pintar();
    });
    tabsNav.appendChild(b);
  });

  function pintar() {
    tabsNav.querySelectorAll(".archivo-tab").forEach((b) => {
      b.classList.toggle("activado", b.dataset.cat === actual);
    });
    grid.innerHTML = "";
    grid.classList.remove("listo");
    const cat = ARCHIVO[actual];
    cat.items.forEach((item, i) => {
      const a = document.createElement(item.u ? "a" : "article");
      a.className = "archivo-item glass";
      if (item.u) {
        a.href = item.u;
        a.target = "_blank";
        a.rel = "noopener";
      }
      a.style.transitionDelay = `${i * 60}ms`;
      a.innerHTML =
        `<b>${cat.icono} ${item.t}</b>` +
        (item.d ? `<p>${item.d}</p>` : "") +
        (item.u ? '<span class="archivo-link">abrir ↗</span>' : "");
      grid.appendChild(a);
    });
    requestAnimationFrame(() => requestAnimationFrame(() => grid.classList.add("listo")));
  }

  pintar();
})();

/* ═══════════ CONTADOR DE VISITAS RETRO ═══════════ */
(function contadorVisitas() {
  const el = document.getElementById("num-visitas");
  if (!el) return;

  let locales = 1;
  try {
    locales = parseInt(localStorage.getItem("visitas-locales") || "0", 10) + 1;
    localStorage.setItem("visitas-locales", String(locales));
  } catch {}

  function pintar(n) {
    el.textContent = String(isFinite(n) && n > 0 ? n : locales).padStart(5, "0");
  }

  /* contador público sin cuentas ni servidores propios; si falla, usa el local */
  const control = new AbortController();
  const fuera = setTimeout(() => control.abort(), 3500);
  fetch("https://abacus.jasoncameron.dev/hit/attie-rincon-noche", { signal: control.signal })
    .then((r) => r.text())
    .then((t) => {
      clearTimeout(fuera);
      const n = parseInt(String(t).trim(), 10);
      pintar(isFinite(n) ? n : locales);
    })
    .catch(() => {
      clearTimeout(fuera);
      pintar(locales);
    });
})();

/* ═══════════ EL SECRETO DE LA PÁGINA ═══════════
   Hay estrellitas escondidas + la luna guarda una.
   Reúnelas todas y se abre la puerta secreta. */
const CLAVE_SECRETO = "rincon-secreto-v1";

function estadoSecreto() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_SECRETO) || "{}") || {};
  } catch {}
  return {};
}

function guardarEstadoSecreto(s) {
  try {
    localStorage.setItem(CLAVE_SECRETO, JSON.stringify(s));
  } catch {}
}

function marcarDescubrimiento(id) {
  const s = estadoSecreto();
  if (!s.estrellas) s.estrellas = [];
  if (s.estrellas.includes(id)) return;
  s.estrellas.push(id);
  guardarEstadoSecreto(s);

  const total = 5;
  const faltan = total - s.estrellas.length;
  desbloquearBadge("curioso");
  if (faltan > 0) {
    toast(`✦ has encontrado una estrella secreta… (${s.estrellas.length}/${total})`);
    lluviaDeEstrellas(2);
  }
  revisarSecretoCompleto();
}

function revisarSecretoCompleto() {
  const s = estadoSecreto();
  if (!s.abierto && s.estrellas && s.estrellas.length >= 5) {
    s.abierto = true;
    guardarEstadoSecreto(s);
    desbloquearBadge("cazador");
    setTimeout(() => mostrarPuertaSecreta(), 900);
  }
}

function mostrarPuertaSecreta() {
  if (document.getElementById("puerta-secreta")) return;
  lluviaDeEstrellas(14);

  const puerta = document.createElement("div");
  puerta.id = "puerta-secreta";
  puerta.className = "puerta-secreta";
  puerta.innerHTML =
    '<div class="puerta-caja glass">' +
    "<h3>✦ encontraste el lugar secreto ✦</h3>" +
    "<p>cinco estrellitas dispersas, ninguna etiqueta, solo curiosidad.<br/>esto también era parte del rincón.</p>" +
    '<div class="puerta-botones">' +
    '<a class="btn-accion principal" href="secreto.html">entrar al secreto →</a>' +
    '<button type="button" class="btn-accion" id="cerrar-puerta">después</button>' +
    "</div></div>";
  document.body.appendChild(puerta);
  puerta.querySelector("#cerrar-puerta").addEventListener("click", () => puerta.remove());
}

(function esconderEstrellitas() {
  const s = estadoSecreto();

  function crear(id, contenedorSel, estiloExtra) {
    if (s.estrellas && s.estrellas.includes(id)) return;
    const host = document.querySelector(contenedorSel);
    if (!host) return;
    const st = document.createElement("button");
    st.type = "button";
    st.className = "estrella-escondida";
    st.textContent = "✦";
    Object.assign(st.style, estiloExtra || {});
    st.addEventListener("click", (e) => {
      e.stopPropagation();
      st.remove();
      marcarDescubrimiento(id);
    });
    host.appendChild(st);
  }

  crear("avatar", ".avatar-zona", { top: "6px", right: "14px", position: "absolute" });
  crear("favoritos", ".favoritos", { bottom: "10px", right: "16px", position: "absolute" });
  crear("historia", ".historia", { top: "30px", right: "22px", position: "absolute" });
  crear("cafe", ".hecho-a-mano", { marginLeft: "8px", position: "static", display: "inline-block" });

  /* la quinta: clic en la luna tres veces */
  const luna = document.getElementById("luna");
  if (luna && !(s.estrellas && s.estrellas.includes("luna"))) {
    let clicsLuna = 0;
    luna.addEventListener("click", () => {
      clicsLuna++;
      if (clicsLuna === 2) toast("👀 la luna se siente observada…");
      if (clicsLuna >= 3) {
        marcarDescubrimiento("luna");
        clicsLuna = 0;
      }
    });
  }
})();

/* el texto del pie da pistas, pero no es el camino */
(function pistaDelPie() {
  const btn = document.getElementById("btn-secreto");
  if (!btn) return;
  const pistas = [
    "no es aquí… busca las estrellas ✦",
    "la luna también tiene oídos 👀",
    "mira donde nadie miraría…",
    "✦ ¿cuántas estrellitas llevas?",
  ];
  let i = Math.floor(Math.random() * pistas.length);
  btn.addEventListener("click", () => {
    toast(pistas[i % pistas.length]);
    i++;
  });
})();

/* ═══════════ EXTRAS: consola, konami ═══════════ */
console.log(
  "%c✦ attie · modo noche ✦%c\n¿curioseando la consola? ya eres de los nuestros.\nescribe attie en la página… o busca cinco estrellitas.",
  "color:#b78cff;font-size:18px;font-weight:bold;text-shadow:0 0 12px rgba(183,140,255,.6)",
  "color:#948ca6;font-size:12px"
);

(function konami() {
  const SEQ = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
  let pos = 0;
  addEventListener("keydown", (e) => {
    if (/input|textarea/i.test(e.target.tagName)) return;
    pos = e.key === SEQ[pos] ? pos + 1 : e.key === SEQ[0] ? 1 : 0;
    if (pos === SEQ.length) {
      pos = 0;
      lluviaDeEstrellas(20);
      toast("🕹️ ¡código antiguo aceptado! respeto absoluto");
    }
  });
})();

/* ---------- secreto: escribe "attie" en cualquier lado ---------- */
let secuenciaSecreta = "";
addEventListener("keydown", (e) => {
  if (/input|textarea/i.test(e.target.tagName)) return;
  secuenciaSecreta = (secuenciaSecreta + e.key.toLowerCase()).slice(-5);
  if (secuenciaSecreta === "attie") {
    secuenciaSecreta = "";
    lluviaDeCorazones(26);
    toast("✦ escribiste mi nombre… gracias por estar aquí ✦");
  }
});

/* ---------- tilt 3D sutil en las tarjetas de obsesiones ---------- */
if (!esTactil && !sinAnimacion()) {
  document.querySelectorAll(".fav").forEach((card) => {
    card.style.transition = "transform 0.18s ease-out";
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      const dx = (e.clientX - r.left) / r.width - 0.5;
      const dy = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(700px) rotateX(${(-dy * 7).toFixed(2)}deg) rotateY(${(dx * 9).toFixed(2)}deg) translateY(-4px)`;
    });
    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });
}

/* ---------- parallax cinemático del hero al hacer scroll ---------- */
(function parallaxHero() {
  const perfil = document.querySelector(".perfil");
  const textoHero = document.querySelector(".hero-texto");
  if (!perfil || sinAnimacion()) return;

  let pendiente = false;
  addEventListener(
    "scroll",
    () => {
      if (pendiente) return;
      pendiente = true;
      requestAnimationFrame(() => {
        pendiente = false;
        const y = scrollY;
        if (y <= innerHeight) {
          perfil.style.transform = `translateY(${(y * 0.16).toFixed(1)}px) scale(${(1 - Math.min(y / (innerHeight * 3), 0.08)).toFixed(3)})`;
          perfil.style.opacity = String(Math.max(0, 1 - y / (innerHeight * 0.9)).toFixed(2));
          if (textoHero) textoHero.style.transform = `translateY(${(-y * 0.06).toFixed(1)}px)`;
        }
      });
    },
    { passive: true }
  );
})();

let introVisto = false;
try {
  introVisto = Boolean(sessionStorage.getItem("intro-vista"));
} catch {}

if (document.body.dataset.intro === "si" && !introVisto) {
  const intro = document.createElement("div");
  intro.className = "intro-overlay";
  intro.innerHTML =
    '<span class="intro-estrella">✦</span>' +
    '<h2 class="intro-titulo">attie</h2>' +
    '<p class="intro-sub">modo noche · rincón personal</p>' +
    '<p class="intro-hint">— haz clic para entrar —</p>';

  for (let i = 0; i < 34; i++) {
    const estrellita = document.createElement("i");
    estrellita.className = "intro-estrellita";
    estrellita.style.left = `${(Math.random() * 100).toFixed(1)}%`;
    estrellita.style.top = `${(Math.random() * 100).toFixed(1)}%`;
    const tam = (Math.random() * 1.8 + 0.8).toFixed(1);
    estrellita.style.width = `${tam}px`;
    estrellita.style.height = `${tam}px`;
    estrellita.style.setProperty("--d", `${(Math.random() * 2.4 + 1.6).toFixed(2)}s`);
    estrellita.style.animationDelay = `${(Math.random() * 3).toFixed(2)}s`;
    estrellita.style.opacity = String((Math.random() * 0.55 + 0.25).toFixed(2));
    intro.appendChild(estrellita);
  }
  document.body.appendChild(intro);

  function salirDeIntro() {
    if (!intro.isConnected) return;
    intro.classList.add("hidden");
    setTimeout(() => intro.remove(), 1400);
    removeEventListener("keydown", tecladoIntro);
    try {
      sessionStorage.setItem("intro-vista", "1");
    } catch {}
  }

  function tecladoIntro(e) {
    if (e.key === "Enter" || e.key === " ") salirDeIntro();
  }

  intro.addEventListener("click", salirDeIntro);
  addEventListener("keydown", tecladoIntro);
}

/* ══════════════════════════════════════════════════════════
   SISTEMA DE BADGES · estilo advancements, diseño propio
   ══════════════════════════════════════════════════════════ */
const BADGES = {
  bienvenida: { icono: "🌱", nombre: "GETTING STARTED", desc: "visitaste el rincón por primera vez" },
  buho: { icono: "🌙", nombre: "NIGHT OWL", desc: "viste la página de madrugada" },
  curioso: { icono: "🔎", nombre: "CURIOUS", desc: "encontraste tu primer secreto" },
  cazador: { icono: "⭐", nombre: "STAR HUNTER", desc: "reuniste las cinco estrellitas" },
  hacker: { icono: "💻", nombre: "HACKER", desc: "descubriste la terminal secreta" },
  perdido: { icono: "🕳️", nombre: "LOST", desc: "llegaste donde nadie debía llegar" },
  testigo: { icono: "👁️", nombre: "YOU SAW THAT?", desc: "presenciaste algo raro en directo" },
  radioyente: { icono: "📻", nombre: "ON AIR", desc: "sintonizaste la radio del rincón" },
  coleccionista: { icono: "🖼️", nombre: "ARCHIVIST", desc: "miraste las imágenes de cerca" },
  completista: { icono: "🧠", nombre: "COMPLETIONIST", desc: "desbloqueaste todos los secretos" },
  creditos: { icono: "🏆", nombre: "THE CREDITS", desc: "you discovered everything.", especial: true },
};

const CLAVE_BADGES = "badges-v1";

function leerMisBadges() {
  try {
    const arr = JSON.parse(localStorage.getItem(CLAVE_BADGES) || "[]");
    return Array.isArray(arr) ? arr : [];
  } catch {}
  return [];
}

function sonarBadge(especial) {
  if (sinAnimacion()) return;
  try {
    const ctx = sonarBadge._ctx || (sonarBadge._ctx = new (window.AudioContext || window.webkitAudioContext)());
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    if (ctx.state !== "running") return;
    const t = ctx.currentTime;
    [[880, 0], [1174.7, 0.1]].forEach(([f, d]) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "triangle";
      o.frequency.value = f;
      g.gain.setValueAtTime(0, t + d);
      g.gain.linearRampToValueAtTime(especial ? 0.07 : 0.05, t + d + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + d + 0.55);
      o.connect(g);
      g.connect(ctx.destination);
      o.start(t + d);
      o.stop(t + d + 0.6);
    });
    if (especial) {
      [[1567.98, 0.24], [2093, 0.38]].forEach(([f, d]) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "triangle";
        o.frequency.value = f;
        g.gain.setValueAtTime(0, t + d);
        g.gain.linearRampToValueAtTime(0.06, t + d + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + d + 0.8);
        o.connect(g);
        g.connect(ctx.destination);
        o.start(t + d);
        o.stop(t + d + 0.85);
      });
    }
  } catch {}
}

function notificarBadge(badge) {
  const n = document.createElement("div");
  n.className = "mc-badge" + (badge.especial ? " especial" : "");
  n.innerHTML =
    `<span class="mc-icono">${badge.icono}</span>` +
    '<div class="mc-texto">' +
    `<small>${badge.especial ? "🏆 FINAL BADGE" : "🏆 NEW BADGE"}</small>` +
    `<b>${badge.nombre}</b>` +
    `<p>${badge.desc}</p>` +
    "</div>";
  document.body.appendChild(n);
  setTimeout(() => n.classList.add("fuera"), badge.especial ? 6000 : 4200);
  setTimeout(() => n.remove(), badge.especial ? 6800 : 5000);
}

function desbloquearBadge(id) {
  const badge = BADGES[id];
  if (!badge) return;
  const mios = leerMisBadges();
  if (mios.includes(id)) return;
  mios.push(id);
  try {
    localStorage.setItem(CLAVE_BADGES, JSON.stringify(mios));
  } catch {}
  setTimeout(() => {
    notificarBadge(badge);
    sonarBadge(badge.especial);
    lluviaDeEstrellas(badge.especial ? 12 : 3);
  }, 250);

  /* reacciones en cadena */
  const normales = Object.keys(BADGES).filter((k) => !BADGES[k].especial && k !== "completista");
  if (!BADGES[id].especial && id !== "completista") {
    const faltan = normales.filter((k) => !mios.includes(k));
    if (!faltan.length) {
      setTimeout(() => desbloquearBadge("completista"), 1400);
    }
  } else if (id === "completista") {
    setTimeout(() => desbloquearBadge("creditos"), 2400);
  } else if (id === "creditos") {
    setTimeout(iniciarCreditos, 3400);
  }
}

/* ═══════════ AMBIENTE SEGÚN LA HORA LOCAL ═══════════ */
(function ambientePorHora() {
  const h = new Date().getHours();
  let fase;
  if (h < 6) fase = "madrugada";
  else if (h < 17) fase = "dia";
  else if (h < 20) fase = "atardecer";
  else fase = "noche";
  document.documentElement.dataset.fase = fase;

  if (fase === "madrugada" || fase === "noche") desbloquearBadge("buho");

  /* detalle especial de madrugada: una ventana del castillo se enciende sola */
  if (fase === "madrugada" && !sinAnimacion()) {
    setTimeout(() => {
      const castilloEl = document.getElementById("castillo");
      if (castilloEl) {
        castilloEl.style.setProperty("--ventana-madrugada", "1");
        castilloEl.classList.add("madrugada");
      }
    }, 3000);
  }
})();

/* ═══════════ MEMORIA DEL VISITANTE ═══════════ */
(function memoriaVisitante() {
  let visitas = 1;
  try {
    visitas = parseInt(localStorage.getItem("visitas-locales") || "1", 10) || 1;
  } catch {}

  let saludo;
  if (visitas <= 1) {
    saludo = "✦ oh… eres nuevo por aquí. quédate un rato";
    desbloquearBadge("bienvenida");
  } else if (visitas === 2) {
    saludo = "✦ volviste :D me haces caso";
  } else if (visitas < 6) {
    saludo = "✦ otra vez tú… ya esto es costumbre";
  } else if (visitas < 15) {
    saludo = "✦ bienvenido de vuelta, casi residente";
  } else {
    saludo = "✦ oficialmente eres residente de este rincón";
  }

  setTimeout(() => {
    try {
      if (!sessionStorage.getItem("saludado-hoy")) {
        sessionStorage.setItem("saludado-hoy", "1");
        toast(saludo);
      }
    } catch {}
  }, 1600);
})();

/* ═══════════ ESTRELLAS INTERACTIVAS ═══════════ */
(function estrellasVivas() {
  const cieloEl = document.getElementById("cielo");
  if (!cieloEl || esTactil && Math.random() < 0.5) return;
  const todas = cieloEl.querySelectorAll(".estrella-grande");
  const MSGS = [
    "✦ esa estrella llevaba ahí toda la noche esperándote",
    "✦ hiciste un deseo? no funcionó, pero suena bonito",
    "✦ esta estrella te vio encontrar las otras",
    "✦ parpadeó dos veces. fue intencional",
    "✦ dice que la luna está bien, gracias por preguntar",
  ];
  todas.forEach((e) => {
    if (Math.random() > 0.45) return;
    e.classList.add("estrella-viva");
    e.addEventListener("click", () => {
      toast(MSGS[Math.floor(Math.random() * MSGS.length)]);
      e.classList.add("tocada");
      setTimeout(() => e.classList.remove("tocada"), 900);
      desbloquearBadge("testigo");
    });
  });
})();

/* ═══════════ EVENTOS RANDOM ("¿eso acaba de pasar?") ═══════════ */
(function eventosRandom() {
  const MENSAJES_RAROS = [
    "💬 alguien dejó la luz de una ventana encendida",
    "💬 ¿escuchaste eso?",
    "💬 el rincón respira cuando nadie mira",
    "💬 si estás leyendo esto a las 3 AM, hola",
    "💬 esta página sueña con ser un juego",
    "💬 psst… prueba la tecla que vive bajo escape",
  ];

  function gatoPasa() {
    const gato = document.createElement("div");
    gato.className = "gato-callejero";
    gato.textContent = "🐈‍⬛";
    gato.title = "";
    document.body.appendChild(gato);
    gato.addEventListener("click", () => {
      toast("🐈 …te vio y siguió de largo");
      gato.remove();
    });
    setTimeout(() => gato.remove(), 11000);
  }

  function glitchFugaz() {
    document.body.classList.add("glitchando");
    setTimeout(() => document.body.classList.remove("glitchando"), 520);
  }

  function estrellaCaeGrande() {
    if (!cielo) return;
    const f = document.createElement("span");
    f.className = "estrella-fugaz enorme";
    f.style.top = `${Math.random() * 25}%`;
    f.style.left = `${Math.random() * 40}%`;
    cielo.appendChild(f);
    setTimeout(() => f.remove(), 2600);
  }

  function lunaGuina() {
    const l = document.getElementById("luna");
    if (!l) return;
    l.classList.add("guino");
    setTimeout(() => l.classList.remove("guino"), 1400);
  }

  const EVENTOS = [
    gatoPasa,
    glitchFugaz,
    () => toast(MENSAJES_RAROS[Math.floor(Math.random() * MENSAJES_RAROS.length)]),
    estrellaCaeGrande,
    lunaGuina,
  ];

  function programar() {
    setTimeout(
      () => {
        if (!document.hidden && !sinAnimacion() && Math.random() < 0.75) {
          const ev = EVENTOS[Math.floor(Math.random() * EVENTOS.length)];
          ev();
          desbloquearBadge("testigo");
        }
        programar();
      },
      Math.random() * 22000 + 14000
    );
  }
  programar();
})();

/* ═══════════ TERMINAL SECRETA (tecla ` ) ═══════════ */
(function terminalSecreta() {
  let caja = null;
  let salida = null;

  function abrir() {
    desbloquearBadge("hacker");
    if (caja) {
      caja.hidden = false;
      enfocar();
      return;
    }
    caja = document.createElement("div");
    caja.id = "terminal-secreta";
    caja.innerHTML =
      '<header><span class="term-titulo">rincon@noche:~</span>' +
      '<button type="button" id="term-cerrar">×</button></header>' +
      '<div class="term-salida"></div>' +
      '<form class="term-form"><span>&gt;</span>' +
      '<input id="term-input" autocomplete="off" spellcheck="false" /></form>';
    document.body.appendChild(caja);
    salida = caja.querySelector(".term-salida");
    imprimir("terminal v0.9 — escribe 'help' para empezar");
    caja.querySelector("#term-cerrar").addEventListener("click", cerrar);
    caja.querySelector(".term-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const inp = caja.querySelector("#term-input");
      const valor = inp.value.trim();
      inp.value = "";
      if (!valor) return;
      imprimir(`&gt; ${valor.replace(/</g, "&lt;")}`);
      ejecutar(valor.toLowerCase());
    });
    enfocar();
  }

  function enfocar() {
    requestAnimationFrame(() => caja && caja.querySelector("#term-input").focus());
  }

  function cerrar() {
    if (caja) caja.hidden = true;
  }

  function imprimir(html, clase) {
    if (!salida) return;
    const linea = document.createElement("div");
    linea.className = "term-linea" + (clase ? ` ${clase}` : "");
    linea.innerHTML = html;
    salida.appendChild(linea);
    salida.scrollTop = salida.scrollHeight;
  }

  function ejecutar(cmd) {
    const [base, ...args] = cmd.split(/\s+/);
    switch (base) {
      case "help":
        imprimir("comandos: help · about · music · projects · secrets · badges · whoami · hora · clear · exit");
        break;
      case "about":
        imprimir("attie ✦ RAAAAAHHH Fan #1 — guardian de este rincón nocturno.<br/>hecho a mano entre madrugadas.");
        break;
      case "music":
        imprimir("abriendo playlist ♪");
        const fab = document.getElementById("fab-musica");
        const panel = document.getElementById("panel-musica");
        if (panel) panel.hidden = false;
        if (!fab && typeof CANCIONES !== "undefined" && typeof audio !== "undefined") {
          /* sin botón en páginas simples: reproduce directo */
          try { reproducir(0); } catch {}
        }
        break;
      case "projects":
        imprimir("llevándote al archivo…");
        document.getElementById("archivo-tabs")?.scrollIntoView({ behavior: "smooth", block: "start" });
        break;
      case "secrets": {
        const s = estadoSecreto();
        const est = s.estrellas ? s.estrellas.length : 0;
        const bd = leerMisBadges().length;
        imprimir(`estrellitas: ${est}/5 · badges: ${bd}/${Object.keys(BADGES).length} · pista: la luna cuenta clics`);
        break;
      }
      case "badges": {
        const mios = leerMisBadges();
        if (!mios.length) imprimir("aún no tienes ninguno… el rincón espera");
        else mios.forEach((k) => BADGES[k] && imprimir(`${BADGES[k].icono} ${BADGES[k].nombre}`, "ok"));
        break;
      }
      case "whoami": {
        let nombre = "?";
        let vis = "?";
        try { nombre = localStorage.getItem("tu-nombre") || "anónimo nocturno"; vis = localStorage.getItem("visitas-locales") || "1"; } catch {}
        imprimir(`${nombre} · ${vis} visitas · nivel de curiosidad: alto`);
        break;
      }
      case "hora": {
        const tz = (() => { try { return Intl.DateTimeFormat().resolvedOptions().timeZone; } catch {} return "?"; })();
        imprimir(new Date().toLocaleString() + ` — ${tz}`);
        break;
      }
      case "clear":
        if (salida) salida.innerHTML = "";
        break;
      case "exit":
      case "close":
        cerrar();
        break;
      /* ---- comandos ocultos ---- */
      case "lost":
        imprimir("…¿seguro? llevándote al fondo.", "warn");
        setTimeout(() => (location.href = "lost.html"), 1200);
        break;
      case "credits":
        if (leerMisBadges().includes("creditos")) iniciarCreditos();
        else imprimir("aún no lo ganaste. quedan secretos por descubrir.", "warn");
        break;
      case "sudo":
        imprimir("bonito intento. aquí los permisos los da la curiosidad.");
        break;
      case "matrix":
        imprimir("no hay cucharas.");
        document.documentElement.animate?.(
          [{ filter: "hue-rotate(0)" }, { filter: "hue-rotate(115deg)" }, { filter: "hue-rotate(0)" }],
          { duration: 1800 }
        );
        break;
      case "luna":
        imprimir("la luna cuenta hasta tres. en silencio.");
        break;
      case "attie":
        imprimir("❤ ella dice hola de vuelta");
        if (typeof lluviaDeCorazones === "function") lluviaDeCorazones(14);
        break;
      default:
        imprimir(`comando no encontrado: ${base} — prueba 'help'`, "err");
    }
  }

  addEventListener("keydown", (e) => {
    const escribiendo = /input|textarea/i.test(e.target.tagName);
    if (escribiendo) return;
    if (e.key === "`" || (e.key === "~" && e.shiftKey)) {
      e.preventDefault();
      caja && !caja.hidden ? cerrar() : abrir();
    }
    if (e.key === "Escape" && caja && !caja.hidden) cerrar();
  });
})();

/* ═══════════ MODO RADIO ═══════════ */
(function modoRadio() {
  const btn = document.getElementById("btn-radio");
  if (!btn) return;

  function refrescar(alAire) {
    btn.textContent = alAire ? "📻 al aire" : "📻 radio";
    btn.classList.toggle("activado", alAire);
  }

  let encendida = false;
  try {
    encendida = localStorage.getItem("radio") === "1";
  } catch {}

  btn.addEventListener("click", () => {
    encendida = !encendida;
    try {
      localStorage.setItem("radio", encendida ? "1" : "0");
      localStorage.setItem("aleatorio", encendida ? "1" : "0");
    } catch {}

    if (encendida) {
      desbloquearBadge("radioyente");
      toast("📻 radio del rincón encendida — now playing…");
      const panel = document.getElementById("panel-musica");
      const fab = document.getElementById("fab-musica");
      const indiceAzar = Math.floor(Math.random() * CANCIONES.length);
      if (typeof indiceActual === "number" && typeof reproducir === "function") {
        reproducir(indiceAzar);
      }
      if (panel) panel.hidden = false;
      refrescar(true);
    } else {
      toast("📻 radio apagada");
      try { audio.pause(); } catch {}
      refrescar(false);
    }
  });

  if (encendida) refrescar(true);
})();

/* ═══════════ THE CREDITS ═══════════ */
function iniciarCreditos() {
  if (document.getElementById("creditos-overlay")) return;

  const LINEAS = [
    ["✦ ✦ ✦", "titulo"],
    ["RAAAAAHHH FAN #1<br>WEBSITE", "titulo"],
    ["PRESENTADO POR", "rol"],
    ["angel moon blosson", "nombre"],
    ["━━━━━━━━━━", "sep"],
    ["creado por", "rol"],
    ["angel moon blosson", "nombre"],
    ["diseño", "rol"],
    ["angel moon blosson", "nombre"],
    ["código", "rol"],
    ["angel moon blosson", "nombre"],
    ["bugs", "rol"],
    ["también angel moon blosson", "nombre"],
    ["decisiones cuestionables", "rol"],
    ["angel moon blosson", "nombre"],
    ["testing", "rol"],
    ["alguna pobre persona", "nombre"],
    ["música", "rol"],
    ["la playlist ✦ 9JackJack8", "nombre"],
    ["━━━━━━━━━━", "sep"],
    ["GRACIAS POR EXPLORAR", "titulo"],
    ["no había ningún premio", "rol"],
    ["✦ ✦ ✦", "titulo"],
  ];

  const ov = document.createElement("div");
  ov.id = "creditos-overlay";
  ov.innerHTML =
    '<button type="button" id="creditos-saltar">saltar »</button>' +
    '<div class="creditos-rueda">' +
    '<p class="creditos-aviso">🎬 STARTING CREDITS...</p>' +
    LINEAS.map(([txt, cls]) => `<p class="cred-${cls}">${txt}</p>`).join("") +
    "</div>";
  document.body.appendChild(ov);

  let terminado = false;

  function faseFinal() {
    if (terminado) return;
    terminado = true;
    ov.innerHTML = '<p class="creditos-espera">…espera.</p>';
    setTimeout(() => {
      ov.innerHTML =
        '<p class="creditos-espera">¿pensaste que había terminado?</p>' +
        '<div class="puerta-botones"><a class="btn-accion principal" href="lost.html">ir más profundo ↓</a>' +
        '<button type="button" class="btn-accion" id="creditos-salir">salir</button></div>';
      ov.querySelector("#creditos-salir").addEventListener("click", () => ov.remove());
    }, 3200);
  }

  ov.querySelector("#creditos-saltar").addEventListener("click", faseFinal);
  const rueda = ov.querySelector(".creditos-rueda");
  rueda.addEventListener("animationend", faseFinal);
}

/* ═══════════ GALERÍA + LIGHTBOX ═══════════ */
const GALERIA = [
  { img: "https://picsum.photos/seed/dreamcore-attie/640/420.jpg", t: "cielo morado de las 5 AM" },
  { img: "https://picsum.photos/seed/liminal-space/640/420.jpg", t: "pasillo que no acaba" },
  { img: "https://picsum.photos/seed/nightrun/640/420.jpg", t: "luces de la ciudad dormida" },
  { img: "https://picsum.photos/seed/vaporwave9/640/420.jpg", t: "atardecer de neón" },
  { img: "https://picsum.photos/seed/moonwindow/640/420.jpg", t: "la ventana encendida" },
  { img: "https://picsum.photos/seed/oldweb3/640/420.jpg", t: "internet antiguo, pantalla baja" },
];

(function montarGaleria() {
  const grid = document.getElementById("galeria-grid");
  if (!grid) return;

  GALERIA.forEach((item, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "galeria-item";
    b.style.transitionDelay = `${i * 50}ms`;
    b.innerHTML = `<img src="${item.img}" alt="${item.t}" loading="lazy" /><span>${item.t}</span>`;
    b.addEventListener("click", () => abrirLightbox(item));
    grid.appendChild(b);
  });
  requestAnimationFrame(() => requestAnimationFrame(() => grid.classList.add("listo")));

  function abrirLightbox(item) {
    let lb = document.getElementById("lightbox");
    if (!lb) {
      lb = document.createElement("div");
      lb.id = "lightbox";
      lb.innerHTML =
        '<figure class="lb-caja">' +
        '<img alt="" />' +
        "<figcaption></figcaption>" +
        '<button type="button" id="lb-cerrar">×</button>' +
        "</figure>";
      document.body.appendChild(lb);
      lb.addEventListener("click", (e) => {
        if (e.target === lb || e.target.id === "lb-cerrar") cerrar();
      });
      addEventListener("keydown", (e) => {
        if (e.key === "Escape") cerrar();
      });
      function cerrar() {
        lb.classList.remove("abierta");
        setTimeout(() => (lb.hidden = true), 350);
      }
    }
    desbloquearBadge("coleccionista");
    lb.querySelector("img").src = item.img;
    lb.querySelector("img").alt = item.t;
    lb.querySelector("figcaption").textContent = `✦ ${item.t}`;
    lb.hidden = false;
    requestAnimationFrame(() => lb.classList.add("abierta"));
  }
})();

/* ═══════════ ESTADO DE LA WEB ═══════════ */
(function estadoWeb() {
  const moodEl = document.getElementById("sw-mood");
  if (!moodEl) return;
  const h = new Date().getHours();
  let mood;
  if (h < 6) mood = "🌙 mood: sleepy";
  else if (h < 12) mood = "☕ mood: despertando";
  else if (h < 19) mood = "🌤 mood: en calma";
  else mood = "🌌 mood: nocturno";
  moodEl.textContent = mood;
})();

/* ═══════════ CURSOR: modo especial para elementos secretos ═══════════ */
if (!esTactil) {
  addEventListener("mouseover", (e) => {
    const anillo = document.querySelector(".cursor-anillo");
    if (!anillo) return;
    const secreto = e.target.closest?.(
      ".estrella-escondida, #luna, .estrella-viva, #btn-secreto, .archivo-item[href]"
    );
    anillo.classList.toggle("modo-secreto", Boolean(secreto));
  });
}

/* ═══════════ JUICE: chispas al hacer clic ═══════════ */
(function chispasAlClic() {
  const GLIFOS = ["✦", "✧", "♥", "＋", "·"];

  addEventListener("pointerdown", (e) => {
    if (sinAnimacion()) return;

    for (let i = 0; i < 6; i++) {
      const s = document.createElement("span");
      s.className = "chispa";
      s.textContent = GLIFOS[Math.floor(Math.random() * GLIFOS.length)];
      const ang = Math.random() * Math.PI * 2;
      const dist = 34 + Math.random() * 52;
      s.style.left = `${e.clientX}px`;
      s.style.top = `${e.clientY}px`;
      s.style.setProperty("--dx", `${Math.cos(ang) * dist}px`);
      s.style.setProperty("--dy", `${Math.sin(ang) * dist - 18}px`);
      s.style.setProperty("--rot", `${Math.random() * 260 - 130}deg`);
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 950);
    }
  }, { passive: true });
})();

/* ═══════════ JUICE: notas musicales cuando suena algo ═══════════ */
(function notasMusicales() {
  setInterval(() => {
    if (sinAnimacion() || !audio || audio.paused) return;
    const fab = document.getElementById("fab-musica");
    if (!fab) return;

    const r = fab.getBoundingClientRect();
    const n = document.createElement("span");
    n.className = "nota-flotante";
    n.textContent = ["♪", "♫", "♩"][Math.floor(Math.random() * 3)];
    n.style.left = `${r.left + r.width / 2 + (Math.random() * 26 - 13)}px`;
    n.style.top = `${r.top - 6}px`;
    n.style.fontSize = `${12 + Math.random() * 7}px`;
    n.style.setProperty("--dx", `${Math.random() * 60 - 30}px`);
    n.style.setProperty("--rot", `${Math.random() * 50 - 25}deg`);
    document.body.appendChild(n);
    setTimeout(() => n.remove(), 2700);
  }, 3600);
})();

/* ═══════════ JUICE: cosas que se menean solas ═══════════ */
(function menearCosas() {
  function programar() {
    setTimeout(
      () => {
        if (!document.hidden && !sinAnimacion()) {
          const candidatos = [
            ...document.querySelectorAll(".seccion-kicker"),
            ...document.querySelectorAll(".ornamento-seccion span"),
            ...document.querySelectorAll(".badges .badge"),
          ];
          const visibles = candidatos.filter((el) => {
            const r = el.getBoundingClientRect();
            return r.top > 0 && r.top < innerHeight && r.width > 0;
          });
          if (visibles.length) {
            const el = visibles[Math.floor(Math.random() * visibles.length)];
            el.classList.add("menear");
            setTimeout(() => el.classList.remove("menear"), 950);
          }
        }
        programar();
      },
      Math.random() * 6000 + 7000
    );
  }
  programar();
})();
