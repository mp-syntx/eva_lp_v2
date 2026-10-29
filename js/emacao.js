// S06 · Veja em ação (T014): vitrine de casos com escolha por clique (P-024). Cada caso toca sua micro-história
// no celular. Avanço automático lento que cede ao clique. Telas ilustrativas, dados fictícios.
import { $, $$, reduz } from './lib/nucleo.js';
import { microHistoria, vitrine } from './lib/componentes.js';
import { home, saude, encherMedidores, rolarPara, tocar } from './demo/telas.js';
import { conteudo, curso, rodas } from './demo/telas-fases.js';
import { chat, msg, digitando, agendar, marcarHora, agendada } from './demo/telas-casos.js';

const ANA = { nome: 'Ana', fase: 'Pós-licença', especialista: 'Dra. Camila Souza', especialidade: 'Psicóloga perinatal' };

export function emAcao() {
  const sec = $('#em-acao'); if (!sec) return;
  const tela = $('.vit-tela', sec);
  const ui = { legenda: $('.etapa .leg', sec), contador: $('.etapa .cont', sec), barra: $('.etapa-barra', sec) };
  let atual = null, tm = [];
  const k = () => tela.clientWidth / 393;
  new ResizeObserver(() => $$('.app', tela).forEach(a => (a.style.transform = `scale(${k()})`))).observe(tela);
  const depois = (ms, fn) => tm.push(setTimeout(fn, ms));
  const limpar = () => { tm.forEach(clearTimeout); tm = []; };
  const mostra = app => {
    app.style.transform = `scale(${k()})`;
    const velho = atual; atual = app;
    if (velho && !reduz) { app.style.opacity = 0; app.style.translate = '40px 0'; app.style.transition = 'opacity .6s, translate .6s'; }
    tela.appendChild(app);
    if (velho && reduz) velho.remove();
    else if (velho) requestAnimationFrame(() => requestAnimationFrame(() => {
      app.style.opacity = 1; app.style.translate = '0 0';
      velho.style.transition = 'opacity .5s, translate .6s'; velho.style.opacity = 0; velho.style.translate = '-40px 0';
      setTimeout(() => velho.remove(), 650);
    }));
    return app;
  };
  const novo = app => { limpar(); tela.replaceChildren(); atual = null; return mostra(app); };

  let c;
  const casos = [
    [
      { legenda: 'Ela conta o que está vivendo', dur: 5200, entrar: () => {
        c = novo(chat(ANA));
        depois(300, () => msg(c, 'ela', 'Voltei ao trabalho há duas semanas e ando muito ansiosa.'));
        depois(1100, () => digitando(c, true));
        depois(2300, () => { digitando(c, false); msg(c, 'eva', 'Obrigada por contar. É comum se sentir assim na volta. Separei um conteúdo sobre isso para você.'); });
        depois(3600, () => digitando(c, true));
        depois(4500, () => { digitando(c, false); msg(c, 'eva', 'Quer conversar com uma especialista?<div class="opcoes"><span>Sim, quero</span><span>Agora não</span></div>'); });
      } },
      { legenda: 'A Eva sugere uma especialista', dur: 3400, entrar: () => { const o = c?.querySelector('.opcoes span'); o?.classList.add('on'); depois(400, () => msg(c, 'ela', 'Sim, quero')); } },
      { legenda: 'Agendamento em poucos toques', dur: 4400, entrar: () => { const a = mostra(agendar(ANA)); depois(1500, () => { tocar(a, 'hora'); marcarHora(a); }); depois(3000, () => tocar(a, 'confirmar')); } },
      { legenda: 'Consulta agendada', dur: 3800, entrar: () => mostra(agendada(ANA)) },
    ],
    [
      { legenda: 'Check-in da semana', dur: 4000, entrar: () => { novo(home(ANA)); depois(2200, () => tocar(atual, 'checkin')); } },
      { legenda: 'Acompanhamentos e próximo check-in', dur: 5200, entrar: () => { const a = mostra(saude(ANA)); encherMedidores(a, 500); depois(3000, () => rolarPara(a, 470)); } },
    ],
    [
      { legenda: 'Conteúdo para cada fase', dur: 4000, entrar: () => { novo(conteudo({ nome: 'Bianca' }, 'pos-licenca')); depois(2400, () => tocar(atual, 'curso')); } },
      { legenda: 'Progresso salvo', dur: 4600, entrar: () => mostra(curso({}, { titulo: 'Entendendo o puerpério e suas emoções', classe: 'capa-rosa', aulas: ['As primeiras semanas', 'Emoções no pós-parto', 'Sono e rotina', 'Rede de apoio', 'Quando pedir ajuda', 'A volta ao trabalho'], feitas: 3 })) },
    ],
    [
      { legenda: 'Rodas ao vivo com especialistas', dur: 4400, entrar: () => { novo(rodas({ nome: 'Lívia' })); depois(2600, () => tocar(atual, 'inscrita')); } },
      { legenda: 'Uma rede de apoio', dur: 3800, entrar: () => rolarPara(atual, 230) },
    ],
  ];
  const historias = casos.map(ps => microHistoria(tela, ps, ui));

  const abas = $$('.vit-lista [data-caso]', sec);
  const paineis = [$$('.vit-desc > div', sec)];
  // a história do caso dura ~16 s; o avanço automático só troca depois de uma volta completa
  vitrine($('.vit-lista nav', sec), abas, paineis, historias, { avancar: reduz ? 0 : 17000 });
}
