// Telas dos casos da S06 (T014): conversa com a Eva e agendamento com especialista (596:3637, 596:6982, 596:7408, 596:7059, refeitas).
// Telas ilustrativas, com dados fictícios.
import { el, ic, status, navInf } from './telas.js';

const ok = '<svg viewBox="0 0 24 24" class="ic ok" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';

export function chat(p) {
  return el(`${status()}<div class="rolo"><div class="conteudo">
    <header class="cab cab-chat"><span class="av eva">E</span><div><b>Eva</b><small>Aqui para você, a qualquer hora</small></div></header>
    <div class="chat"></div>
  </div></div>${navInf(4)}`);
}
// adiciona uma mensagem com entrada animada; quem: 'ela' | 'eva'
export function msg(app, quem, html) {
  const c = app.querySelector('.chat'); if (!c) return;
  const d = document.createElement('div'); d.className = `bal ${quem} entra`; d.innerHTML = html; c.appendChild(d);
}
export function digitando(app, on) {
  const c = app.querySelector('.chat'); if (!c) return;
  c.querySelector('.digit')?.remove();
  if (on) { const d = document.createElement('div'); d.className = 'bal eva digit'; d.innerHTML = '<i></i><i></i><i></i>'; c.appendChild(d); }
}

export function agendar(p) {
  const dias = [['Ter', 14], ['Qua', 15], ['Qui', 16], ['Sex', 17], ['Seg', 20]];
  return el(`${status()}<div class="rolo"><div class="conteudo">
    <header class="cab cab-t"><h4>Agendar conversa</h4><span class="btn-ic">${ic('sino')}</span></header>
    <section class="sec"><div class="consulta"><span class="foto">${ic('usuaria')}</span><div><b>${p.especialista}</b><small>${p.especialidade}</small></div><div class="hora">Online<br><b>50 min</b></div></div></section>
    <section class="sec"><div class="sec-t"><h4>Escolha o dia</h4></div>
      <div class="dias">${dias.map(([d, n], i) => `<span class="${i === 2 ? 'on' : ''}" ${i === 2 ? 'data-alvo="dia"' : ''}><small>${d}</small><b>${n}</b></span>`).join('')}</div></section>
    <section class="sec"><div class="sec-t"><h4>Horários</h4></div>
      <div class="horas"><span>08:00</span><span data-alvo="hora" class="hora-alvo">10:00</span><span>14:30</span><span>17:00</span></div>
      <div class="btn-pill" data-alvo="confirmar">Agendar</div></section>
  </div></div>${navInf(1)}`);
}
export function marcarHora(app) { app.querySelector('.hora-alvo')?.classList.add('on'); }

export function agendada(p) {
  return el(`${status()}<div class="rolo"><div class="conteudo">
    <div class="agendada entra"><span class="selo-ok">${ok}</span><h3>Consulta agendada</h3><p>Você recebe um lembrete antes da conversa.</p></div>
    <section class="sec"><div class="consulta entra" style="animation-delay:.15s"><span class="foto">${ic('usuaria')}</span><div><b>${p.especialista}</b><small>${p.especialidade}</small></div><div class="hora">Quinta<br><b>10:00</b></div></div></section>
    <section class="sec"><div class="sec-t"><h4>Enquanto isso</h4></div>
      <div class="lista-cont"><div class="entra" style="animation-delay:.3s"><span class="capa capa-azul"></span><div><span class="etq info">Revista</span><b>Ansiedade na volta ao trabalho</b><small>Leitura de 5 min</small></div></div></div></section>
  </div></div>${navInf(1)}`);
}
