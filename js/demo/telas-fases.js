// Telas por fase para a S05 (T009/T013). Mesmo padrão de telas.js: frame de 393 px do Figma, tokens do app.
// Telas ilustrativas, com dados fictícios. Ver docs/secoes/S05_jornada.md para a origem de cada uma no Figma.
import { el, ic, status, cabecalho, navInf } from './telas.js';

const A = 'assets/app/';
const ok = '<svg viewBox="0 0 24 24" class="ic ok" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';

/* Tentante · checkpoint de fertilidade concluído (596:7530, refeita no padrão Eva) */
export function checkpoint(p) {
  return el(`${status()}<div class="rolo"><div class="conteudo">${cabecalho(p)}
    <div class="faixa"><div class="banner-mg entra"><span class="selo">${ok}</span><small>Checkpoint de fertilidade</small><h3>Concluído!</h3><p>Suas respostas ajudam a Eva a sugerir o próximo cuidado.</p></div></div>
    <section class="sec"><div class="sec-t"><h4>Suas respostas</h4></div>
      <div class="lista-ok">
        <div class="entra" style="animation-delay:.15s">${ok}<span>Tempo de tentativa</span></div>
        <div class="entra" style="animation-delay:.3s">${ok}<span>Regularidade do ciclo</span></div>
        <div class="entra" style="animation-delay:.45s">${ok}<span>Como você está se sentindo</span></div>
      </div></section>
    <section class="sec"><div class="prox entra" style="animation-delay:.6s" data-alvo="ciclo"><span class="circ">${ic('alvo')}</span><div><small>Próximo passo</small><b>Acompanhar o ciclo</b></div><span class="pilula">Começar</span></div></section>
  </div></div>${navInf(1)}`);
}

/* Tentante · acompanhamento do ciclo (596:7595, refeita) */
export function ciclo(p) {
  const C = 2 * Math.PI * 110;
  return el(`${status()}<div class="rolo"><div class="conteudo">${cabecalho(p)}
    <section class="sec"><div class="sec-t"><h4>Meu ciclo</h4><a>Histórico</a></div>
      <div class="ciclo"><svg viewBox="0 0 260 260"><circle cx="130" cy="130" r="110" class="ciclo-trilho"/><circle cx="130" cy="130" r="110" class="ciclo-valor" stroke-dasharray="${C}" stroke-dashoffset="${C}" data-c="${C}" data-frac="${8 / 28}"/></svg>
        <div><small>Dia</small><b>8</b><span>Fase folicular</span></div></div>
      <div class="chips-fase"><span class="on">Menstrual</span><span class="on">Folicular</span><span>Ovulatória</span><span>Lútea</span></div></section>
    <section class="sec"><div class="sec-t"><h4>Registro de hoje</h4></div>
      <div class="ferr">
        <div><span style="background:#FCE8F0;color:#CD3976">${ic('coracao')}</span>Humor</div>
        <div><span style="background:#E3F1EA;color:#277D60">${ic('lua')}</span>Sono</div>
        <div><span style="background:#E4F5FB;color:#5A9AA8">${ic('gota')}</span>Sintomas</div>
        <div><span style="background:#FDEBDD;color:#E65100">${ic('diario')}</span>Notas</div>
      </div></section>
  </div></div>${navInf(1)}`);
}
export function encherCiclo(app, atraso = 300) {
  const v = app.querySelector('.ciclo-valor'); if (!v) return;
  setTimeout(() => (v.style.strokeDashoffset = +v.dataset.c * (1 - +v.dataset.frac)), atraso);
}

/* Gestante · home "Semana 28" (596:2935) */
export function gestante(p) {
  return el(`${status()}<div class="rolo"><div class="conteudo">${cabecalho(p)}
    <div class="faixa"><div class="banner-sem"><div><small>Você está na</small><h3>Semana 28</h3>
      <div class="tri"><i class="on"></i><i class="on"></i><i class="meio"></i></div><div class="tri-r"><span>1º tri</span><span>2º tri</span><span>3º tri</span></div>
      <p>O bebê já ouve a sua voz e reage ao toque.</p></div><img src="${A}mascote-gestante.webp" alt="" width="120" height="144"></div></div>
    <section class="sec" data-alvo="ferr"><div class="sec-t"><h4>Minhas ferramentas</h4><a>Ver todas</a></div>
      <div class="ferr">
        <div class="entra"><span style="background:#FCE8F0;color:#CD3976">${ic('diario')}</span>Diário</div>
        <div class="entra" style="animation-delay:.1s"><span style="background:#E3F1EA;color:#277D60">${ic('lua')}</span>Sono</div>
        <div class="entra" style="animation-delay:.2s"><span style="background:#E4F5FB;color:#5A9AA8">${ic('pulso')}</span>Pressão</div>
        <div class="entra" style="animation-delay:.3s"><span style="background:#FDEBDD;color:#E65100">${ic('atividade')}</span>Movimento</div>
      </div></section>
    <section class="sec"><div class="sec-t"><h4>Recomendados para você</h4><a>Ver todos</a></div>
      <div class="cards-h"><div class="card-img" style="background-image:url(${A}conteudo-gestante.webp)"><b>Diário da gravidez</b></div><div class="card-img azul"><b>Preparando a volta</b></div></div></section>
  </div></div>${navInf(0)}`);
}

