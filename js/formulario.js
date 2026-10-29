// Formulário compartilhado (S02 no desktop + S11). Um <template id="tpl-form"> é clonado em cada [data-form-slot].
// CONFIG.modo 'prototipo' não envia nada (rascunho em revisão). 'ao-vivo' envia ao formulário 8 do AC (pipeline 3).
// A troca para 'ao-vivo' e o teste real ficam com o Marcelo (T018).

export const CONFIG = {
  modo: 'prototipo',
  acUrl: 'https://bastasentir.activehosted.com/proc.php',
  acForm: { u: '8', f: '8', s: '', c: '0', m: '0', act: 'sub', v: '2' },
  calendly: 'https://calendly.com/contato-evamaternidade/conversa-com-a-eva-maternidade',
};

const UTM = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
const MSG = {
  fullname: 'Escreva seu nome.',
  email: 'Use um e-mail válido, de preferência o do trabalho.',
  'field[49]': 'Diga o nome da empresa.',
  'field[50]': 'Escolha o número de colaboradores.',
  consent: 'Precisamos do seu aceite para entrar em contato.',
};

export const linkAgenda = pos => `${CONFIG.calendly}?utm_source=evamaternidade.com.br&utm_medium=lp&utm_content=${pos}`;

function validar(c) {
  if (!(c.name in MSG)) return true;
  let ok = c.type === 'checkbox' ? c.checked : c.value.trim() !== '';
  if (c.name === 'email') ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(c.value.trim());
  c.setAttribute('aria-invalid', String(!ok));
  const erro = document.getElementById(c.getAttribute('aria-describedby'));
  if (erro) erro.textContent = ok ? '' : MSG[c.name];
  return ok;
}

function mascaraTel(e) {
  const d = e.target.value.replace(/\D/g, '').slice(0, 11);
  e.target.value = d.length > 6 ? `(${d.slice(0, 2)}) ${d.slice(2, d.length - 4)}-${d.slice(-4)}`
    : d.length > 2 ? `(${d.slice(0, 2)}) ${d.slice(2)}` : d;
}

function montar(slot) {
  const pos = slot.dataset.formSlot;
  const frag = document.getElementById('tpl-form').content.cloneNode(true);
  // ids únicos por posição
  frag.querySelectorAll('[id]').forEach(n => (n.id = `${n.id}-${pos}`));
  frag.querySelectorAll('[for]').forEach(n => n.setAttribute('for', `${n.getAttribute('for')}-${pos}`));
  frag.querySelectorAll('[aria-describedby]').forEach(n => n.setAttribute('aria-describedby', `${n.getAttribute('aria-describedby')}-${pos}`));
  frag.querySelectorAll('[aria-labelledby]').forEach(n => n.setAttribute('aria-labelledby', `${n.getAttribute('aria-labelledby')}-${pos}`));
  frag.querySelectorAll('[data-agenda]').forEach(a => (a.href = linkAgenda(`${pos}-${a.dataset.agenda}`)));
  if (slot.dataset.titulo) frag.querySelector('.form__titulo').textContent = slot.dataset.titulo;
  if (slot.dataset.apoio) frag.querySelector('.form__apoio').textContent = slot.dataset.apoio;
  slot.replaceChildren(frag);

  const form = slot.querySelector('form');
  const enviar = form.querySelector('.form__enviar');
  const falha = form.querySelector('.form__falha');
  const ok = slot.querySelector('.form__ok');
  form.addEventListener('blur', e => { if (e.target.matches('input, select')) validar(e.target); }, true);
  form.addEventListener('input', e => { if (e.target.getAttribute('aria-invalid') === 'true') validar(e.target); });
  form.addEventListener('change', e => { if (e.target.type === 'checkbox') validar(e.target); });
  form.querySelector('[name=phone]')?.addEventListener('input', mascaraTel);

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const campos = [...form.querySelectorAll('input, select')];
    const invalidos = campos.filter(c => !validar(c));
    if (invalidos.length) { invalidos[0].focus(); return; }
    enviar.disabled = true; enviar.textContent = 'Enviando…'; falha.textContent = '';
    try {
      if (CONFIG.modo === 'ao-vivo') {
        const dados = new URLSearchParams({ ...CONFIG.acForm, jsonp: 'true' });
        campos.forEach(c => { if (c.type !== 'checkbox' && c.value.trim()) dados.append(c.name, c.value.trim()); });
        const q = new URLSearchParams(location.search);
        UTM.forEach(k => { if (q.get(k)) dados.append(k, q.get(k)); });
        dados.append('lp_posicao', pos);
        await fetch(CONFIG.acUrl, { method: 'POST', mode: 'no-cors', body: dados });
      } else {
        await new Promise(r => setTimeout(r, 600));
      }
      slot.querySelector('.form').classList.add('is-enviado');
      ok.hidden = false;
      ok.querySelector('.form__previa').hidden = CONFIG.modo === 'ao-vivo';
      ok.querySelector('h3').focus();
      (window.dataLayer = window.dataLayer || []).push({ event: 'lead_form_submit', form: 'lp_v2', posicao: pos });
    } catch {
      enviar.disabled = false; enviar.textContent = 'Tentar de novo';
      falha.textContent = 'Não conseguimos enviar agora. Tente de novo ou escolha um horário na agenda.';
    }
  });
}

export function formularios() {
  document.querySelectorAll('[data-form-slot]').forEach(montar);
}
