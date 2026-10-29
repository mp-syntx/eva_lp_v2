// LP Eva Maternidade v2 · base (T010): navegação, menu Jornadas, gaveta, barra móvel, CTA ao formulário mais próximo,
// medição dos links de aprofundamento, traço de caneta nos títulos e formulários.
import { $, $$, desenharAoVer } from './lib/nucleo.js';
import { marcarTitulos } from './lib/traco.js';
import { formularios } from './formulario.js';
import { abertura } from './abertura.js';
import { problema, origem, pausa } from './secoes.js';
import { jornada } from './jornada.js';
import { emAcao } from './emacao.js';
import { painel } from './painel.js';

const nav = $('.nav');
const dl = (window.dataLayer = window.dataLayer || []);

/* ---------- fundo da nav e progresso de leitura (P-017) ---------- */
(() => {
  const barra = $('.nav__progresso');
  let pedido = false;
  const atualizar = () => {
    pedido = false;
    const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
    nav.classList.toggle('is-rolada', y > 10);
    barra.style.setProperty('--p', max > 0 ? Math.min(1, y / max).toFixed(4) : 0);
  };
  addEventListener('scroll', () => { if (!pedido) { pedido = true; requestAnimationFrame(atualizar); } }, { passive: true });
  atualizar();
})();

/* ---------- item da seção em leitura ---------- */
(() => {
  const itens = $$('[data-secao]');
  const alvos = [...new Set(itens.map(a => a.dataset.secao))].map(id => document.getElementById(id)).filter(Boolean);
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    itens.forEach(a => a.setAttribute('aria-current', String(a.dataset.secao === e.target.id)));
  }), { rootMargin: '-45% 0px -50% 0px' });
  alvos.forEach(s => io.observe(s));
})();

/* ---------- menu Jornadas ---------- */
(() => {
  const caixa = $('.jornadas'); if (!caixa) return;
  const botao = $('button', caixa);
  let t;
  const abrir = v => { caixa.classList.toggle('is-aberto', v); botao.setAttribute('aria-expanded', String(v)); };
  botao.addEventListener('click', () => abrir(botao.getAttribute('aria-expanded') !== 'true'));
  if (matchMedia('(hover: hover)').matches) {
    caixa.addEventListener('mouseenter', () => { clearTimeout(t); t = setTimeout(() => abrir(true), 120); });
    caixa.addEventListener('mouseleave', () => { clearTimeout(t); t = setTimeout(() => abrir(false), 200); });
  }
  caixa.addEventListener('keydown', e => { if (e.key === 'Escape') { abrir(false); botao.focus(); } });
  document.addEventListener('click', e => { if (!caixa.contains(e.target)) abrir(false); });
  caixa.addEventListener('focusout', e => { if (!caixa.contains(e.relatedTarget)) abrir(false); });
  $$('a', caixa).forEach(a => a.addEventListener('click', () => abrir(false)));
})();

/* ---------- gaveta (celular) ---------- */
(() => {
  const botao = $('.nav__menu'), gaveta = $('.gaveta'); if (!botao || !gaveta) return;
  const abrir = v => {
    gaveta.classList.toggle('is-aberta', v); nav.classList.toggle('is-gaveta', v);
    botao.setAttribute('aria-expanded', String(v)); botao.setAttribute('aria-label', v ? 'Fechar menu' : 'Abrir menu');
    document.documentElement.style.overflow = v ? 'hidden' : '';
    gaveta.inert = !v;
    if (v) $('a', gaveta)?.focus();
  };
  gaveta.inert = true;
  botao.addEventListener('click', () => abrir(botao.getAttribute('aria-expanded') !== 'true'));
  gaveta.addEventListener('click', e => { if (e.target.closest('a')) abrir(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && gaveta.classList.contains('is-aberta')) { abrir(false); botao.focus(); } });
  // foco preso entre o botão da nav e a gaveta
  gaveta.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const f = $$('a, button', gaveta), ult = f[f.length - 1];
    if (!e.shiftKey && document.activeElement === ult) { e.preventDefault(); botao.focus(); }
  });
  matchMedia('(min-width: 901px)').addEventListener('change', m => { if (m.matches) abrir(false); });
})();

/* ---------- barra inferior: aparece depois da abertura, some na conversão ---------- */
(() => {
  const barra = $('.barra'), abertura = $('#abertura'), fale = $('#fale'); if (!barra || !abertura || !fale) return;
  const est = { passou: false, naConversao: false };
  const aplicar = () => barra.classList.toggle('is-on', est.passou && !est.naConversao);
  new IntersectionObserver(([e]) => { est.passou = !e.isIntersecting && e.boundingClientRect.top < 0; aplicar(); }).observe(abertura);
  new IntersectionObserver(([e]) => { est.naConversao = e.isIntersecting; aplicar(); }, { threshold: .15 }).observe(fale);
})();

/* ---------- "Agendar conversa": leva ao formulário mais próximo (D-S02-1) ---------- */
document.addEventListener('click', e => {
  const a = e.target.closest('a[href="#agendar"]'); if (!a) return;
  e.preventDefault();
  const slots = $$('[data-form-slot]').filter(s => s.offsetParent !== null);
  if (!slots.length) return;
  const meio = scrollY + innerHeight / 2;
  const alvo = slots.reduce((m, s) => {
    const y = s.getBoundingClientRect().top + scrollY;
    return Math.abs(y - meio) < Math.abs(m.y - meio) ? { s, y } : m;
  }, { s: slots[0], y: Infinity }).s;
  alvo.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
  setTimeout(() => $('input', alvo)?.focus({ preventScroll: true }), 600);
  dl.push({ event: 'cta_agendar', origem: a.dataset.origem || 'pagina' });
});

/* ---------- links de aprofundamento (subpáginas de jornada) ---------- */
document.addEventListener('click', e => {
  const a = e.target.closest('a[data-aprofundar]'); if (!a) return;
  const [ponto, fase] = a.dataset.aprofundar.split(':');
  dl.push({ event: 'eva_aprofundar', fase, ponto });
});

/* ---------- traço de caneta nos títulos (P-001) ---------- */
marcarTitulos();
$$('[data-traco]').forEach(desenharAoVer);

/* ---------- formulários ---------- */
formularios();

/* ---------- S02 · boas-vindas em vídeo com a jornada ---------- */
abertura();

/* ---------- T012 · S03, S08, S04 ---------- */
problema();
origem();
pausa();

/* ---------- T013 · S05 jornada ---------- */
jornada();

/* ---------- T014 · S06 em ação ---------- */
emAcao();

/* ---------- T015 · S07 painel do RH ---------- */
painel();
