// ════════════════════════════════════════════════
//  EDITA TUS CANCIONES AQUÍ ↓ URL de YouTube o mp3
// ════════════════════════════════════════════════
const CANCIONES = [
  { titulo: "Hollow Memory ✦ dreamcore", url: "https://cdn.pixabay.com/download/audio/2026/08/11/audio_ad420da63d.mp3?filename=9jackjack8-hollow-memory-nostalgic-dreamcore-beat-584029.mp3" },
  { titulo: "Loft ✦ ethereal", url: "https://cdn.pixabay.com/download/audio/2026/06/08/audio_394eae53a8.mp3?filename=9jackjack8-loft-dreamcore-ethereal-548568.mp3" },
];

const esTactil = window.matchMedia("(pointer: coarse)").matches;
const sinAnimacion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
if (eventoGuardado) document.documentElement.dataset.evento = eventoGuardado;

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
    "<header><b>✦ Personalizar</b>" +
    '<button id="cerrar-settings" type="button" title="Cerrar">×</button></header>' +
    '<span class="ps-etiqueta">Ambiente</span>' +
    '<div class="ps-fila">' +
    '<button type="button" class="ps-op modo-op" data-modo="">🌙 Noche</button>' +
    '<button type="button" class="ps-op modo-op" data-modo="claro">☀️ Día</button>' +
    "</div>" +
    '<span class="ps-etiqueta">Evento del cielo</span>' +
    '<div class="ps-fila">' +
    '<button type="button" class="ps-op ev-op" data-evento="">✦ Calma</button>' +
    '<button type="button" class="ps-op ev-op" data-evento="eclipse">🌑 Eclipse</button>' +
    "</div>" +
    '<div class="ps-fila" style="margin-top:.5rem">' +
    '<button type="button" class="ps-op ev-op" data-evento="meteoros">☄️ Meteoros</button>' +
    '<button type="button" class="ps-op ev-op" data-evento="aurora">🌌 Aurora</button>' +
    "</div>" +
    '<span class="ps-etiqueta">Fondo propio (URL de imagen)</span>' +
    '<input id="input-fondo-url" type="url" placeholder="pega el URL de una imagen…" spellcheck="false">' +
    '<div class="ps-fila" style="margin-top:.5rem">' +
    '<button type="button" id="btn-aplicar-fondo" class="ps-op">Aplicar</button>' +
    '<button type="button" id="btn-quitar-fondo" class="ps-op">Quitar</button>' +
    "</div>" +
    '<div class="ps-fila" style="margin-top:.9rem">' +
    '<button type="button" id="btn-restablecer" class="ps-op peligro">Restablecer todo</button>' +
    "</div>" +
    '<p class="ps-nota">Tu estilo se guarda solo en este navegador.</p>';
  document.body.appendChild(panel);

  function marcarModo() {
    const actual = document.documentElement.dataset.modo || "";
    panel.querySelectorAll(".modo-op").forEach((b) => {
      b.classList.toggle("activo", (b.dataset.modo || "") === actual);
    });
  }

  function abrir() {
    panel.hidden = !panel.hidden;
    if (!panel.hidden) {
      marcarModo();
      marcarEvento();
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
    meteoros: "☄️ Lluvia de meteoros",
    aurora: "🌌 Aurora boreal encendida",
  };

  panel.querySelectorAll(".ev-op").forEach((b) => {
    b.addEventListener("click", () => {
      const v = b.dataset.evento || "";
      if (v) document.documentElement.dataset.evento = v;
      else delete document.documentElement.dataset.evento;
      try {
        localStorage.setItem("evento", v);
      } catch {}
      eventoGuardado = v;
      marcarEvento();
      toast(NOMBRES_EVENTOS[v] || "✦ Evento cambiado");
    });
  });

  function marcarEvento() {
    const actual = document.documentElement.dataset.evento || "";
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
      localStorage.removeItem("modo");
      localStorage.removeItem("fondo-url");
      localStorage.removeItem("tema");
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
  if (e.key === "?") toast("⌨️ M = música · ? = ayuda · ⚙ arriba = personalizar");
});

const tituloOriginal = document.title;
document.addEventListener("visibilitychange", () => {
  document.title = document.hidden
    ? "✦ vuelve, la noche te espera…"
    : tituloOriginal;
});

const cielo = document.getElementById("cielo");

