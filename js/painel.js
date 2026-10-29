// S07 · Painel do RH e das lideranças (T015). Ilustrativo, dados fictícios e agregados; nada individual.
// 4 abas com troca automática (~4 s) que para no primeiro clique (P-024); números sobem (P-007),
// linha se desenha (P-008), anel e barras enchem. Reduced-motion: valores finais, Visão geral parada.
import { $, $$, reduz, tween, curva } from './lib/nucleo.js';
import { vitrine } from './lib/componentes.js';

const fmt = (v, dec = 0) => v.toLocaleString('pt-BR', { minimumFractionDigits: dec, maximumFractionDigits: dec });

function animar(painel) {
  $$('[data-n]', painel).forEach(n => {
    const ate = +n.dataset.n, suf = n.dataset.suf || '', dec = (n.dataset.n.split('.')[1] || '').length;
    if (reduz) { n.textContent = fmt(ate, dec) + suf; return; }
    tween(1200, k => (n.textContent = fmt(ate * k, dec) + suf), null, curva.outCubic);
  });
  painel.classList.remove('vai'); void painel.offsetWidth; painel.classList.add('vai');
}

export function painel() {
  const raiz = $('.painel'); if (!raiz) return;
  const abas = $$('.painel__menu [role=tab], .painel__menu button', raiz);
  const paineis = $$('.painel__aba', raiz);
  const menu = $('.painel__menu', raiz);
  // no celular o menu rola na horizontal: mantém a aba ativa à vista sem mexer na rolagem da página
  const mostrarAba = i => { const a = abas[i]; if (menu.scrollWidth > menu.clientWidth) menu.scrollTo({ left: a.offsetLeft - (menu.clientWidth - a.offsetWidth) / 2, behavior: reduz ? 'auto' : 'smooth' }); };
  const historias = paineis.map((p, i) => ({ tocar: () => { animar(p); mostrarAba(i); }, parar: () => {} }));
  vitrine(menu, abas, [paineis], historias, { avancar: reduz ? 0 : 4200, pausaEm: raiz });
}
