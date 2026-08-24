/* ═══ ATTIE — dimensión matemática ═══ */

(function anio() {
  const el = document.getElementById("anio");
  if (el) el.textContent = String(new Date().getFullYear());
})();

/* ── lienzo: curvas de Lissajous dibujándose en el plano ── */
(function curvas() {
  const lienzo = document.getElementById("lienzo");
  if (!lienzo) return;
  const ctx = lienzo.getContext("2d");
  const reducido = matchMedia("(prefers-reduced-motion: reduce)").matches;

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
    ctx.fillStyle = "#06080d";
    ctx.fillRect(0, 0, w, h);
  }

  medir();
  addEventListener("resize", medir);

  let t = 0;

  function trazar(a, b, fase, color, grosor) {
    ctx.beginPath();
    for (let i = 0; i <= 220; i++) {
      const u = (i / 220) * Math.PI * 2;
      const x =
        w / 2 + Math.sin(a * u + t * 0.32 + fase) * w * 0.3;
      const y =
        h / 2 + Math.sin(b * u + fase) * h * 0.26;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = grosor;
    ctx.stroke();
  }

  function cuadro() {
    ctx.fillStyle = "rgba(6, 8, 13, 0.075)";
    ctx.fillRect(0, 0, w, h);

    t += 0.0045;
    const cx = w / 2 + Math.cos(t * 0.21) * w * 0.06;
    const cy = h / 2 + Math.sin(t * 0.17) * h * 0.05;

    trazar(3, 2, 0, "rgba(103, 232, 249, 0.34)", 1.1);
    trazar(2, 3, Math.PI / 3, "rgba(252, 211, 77, 0.16)", 1);
    trazar(4, 3, Math.PI / 2, "rgba(148, 163, 233, 0.12)", 1);

    const px = cx + Math.sin(t * 2.1) * w * 0.24;
    const py = cy + Math.sin(t * 1.4 + Math.PI / 3) * h * 0.2;
    ctx.beginPath();
    ctx.arc(px, py, 2.6, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(103, 232, 249, 0.9)";
    ctx.shadowColor = "rgba(103, 232, 249, 0.9)";
    ctx.shadowBlur = 14;
    ctx.fill();
    ctx.shadowBlur = 0;

    if (!document.hidden && !reducido) {
      requestAnimationFrame(cuadro);
    }
  }

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && !reducido) requestAnimationFrame(cuadro);
  });

  cuadro();
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
