/* ═══ ATTIE — dimensión matemática ═══ */

(function anio() {
  const el = document.getElementById("anio");
  if (el) el.textContent = String(new Date().getFullYear());
})();

/* ── lienzo: red de particulas interactiva + figuras wireframe ── */
(function red() {
  const lienzo = document.getElementById("lienzo");
  const html = document.documentElement;
  if (!lienzo) return;
  const ctx = lienzo.getContext("2d");

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

  function formaOctaedro() {
    const v = [];
    for (let i = 0; i < 3; i++) {
      v.push([1, 0, 0].map((n, k) => (k === i ? n : 0)));
      v.push([-1, 0, 0].map((n, k) => (k === i ? n : 0)));
    }
    const e = [];
    for (let i = 0; i < 6; i++)
      for (let j = i + 1; j < 6; j++) {
        const a = v[i];
        const b = v[j];
        if (!(a[0] === -b[0] && a[1] === -b[1] && a[2] === -b[2])) e.push([i, j]);
      }
    return { v, e };
  }

  const FIGURAS = [
    { f: formaIcosaedro(), px: 0.13, py: 0.26, tam: 84, vx: 0.0026, vy: 0.0041 },
    { f: formaOctaedro(), px: 0.87, py: 0.72, tam: 66, vx: -0.0034, vy: 0.003 }
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
  }

  let nodos = [];
  function crearNodos() {
    const n = Math.max(36, Math.min(100, Math.round((w * h) / 17000)));
    nodos = Array.from({ length: n }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.24,
      vy: (Math.random() - 0.5) * 0.24,
      r: Math.random() * 1.4 + 0.8
    }));
  }

  medir();
  crearNodos();
  addEventListener(
    "resize",
    () => {
      medir();
      crearNodos();
    },
    { passive: true }
  );

  const raton = { x: -9999, y: -9999 };
  addEventListener(
    "pointermove",
    (e) => {
      raton.x = e.clientX;
      raton.y = e.clientY;
    },
    { passive: true }
  );

  let cA = "103,232,249";
  function refrescarColor() {
    const hex = getComputedStyle(html).getPropertyValue("--cian").trim();
    const m = /^#([0-9a-f]{6})$/i.exec(hex);
    if (m)
      cA = [
        parseInt(m[1].slice(0, 2), 16),
        parseInt(m[1].slice(2, 4), 16),
        parseInt(m[1].slice(4, 6), 16)
      ].join(",");
  }
  refrescarColor();
  addEventListener("acento-cambio", refrescarColor);

  const DIST = 130;
  const RCURSOR = 185;

  function proyectar(p, ax, ay, cx, cy, tam) {
    const cosX = Math.cos(ax);
    const sinX = Math.sin(ax);
    const cosY = Math.cos(ay);
    const sinY = Math.sin(ay);
    const x1 = p[0] * cosY + p[2] * sinY;
    const z1 = -p[0] * sinY + p[2] * cosY;
    const y1 = p[1] * cosX - z1 * sinX;
    const z2 = p[1] * sinX + z1 * cosX;
    const f = 3.2 / (3.2 + z2);
    return [cx + x1 * tam * f, cy + y1 * tam * f];
  }

  let corriendo = true;
  let fotograma = 0;

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

    ctx.clearRect(0, 0, w, h);

    for (const n of nodos) {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < -20) n.x = w + 20;
      if (n.x > w + 20) n.x = -20;
      if (n.y < -20) n.y = h + 20;
      if (n.y > h + 20) n.y = -20;

      const dx = raton.x - n.x;
      const dy = raton.y - n.y;
      const d = Math.hypot(dx, dy);
      if (d < RCURSOR && d > 40) {
        n.x += (dx / d) * 0.35;
        n.y += (dy / d) * 0.35;
      }
    }

    for (let i = 0; i < nodos.length; i++) {
      const a = nodos[i];
      for (let j = i + 1; j < nodos.length; j++) {
        const b = nodos[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        if (Math.abs(dx) > DIST || Math.abs(dy) > DIST) continue;
        const d = Math.hypot(dx, dy);
        if (d > DIST) continue;
        ctx.strokeStyle = "rgba(" + cA + "," + ((1 - d / DIST) * 0.26).toFixed(3) + ")";
        ctx.lineWidth = 0.55;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }

    for (const n of nodos) {
      const dx = raton.x - n.x;
      const dy = raton.y - n.y;
      const d = Math.hypot(dx, dy);
      if (d < RCURSOR) {
        ctx.strokeStyle = "rgba(" + cA + "," + ((1 - d / RCURSOR) * 0.5).toFixed(3) + ")";
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(n.x, n.y);
        ctx.lineTo(raton.x, raton.y);
        ctx.stroke();
      }
      const cerca = d < RCURSOR ? 1 : 0;
      ctx.fillStyle = "rgba(" + cA + "," + (cerca ? 0.9 : 0.55) + ")";
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r + cerca * 0.8, 0, Math.PI * 2);
      ctx.fill();
    }

    for (const fig of FIGURAS) {
      fig.ax += fig.vx;
      fig.ay += fig.vy;
      const rotA = fig.ax;
      const rotB = fig.ay;
      const cx = fig.px * w;
      const cy = fig.py * h;
      const pts = fig.f.v.map((p) => proyectar(p, rotA, rotB, cx, cy, fig.tam));
      ctx.strokeStyle = "rgba(" + cA + ",0.13)";
      ctx.lineWidth = 0.7;
      for (const [a, b] of fig.f.e) {
        ctx.beginPath();
        ctx.moveTo(pts[a][0], pts[a][1]);
        ctx.lineTo(pts[b][0], pts[b][1]);
        ctx.stroke();
      }
    }

    requestAnimationFrame(cuadro);
  }

  requestAnimationFrame(cuadro);
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
