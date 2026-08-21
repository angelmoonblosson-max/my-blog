// ════════════════════════════════════════════════
//  EDITA TUS CANCIONES AQUÍ ↓ URL de YouTube o mp3
// ════════════════════════════════════════════════
const CANCIONES = [
  { titulo: "Lo-fi para concentrarse", url: "https://www.youtube.com/watch?v=jfKfPfyJRdk" },
  { titulo: "Noches tranquilas", url: "https://www.youtube.com/watch?v=5qap5aO4i9A" },
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

const cielo = document.getElementById("cielo");

if (cielo && !sinAnimacion) {
  for (let i = 0; i < 80; i++) {
    const estrella = document.createElement("span");
    estrella.className = "estrella";
    const tamano = Math.random() * 2 + 1;
    estrella.style.width = estrella.style.height = `${tamano}px`;
    estrella.style.left = `${Math.random() * 100}%`;
    estrella.style.top = `${Math.random() * 100}%`;
    estrella.style.setProperty("--d", `${Math.random() * 3 + 2}s`);
    estrella.style.animationDelay = `${Math.random() * 3}s`;
    cielo.appendChild(estrella);
  }
}

const contenedorOrbes = document.getElementById("orbes");
const CLASES_ORBE = ["lila", "oro", "rosa"];

if (contenedorOrbes && !sinAnimacion) {
  for (let i = 0; i < 12; i++) {
    const orbe = document.createElement("span");
    orbe.className = `orbe ${CLASES_ORBE[i % 3]}`;
    const tamano = Math.random() * 110 + 50;
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
  if (document.querySelectorAll(".luciernaga").length > 14) return;

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

if (!sinAnimacion) setInterval(lanzarLuciernaga, 1400);

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

if (!sinAnimacion) {
  (function programarFugaces() {
    setTimeout(() => {
      lanzarEstrellaFugaz();
      programarFugaces();
    }, Math.random() * 7000 + 5000);
  })();
}

const frases = [
  "gracias por tomarte el tiempo de visitar mi rincón",
  "aquí siempre hay algo sonando de fondo",
  "explora con calma, quédate lo que quieras",
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

addEventListener("pointerdown", (e) => {
  if (sinAnimacion || e.button !== 0) return;

  for (let i = 0; i < 8; i++) {
    const chispa = document.createElement("span");
    chispa.className = "chispa";
    chispa.style.left = e.clientX + "px";
    chispa.style.top = e.clientY + "px";
    chispa.style.background = ["#e9c46a", "#b78cff", "#f5a8cb"][i % 3];
    chispa.style.boxShadow = `0 0 10px ${chispa.style.background}`;
    document.body.appendChild(chispa);

    const angulo = (Math.PI * 2 * i) / 8 + Math.random();
    const distancia = 30 + Math.random() * 40;

    requestAnimationFrame(() => {
      chispa.style.transform = `translate(${Math.cos(angulo) * distancia}px, ${Math.sin(angulo) * distancia}px) scale(0)`;
      chispa.style.opacity = "0";
    });

    setTimeout(() => chispa.remove(), 650);
  }
});

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
  const m = url.match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([\w-]{11})/);
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

const intro = document.createElement("div");
intro.className = "intro-overlay";
intro.innerHTML = '<p class="intro-hint">— haz clic para entrar —</p>';
document.body.appendChild(intro);

function salirDeIntro() {
  intro.classList.add("hidden");
  setTimeout(() => intro.remove(), 950);
  removeEventListener("keydown", tecladoIntro);
}

function tecladoIntro(e) {
  if (e.key === "Enter" || e.key === " ") salirDeIntro();
}

intro.addEventListener("click", salirDeIntro);
addEventListener("keydown", tecladoIntro);
