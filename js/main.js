/* ═══ ATTIE — dimensión matemática ═══ */

(function anio() {
  const el = document.getElementById("anio");
  if (el) el.textContent = String(new Date().getFullYear());
})();

/* ── lienzo: poliedros 3D en wireframe flotando en la dimensión ── */
(function escena() {
  const lienzo = document.getElementById("lienzo");
  const html = document.documentElement;
  if (!lienzo) return;
  const ctx = lienzo.getContext("2d");

  function formaCubo() {
    const v = [];
    for (const x of [-1, 1]) for (const y of [-1, 1]) for (const z of [-1, 1]) v.push([x, y, z]);
    const e = [];
    for (let i = 0; i < 8; i++)
      for (let j = i + 1; j < 8; j++) {
        let d = 0;
        for (let k = 0; k < 3; k++) d += (v[i][k] - v[j][k]) ** 2;
        if (Math.abs(Math.sqrt(d) - 2) < 0.01) e.push([i, j]);
      }
    return { v, e };
  }

  function formaOctaedro() {
    const v = [];
    for (let i = 0; i < 3; i++) {
      v.push([1, 0, 0].map((n, k) => (k === i ? n : 0)));
      v.push([-1, 0, 0].map((n, k) => (k === i ? n : 0)));
    }
    const e = [];
    for (let i = 0; i < 6; i++)
      for (let j = i + 1; j < 6; j++) {
        const a = v[i], b = v[j];
        if (!(a[0] === -b[0] && a[1] === -b[1] && a[2] === -b[2])) e.push([i, j]);
      }
    return { v, e };
  }

  function formaIcosaedro() {
    const fi = (1 + Math.sqrt(5)) / 2;
    const base = [
      [-1, fi, 0], [1, fi, 0], [-1, -fi, 0], [1, -fi, 0],
      [0, -1, fi], [0, 1, fi], [0, -1, -fi], [0, 1, -fi],
      [fi, 0, -1], [fi, 0, 1], [-fi, 0, -1], [-fi, 0, 1]
    ];
    const v = base.map((p) => p.map((n) => n / Math.hypot(...p)));
    const e = [];
    for (let i = 0; i < 12; i++)
      for (let j = i + 1; j < 12; j++) {
        const d = Math.hypot(v[i][0] - v[j][0], v[i][1] - v[j][1], v[i][2] - v[j][2]);
        if (d < 1.2) e.push([i, j]);
      }
    return { v, e };
  }

  function formaTetraedro() {
    const s = 1 / Math.sqrt(3);
    const v = [[1,1,1],[1,-1,-1],[-1,1,-1],[-1,-1,1]].map((p) => p.map((n) => n * s));
    return { v, e: [[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]] };
  }

  const FORMAS = [formaIcosaedro(), formaCubo(), formaOctaedro(), formaTetraedro()];
  const FIGURAS = [
    { f: FORMAS[0], px: 0.16, py: 0.3, tam: 90, vx: 0.0032, vy: 0.0051 },
    { f: FORMAS[1], px: 0.82, py: 0.24, tam: 64, vx: -0.0044, vy: 0.0037 },
    { f: FORMAS[2], px: 0.72, py: 0.72, tam: 110, vx: 0.0026, vy: -0.0046 },
    { f: FORMAS[3], px: 0.28, py: 0.78, tam: 56, vx: -0.0038, vy: -0.0029 },
    { f: FORMAS[0], px: 0.55, py: 0.12, tam: 40, vx: 0.0058, vy: 0.0042 },
    { f: FORMAS[2], px: 0.06, py: 0.62, tam: 46, vx: 0.0049, vy: 0.0031 },
    { f: FORMAS[1], px: 0.93, py: 0.55, tam: 38, vx: -0.0033, vy: 0.0056 }
  ].map((o) => ({ ...o, ax: Math.random() * 6, ay: Math.random() * 6 }));

  let w = 0;
  let h = 0;
  let dpr = 1;

  function medir() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    w = innerWidth;
    h = innerHeight;
    lienzo.width = w * dpr;
    lienzo.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
  }

  medir();
  addEventListener("resize", medir);

  let ratonX = 0.5;
  let ratonY = 0.5;
  let inclX = 0;
  let inclY = 0;

  addEventListener(
    "pointermove",
    (ev) => {
      ratonX = ev.clientX / innerWidth;
      ratonY = ev.clientY / innerHeight;
    },
    { passive: true }
  );

  let colorAcento = "#67e8f9";
  let fotograma = 0;
  function refrescarColor() {
    colorAcento = getComputedStyle(html).getPropertyValue("--cian").trim() || colorAcento;
  }
  refrescarColor();
  addEventListener("acento-cambio", refrescarColor);

  function proyectar(p, rot, cx, cy, tam) {
    const cosX = Math.cos(rot.ax);
    const sinX = Math.sin(rot.ax);
    const cosY = Math.cos(rot.ay);
    const sinY = Math.sin(rot.ay);
    let [x, y, z] = p;
    let x1 = x * cosY + z * sinY;
    let z1 = -x * sinY + z * cosY;
    let y1 = y * cosX - z1 * sinX;
    z1 = y * sinX + z1 * cosX;
    const f = 3.2 / (3.2 + z1);
    return [cx + x1 * tam * f, cy + y1 * tam * f, f];
  }

  let corriendo = true;

  function cuadro() {
    fotograma++;
    const modo = html.dataset.efectos || "epico";
    const fondoApagado = document.getElementById("cfg-fondo")
      ? !document.getElementById("cfg-fondo").checked
      : false;

    if (modo === "off" || fondoApagado || document.hidden) {
      if (corriendo) {
        ctx.clearRect(0, 0, w, h);
        corriendo = false;
      }
      requestAnimationFrame(cuadro);
      return;
    }
    corriendo = true;

    if (modo === "normal" && fotograma % 2 === 0) {
      requestAnimationFrame(cuadro);
      return;
    }

    ctx.fillStyle = "rgba(6, 8, 13, 0.16)";
    ctx.fillRect(0, 0, w, h);

    inclX += ((ratonY - 0.5) * 0.5 - inclX) * 0.04;
    inclY += ((ratonX - 0.5) * 0.6 - inclY) * 0.04;

    for (const fig of FIGURAS) {
      fig.ax += fig.vx;
      fig.ay += fig.vy;
      const cx = fig.px * w;
      const cy = fig.py * h;
      const rot = { ax: fig.ax + inclX, ay: fig.ay + inclY };
      const pts = fig.f.v.map((p) => proyectar(p, rot, cx, cy, fig.tam));

      for (const [a, b] of fig.f.e) {
        const pa = pts[a];
        const pb = pts[b];
        const prof = (pa[2] + pb[2]) / 2;
        ctx.strokeStyle = colorAcento;
        ctx.globalAlpha = 0.14 + prof * 0.3;
        ctx.lineWidth = prof > 1 ? 1.2 : 0.7;
        ctx.beginPath();
        ctx.moveTo(pa[0], pa[1]);
        ctx.lineTo(pb[0], pb[1]);
        ctx.stroke();
      }

      ctx.globalAlpha = 0.75;
      ctx.fillStyle = colorAcento;
      for (const p of pts) {
        if (p[2] < 0.86) continue;
        ctx.fillRect(p[0] - 1, p[1] - 1, 2, 2);
      }
      ctx.globalAlpha = 1;
    }

    requestAnimationFrame(cuadro);
  }

  requestAnimationFrame(cuadro);
})();

