// Telas do app Eva em HTML (T009). Cada função recebe uma persona e devolve um elemento .app.
// Dados de demonstração fictícios e genéricos; nada de dado clínico sensível. Ver README.md.

export const icones = {
  sino: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  engrenagem: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-2.82 1.17V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-2.82-1.17l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 3 13.6H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.17-2.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9.9 3.1V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 2.82 1.17l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 20.9 9.9H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1.1z"/>',
  seta: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  casa: '<path d="M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3z"/>',
  pulso: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z"/><path d="M3.5 12h4l2-3 3 6 2-3h6"/>',
  livro: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z"/><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"/>',
  pessoas: '<circle cx="9" cy="7" r="4"/><path d="M2 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2"/><path d="M16 3.1a4 4 0 0 1 0 7.8M22 21v-2a4 4 0 0 0-3-3.9"/>',
  balao: '<path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.6 8.6 0 0 1-3.9-.9L3 21l1.9-5.1A8.4 8.4 0 0 1 12 3a8.4 8.4 0 0 1 9 8.5z"/>',
  gota: '<path d="M12 2.7s6 6.4 6 11.3a6 6 0 0 1-12 0c0-4.9 6-11.3 6-11.3z"/>',
  lua: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
  atividade: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
  diario: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 7h6M9 11h6"/>',
  coracao: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z"/>',
  alvo: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  estetoscopio: '<path d="M6 3v5a5 5 0 0 0 10 0V3"/><path d="M11 13v3a5 5 0 0 0 10 0v-2"/><circle cx="21" cy="12" r="2"/>',
  documento: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 15l2.5-2.5 2 2L16 11"/>',
  usuaria: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
};
export const ic = (n, cls = 'ic') => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${icones[n]}</svg>`;

const ABAS = ['casa', 'pulso', 'livro', 'pessoas', 'balao'];
export const navInf = ativa => `<nav class="nav-inf" aria-hidden="true">${ABAS.map((a, i) => `<span class="${i === ativa ? 'on' : ''}">${ic(a)}</span>`).join('')}</nav><i class="indicador"></i>`;
export const status = () => `<div class="status"><span>9:41</span><i></i></div>`;
export const cabecalho = p => `<header class="cab"><span class="av">${p.nome[0]}</span><div><b>${p.nome}</b><small>${p.fase}</small></div>
  <div class="acoes"><span class="btn-ic">${ic('sino')}<span class="bolha">2</span></span><span class="btn-ic">${ic('engrenagem')}</span></div></header>`;
const bannerCheckin = p => `<div class="banner-ck" data-alvo="checkin"><span class="ola">Olá, ${p.nome}</span>
  <h3>Como você está se sentindo no seu corpo hoje?</h3><p>Vamos começar o seu check-in?</p><span class="seta-dest">${ic('seta')}</span></div>`;

export function el(html) { const d = document.createElement('div'); d.className = 'app'; d.innerHTML = html; return d; }

// Medidor em 3/4 de círculo. frac 0–1; o arco só enche quando .encher() é chamado.
function medidor(cor, frac, rotulo, sub = '') {
  const C = 2 * Math.PI * 31, arco = C * .75;
  return `<div class="med" data-frac="${frac}"><svg viewBox="0 0 76 76"><circle class="trilho" cx="38" cy="38" r="31" stroke-dasharray="${arco} ${C}"/>
    <circle class="valor" cx="38" cy="38" r="31" stroke="${cor}" stroke-dasharray="${arco} ${C}" stroke-dashoffset="${arco}" data-arco="${arco}"/></svg><b>${rotulo}<em>${sub}</em></b></div>`;
}
export function encherMedidores(raiz, atraso = 0) {
  raiz.querySelectorAll('.med').forEach((m, i) => {
    const v = m.querySelector('.valor'), arco = +v.dataset.arco;
    setTimeout(() => (v.style.strokeDashoffset = arco * (1 - +m.dataset.frac)), atraso + i * 180);
  });
}

/* Tela: Home (aba Início) com banner de check-in e ferramentas */
export function home(p) {
  return el(`${status()}<div class="rolo"><div class="conteudo">${cabecalho(p)}
    <div class="faixa">${bannerCheckin(p)}</div>
    <section class="sec"><div class="sec-t"><h4>Minhas ferramentas</h4><a>Ver todas</a></div>
      <div class="ferr">
        <div><span style="background:#FCE8F0;color:#CD3976">${ic('diario')}</span>Diário</div>
        <div><span style="background:#E3F1EA;color:#277D60">${ic('lua')}</span>Sono</div>
        <div><span style="background:#E4F5FB;color:#5A9AA8">${ic('atividade')}</span>Energia</div>
        <div><span style="background:#FDEBDD;color:#E65100">${ic('coracao')}</span>Comunidade</div>
      </div></section>
    <section class="sec"><div class="sec-t"><h4>Recomendados para você</h4><a>Ver todos</a></div>
      <div style="display:grid;grid-template-columns:1fr .55fr;gap:10px">
        <div style="height:170px;border-radius:16px;background:linear-gradient(180deg,#BBDEEA,#295163);padding:14px;display:flex;align-items:end;color:#fff;font-weight:700;font-size:16px">Voltar ao trabalho com cuidado</div>
        <div style="height:170px;border-radius:16px;background:linear-gradient(180deg,#FCE8F0,#CD3976)"></div></div></section>
  </div></div>${navInf(0)}`);
}

/* Tela: Saúde (aba Saúde) com acompanhamentos, próximo check-in, consulta e plano */
export function saude(p) {
  return el(`${status()}<div class="rolo"><div class="conteudo">${cabecalho(p)}
    <div class="faixa">${bannerCheckin(p)}</div>
    <section class="sec"><div class="sec-t"><h4>Meus acompanhamentos</h4></div>
      <div class="acomp entra"><div><span class="etq pend">Pendente</span><h5>Ingestão de água</h5></div>${medidor('#78C0D7', .51, '1.230', '2.400 ml')}</div>
      <div class="acomp entra" style="animation-delay:.1s"><div><span class="etq info">Esta semana</span><h5>Sono</h5><p>Média de 6h por noite. Que tal uma rotina para dormir melhor?</p></div>${medidor('#FF657D', .75, '6h', 'de 8h')}</div>
      <div class="acomp entra" style="animation-delay:.2s"><div><span class="etq ativo">Registrado hoje 08:30</span><h5>Energia e humor</h5><p>Você registrou: disposição média.</p></div>${medidor('#F2C94C', .6, 'Média', '')}</div>
      <div class="prox"><span class="circ">${ic('pulso')}</span><div><small>Próximo check-in</small><span>em 3 dias</span><b>Retorno ao trabalho</b></div><span class="pilula">Iniciar agora</span></div>
    </section>
    <section class="sec"><div class="sec-t"><h4>Minhas consultas</h4></div>
      <div class="consulta"><span class="foto">${ic('usuaria')}</span><div><b>${p.especialista}</b><small>${p.especialidade}</small></div><div class="hora">Quinta<br><b>10:00</b></div></div>
      <div class="btn-pill">${ic('balao')} Fale com um especialista</div></section>
    <section class="sec" data-alvo="plano"><div class="sec-t"><h4>Meu plano de cuidado</h4></div>
      <div class="plano">
        <div class="tarefa"><span class="q">${ic('documento')}</span><div><b>Check-in emocional</b><small>Leva 3 minutos</small><span class="etq pend">Pendente</span></div></div>
        <div class="tarefa"><span class="q">${ic('lua')}</span><div><b>Rotina de sono</b><small>Sugestões para as próximas semanas</small><span class="etq ativo">Ativado</span></div></div>
        <div class="tarefa"><span class="q">${ic('estetoscopio')}</span><div><b>Conversa com especialista</b><small>Sugerida após o check-in</small><span class="etq pend">Pendente</span></div></div>
      </div></section>
  </div></div>${navInf(1)}`);
}

/* Rolagem guiada dentro da tela até um alvo [data-alvo] (ou deslocamento em px). */
export function rolarPara(app, alvo, margem = 70) {
  const c = app.querySelector('.conteudo');
  const y = typeof alvo === 'number' ? alvo : Math.max(0, (app.querySelector(`[data-alvo="${alvo}"]`)?.offsetTop || 0) - margem);
  c.style.transform = `translateY(${-y}px)`;
}

/* Toque simulado sobre um alvo: círculo que aparece e "aperta". */
export function tocar(app, alvo) {
  const a = app.querySelector(`[data-alvo="${alvo}"] .seta-dest`) || app.querySelector(`[data-alvo="${alvo}"]`);
  if (!a) return;
  const r = a.getBoundingClientRect(), base = app.getBoundingClientRect(), z = base.width / app.offsetWidth || 1;
  const t = document.createElement('span'); t.className = 'toque';
  t.style.left = ((r.left - base.left + r.width / 2) / z) + 'px'; t.style.top = ((r.top - base.top + r.height / 2) / z) + 'px';
  app.appendChild(t); requestAnimationFrame(() => t.classList.add('vai')); setTimeout(() => t.remove(), 1000);
}
