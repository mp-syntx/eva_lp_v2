// S02 · Abertura (T011): boas-vindas em vídeo do app (Figma 596:2199) com a jornada animada por cima.
// Barra segmentada estilo stories (5 × 3 s) + cartão translúcido por fase com traço magenta (P-001, P-019).
// Só roda com a seção visível e a aba ativa. Reduced-motion: pôster parado e lista estática das fases.
import { $, $$, reduz, svg } from './lib/nucleo.js';
import { mao, traco } from './lib/traco.js';

const DUR = 3000;

export function abertura() {
  const tela = $('.app-bv'); if (!tela) return;
  const video = $('video', tela);
  const segs = $$('.app-bv__seg', tela);
  const cartoes = $$('.app-bv__cartao', tela);

  // traço sob o nome de cada fase
  cartoes.forEach((c, i) => {
    const nome = $('.app-bv__nome', c);
    const w = Math.max(60, nome.textContent.length * 9.5);
    const s = svg('svg', { class: 'app-bv__traco', viewBox: `0 0 ${w} 12`, width: w, height: 12, 'aria-hidden': 'true' });
    traco(s, mao.linha(2, 6, w - 2, 7, i + 3, .03), 3);
    nome.after(s);
  });

  if (reduz) { tela.classList.add('is-estatico'); return; }

  let ativo = -1, t = 0, ultimo = 0, visivel = false, rodando = false;

  const mostrar = n => {
    ativo = n;
    segs.forEach((s, i) => s.style.setProperty('--p', i < n ? 1 : 0));
    cartoes.forEach((c, i) => {
      c.classList.toggle('on', i === n);
      if (i === n) { c.classList.remove('draw'); void c.offsetWidth; c.classList.add('draw'); }
    });
  };

  const quadro = agora => {
    if (!rodando) return;
    t += Math.max(0, Math.min(64, agora - ultimo)); ultimo = agora;
    const n = Math.floor(t / DUR) % segs.length;
    if (n !== ativo) {
      if (n === 0 && ativo === segs.length - 1) t = 0; // recomeça o ciclo
      mostrar(n);
    }
    segs[n].style.setProperty('--p', ((t % DUR) / DUR).toFixed(3));
    requestAnimationFrame(quadro);
  };

  const ligar = () => {
    const deve = visivel && !document.hidden;
    if (deve && !rodando) {
      rodando = true; ultimo = performance.now(); requestAnimationFrame(quadro);
      if (video) { if (!video.src) video.src = video.dataset.src; video.play().catch(() => {}); }
    } else if (!deve && rodando) {
      rodando = false; video?.pause();
    }
  };

  mostrar(0);
  new IntersectionObserver(([e]) => { visivel = e.isIntersecting; ligar(); }, { threshold: .2 }).observe(tela);
  document.addEventListener('visibilitychange', ligar);
}
