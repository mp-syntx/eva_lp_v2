// P-001 · Traço de caneta: sublinhar, circular e apontar com mão irregular e reproduzível.
// CSS necessário em biblioteca.css (.tr, .draw .tr, .mk).
import { svg, semente, suave, f1 } from './nucleo.js';

export const mao = {
  // Elipse aberta (passa um pouco da volta, como quem circula à mão).
  elipse(cx, cy, rx, ry, s = 3, voltas = 1.1) {
    const r = semente(s), n = 26, a0 = -2.5 + r() * .5, p = [];
    for (let i = 0; i <= n; i++) {
      const t = a0 + (i / n) * Math.PI * 2 * voltas, k = 1 + (r() - .5) * .05 + (i / n) * .05;
      p.push([cx + Math.cos(t) * rx * k, cy + Math.sin(t) * ry * k]);
    }
    return suave(p);
  },
  // Linha com leve arco (curva) e tremor.
  linha(x1, y1, x2, y2, s = 5, curva = .04) {
    const r = semente(s), n = 7, p = [], dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
    for (let i = 0; i <= n; i++) {
      const t = i / n, b = Math.sin(t * Math.PI) * L * curva, j = (i === 0 || i === n) ? 0 : (r() - .5) * L * .012;
      p.push([x1 + dx * t + nx * (b + j), y1 + dy * t + ny * (b + j)]);
    }
    return suave(p);
  },
  ponta(x, y, ang, h = 14) {
    const a1 = ang + Math.PI - .5, a2 = ang + Math.PI + .5;
    return `M${f1(x + Math.cos(a1) * h)} ${f1(y + Math.sin(a1) * h)} L${f1(x)} ${f1(y)} L${f1(x + Math.cos(a2) * h)} ${f1(y + Math.sin(a2) * h)}`;
  },
};

// Desenha um traço (path com pathLength=1, para animar dashoffset 1→0).
export function traco(pai, d, largura = 4, classe = '') {
  return svg('path', { d, class: ('tr ' + classe).trim(), 'stroke-width': largura, pathLength: 1 }, pai);
}

export function seta(pai, x1, y1, x2, y2, o = {}) {
  const curva = o.curva ?? .1, w = o.w || 3.5;
  const ang = Math.atan2(y2 - y1, x2 - x1) - Math.atan(curva * Math.PI);
  return [traco(pai, mao.linha(x1, y1, x2, y2, o.s || 7, curva), w, o.classe), traco(pai, mao.ponta(x2, y2, ang, o.h || 13), w, o.classe)];
}

// Marca palavras em títulos: <span class="mk" data-mk="sublinhado|circulo">…</span>.
// Recalcula no resize e quando as fontes carregam.
export function marcarTitulos(raiz = document) {
  const desenhar = () => raiz.querySelectorAll('.mk').forEach((m, i) => {
    m.querySelector(':scope>svg')?.remove();
    const w = m.offsetWidth, h = m.offsetHeight; if (!w) return;
    const tipo = m.dataset.mk, sw = Math.max(3, Math.min(7, h * .06));
    const px = tipo === 'circulo' ? w * .1 + 12 : 4, py = tipo === 'circulo' ? h * .18 + 6 : 4, ex = tipo === 'sublinhado' ? h * .3 : 0;
    const W = w + px * 2, H = h + py * 2 + ex;
    const s = svg('svg', { 'aria-hidden': 'true', viewBox: `0 0 ${f1(W)} ${f1(H)}` });
    Object.assign(s.style, { left: -px + 'px', top: -py + 'px', width: W + 'px', height: H + 'px' });
    if (tipo === 'circulo') traco(s, mao.elipse(W / 2, H / 2, W / 2 - sw, H / 2 - sw, i + 5, 1.08), sw);
    else {
      const y = py + h * .98;
      traco(s, mao.linha(px, y, W - px, y + 2, i + 4, .015), sw);
      traco(s, mao.linha(px + w * .14, y + sw * 2.1, W - px - w * .05, y + sw * 1.6, i + 9, -.012), sw * .75, 'd2');
    }
    m.appendChild(s);
  });
  (document.fonts?.ready ?? Promise.resolve()).then(desenhar);
  addEventListener('load', desenhar);
  let t; addEventListener('resize', () => { clearTimeout(t); t = setTimeout(desenhar, 160); });
  return desenhar;
}
