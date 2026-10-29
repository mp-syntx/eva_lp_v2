// S05 · A jornada com a Eva (T013): capítulos conduzidos pela rolagem (P-004/P-019) com micro-histórias
// no celular e linha de fases (P-027, perda como desvio). Telas ilustrativas, dados fictícios.
import { $, $$, reduz } from './lib/nucleo.js';
import { microHistoria } from './lib/componentes.js';
import { home, saude, encherMedidores, rolarPara, tocar } from './demo/telas.js';
import { checkpoint, ciclo, encherCiclo, gestante, conteudo, curso, maeDeAnjo, rodas } from './demo/telas-fases.js';

const P = {
  1: { nome: 'Júlia', fase: 'Tentante' },
  2: { nome: 'Carla', fase: 'Gestante · 28 semanas' },
  3: { nome: 'Bianca', fase: 'Puérpera' },
  4: { nome: 'Ana', fase: 'Pós-licença', especialista: 'Dra. Camila Souza', especialidade: 'Psicóloga perinatal' },
  5: { nome: 'Lívia', fase: 'Mãe de anjo' },
};

export function jornada() {
  const sec = $('#jornada'); if (!sec) return;
  const tela = $('.jor-tela', sec), passos = $$('.jor-cap', sec), pontos = $$('.linha-fases [data-s]', sec);
  const ui = { legenda: $('.etapa .leg', sec), contador: $('.etapa .cont', sec), barra: $('.etapa-barra', sec) };

  // celular: telas desenhadas em 393 px e escaladas inteiras
  let atual = null, tm = [];
  const k = () => tela.clientWidth / 393;
  const escala = () => $$('.app', tela).forEach(a => (a.style.transform = `scale(${k()})`));
  new ResizeObserver(escala).observe(tela);
  const depois = (ms, fn) => tm.push(setTimeout(fn, ms));
  const limpar = () => { tm.forEach(clearTimeout); tm = []; };
  const mostra = app => {
    app.style.transform = `scale(${k()})`;
    const velho = atual; atual = app;
    if (velho && !reduz) { app.style.opacity = 0; app.style.translate = '40px 0'; app.style.transition = 'opacity .6s, translate .6s'; }
    tela.appendChild(app);
    if (!velho) return app;
    if (reduz) { velho.remove(); return app; }
    requestAnimationFrame(() => requestAnimationFrame(() => {
      app.style.opacity = 1; app.style.translate = '0 0';
      velho.style.transition = 'opacity .5s, translate .6s'; velho.style.opacity = 0; velho.style.translate = '-40px 0';
      setTimeout(() => velho.remove(), 650);
    }));
    return app;
  };

  let t2, t5;
  const historias = {
    1: [
      { legenda: 'Checkpoint de fertilidade', dur: 4200, entrar: () => { limpar(); mostra(checkpoint(P[1])); depois(2600, () => tocar(atual, 'ciclo')); } },
      { legenda: 'Acompanhamento do ciclo', dur: 4600, entrar: () => { const a = mostra(ciclo(P[1])); encherCiclo(a, 400); } },
    ],
    2: [
      { legenda: 'Semana a semana', dur: 4200, entrar: () => { limpar(); t2 = mostra(gestante(P[2])); } },
      { legenda: 'Ferramentas do dia a dia', dur: 4200, entrar: () => rolarPara(t2, 'ferr', 20) },
    ],
    3: [
      { legenda: 'Conteúdo para a fase', dur: 4200, entrar: () => { limpar(); mostra(conteudo(P[3], 'puerpera')); depois(2600, () => tocar(atual, 'curso')); } },
      { legenda: 'Trilhas com especialistas', dur: 4600, entrar: () => mostra(curso(P[3], { titulo: 'Entendendo o puerpério e suas emoções', classe: 'capa-rosa', aulas: ['As primeiras semanas', 'Emoções no pós-parto', 'Sono e rotina', 'Rede de apoio', 'Quando pedir ajuda', 'A volta ao trabalho'], feitas: 2 })) },
    ],
    4: [
      { legenda: 'Check-in da semana', dur: 4200, entrar: () => { limpar(); mostra(home(P[4])); depois(2400, () => tocar(atual, 'checkin')); } },
      { legenda: 'Acompanhamentos e checkpoints', dur: 5200, entrar: () => { const a = mostra(saude(P[4])); encherMedidores(a, 500); depois(3000, () => rolarPara(a, 470)); } },
    ],
    5: [
      { legenda: 'Uma home para esse momento', dur: 4200, entrar: () => { limpar(); t5 = mostra(maeDeAnjo(P[5])); depois(2600, () => tocar(t5, 'curso')); } },
      { legenda: 'Curso com especialistas', dur: 4200, entrar: () => mostra(curso(P[5], { titulo: 'Acolhendo o luto perinatal', capa: 'assets/app/curso-luto.webp', classe: '', aulas: ['O que você sente é legítimo', 'O corpo depois da perda', 'Como falar sobre isso', 'Voltar à rotina e ao trabalho'], feitas: 1 })) },
      { legenda: 'Rodas de conversa', dur: 4600, entrar: () => mostra(rodas(P[5])) },
    ],
  };
  const hs = Object.fromEntries(Object.entries(historias).map(([n, ps]) => [n, microHistoria(tela, ps, ui)]));

  // reduced-motion: mostra a última etapa do capítulo, parada
  const estatica = n => { limpar(); tela.replaceChildren(); atual = null; const ps = historias[n]; ps.forEach(p => p.entrar()); if (ui.legenda) ui.legenda.textContent = ps[ps.length - 1].legenda; if (ui.contador) ui.contador.textContent = ''; if (ui.barra) ui.barra.style.transform = 'scaleX(1)'; };

  let cap = 0, visivel = false;
  const ativar = n => {
    if (n === cap) return;
    if (cap) hs[cap].parar();
    cap = n;
    passos.forEach(p => p.classList.toggle('on', +p.dataset.s === n));
    pontos.forEach(p => { const on = +p.dataset.s === n; p.classList.toggle('on', on); p.toggleAttribute('aria-current', on); });
    sec.dataset.fase = n;
    if (reduz) estatica(n); else if (visivel) hs[n].tocar();
  };

  // capítulo ativo = o mais perto da linha de leitura (no celular, abaixo do palco)
  const palco = $('.jor-palco', sec);
  const linha = () => {
    const sr = palco.getBoundingClientRect(), lr = passos[0].parentElement.getBoundingClientRect();
    const sobrepoe = Math.min(sr.right, lr.right) - Math.max(sr.left, lr.left) > 1;
    return sobrepoe ? (Math.min(innerHeight, Math.max(0, sr.bottom)) + innerHeight) / 2 : innerHeight / 2;
  };
  const sync = () => {
    const y = linha(); let melhor = passos[0], d = Infinity;
    passos.forEach(p => { const b = (p.querySelector('h3') || p).getBoundingClientRect(), dd = Math.abs(b.top + b.height / 2 - y); if (dd < d) { d = dd; melhor = p; } });
    ativar(+melhor.dataset.s);
  };
  let pend = false;
  addEventListener('scroll', () => { if (!pend) { pend = true; requestAnimationFrame(() => { pend = false; sync(); }); } }, { passive: true });
  addEventListener('resize', sync);
  new IntersectionObserver(([e]) => {
    visivel = e.isIntersecting;
    if (!visivel) { if (cap) hs[cap].parar(); return; }
    if (!cap) sync(); else if (!reduz) { hs[cap].parar(); hs[cap].tocar(); }
  }, { threshold: .15 }).observe(sec);
  sync();

  // linha de fases: rola até o capítulo
  pontos.forEach(p => p.addEventListener('click', e => {
    e.preventDefault();
    const alvo = document.getElementById(p.getAttribute('href').slice(1));
    const h3 = alvo.querySelector('h3'), y = h3.getBoundingClientRect().top + scrollY;
    const desloc = palco.getBoundingClientRect().left < 10 ? palco.offsetHeight + 40 : innerHeight / 2 - 40;
    scrollTo({ top: y - desloc, behavior: reduz ? 'auto' : 'smooth' });
  }));
}