/* ── coordenadas en vivo junto al cursor ── */
(function coordenadas() {
  const el = document.getElementById("coordenadas");
  if (!el || matchMedia("(hover: none)").matches) return;
  addEventListener(
    "pointermove",
    (e) => {
      el.textContent = `x:${e.clientX} · y:${e.clientY}`;
    },
    { passive: true }
  );
})();

/* ── reveal al scroll con escalonado ── */
(function revelar() {
  const objetivos = document.querySelectorAll(".reveal");
  objetivos.forEach((el) => {
    const i = Array.from(el.parentElement.children).indexOf(el);
    el.style.setProperty("--rd", `${Math.min(i * 70, 350)}ms`);
  });
  if (!("IntersectionObserver" in window)) {
    objetivos.forEach((el) => el.classList.add("visible"));
    return;
  }
  const io = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add("visible");
          io.unobserve(entrada.target);
        }
      });
    },
    { threshold: 0.14 }
  );
  objetivos.forEach((el) => io.observe(el));
})();

/* ── service worker: offline primero ── */
if ("serviceWorker" in navigator && location.protocol === "https:") {
  addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}

/* ── preferencias guardadas ── */
(function prefs() {
  const html = document.documentElement;
  let acento = null;
  try { acento = localStorage.getItem("attie-acento"); } catch {}
  if (acento && ["cian", "ambar", "rosa", "violeta"].includes(acento))
    html.dataset.acento = acento;

  let efectos = null;
  try { efectos = localStorage.getItem("attie-efectos"); } catch {}
  if (efectos && ["epico", "normal", "off"].includes(efectos))
    html.dataset.efectos = efectos;

  let fondo = null;
  try { fondo = localStorage.getItem("attie-fondo"); } catch {}
  const chk = document.getElementById("cfg-fondo");
  if (chk) chk.checked = fondo !== "off";
})();

