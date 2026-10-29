// Núcleo da biblioteca de motion: utilidades, curvas, observadores.
// Sem dependências. Módulos ES; servir por HTTP.

export const NS = 'http://www.w3.org/2000/svg';
export const reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;
export const $ = (s, c = document) => c.querySelector(s);
export const $$ = (s, c = document) => [...c.querySelectorAll(s)];
export const f1 = n => (+n).toFixed(1);

// Cria elemento SVG com atributos e (opcional) anexa ao pai.
export function svg(tag, attrs, pai) {
  const e = document.createElementNS(NS, tag);
  if (attrs) for (const k in attrs) e.setAttribute(k, attrs[k]);
  if (pai) pai.appendChild(e);
  return e;
}

// Texto SVG.
export function texto(pai, x, y, conteudo, attrs = {}) {
  const t = svg('text', { x, y, ...attrs }, pai);
  t.textContent = conteudo;
  return t;
}

// Gerador pseudoaleatório com semente (Park–Miller): irregular, mas igual a cada carga.
export function semente(s) {
  let v = Math.abs(Math.floor(s * 9973 + 17)) % 2147483646 + 1;
  return () => { v = (v * 16807) % 2147483647; return (v - 1) / 2147483646; };
}

// Curva Catmull-Rom → Bézier passando pelos pontos.
export function suave(p) {
  let d = `M${f1(p[0][0])} ${f1(p[0][1])}`;
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] || p[i], a = p[i], b = p[i + 1], p3 = p[i + 2] || b;
    d += ` C${f1(a[0] + (b[0] - p0[0]) / 6)} ${f1(a[1] + (b[1] - p0[1]) / 6)},${f1(b[0] - (p3[0] - a[0]) / 6)} ${f1(b[1] - (p3[1] - a[1]) / 6)},${f1(b[0])} ${f1(b[1])}`;
  }
  return d;
}

// Curvas de tempo.
export const curva = {
  inOutQuad: t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
  inOutCubic: t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  outCubic: t => 1 - Math.pow(1 - t, 3),
};

// Molas em CSS (overshoot no 2º ponto). Usar em transition/animation.
export const mola = {
  entrada: 'cubic-bezier(.3,1.6,.5,1)',   // 0.5s: elementos acendendo, blocos
  suave: 'cubic-bezier(.3,1.4,.5,1)',     // 0.45–0.5s: mensagens, hover de cartões
  lenta: 'cubic-bezier(.3,1.2,.5,1)',     // 0.7s: reordenação
  traco: 'cubic-bezier(.65,.05,.3,1)',    // 1.1s: traço de caneta
};

// Tween com requestAnimationFrame. Retorna função para cancelar.
export function tween(dur, aCada, fim, ease = curva.inOutQuad) {
  const t0 = performance.now(); let id, vivo = true;
  (function q(t) {
    if (!vivo) return;
    const k = Math.min(1, (t - t0) / dur);
    aCada(ease(k), k);
    if (k < 1) id = requestAnimationFrame(q); else fim && fim();
  })(t0);
  return () => { vivo = false; cancelAnimationFrame(id); };
}

// Executa fn uma vez quando o nó entra na tela.
export function aoVer(no, fn, limiar = .3) {
  if (!no) return;
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { io.disconnect(); fn(); } }), { threshold: limiar });
  io.observe(no);
}

// Bandeira viva: { v: true } enquanto o nó está visível. Loops contínuos checam antes de rodar.
export function visivel(no, limiar = .05) {
  const est = { v: false };
  if (no) new IntersectionObserver(es => es.forEach(e => (est.v = e.isIntersecting)), { threshold: limiar }).observe(no);
  return est;
}
export const podeAnimar = flag => flag.v && !document.hidden;

// Loop que só roda quando visível. intervalo pode ser número ou função que retorna ms.
export function loopVisivel(no, intervalo, fn) {
  if (reduz) return () => {};
  const flag = visivel(no); let vivo = true;
  (function passo() {
    if (!vivo) return;
    if (podeAnimar(flag)) fn();
    setTimeout(passo, typeof intervalo === 'function' ? intervalo() : intervalo);
  })();
  return () => { vivo = false; };
}

// Reinicia a classe .draw (traço) num grupo. O conteúdo já está visível; a animação só redesenha.
export function redesenhar(g, dur = 3400) {
  if (reduz || !g) return;
  g.classList.remove('draw'); void g.getBoundingClientRect(); g.classList.add('draw');
  if (dur) setTimeout(() => g.classList.remove('draw'), dur);
}

// Observador padrão: redesenha ao entrar e dispara evento 'naTela'.
const observadorDesenho = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  observadorDesenho.unobserve(e.target);
  redesenhar(e.target);
  e.target.dispatchEvent(new CustomEvent('naTela'));
}), { threshold: .3 });
export const desenharAoVer = no => no && observadorDesenho.observe(no);
