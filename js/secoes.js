// T012 · S03 Problema, S08 Origem, S04 Pausa × jornada.
import { $, $$, svg, reduz, aoVer, f1, desenharAoVer, redesenhar } from './lib/nucleo.js';
import { mao, traco } from './lib/traco.js';
import { contadores, sobreposicao } from './lib/componentes.js';

/* ---------- S03 · gráfico do primeiro ano (P-008, ilustrativo) + arcos (P-025) ---------- */
export function problema() {
  const g = $('#grafico-ano'); if (!g) return;
  // Alturas ilustrativas: só mostram a concentração no início do primeiro ano (o único número afirmado é o 65%).
  const colunas = [9, 8, 7, 6, 5, 5, 4, 4, 3, 3, 3, 2];
  const x0 = 46, passo = 52, bw = 26, bh = 14, vao = 5, base = 300, pts = [];
  colunas.forEach((n, i) => {
    const x = x0 + i * passo;
    for (let k = 0; k < n; k++) {
      const b = svg('rect', { class: 'gb-bloco' + (i < 3 ? ' forte' : ''), x: x - bw / 2, y: base - (k + 1) * (bh + vao), width: bw, height: bh, rx: 4 }, g);
      b.style.animationDelay = (i * .08 + k * .02).toFixed(2) + 's';
    }
    pts.push([x, base - n * (bh + vao) - 12]);
    svg('text', { x, y: base + 26, class: 'gb-rotulo', 'text-anchor': 'middle' }, g).textContent = i + 1;
  });
  svg('line', { class: 'gb-eixo', x1: x0 - 26, y1: base + 6, x2: x0 + passo * 11 + 26, y2: base + 6 }, g);
  let d = `M${pts[0][0]} ${f1(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], a = pts[i], b = pts[i + 1], p3 = pts[i + 2] || b;
    d += ` C${f1(a[0] + (b[0] - p0[0]) / 6)} ${f1(a[1] + (b[1] - p0[1]) / 6)},${f1(b[0] - (p3[0] - a[0]) / 6)} ${f1(b[1] - (p3[1] - a[1]) / 6)},${b[0]} ${f1(b[1])}`;
  }
  svg('path', { class: 'gb-curva', d, pathLength: 1 }, g);
  const sec = $('#problema');
  traco($('.grafico__circulo', sec), mao.elipse(110, 60, 104, 54, 4, 1.1), 4);
  aoVer(g, () => { if (!reduz) g.classList.add('vai'); setTimeout(() => redesenhar($('.grafico__numero', sec), 0), reduz ? 0 : 1400); }, .25);

  // arcos com a fração exata
  $$('.arco', sec).forEach(a => {
    const v = parseFloat(a.dataset.valor.replace(',', '.')) / 100;
    const c = $('.arco__valor', a);
    c.style.setProperty('--v', v);
    aoVer(a, () => a.classList.add('vai'), .6);
  });
  contadores(sec);
}

/* ---------- S08 · manifesto: prévia muda em loop, toca no lugar com som ---------- */
export function origem() {
  const fig = $('.origem__video'); if (!fig) return;
  const previa = $('.origem__previa', fig), botao = $('.origem__play', fig), moldura = $('.origem__moldura', fig);
  if (previa && !reduz) {
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !fig.classList.contains('is-tocando')) { if (!previa.src) previa.src = previa.dataset.src; previa.play().catch(() => {}); }
      else previa.pause();
    }, { threshold: .3 }).observe(fig);
  }
  botao.addEventListener('click', () => {
    const v = document.createElement('video');
    Object.assign(v, { src: botao.dataset.video, controls: true, playsInline: true, preload: 'auto', poster: botao.dataset.poster });
    v.className = 'origem__completo';
    v.setAttribute('aria-label', 'Vídeo: Mariana Rios conta como nasceu a Eva Maternidade');
    previa?.pause();
    fig.classList.add('is-tocando');
    moldura.append(v);
    v.play().catch(() => {});
    v.focus();
    (window.dataLayer = window.dataLayer || []).push({ event: 'video_manifesto_play' });
    v.addEventListener('ended', () => { v.remove(); fig.classList.remove('is-tocando'); botao.focus(); });
  });
}

/* ---------- S04 · pausa × jornada (P-020) ---------- */
export function pausa() {
  const sec = $('.sobre'); if (!sec) return;
  const titulo = $('.pausa__cartao--jornada h3', sec);
  // círculo à mão no título do cartão "jornada"
  const desenhar = () => {
    titulo.querySelector(':scope > svg')?.remove();
    const w = titulo.offsetWidth, h = titulo.offsetHeight, W = w + 36, H = h + 30;
    const s = svg('svg', { viewBox: `0 0 ${f1(W)} ${f1(H)}`, 'aria-hidden': 'true', class: 'pausa__circulo' });
    Object.assign(s.style, { width: W + 'px', height: H + 'px', left: '-18px', top: '-15px' });
    traco(s, mao.elipse(W / 2, H / 2, W / 2 - 4, H / 2 - 4, 7, 1.08), 3);
    titulo.append(s);
  };
  (document.fonts?.ready ?? Promise.resolve()).then(desenhar);
  const fecho = $('.pausa__fecho');
  const fim = () => { redesenhar(titulo, 0); fecho?.classList.add('on'); };
  if (matchMedia('(max-width: 900px)').matches || reduz) { aoVer(titulo, fim, .6); return; }
  sobreposicao(sec, $('.pausa__cartao--pausa', sec), $('.pausa__cartao--jornada', sec), { aoFim: fim, recuo: .92 });
}

export { desenharAoVer };