/* Conteúdo filtrado por fase (596:2593) */
const FASES = [['tentante', 'Tentante'], ['gestante', 'Gestante'], ['puerpera', 'Puérpera'], ['mae-de-anjo', 'Mãe de anjo'], ['pos-licenca', 'Pós licença']];
export function conteudo(p, ativa = 'puerpera') {
  return el(`${status()}<div class="rolo"><div class="conteudo">
    <header class="cab cab-t"><h4>Conteúdos</h4><span class="btn-ic">${ic('sino')}</span></header>
    <div class="filtro">${FASES.map(([k, n]) => `<span class="${k === ativa ? 'on' : ''}"><img src="assets/img/fase-${k}.webp" alt="" width="40" height="40">${n}</span>`).join('')}</div>
    <section class="sec"><div class="sec-t"><h4>Para o seu momento</h4></div>
      <div class="lista-cont">
        <div class="entra" data-alvo="curso"><span class="capa capa-rosa"></span><div><span class="etq curso">Curso</span><b>Entendendo o puerpério e suas emoções</b><small>6 aulas · com especialistas</small></div></div>
        <div class="entra" style="animation-delay:.12s"><span class="capa capa-azul"></span><div><span class="etq info">Revista</span><b>A nova rotina com o bebê</b><small>Leitura de 5 min</small></div></div>
        <div class="entra" style="animation-delay:.24s"><span class="capa capa-salvia"></span><div><span class="etq ativo">Podcast</span><b>Rede de apoio no pós-parto</b><small>Episódio de 20 min</small></div></div>
      </div></section>
  </div></div>${navInf(2)}`);
}

/* Curso com aulas e progresso (596:4971 / 596:4640) */
export function curso(p, { titulo, capa = '', classe = 'capa-rosa', aulas, feitas = 1 }) {
  return el(`${status()}<div class="rolo"><div class="conteudo">
    <div class="curso-capa ${classe}" ${capa ? `style="background-image:linear-gradient(180deg,rgba(14,36,51,0) 30%,rgba(14,36,51,.75)),url(${capa})"` : ''}><span class="etq curso">Curso</span><h3>${titulo}</h3><small>${aulas.length} aulas · com especialistas</small></div>
    <section class="sec"><div class="progresso-curso"><span>Seu progresso</span><b>${feitas} de ${aulas.length}</b><i><em style="--f:${feitas / aulas.length}"></em></i></div>
      <div class="aulas">${aulas.map((a, i) => `<div class="aula ${i < feitas ? 'feita' : i === feitas ? 'atual' : ''} entra" style="animation-delay:${(i * .1).toFixed(1)}s"><span class="n">${i < feitas ? ok : i + 1}</span><div><b>${a}</b><small>${i < feitas ? 'Concluída' : i === feitas ? 'Continuar' : 'Aula ' + (i + 1)}</small></div></div>`).join('')}</div></section>
  </div></div>${navInf(2)}`);
}

/* Perda · home "Mãe de anjo" (596:3756) */
export function maeDeAnjo(p) {
  return el(`${status()}<div class="rolo"><div class="conteudo">${cabecalho(p)}
    <div class="faixa"><div class="banner-anjo"><div><small>Mãe de anjo</small><h3>Um espaço para o seu tempo</h3><p>Conteúdos, especialistas e outras mães que entendem o que você sente.</p></div><img src="${A}mascote-mae-de-anjo.webp" alt="" width="110" height="135"></div></div>
    <section class="sec"><div class="sec-t"><h4>Para você agora</h4></div>
      <div class="card-img grande entra" data-alvo="curso" style="background-image:linear-gradient(180deg,rgba(14,36,51,0) 35%,rgba(14,36,51,.7)),url(${A}curso-luto.webp)"><span class="etq curso">Curso</span><b>Acolhendo o luto perinatal</b></div></section>
    <section class="sec"><div class="sec-t"><h4>Rodas de conversa</h4><a>Ver todas</a></div>
      <div class="roda-mini entra" style="animation-delay:.15s"><span class="circ">${ic('pessoas')}</span><div><b>Luto parental</b><small>Quinta · 19h · online</small></div></div></section>
  </div></div>${navInf(0)}`);
}

/* Perda · rodas de conversa (596:2251, 596:5470) */
export function rodas(p) {
  return el(`${status()}<div class="rolo"><div class="conteudo">
    <header class="cab cab-t"><h4>Comunidade</h4><span class="btn-ic">${ic('sino')}</span></header>
    <div class="faixa"><div class="banner-sal"><h3>Você não está sozinha!</h3><p>Encontros ao vivo com especialistas e mães que vivem o mesmo momento.</p></div></div>
    <section class="sec"><div class="sec-t"><h4>Próximas rodas</h4></div>
      <div class="roda entra" data-alvo="inscrita"><div><small>Quinta · 19h · online</small><b>Luto parental</b><span>Com psicóloga perinatal</span></div><span class="etq ativo insc">Inscrita</span></div>
      <div class="roda entra" style="animation-delay:.12s"><div><small>Sábado · 10h · online</small><b>Voltar ao trabalho depois da perda</b><span>Com psicóloga perinatal</span></div><span class="pilula">Inscrever</span></div></section>
    <section class="sec"><div class="sec-t"><h4>Sua rede de apoio</h4></div>
      <div class="rede entra" style="animation-delay:.24s"><span></span><span></span><span></span><span></span><b>+ mães no grupo</b></div></section>
  </div></div>${navInf(3)}`);
}