if (cielo && !sinAnimacion) {
  const factorPantalla = Math.min(
    1.45,
    Math.max(1, (window.innerWidth * window.innerHeight) / (1440 * 800))
  );

  for (let i = 0; i < Math.round(65 * factorPantalla); i++) {
    const estrella = document.createElement("span");
    estrella.className = "estrella";
    const tamano = Math.random() * 1.8 + 0.8;
    estrella.style.width = estrella.style.height = `${tamano}px`;
    estrella.style.left = `${Math.random() * 100}%`;
    estrella.style.top = `${Math.random() * 100}%`;
    estrella.style.setProperty("--d", `${Math.random() * 3 + 2}s`);
    estrella.style.animationDelay = `${Math.random() * 3}s`;
    estrella.style.opacity = String(Math.random() * 0.55 + 0.25);
    cielo.appendChild(estrella);
  }

  for (let i = 0; i < Math.round(9 * factorPantalla); i++) {
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

["sol", "corona", "eclipse-noche"].forEach((id) => {
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
];

let ratonPx = 0;
let ratonPy = 0;
let rafParallax = null;

function aplicarParallax() {
  if (sinAnimacion) return;
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

if (!esTactil && !sinAnimacion) {
  addEventListener("mousemove", (e) => {
    ratonPx = e.clientX / innerWidth - 0.5;
    ratonPy = e.clientY / innerHeight - 0.5;
    pedirParallax();
  });
}

const contenedorOrbes = document.getElementById("orbes");
const CLASES_ORBE = ["lila", "oro", "rosa"];

if (contenedorOrbes && !sinAnimacion) {
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

const COLORES_LUZ = ["#e9c46a", "#b78cff", "#f5a8cb"];

function lanzarLuciernaga() {
  if (sinAnimacion) return;
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

if (!sinAnimacion) setInterval(lanzarLuciernaga, 2600);

function lanzarEstrellaFugaz() {
  if (!cielo || sinAnimacion) return;
  const fugaz = document.createElement("span");
  fugaz.className = "estrella-fugaz";
  fugaz.style.top = `${Math.random() * 35}%`;
  fugaz.style.left = `${Math.random() * 45}%`;
  cielo.appendChild(fugaz);
  setTimeout(() => fugaz.remove(), 1600);
}

function lluviaDeEstrellas(cantidad) {
  if (!cielo || sinAnimacion) return;
  let n = 0;
  const intervalo = setInterval(() => {
    lanzarEstrellaFugaz();
    lanzarEstrellaFugaz();
    if (++n >= cantidad) clearInterval(intervalo);
  }, 120);
}

/* meteoros solo durante el evento "meteoros" */
(function programarFugaces() {
  setTimeout(() => {
    if (document.documentElement.dataset.evento === "meteoros") lanzarEstrellaFugaz();
    programarFugaces();
  }, Math.random() * 4500 + 2200);
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
  const estados = [
    "🎮 en una partida",
    "🎧 con los audífonos puestos",
    "💻 creando algo nuevo",
    "🌙 modo noche activado",
    "☕ tomando un descanso",
  ];
  let estadoIdx = 0;

  setInterval(() => {
    actividadEl.classList.add("cambiando");
    setTimeout(() => {
      estadoIdx = (estadoIdx + 1) % estados.length;
      actividadEl.textContent = estados[estadoIdx];
      actividadEl.classList.remove("cambiando");
    }, 300);
  }, 4000);
}

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

if (avatarTilt && !esTactil && !sinAnimacion) {
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
  if (sinAnimacion) return;

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
  if (sinAnimacion || e.button !== 0) return;
  crearChispas(e.clientX, e.clientY, 8);
});

function lluviaDeCorazones(cantidad) {
  if (sinAnimacion) return;
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
  if (sinAnimacion) return;
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

  audio.volume = parseInt(volumen.value, 10) / 100;

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
}

function reproducir(i) {
  if (!CANCIONES.length) return;
  indiceActual = ((i % CANCIONES.length) + CANCIONES.length) % CANCIONES.length;

  const cancion = CANCIONES[indiceActual];
  marcarActiva(indiceActual);
  nombreCancion.textContent = cancion.titulo;
  nowNombre.textContent = cancion.titulo;
  nowPlaying.hidden = false;
  estadoCancion.textContent = "cargando…";

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
  reproducir(indiceActual <= 0 ? CANCIONES.length - 1 : indiceActual - 1)
);

btnSiguiente.addEventListener("click", () => reproducir(indiceActual + 1));

audio.addEventListener("play", () => sonando(true));
audio.addEventListener("pause", () => sonando(false));

/* al terminar una canción, sigue la siguiente */
audio.addEventListener("ended", () => reproducir(indiceActual + 1));

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

let introVisto = false;
try {
  introVisto = Boolean(sessionStorage.getItem("intro-vista"));
} catch {}

if (document.body.dataset.intro === "si" && !introVisto) {
  const intro = document.createElement("div");
  intro.className = "intro-overlay";
  intro.innerHTML = '<p class="intro-hint">— haz clic para entrar —</p>';
  document.body.appendChild(intro);

  function salirDeIntro() {
    intro.classList.add("hidden");
    setTimeout(() => intro.remove(), 950);
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
