/* ═══ ATTIE — dimensión matemática ═══ */

(function anio() {
  const el = document.getElementById("anio");
  if (el) el.textContent = String(new Date().getFullYear());
})();

/* ── lienzo: enjambre con 24 formaciones, dispersion y profundidad ── */
(function enjambre() {
  const lienzo = document.getElementById("lienzo");
  const html = document.documentElement;
  if (!lienzo) return;
  const ctx = lienzo.getContext("2d");

  let w = 0;
  let h = 0;
  let dpr = 1;

  function medir() {
    dpr = 1;
    w = innerWidth;
    h = innerHeight;
    lienzo.width = w * dpr;
    lienzo.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  let nodos = [];
  function crearNodos() {
    const base = Math.max(60, Math.min(105, Math.round((w * h) / 17000)));
    const refuerzos = Math.round(base * 0.45);
    nodos = [];
    for (let i = 0; i < base + refuerzos; i++) {
      const extra = i >= base;
      nodos.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.13,
        vy: (Math.random() - 0.5) * 0.13,
        bx: 0,
        by: 0,
        r: (Math.random() * 1.3 + 0.8) * (extra ? 0.82 : 1),
        brillo: i / (base + refuerzos),
        objetivo: null,
        extra: extra,
        a: extra ? 0 : 1,
        aT: extra ? 0 : 1
      });
    }
  }

  function muestrearBorde(verts, n) {
    let per = 0;
    const lens = [];
    for (let i = 0; i < verts.length; i++) {
      const a = verts[i];
      const b = verts[(i + 1) % verts.length];
      const l = Math.hypot(b[0] - a[0], b[1] - a[1]);
      lens.push(l);
      per += l;
    }
    return Array.from({ length: n }, (_, i) => {
      let objetivo = (i / n) * per;
      for (let k = 0; k < verts.length; k++) {
        if (objetivo <= lens[k]) {
          const f = lens[k] ? objetivo / lens[k] : 0;
          const a = verts[k];
          const b = verts[(k + 1) % verts.length];
          return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
        }
        objetivo -= lens[k];
      }
      return verts[0].slice();
    });
  }

  function generarCirculo(n) {
    return Array.from({ length: n }, (_, i) => {
      const a = (i / n) * Math.PI * 2;
      return [Math.cos(a), Math.sin(a)];
    });
  }

  function generarPoligono(n, lados, giro) {
    const verts = Array.from({ length: lados }, (_, i) => {
      const a = (i / lados) * Math.PI * 2 - Math.PI / 2 + (giro || 0);
      return [Math.cos(a), Math.sin(a)];
    });
    return muestrearBorde(verts, n);
  }

  function generarEstrella(n, puntas) {
    return Array.from({ length: n }, (_, i) => {
      const a = (i / n) * Math.PI * 2 - Math.PI / 2;
      const ciclo = ((i / n) * puntas) % 1;
      const r = ciclo < 0.5
        ? 0.42 + (ciclo / 0.5) * 0.58
        : 1 - ((ciclo - 0.5) / 0.5) * 0.58;
      return [Math.cos(a) * r, Math.sin(a) * r];
    });
  }

  function generarInfinito(n) {
    return Array.from({ length: n }, (_, i) => {
      const t = (i / n) * Math.PI * 2;
      return [Math.sin(t), Math.sin(t) * Math.cos(t) * 1.7];
    });
  }

  function generarEspiral(n) {
    return Array.from({ length: n }, (_, i) => {
      const t = (i / n) * Math.PI * 6;
      const r = 0.18 + (i / n) * 0.82;
      return [Math.cos(t) * r, Math.sin(t) * r];
    });
  }

  function generarCorazon(n) {
    return Array.from({ length: n }, (_, i) => {
      const t = (i / n) * Math.PI * 2;
      return [
        (16 * Math.pow(Math.sin(t), 3)) / 16,
        -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) / 15
      ];
    });
  }

  function generarOnda(n) {
    return Array.from({ length: n }, (_, i) => {
      const x = (i / n) * 2 - 1;
      return [x, Math.sin((i / n) * Math.PI * 5) * 0.38];
    });
  }

  function generarChip(n) {
    const pts = [];
    const h2 = 0.62;
    for (const p of generarPoligono(Math.round(n * 0.58), 4)) pts.push(p);
    const porPin = pts.length ? (n - pts.length) / 16 : 0;
    for (let lado = 0; lado < 4; lado++) {
      for (let k = 0; k < 4; k++) {
        const u = -0.36 + (k + 0.5) * 0.18;
        for (let s = 0; s < porPin; s++) {
          const f = h2 + (s / Math.max(porPin - 1, 1)) * 0.34;
          if (lado === 0) pts.push([u, -f]);
          else if (lado === 1) pts.push([u, f]);
          else if (lado === 2) pts.push([-f, u]);
          else pts.push([f, u]);
        }
      }
    }
    return pts.slice(0, n);
  }

  function generarADN(n) {
    return Array.from({ length: n }, (_, i) => {
      const t = (i / n) * Math.PI * 7;
      const y = (i / n) * 2 - 1;
      if (i % 4 === 0 && Math.floor((i / n) * 14) % 2 === 0)
        return [Math.sin(t) * 0.25, y];
      return [Math.sin(t + (i % 2 ? Math.PI : 0)) * 0.5, y];
    });
  }

  function generarDiana(n) {
    const pts = [];
    const anillos = [
      { r: 0.95, frac: 0.36 },
      { r: 0.64, frac: 0.28 },
      { r: 0.34, frac: 0.24 }
    ];
    for (const a of anillos) {
      const cnt = Math.round(n * a.frac);
      for (let i = 0; i < cnt; i++) {
        const ang = (i / cnt) * Math.PI * 2 + a.r * 2;
        pts.push([Math.cos(ang) * a.r, Math.sin(ang) * a.r]);
      }
    }
    while (pts.length < n) {
      const ang = Math.random() * Math.PI * 2;
      const rr = Math.random() * 0.08;
      pts.push([Math.cos(ang) * rr, Math.sin(ang) * rr]);
    }
    return pts.slice(0, n);
  }

  function generarOrbita(n) {
    const pts = [];
    for (let e = 0; e < 3; e++) {
      const giro = (e * Math.PI) / 3;
      const cnt = Math.round(n / 3);
      for (let i = 0; i < cnt; i++) {
        const t = (i / cnt) * Math.PI * 2;
        const x = Math.cos(t);
        const y = Math.sin(t) * 0.36;
        pts.push([
          x * Math.cos(giro) - y * Math.sin(giro),
          x * Math.sin(giro) + y * Math.cos(giro)
        ]);
      }
    }
    return pts.slice(0, n);
  }

  function generarCubo(n) {
    const pts = [];
    const s = 0.68;
    const frente = [[-s, -s], [s, -s], [s, s], [-s, s]].map((p) => [p[0] - 0.13, p[1] + 0.13]);
    const atras = [[-s, -s], [s, -s], [s, s], [-s, s]].map((p) => [p[0] + 0.13, p[1] - 0.13]);
    for (const p of muestrearBorde(frente, Math.round(n * 0.36))) pts.push(p);
    for (const p of muestrearBorde(atras, Math.round(n * 0.36))) pts.push(p);
    for (let i = 0; i < 4; i++) {
      const a = frente[i];
      const b = atras[i];
      const cnt = Math.max(3, Math.round(n * 0.07));
      for (let k = 0; k < cnt; k++) {
        const f = k / (cnt - 1);
        pts.push([a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]);
      }
    }
    return pts.slice(0, n);
  }

  const RAYO_VERTS = [
    [0.18, -1], [-0.32, 0.08], [0.04, 0.05], [-0.2, 1],
    [0.46, -0.14], [0.16, -0.1], [0.42, -1]
  ];

  let puntosTexto = null;

  function generarTexto() {
    if (!puntosTexto || puntosTexto.length < nodos.length) {
      const oc = document.createElement("canvas");
      oc.width = 620;
      oc.height = 170;
      const octx = oc.getContext("2d");
      octx.fillStyle = "#fff";
      octx.font = "900 132px 'Space Grotesk', 'Arial Black', sans-serif";
      octx.textAlign = "center";
      octx.textBaseline = "middle";
      octx.fillText("ATTIE", 310, 88);
      const img = octx.getImageData(0, 0, 620, 170).data;
      const crudos = [];
      for (let y = 0; y < 170; y += 5)
        for (let x = 0; x < 620; x += 5)
          if (img[(y * 620 + x) * 4 + 3] > 120)
            crudos.push([(x / 310 - 1) * 1.75, (y / 85 - 1) * 0.48]);
      for (let i = crudos.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const tmp = crudos[i];
        crudos[i] = crudos[j];
        crudos[j] = tmp;
      }
      puntosTexto = crudos;
    }
    return puntosTexto.slice(0, nodos.length);
  }

  const cacheDibujos = {};

  function muestrearDibujo(id, dibujar) {
    const total = nodos.length;
    if (!cacheDibujos[id] || cacheDibujos[id].length < total) {
      const S = 220;
      const oc = document.createElement("canvas");
      oc.width = S;
      oc.height = S;
      const octx = oc.getContext("2d");
      octx.fillStyle = "#fff";
      octx.strokeStyle = "#fff";
      octx.lineWidth = S * 0.02;
      octx.lineCap = "round";
      octx.lineJoin = "round";
      dibujar(octx, S);
      const img = octx.getImageData(0, 0, S, S).data;
      const crudos = [];
      for (let y = 0; y < S; y += 3)
        for (let x = 0; x < S; x += 3)
          if (img[(y * S + x) * 4 + 3] > 110)
            crudos.push([(x / S) * 2 - 1, (y / S) * 2 - 1]);
      for (let i = crudos.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const tmp = crudos[i];
        crudos[i] = crudos[j];
        crudos[j] = tmp;
      }
      cacheDibujos[id] = crudos;
    }
    return cacheDibujos[id].slice(0, total);
  }

  function dibMonalisa(c, S) {
    c.strokeRect(S * 0.06, S * 0.04, S * 0.88, S * 0.92);
    c.beginPath();
    c.ellipse(S * 0.5, S * 0.34, S * 0.17, S * 0.2, 0, 0, Math.PI * 2);
    c.stroke();
    c.beginPath();
    c.moveTo(S * 0.35, S * 0.34);
    c.lineTo(S * 0.31, S * 0.64);
    c.moveTo(S * 0.65, S * 0.34);
    c.lineTo(S * 0.69, S * 0.64);
    c.stroke();
    c.beginPath();
    c.ellipse(S * 0.5, S * 0.36, S * 0.1, S * 0.13, 0, 0, Math.PI * 2);
    c.stroke();
    c.beginPath();
    c.arc(S * 0.455, S * 0.335, S * 0.012, 0, Math.PI * 2);
    c.arc(S * 0.545, S * 0.335, S * 0.012, 0, Math.PI * 2);
    c.fill();
    c.beginPath();
    c.arc(S * 0.5, S * 0.395, S * 0.05, Math.PI * 0.15, Math.PI * 0.85);
    c.stroke();
    c.beginPath();
    c.moveTo(S * 0.29, S * 0.74);
    c.quadraticCurveTo(S * 0.37, S * 0.52, S * 0.44, S * 0.5);
    c.lineTo(S * 0.56, S * 0.5);
    c.quadraticCurveTo(S * 0.63, S * 0.52, S * 0.71, S * 0.74);
    c.stroke();
    c.beginPath();
    c.arc(S * 0.46, S * 0.69, S * 0.035, 0, Math.PI * 2);
    c.arc(S * 0.54, S * 0.69, S * 0.035, 0, Math.PI * 2);
    c.stroke();
  }

  function dibPlaneta(c, S) {
    c.beginPath();
    c.arc(S * 0.5, S * 0.5, S * 0.4, 0, Math.PI * 2);
    c.stroke();
    c.beginPath();
    c.ellipse(S * 0.5, S * 0.5, S * 0.18, S * 0.4, 0, 0, Math.PI * 2);
    c.stroke();
    c.beginPath();
    c.moveTo(S * 0.12, S * 0.38);
    c.lineTo(S * 0.88, S * 0.38);
    c.moveTo(S * 0.12, S * 0.62);
    c.lineTo(S * 0.88, S * 0.62);
    c.stroke();
    c.beginPath();
    c.moveTo(S * 0.25, S * 0.3);
    c.lineTo(S * 0.38, S * 0.26);
    c.lineTo(S * 0.44, S * 0.34);
    c.lineTo(S * 0.34, S * 0.4);
    c.closePath();
    c.fill();
    c.beginPath();
    c.moveTo(S * 0.58, S * 0.55);
    c.lineTo(S * 0.72, S * 0.52);
    c.lineTo(S * 0.76, S * 0.63);
    c.lineTo(S * 0.64, S * 0.68);
    c.closePath();
    c.fill();
    c.beginPath();
    c.moveTo(S * 0.3, S * 0.68);
    c.lineTo(S * 0.4, S * 0.66);
    c.lineTo(S * 0.43, S * 0.73);
    c.lineTo(S * 0.33, S * 0.75);
    c.closePath();
    c.fill();
  }

  function dibRobot(c, S) {
    c.beginPath();
    c.moveTo(S * 0.5, S * 0.32);
    c.lineTo(S * 0.5, S * 0.22);
    c.stroke();
    c.beginPath();
    c.arc(S * 0.5, S * 0.19, S * 0.02, 0, Math.PI * 2);
    c.fill();
    c.strokeRect(S * 0.3, S * 0.32, S * 0.4, S * 0.38);
    c.fillRect(S * 0.23, S * 0.42, S * 0.06, S * 0.14);
    c.fillRect(S * 0.71, S * 0.42, S * 0.06, S * 0.14);
    c.beginPath();
    c.arc(S * 0.42, S * 0.46, S * 0.04, 0, Math.PI * 2);
    c.arc(S * 0.58, S * 0.46, S * 0.04, 0, Math.PI * 2);
    c.fill();
    c.strokeRect(S * 0.4, S * 0.56, S * 0.2, S * 0.08);
    c.beginPath();
    c.moveTo(S * 0.47, S * 0.56);
    c.lineTo(S * 0.47, S * 0.64);
    c.moveTo(S * 0.53, S * 0.56);
    c.lineTo(S * 0.53, S * 0.64);
    c.stroke();
  }

  function dibPersona(c, S) {
    c.beginPath();
    c.arc(S * 0.5, S * 0.26, S * 0.11, 0, Math.PI * 2);
    c.stroke();
    c.beginPath();
    c.moveTo(S * 0.26, S * 0.84);
    c.quadraticCurveTo(S * 0.27, S * 0.5, S * 0.5, S * 0.45);
    c.quadraticCurveTo(S * 0.73, S * 0.5, S * 0.74, S * 0.84);
    c.stroke();
  }

  function dibCohete(c, S) {
    c.beginPath();
    c.moveTo(S * 0.44, S * 0.66);
    c.lineTo(S * 0.44, S * 0.28);
    c.quadraticCurveTo(S * 0.44, S * 0.12, S * 0.5, S * 0.06);
    c.quadraticCurveTo(S * 0.56, S * 0.12, S * 0.56, S * 0.28);
    c.lineTo(S * 0.56, S * 0.66);
    c.stroke();
    c.beginPath();
    c.arc(S * 0.5, S * 0.3, S * 0.05, 0, Math.PI * 2);
    c.stroke();
    c.beginPath();
    c.moveTo(S * 0.44, S * 0.52);
    c.lineTo(S * 0.33, S * 0.72);
    c.lineTo(S * 0.44, S * 0.66);
    c.moveTo(S * 0.56, S * 0.52);
    c.lineTo(S * 0.67, S * 0.72);
    c.lineTo(S * 0.56, S * 0.66);
    c.stroke();
    c.beginPath();
    c.moveTo(S * 0.46, S * 0.7);
    c.lineTo(S * 0.48, S * 0.8);
    c.lineTo(S * 0.5, S * 0.71);
    c.lineTo(S * 0.52, S * 0.83);
    c.lineTo(S * 0.54, S * 0.7);
    c.stroke();
  }

  function dibGamepad(c, S) {
    c.beginPath();
    if (typeof c.roundRect === "function") c.roundRect(S * 0.14, S * 0.36, S * 0.72, S * 0.28, S * 0.09);
    else c.rect(S * 0.14, S * 0.36, S * 0.72, S * 0.28);
    c.stroke();
    c.fillRect(S * 0.27, S * 0.44, S * 0.035, S * 0.12);
    c.fillRect(S * 0.225, S * 0.485, S * 0.125, S * 0.035);
    c.beginPath();
    c.arc(S * 0.66, S * 0.46, S * 0.022, 0, Math.PI * 2);
    c.arc(S * 0.74, S * 0.46, S * 0.022, 0, Math.PI * 2);
    c.arc(S * 0.7, S * 0.54, S * 0.022, 0, Math.PI * 2);
    c.fill();
    c.beginPath();
    c.arc(S * 0.42, S * 0.55, S * 0.03, 0, Math.PI * 2);
    c.stroke();
  }

  const CLAVES = [
    ["HEXAGONO", () => generarPoligono(nodos.length, 6)],
    ["ATTIE.SYS", () => generarTexto()],
    ["LA MONALISA", () => muestrearDibujo("mona", dibMonalisa)],
    ["CIRCULO", () => generarCirculo(nodos.length)],
    ["ESTRELLA", () => generarEstrella(nodos.length, 5)],
    ["PLANETA", () => muestrearDibujo("planeta", dibPlaneta)],
    ["INFINITO", () => generarInfinito(nodos.length)],
    ["RAYO", () => muestrearBorde(RAYO_VERTS, nodos.length)],
    ["ROBOT", () => muestrearDibujo("robot", dibRobot)],
    ["TRIANGULO", () => generarPoligono(nodos.length, 3)],
    ["ESPIRAL", () => generarEspiral(nodos.length)],
    ["CORAZON", () => generarCorazon(nodos.length)],
    ["CHIP.CPU", () => generarChip(nodos.length)],
    ["ADN", () => generarADN(nodos.length)],
    ["PERSONA", () => muestrearDibujo("persona", dibPersona)],
    ["DIANA", () => generarDiana(nodos.length)],
    ["ORBITA ATOMICA", () => generarOrbita(nodos.length)],
    ["CUBO 3D", () => generarCubo(nodos.length)],
    ["COHETE", () => muestrearDibujo("cohete", dibCohete)],
    ["ESTRELLA x4", () => generarEstrella(nodos.length, 4)],
    ["GAMEPAD", () => muestrearDibujo("gamepad", dibGamepad)],
    ["ONDA", () => generarOnda(nodos.length)],
    ["HEXAGRAMA", () => generarPoligono(nodos.length, 3).concat(generarPoligono(nodos.length, 3, Math.PI)).slice(0, nodos.length)],
    ["DIAMANTE", () => generarPoligono(nodos.length, 4)]
  ];
  let idxForma = 0;

  let polvoLejos = [];
  let polvoCerca = [];
  function crearPolvo() {
    polvoLejos = Array.from({ length: 70 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.05,
      vy: (Math.random() - 0.5) * 0.05,
      f: Math.random() * Math.PI * 2
    }));
    polvoCerca = Array.from({ length: 45 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.09,
      vy: (Math.random() - 0.5) * 0.09,
      f: Math.random() * Math.PI * 2
    }));
  }

  const fugaces = [];

  medir();
  crearNodos();
  crearPolvo();
  addEventListener(
    "resize",
    () => {
      medir();
      crearNodos();
      crearPolvo();
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

  const ondasCanvas = [];
  const disparos = [];

  function lanzarDisparo(ax, ay, bx, by) {
    disparos.push({
      ax: ax,
      ay: ay,
      bx: bx,
      by: by,
      p: 0,
      v: 0.06 + Math.random() * 0.05,
      flash: false
    });
  }

  function disparoAleatorio() {
    if (nodos.length < 2) return;
    const a = nodos[Math.floor(Math.random() * nodos.length)];
    let b = a;
    let intentos = 0;
    while ((b === a || Math.hypot(b.x - a.x, b.y - a.y) < 180) && intentos++ < 10)
      b = nodos[Math.floor(Math.random() * nodos.length)];
    lanzarDisparo(a.x, a.y, b.x, b.y);
  }

  function empujar(cx, cy, radio, fuerzaBase) {
    for (const nd of nodos) {
      const dx = nd.x - cx;
      const dy = nd.y - cy;
      const d = Math.max(Math.hypot(dx, dy), 24);
      if (d < radio) {
        const f = ((radio - d) / radio) * fuerzaBase;
        nd.bx += (dx / d) * f;
        nd.by += (dy / d) * f;
      }
    }
  }

  function anunciar(txt) {
    const hud = document.getElementById("hud-forma");
    if (!hud) return;
    if (typeof window.__descifrar === "function") window.__descifrar(hud, txt, 1600);
    else hud.textContent = txt;
  }

  let cA = "103,232,249";
  const NIVELES = ["0.05", "0.09", "0.14", "0.19", "0.26"];
  let coloresLote = [];
  function refrescarColor() {
    const hex = getComputedStyle(html).getPropertyValue("--cian").trim();
    const m = /^#([0-9a-f]{6})$/i.exec(hex);
    if (m)
      cA = [
        parseInt(m[1].slice(0, 2), 16),
        parseInt(m[1].slice(2, 4), 16),
        parseInt(m[1].slice(4, 6), 16)
      ].join(",");
    coloresLote = NIVELES.map((a) => "rgba(" + cA + "," + a + ")");
  }
  refrescarColor();
  addEventListener("acento-cambio", refrescarColor);

  const CICLO = [
    { m: "forma", t: 380 },
    { m: "dispersion", t: 120 },
    { m: "forma", t: 380 },
    { m: "dispersion", t: 120 },
    { m: "libre", t: 160 },
    { m: "explosion", t: 140 },
    { m: "libre", t: 150 }
  ];
  let fase = 0;
  let tFase = 0;

  function asignarForma(indice) {
    const clave = CLAVES[indice !== undefined ? indice : idxForma++ % CLAVES.length];
    const pts = clave[1]();
    const cx = w / 2;
    const cy = h * 0.46;
    const tam = Math.min(w, h) * 0.33;
    for (let i = 0; i < nodos.length; i++) {
      const p = pts[i % pts.length];
      nodos[i].objetivo = [
        cx + p[0] * tam + (Math.random() - 0.5) * 1.6,
        cy + p[1] * tam + (Math.random() - 0.5) * 1.6
      ];
      nodos[i].bx *= 0.2;
      nodos[i].by *= 0.2;
      nodos[i].aT = 1;
    }
    anunciar("FORMANDO: " + clave[0]);
  }

  function dispersar() {
    const cx = w / 2;
    const cy = h * 0.46;
    for (const nd of nodos) {
      const dx = nd.x - cx + (Math.random() - 0.5) * 70;
      const dy = nd.y - cy + (Math.random() - 0.5) * 70;
      const d = Math.max(Math.hypot(dx, dy), 40);
      const f = 2.5 + Math.random() * 4.5;
      nd.bx += (dx / d) * f;
      nd.by += (dy / d) * f;
      nd.objetivo = null;
    }
    anunciar("DISPERSION");
  }

  function explotar(mega) {
    const cx = w / 2;
    const cy = h * 0.46;
    for (const nd of nodos) {
      const dx = nd.x - cx;
      const dy = nd.y - cy;
      const d = Math.max(Math.hypot(dx, dy), 30);
      const f = (mega ? 7 : 4) + Math.random() * (mega ? 11 : 7);
      nd.bx += (dx / d) * f;
      nd.by += (dy / d) * f;
      nd.objetivo = null;
    }
    ondasCanvas.push({ x: cx, y: cy, r: 10, a: mega ? 0.7 : 0.5 });
    anunciar(mega ? "SOBRECARGA" : "EXPANSION");
  }

  addEventListener("keydown", (e) => {
    if (/input|textarea|select/i.test(e.target.tagName)) return;
    const k = e.key.toLowerCase();
    if (k === "f") {
      fase = 0;
      tFase = 0;
      asignarForma();
    } else if (k === "e") {
      explotar(false);
    } else if (k === "d") {
      for (let i = 0; i < 4; i++) setTimeout(disparoAleatorio, i * 90);
    }
  });

  addEventListener("dblclick", (e) => {
    empujar(e.clientX, e.clientY, 520, 14);
    ondasCanvas.push({ x: e.clientX, y: e.clientY, r: 12, a: 0.75 });
    for (let i = 0; i < 5; i++) {
      const ang = Math.random() * Math.PI * 2;
      lanzarDisparo(e.clientX, e.clientY, e.clientX + Math.cos(ang) * 300, e.clientY + Math.sin(ang) * 300);
    }
  });

  addEventListener("pointerdown", (e) => {
    empujar(e.clientX, e.clientY, 340, 9);
    ondasCanvas.push({ x: e.clientX, y: e.clientY, r: 6, a: 0.55 });
  });

  const DIST_LIBRE = 128;
  const DIST_FORMA = 48;
  const RCURSOR = 150;

  let corriendo = true;
  let fotograma = 0;
  let ultimoT = 0;

  asignarForma();

  function cuadro(t) {
    requestAnimationFrame(cuadro);
    if (ultimoT && t - ultimoT < 32) return;
    ultimoT = t;
    fotograma++;
    const modoEfectos = html.dataset.efectos || "epico";
    const fondoApagado = document.getElementById("cfg-fondo")
      ? !document.getElementById("cfg-fondo").checked
      : false;

    if (modoEfectos === "off" || fondoApagado || document.hidden) {
      if (corriendo) {
        ctx.clearRect(0, 0, w, h);
        corriendo = false;
      }
      return;
    }
    corriendo = true;

    const vel =
      html.dataset.velocidad === "lenta" ? 0.5 :
      html.dataset.velocidad === "rapida" ? 2 : 1;

    tFase += vel;
    if (tFase > CICLO[fase].t) {
      tFase = 0;
      fase = (fase + 1) % CICLO.length;
      if (CICLO[fase].m === "forma") asignarForma();
      if (CICLO[fase].m === "dispersion") dispersar();
      if (CICLO[fase].m === "explosion") explotar(false);
      if (CICLO[fase].m === "libre") anunciar("RED ACTIVA");
    }
    const modo = CICLO[fase].m;

    if (modo === "libre" && tFase >= 90 && tFase - vel < 90 && nodos.length) {
      const nd = nodos[Math.floor(Math.random() * nodos.length)];
      ondasCanvas.push({ x: nd.x, y: nd.y, r: 4, a: 0.35 });
    }

    if (fotograma % 480 === 0) {
      fugaces.push({
        x: Math.random() * w * 0.7 + w * 0.15,
        y: Math.random() * h * 0.3,
        vx: 6 + Math.random() * 4,
        vy: 2 + Math.random() * 2,
        vida: 42
      });
    }

    if (modoEfectos !== "normal") {
      if (fotograma % 95 === 0) disparoAleatorio();
      if (fotograma % 95 === 40 && raton.x > -100) {
        const destino = nodos[Math.floor(Math.random() * nodos.length)];
        lanzarDisparo(raton.x, raton.y, destino.x, destino.y);
      }
      if (fotograma % 95 === 70) disparoAleatorio();
    } else if (fotograma % 190 === 0) {
      disparoAleatorio();
    }

    ctx.clearRect(0, 0, w, h);

    const nx = Math.min(Math.max(raton.x / w, 0), 1);
    const ny = Math.min(Math.max(raton.y / h, 0), 1);
    const ox1 = (nx - 0.5) * -10;
    const oy1 = (ny - 0.5) * -7;
    const ox2 = (nx - 0.5) * -22;
    const oy2 = (ny - 0.5) * -15;

    ctx.fillStyle = "rgba(148,163,233,0.2)";
    for (const p of polvoLejos) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;
      const tw = 0.55 + Math.sin(fotograma * 0.02 + p.f) * 0.35;
      ctx.globalAlpha = 0.22 * tw;
      ctx.fillRect(p.x + ox1, p.y + oy1, 1, 1);
    }
    ctx.fillStyle = "rgba(103,232,249,0.32)";
    for (const p of polvoCerca) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;
      const tw = 0.5 + Math.sin(fotograma * 0.03 + p.f) * 0.4;
      ctx.globalAlpha = 0.34 * tw;
      ctx.fillRect(p.x + ox2, p.y + oy2, 1.6, 1.6);
    }
    ctx.globalAlpha = 1;

    for (let i = fugaces.length - 1; i >= 0; i--) {
      const fz = fugaces[i];
      fz.x += fz.vx;
      fz.y += fz.vy;
      fz.vida--;
      if (fz.vida <= 0 || fz.x > w + 100) {
        fugaces.splice(i, 1);
        continue;
      }
      const colaX = fz.x - fz.vx * 11;
      const colaY = fz.y - fz.vy * 11;
      const grad = ctx.createLinearGradient(colaX, colaY, fz.x, fz.y);
      grad.addColorStop(0, "rgba(255,255,255,0)");
      grad.addColorStop(1, "rgba(255,255,255," + (fz.vida / 42) * 0.7 + ")");
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.moveTo(colaX, colaY);
      ctx.lineTo(fz.x, fz.y);
      ctx.stroke();
    }

    for (const nd of nodos) {
      if (modo === "forma" && nd.objetivo) {
        const dx = nd.objetivo[0] - nd.x;
        const dy = nd.objetivo[1] - nd.y;
        if (Math.abs(dx) < 1.2 && Math.abs(dy) < 1.2) {
          nd.x = nd.objetivo[0];
          nd.y = nd.objetivo[1];
          nd.bx *= 0.5;
          nd.by *= 0.5;
        } else {
          nd.x += dx * Math.min(0.14 * vel, 0.2);
          nd.y += dy * Math.min(0.14 * vel, 0.2);
        }
      } else {
        nd.x += nd.vx * vel;
        nd.y += nd.vy * vel;
      }
      nd.x += nd.bx;
      nd.y += nd.by;
      nd.bx *= 0.93;
      nd.by *= 0.93;
      if (nd.x < -20) nd.x = w + 20;
      if (nd.x > w + 20) nd.x = -20;
      if (nd.y < -20) nd.y = h + 20;
      if (nd.y > h + 20) nd.y = -20;
      nd.aT = modo === "forma" ? 1 : nd.extra ? 0 : 1;
      nd.a += (nd.aT - nd.a) * 0.06;
    }

    const dist = modo === "forma" ? DIST_FORMA : DIST_LIBRE;

    const lotes = [[], [], [], [], []];
    for (let i = 0; i < nodos.length; i++) {
      const a = nodos[i];
      if (a.a < 0.06) continue;
      for (let j = i + 1; j < nodos.length; j++) {
        const b = nodos[j];
        if (b.a < 0.06) continue;
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        if (Math.abs(dx) > dist || Math.abs(dy) > dist) continue;
        const d = Math.hypot(dx, dy);
        if (d > dist) continue;
        lotes[Math.min(4, ((1 - d / dist) * 0.3 * Math.min(a.a, b.a) * 19) | 0)].push(
          a.x, a.y, b.x, b.y
        );
      }
    }
    ctx.lineWidth = 0.55;
    for (let k2 = 0; k2 < 5; k2++) {
      const seg = lotes[k2];
      if (!seg.length) continue;
      ctx.strokeStyle = coloresLote[k2];
      ctx.beginPath();
      for (let s2 = 0; s2 < seg.length; s2 += 4) {
        ctx.moveTo(seg[s2], seg[s2 + 1]);
        ctx.lineTo(seg[s2 + 2], seg[s2 + 3]);
      }
      ctx.stroke();
    }

    for (const nd of nodos) {
      if (nd.a < 0.03) continue;
      const dx = raton.x - nd.x;
      const dy = raton.y - nd.y;
      const d = Math.hypot(dx, dy);
      if (d < RCURSOR && (fotograma & 1) === 0) {
        ctx.strokeStyle =
          "rgba(" + cA + "," + ((1 - d / RCURSOR) * 0.5).toFixed(3) + ")";
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(nd.x, nd.y);
        ctx.lineTo(raton.x, raton.y);
        ctx.stroke();
      }
      const cerca = d < RCURSOR ? 1 : 0;
      const titilo = 0.5 + Math.sin(fotograma * 0.03 + nd.brillo * 12) * 0.22;
      ctx.fillStyle =
        "rgba(" + cA + "," + (nd.a * (cerca ? 0.95 : titilo)).toFixed(3) + ")";
      ctx.beginPath();
      ctx.arc(nd.x, nd.y, nd.r + cerca * 0.9, 0, Math.PI * 2);
      ctx.fill();
    }

    for (let i = disparos.length - 1; i >= 0; i--) {
      const d = disparos[i];
      d.p += d.v;
      if (d.p >= 1.3) {
        disparos.splice(i, 1);
        continue;
      }
      const cabeza = Math.min(d.p, 1);
      const cola = Math.max(d.p - 0.2, 0);
      const hx = d.ax + (d.bx - d.ax) * cabeza;
      const hy = d.ay + (d.by - d.ay) * cabeza;
      const tx = d.ax + (d.bx - d.ax) * cola;
      const ty = d.ay + (d.by - d.ay) * cola;
      if (d.p >= 1 && !d.flash) {
        d.flash = true;
        ondasCanvas.push({ x: d.bx, y: d.by, r: 3, a: 0.45 });
      }
      const grad = ctx.createLinearGradient(tx, ty, hx, hy);
      grad.addColorStop(0, "rgba(" + cA + ",0)");
      grad.addColorStop(1, "rgba(" + cA + ",0.85)");
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(hx, hy);
      ctx.stroke();
      ctx.fillStyle = "rgba(" + cA + ",0.95)";
      ctx.beginPath();
      ctx.arc(hx, hy, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    for (let i = ondasCanvas.length - 1; i >= 0; i--) {
      const o = ondasCanvas[i];
      o.r += 7;
      o.a *= 0.955;
      if (o.a < 0.02) {
        ondasCanvas.splice(i, 1);
        continue;
      }
      ctx.strokeStyle = "rgba(" + cA + "," + o.a.toFixed(3) + ")";
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
      ctx.stroke();
    }
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

/* ── cinematica persiana: ATTIE partido por la mitad + despertar ── */
(function cine() {
  const c = document.getElementById("cine");
  const raiz = document.documentElement;
  const mainEl = document.querySelector("main");

  function despertar() {
    raiz.classList.add("despierto");
    if (mainEl) mainEl.classList.add("presentarse");
  }

  function terminarRapido() {
    try { sessionStorage.setItem("attie-cine", "1"); } catch {}
    despertar();
    if (c) c.remove();
  }

  if (!c) return;

  if (matchMedia("(prefers-reduced-motion: reduce)").matches)
    return terminarRapido();

  let visto = false;
  try { visto = sessionStorage.getItem("attie-cine"); } catch {}
  if (visto) {
    despertar();
    c.classList.add("abrir");
    setTimeout(() => c.remove(), 1100);
    return;
  }

  try { sessionStorage.setItem("attie-cine", "1"); } catch {}
  raiz.classList.add("cine-activo");

  setTimeout(() => c.classList.add("lista"), 950);
  setTimeout(() => c.classList.add("abrir"), 1650);
  setTimeout(() => {
    raiz.classList.remove("cine-activo");
    despertar();
  }, 1800);
  setTimeout(() => {
    c.remove();
    raiz.classList.remove("cine-activo");
  }, 2900);
})();

/* ── control de velocidad del ciclo ── */
(function velocidad() {
  const html = document.documentElement;
  let guardada = null;
  try { guardada = localStorage.getItem("attie-velocidad"); } catch {}
  if (guardada && ["lenta", "normal", "rapida"].includes(guardada))
    html.dataset.velocidad = guardada;

  const botones = Array.from(document.querySelectorAll("[data-velocidad-btn]"));
  if (!botones.length) return;

  function pintar() {
    const actual = html.dataset.velocidad || "normal";
    botones.forEach((b) =>
      b.classList.toggle("activo", b.dataset.velocidadBtn === actual)
    );
  }

  botones.forEach((b) =>
    b.addEventListener("click", () => {
      html.dataset.velocidad = b.dataset.velocidadBtn;
      try { localStorage.setItem("attie-velocidad", b.dataset.velocidadBtn); } catch {}
      pintar();
    })
  );
  pintar();
})();

/* ── efecto de desencriptado global ── */
(function descifrado() {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const GLIFOS = "!<>-_\\/[]{}=+*^?#$%&@~|=01ABCDEFXZ";

  function descifrar(el, dur) {
    const original = el.dataset.txt || (el.dataset.txt = el.textContent);
    el.setAttribute("aria-label", original);
    const n = original.length;
    if (!n) return;
    const objetivoFrames = Math.round(((dur || 1400) / 1000) * 60);
    const ritmo = Math.max(objetivoFrames / n, 0.5);
    const cola = [];
    for (let i = 0; i < n; i++) {
      const inicio = i * ritmo + Math.random() * 9;
      cola.push({
        hasta: original[i],
        inicio: inicio,
        fin: inicio + 26 + Math.random() * 40
      });
    }
    let fotograma = 0;

    function avanzar() {
      fotograma++;
      let salida = "";
      let pendientes = 0;
      for (const c of cola) {
        if (fotograma >= c.fin) {
          salida += c.hasta;
        } else {
          pendientes++;
          salida += c.hasta === " " ? " " : GLIFOS[(Math.random() * GLIFOS.length) | 0];
        }
      }
      el.textContent = salida;
      if (pendientes > 0 && fotograma < 500) requestAnimationFrame(avanzar);
      else el.textContent = original;
    }

    requestAnimationFrame(avanzar);
  }

  window.__descifrar = function (el, texto, dur) {
    if (!el) return;
    if (texto !== undefined && el.dataset.txt !== undefined) el.dataset.txt = texto;
    else if (texto !== undefined) {
      el.textContent = texto;
      el.dataset.txt = texto;
      return;
    }
    descifrar(el, dur);
  };

  function arrancar() {
    const sel = [
      ".marca",
      ".barra-nav a",
      ".hero-exp",
      ".hero-def",
      ".hero-acciones .btn",
      ".figura h2",
      ".fig-num",
      ".figura-cuerpo p",
      ".chips li",
      ".tarjeta-dato small",
      ".tarjeta-dato strong",
      ".tarjeta-dato span",
      ".enlace-ficha small",
      ".enlace-ficha strong",
      ".enlace-ficha span",
      ".nota-contacto",
      ".pie span",
      "#hud-forma"
    ].join(",");
    document.querySelectorAll(sel).forEach((el, i) => {
      const largo = el.textContent.length;
      setTimeout(() => descifrar(el, Math.min(2200 + largo * 7, 5200)), i * 110);
    });
  }

  let listo = false;
  const reloj = setInterval(() => {
    if (listo) return;
    if (document.querySelector("main.presentarse")) {
      listo = true;
      clearInterval(reloj);
      setTimeout(arrancar, 250);
    }
  }, 120);
})();