/* ── panel de configuraciones ── */
(function config() {
  const btn = document.getElementById("btn-config");
  const panel = document.getElementById("panel-config");
  if (!btn || !panel) return;
  const html = document.documentElement;

  function abrir() {
    panel.hidden = false;
    btn.setAttribute("aria-expanded", "true");
  }
  function cerrar() {
    panel.hidden = true;
    btn.setAttribute("aria-expanded", "false");
    btn.focus();
  }

  btn.addEventListener("click", () => (panel.hidden ? abrir() : cerrar()));
  panel.addEventListener("click", (ev) => {
    if (ev.target.closest("[data-cerrar]")) cerrar();
  });
  document.addEventListener("keydown", (ev) => {
    if (ev.key === "Escape" && !panel.hidden) cerrar();
  });

  const muestras = Array.from(panel.querySelectorAll(".muestra"));
  function pintarActivoAcento() {
    const actual = html.dataset.acento || "cian";
    muestras.forEach((m) =>
      m.classList.toggle("activo", m.dataset.acento === actual)
    );
  }
  muestras.forEach((m) =>
    m.addEventListener("click", () => {
      html.dataset.acento = m.dataset.acento;
      try { localStorage.setItem("attie-acento", m.dataset.acento); } catch {}
      pintarActivoAcento();
      dispatchEvent(new CustomEvent("acento-cambio"));
    })
  );
  pintarActivoAcento();

  const segs = Array.from(panel.querySelectorAll(".seg"));
  function pintarActivoEfectos() {
    const actual = html.dataset.efectos || "epico";
    segs.forEach((s) =>
      s.classList.toggle("activo", s.dataset.efectos === actual)
    );
  }
  segs.forEach((s) =>
    s.addEventListener("click", () => {
      html.dataset.efectos = s.dataset.efectos;
      try { localStorage.setItem("attie-efectos", s.dataset.efectos); } catch {}
      pintarActivoEfectos();
    })
  );
  pintarActivoEfectos();

  const chk = document.getElementById("cfg-fondo");
  if (chk)
    chk.addEventListener("change", () => {
      try {
        localStorage.setItem("attie-fondo", chk.checked ? "on" : "off");
      } catch {}
    });
})();

/* ── brillo que sigue al cursor ── */
(function brillo() {
  const halo = document.getElementById("brillo");
  if (!halo || matchMedia("(hover: none)").matches) return;
  let mx = innerWidth / 2;
  let my = innerHeight / 2;
  let px = mx;
  let py = my;
  addEventListener(
    "pointermove",
    (e) => {
      mx = e.clientX;
      my = e.clientY;
    },
    { passive: true }
  );
  (function seguir() {
    px += (mx - px) * 0.14;
    py += (my - py) * 0.14;
    halo.style.translate = px + "px " + py + "px";
    requestAnimationFrame(seguir);
  })();
})();

/* ── ondas al hacer clic ── */
(function ondas() {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  document.addEventListener("pointerdown", (ev) => {
    if ((document.documentElement.dataset.efectos || "epico") === "off") return;
    if (ev.target.closest(".panel-caja")) return;
    ["", "o2"].forEach((extra) => {
      const o = document.createElement("span");
      o.className = ("onda-clik " + extra).trim();
      o.style.left = ev.clientX + "px";
      o.style.top = ev.clientY + "px";
      document.body.appendChild(o);
      setTimeout(() => o.remove(), 850);
    });
  });
})();

/* ── tarjetas tangibles: inclinacion 3D ── */
(function tangible() {
  if (matchMedia("(hover: none)").matches) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  document.querySelectorAll(".tarjeta-dato, .enlace-ficha").forEach((el) => {
    el.addEventListener("pointermove", (ev) => {
      if ((document.documentElement.dataset.efectos || "epico") === "off")
        return;
      const r = el.getBoundingClientRect();
      const nx = ((ev.clientX - r.left) / r.width - 0.5) * 2;
      const ny = ((ev.clientY - r.top) / r.height - 0.5) * 2;
      el.style.setProperty("--tx", (nx * 6).toFixed(2) + "deg");
      el.style.setProperty("--ty", (-ny * 6).toFixed(2) + "deg");
    });
    el.addEventListener("pointerleave", () => {
      el.style.setProperty("--tx", "0deg");
      el.style.setProperty("--ty", "0deg");
    });
  });
})();

/* ── secuencia de arranque ── */
(function arranque() {
  const ov = document.getElementById("arranque");
  const barra = ov ? ov.querySelector(".arranque-barra span") : null;
  const por = document.getElementById("arranque-por");
  if (!ov || !barra || !por) return;
  let visto = true;
  try { visto = sessionStorage.getItem("attie-arranque"); } catch {}
  if (visto) {
    ov.remove();
    return;
  }
  try { sessionStorage.setItem("attie-arranque", "1"); } catch {}
  const t0 = performance.now();
  const dur = 950;
  (function paso(ahora) {
    const p = Math.min(1, (ahora - t0) / dur);
    por.textContent = Math.floor(p * 100) + "%";
    barra.style.scale = p + " 1";
    if (p < 1) {
      requestAnimationFrame(paso);
    } else {
      ov.classList.add("listo");
      setTimeout(() => ov.remove(), 700);
    }
  })(t0);
})();
