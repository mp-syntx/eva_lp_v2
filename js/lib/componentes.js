// Componentes de experiência (padrões P-004 a P-017). Cada um recebe o DOM e opções;
// nenhum decide conteúdo ou cor (isso fica no CSS do tema).
import { $, $$, svg, texto, reduz, tween, curva, aoVer, visivel, podeAnimar, loopVisivel, redesenhar, desenharAoVer, f1 } from './nucleo.js';
import { traco, mao, seta } from './traco.js';

/* P-005 · Comparador arrastável antes/depois.
   Estrutura: .cmp > .pane.a + .pane.b + .cmp-alca>.cmp-botao + input[type=range].
   CSS usa --x (0–100%) para o clip-path do painel b e a posição da alça.
   demo: sequência de posições tocada ao entrar na tela, até o usuário tocar. */
export function comparador(raiz, { demo = [50, 28, 72, 50], trecho = 650 } = {}) {
  const input = $('input[type=range]', raiz); let arrastando = false, tocou = false;
  const setX = v => { raiz.style.setProperty('--x', v + '%'); input.value = v; };
  const doPonteiro = e => { const b = raiz.getBoundingClientRect(); setX(Math.max(0, Math.min(100, (e.clientX - b.left) / b.width * 100))); };
  input.addEventListener('input', () => { tocou = true; setX(+input.value); });
  input.addEventListener('pointerdown', e => { tocou = arrastando = true; input.setPointerCapture(e.pointerId); doPonteiro(e); });
  input.addEventListener('pointermove', e => arrastando && doPonteiro(e));
  ['pointerup', 'pointercancel'].forEach(t => input.addEventListener(t, () => (arrastando = false)));
  setX(demo[0]);
  if (!reduz) aoVer(raiz, () => {
    let i = 0;
    const vai = () => { if (tocou || i >= demo.length - 1) return; const a = demo[i], b = demo[i + 1];
      tween(trecho, k => !tocou && setX(a + (b - a) * k), () => { i++; vai(); }, curva.inOutQuad); };
    setTimeout(vai, 400);
  });
  return { setX };
}

/* P-004 · Scrollytelling com palco sticky.
   passos: elementos com data-s (1..n); cenas: elementos com data-s; pontos: indicadores.
   aoTrocar(n): chamado quando a cena muda (para tocar a animação própria da cena).
   A "linha de leitura" é o meio da tela; quando o palco cobre a lista (celular),
   desce para o meio do espaço abaixo do palco. */
export function scrolly({ palco, passos, cenas, pontos = [], aoTrocar }) {
  let atual = 0;
  const set = n => {
    if (n === atual) return; atual = n;
    cenas.forEach(e => e.classList.toggle('on', +e.dataset.s === n));
    passos.forEach(e => e.classList.toggle('on', +e.dataset.s === n));
    pontos.forEach((d, i) => d.classList.toggle('on', i === n - 1));
    if (!reduz && aoTrocar) aoTrocar(n);
  };
  const lista = passos[0].parentElement;
  const linha = () => {
    const sr = palco.getBoundingClientRect(), r = lista.getBoundingClientRect();
    const sobrepoe = Math.min(sr.right, r.right) - Math.max(sr.left, r.left);
    if (sobrepoe <= 1) return innerHeight / 2;
    return (Math.min(innerHeight, Math.max(0, sr.bottom)) + innerHeight) / 2;
  };
  const sync = () => {
    if (!lista.getBoundingClientRect().height) return;
    const y = linha(); let melhor = 0, dist = Infinity;
    passos.forEach((p, i) => { const b = (p.querySelector('h3') || p).getBoundingClientRect(), d = Math.abs(b.top + b.height / 2 - y); if (d < dist) { dist = d; melhor = i; } });
    set(+passos[melhor].dataset.s);
  };
  let pendente = false;
  addEventListener('scroll', () => { sync(); if (!pendente) { pendente = true; requestAnimationFrame(() => { pendente = false; sync(); }); } }, { passive: true });
  addEventListener('resize', sync); addEventListener('load', sync);
  sync();
  return { set, get atual() { return atual; } };
}

/* P-010 · Roda/ciclo com nós clicáveis e avanço automático.
   svgRoda: <svg viewBox="0 0 700 700">; itens: [{rotulo, desenhar(g,x,y)}];
   lista: <li>s sincronizadas (pode ter um item a mais = "volta completa").
   miolo(g, C): desenha o centro. */
export function roda(svgRoda, { itens, lista = [], C = 350, R = 225, raioNo = 46, intervalo = 2300, pausa = 9000, miolo } = {}) {
  const n = itens.length, temFecho = lista.length === n + 2;
  svg('circle', { class: 'rd-trilho', cx: C, cy: C, r: R }, svgRoda);
  const arco = svg('circle', { class: 'rd-arco', cx: C, cy: C, r: R, transform: `rotate(-90 ${C} ${C})`, pathLength: 1, 'stroke-dasharray': '1 1' }, svgRoda);
  arco.style.strokeDashoffset = 1;
  const pos = itens.map((_, k) => { const a = (-90 + k * 360 / n) * Math.PI / 180; return { x: C + Math.cos(a) * R, y: C + Math.sin(a) * R, a }; });
  pos.forEach(p => svg('line', { class: 'rd-raio', x1: C, y1: C, x2: p.x, y2: p.y }, svgRoda));
  const centro = svg('circle', { class: 'rd-centro', cx: C, cy: C, r: 110 }, svgRoda);
  if (miolo) miolo(svg('g', {}, svgRoda), C);
  const volta = svg('g', { opacity: 0, class: 'rd-volta' }, svgRoda);
  seta(volta, pos[n - 1].x + 40, pos[n - 1].y + 22, C - 104, C - 34, { s: 71, curva: .28, w: 4, h: 14 });
  const corredor = svg('g', {}, svgRoda);
  corredor.style.transformOrigin = `${C}px ${C}px`; corredor.style.transition = 'transform .9s cubic-bezier(.5,0,.2,1)';
  svg('circle', { class: 'rd-corredor', cx: C, cy: C - R, r: 9 }, corredor);
  let idx = 0, voltas = 0, pausadoAte = 0;
  const nos = pos.map((p, k) => {
    const g = svg('g', { class: 'rd-no', tabindex: 0, role: 'button', 'aria-label': itens[k].rotulo }, svgRoda);
    svg('circle', { class: 'rd-borda', cx: p.x, cy: p.y, r: raioNo }, g);
    itens[k].desenhar?.(g, p.x, p.y, raioNo);
    texto(g, C + Math.cos(p.a) * (R + 80), C + Math.sin(p.a) * (R + 80) + 6, itens[k].rotulo, { class: 'rd-rotulo' });
    const vai = () => { pausadoAte = Date.now() + pausa; mostra(temFecho ? k + 1 : k); };
    g.addEventListener('click', vai); g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); vai(); } });
    return g;
  });
  lista.forEach((li, i) => li.addEventListener('click', () => { pausadoAte = Date.now() + pausa; mostra(i); }));
  const total = temFecho ? n + 2 : n, ultimo = total - 1;
  function mostra(i) {
    if (i < idx) voltas++; idx = i;
    lista.forEach((li, k) => li.classList.toggle('on', k === i));
    const fecho = temFecho && i === ultimo, ini = temFecho && i === 0;
    const k = temFecho ? Math.max(0, Math.min(n - 1, fecho ? n - 1 : i - 1)) : i;
    nos.forEach((g, j) => g.classList.toggle('on', fecho || (!ini && j === k)));
    arco.style.strokeDashoffset = ini ? 1 : (fecho ? 0 : 1 - k / n);
    corredor.style.transform = `rotate(${voltas * 360 + (fecho ? 360 : k * 360 / n)}deg)`; if (fecho) voltas++;
    centro.classList.toggle('on', ini || fecho);
    volta.setAttribute('opacity', fecho ? 1 : 0); if (fecho) redesenhar(volta);
  }
  mostra(0);
  const vis = visivel(svgRoda);
  if (!reduz) setInterval(() => { if (podeAnimar(vis) && Date.now() > pausadoAte) mostra((idx + 1) % total); }, intervalo);
  return { mostra };
}

/* P-011 · Fluxo de partículas: entram por um caminho, somem no núcleo, saem por outro
   (mudando de classe = mudando de cor) e "batem" no destino. */
export function fluxo(svgRaiz, { entradas, saidas, aoChegar, cadencia = 300, ida = 1500, dentro = 300, raio = 6.5 } = {}) {
  if (reduz) return;
  const camada = svg('g', {}, svgRaiz), vis = visivel(svgRaiz); let lista = [], ultimo = 0;
  function quadro(t) {
    if (podeAnimar(vis)) {
      if (t - ultimo > cadencia) { ultimo = t; const a = entradas[Math.floor(Math.random() * entradas.length)], bi = Math.floor(Math.random() * saidas.length), b = saidas[bi];
        lista.push({ c: svg('circle', { r: raio, class: 'fx-p' }, camada), a, b, bi, t0: t, la: a.getTotalLength(), lb: b.getTotalLength() }); }
      lista = lista.filter(p => {
        const dt = t - p.t0;
        if (dt < ida) { const q = p.a.getPointAtLength(p.la * curva.inOutQuad(dt / ida)); p.c.setAttribute('cx', q.x); p.c.setAttribute('cy', q.y); return true; }
        if (dt < ida + dentro) { p.c.setAttribute('opacity', 0); return true; }
        if (dt < ida * 2 + dentro) { if (!p.virou) { p.virou = true; p.c.classList.add('fx-p2'); p.c.setAttribute('opacity', 1); }
          const q = p.b.getPointAtLength(p.lb * curva.inOutQuad((dt - ida - dentro) / ida)); p.c.setAttribute('cx', q.x); p.c.setAttribute('cy', q.y); return true; }
        aoChegar?.(p.bi); p.c.remove(); return false;
      });
    }
    requestAnimationFrame(quadro);
  }
  requestAnimationFrame(quadro);
}

/* P-009a · Feed vivo de mensagens. mensagens: [{de, texto, marca?: bool, avatar?: fn→Node}] */
export function chatVivo(corpo, mensagens, { intervalo = 2600, max = 6, iniciais = 4 } = {}) {
  let i = 0;
  const empurra = () => {
    const m = mensagens[i++ % mensagens.length], d = document.createElement('div');
    d.className = 'msg' + (m.marca ? ' marca' : '');
    if (m.avatar) d.appendChild(m.avatar());
    const p = document.createElement('p'), q = document.createElement('small');
    q.textContent = m.de; p.append(q, document.createTextNode(m.texto)); d.appendChild(p); corpo.appendChild(d);
    while (corpo.children.length > max) corpo.firstChild.remove();
  };
  for (let k = 0; k < iniciais; k++) empurra();
  loopVisivel(corpo, intervalo, empurra);
}

/* P-009b · Ranking que se reordena. itens: [{nome, sub, valor, avatar?: fn→Node}] */
export function rankingVivo(ol, itens, { altura = 62, intervalo = 1500 } = {}) {
  itens.forEach(p => {
    const li = document.createElement('li'), pos = document.createElement('span'), nm = document.createElement('span'), sm = document.createElement('small'), v = document.createElement('span');
    pos.className = 'pos'; nm.className = 'nm'; v.className = 'v'; nm.textContent = p.nome; sm.textContent = p.sub; nm.appendChild(sm);
    li.append(pos, p.avatar ? p.avatar() : document.createElement('span'), nm, v); ol.appendChild(li); Object.assign(p, { li, pos, v });
  });
  const arruma = () => { itens.sort((a, b) => b.valor - a.valor); itens.forEach((p, i) => { p.li.style.transform = `translateY(${i * altura}px)`; p.pos.textContent = i + 1; p.v.textContent = p.valor; p.li.classList.toggle('topo', i === 0); }); };
  arruma();
  loopVisivel(ol, intervalo, () => { const p = itens[Math.floor(Math.random() * itens.length)]; p.valor += 1 + Math.floor(Math.random() * 4); p.li.classList.add('sobe'); setTimeout(() => p.li.classList.remove('sobe'), 900); arruma(); });
}

/* P-007 · Contador que sobe ao entrar na tela. <strong data-conta="69" data-prefixo="" data-sufixo="%"> */
export function contadores(raiz = document, dur = 1500) {
  $$('[data-conta]', raiz).forEach(n => aoVer(n, () => {
    if (reduz) return;
    const ate = +n.dataset.conta, pre = n.dataset.prefixo || '', suf = n.dataset.sufixo || '', dec = (n.dataset.conta.split(/[.,]/)[1] || '').length;
    tween(dur, k => { n.textContent = pre + (ate * k).toLocaleString('pt-BR', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suf; }, null, curva.outCubic);
  }, .6));
}

/* P-008 · Gráfico de blocos que sobe + curva desenhada. colunas: array de alturas (n blocos). */
export function graficoBlocos(g, { colunas, x0 = 120, passo = 70, bw = 15, bh = 13, vao = 4.5, base = 486, destaqueTopo = 3 } = {}) {
  const pts = [];
  colunas.forEach((n, i) => {
    const x = x0 + i * passo;
    for (let k = 0; k < n; k++) { const b = svg('rect', { class: 'gb-bloco' + (k > n - destaqueTopo - 1 ? ' forte' : ''), x: x - bw / 2, y: base - (k + 1) * (bh + vao), width: bw, height: bh, rx: 3 }, g); b.style.animationDelay = (i * .08 + k * .01).toFixed(2) + 's'; }
    pts.push([x, base - n * (bh + vao) - 14]);
  });
  svg('line', { class: 'gb-eixo', x1: x0 - 50, y1: base + 8, x2: x0 + passo * (colunas.length - 1) + 50, y2: base + 8 }, g);
  let d = `M${pts[0][0]} ${f1(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) { const p0 = pts[i - 1] || pts[i], a = pts[i], b = pts[i + 1], p3 = pts[i + 2] || b;
    d += ` C${f1(a[0] + (b[0] - p0[0]) / 6)} ${f1(a[1] + (b[1] - p0[1]) / 6)},${f1(b[0] - (p3[0] - a[0]) / 6)} ${f1(b[1] - (p3[1] - a[1]) / 6)},${b[0]} ${f1(b[1])}`; }
  svg('path', { class: 'gb-curva', d, pathLength: 1 }, g);
  aoVer(g, () => !reduz && g.classList.add('vai'), .25);
  return pts;
}

/* P-017 · Barra de progresso de leitura + nav com borda ao rolar. */
export function progressoLeitura(nav, barra) {
  const at = () => { nav?.classList.toggle('rolou', scrollY > 10); const h = document.documentElement; barra.style.transform = `scaleX(${h.scrollTop / ((h.scrollHeight - h.clientHeight) || 1)})`; };
  addEventListener('scroll', at, { passive: true }); at();
}

/* Marquee: duplica os itens para o loop CSS de -50%. */
export function marquee(ul) { [...ul.children].forEach(li => { const c = li.cloneNode(true); c.setAttribute('aria-hidden', 'true'); c.querySelector('img')?.setAttribute('alt', ''); ul.appendChild(c); }); }


/* P-019 · Micro-história: sequência de etapas que toca em loop enquanto ativa e visível.
   passos: [{ legenda, dur (ms), entrar(): void }]. ui: { legenda, contador, barra } (opcionais).
   A barra cresce de 0 a 100% durante cada etapa (transição linear de width/scaleX).
   Retorna { tocar(), parar() }: o capítulo ativo toca, os outros param. */
export function microHistoria(no, passos, ui = {}) {
  let i = 0, tm = null, ativo = false;
  const vis = visivel(no);
  const etapa = () => {
    if (!ativo) return;
    if (!podeAnimar(vis)) { tm = setTimeout(etapa, 400); return; }
    const p = passos[i];
    p.entrar?.();
    if (ui.legenda) ui.legenda.textContent = p.legenda ?? '';
    if (ui.contador) ui.contador.textContent = `${(i % passos.length) + 1}/${passos.length}`;
    if (ui.barra) { ui.barra.style.transition = 'none'; ui.barra.style.transform = 'scaleX(0)'; void ui.barra.offsetWidth; ui.barra.style.transition = `transform ${p.dur}ms linear`; ui.barra.style.transform = 'scaleX(1)'; }
    i = (i + 1) % passos.length;
    tm = setTimeout(etapa, p.dur);
  };
  return {
    tocar() { if (ativo) return; ativo = true; i = 0; if (reduz) { passos.forEach(p => p.entrar?.()); return; } etapa(); },
    parar() { ativo = false; clearTimeout(tm); },
  };
}

/* P-019 · Demonstração em capítulos: a rolagem escolhe o capítulo (via scrolly) e
   cada capítulo toca sua micro-história. historias: { [n]: microHistoria(...) }. */
export function capitulos({ palco, passos, cenas, pontos = [], historias }) {
  let atual = 0;
  const troca = n => { if (atual) historias[atual]?.parar(); atual = n; historias[n]?.tocar(); };
  const ctl = scrolly({ palco, passos, cenas, pontos, aoTrocar: troca });
  if (reduz) Object.values(historias).forEach(h => h.tocar());
  else aoVer(palco, () => { if (!atual) troca(ctl.atual || 1); }, .3);
  return ctl;
}

/* P-020 · Antes/depois por sobreposição na rolagem.
   secao: alta (ex.: 300vh) com um filho sticky; antes/depois: cartões lado a lado.
   p = 0 → lado a lado; p = 1 → "depois" centralizado por cima, "antes" recuado.
   aoFim(): chamado uma vez quando p passa de 0,85 (ex.: desenhar o traço). */
export function sobreposicao(secao, antes, depois, { aoFim, recuo = .9 } = {}) {
  let fim = false, pend = false;
  const at = () => {
    pend = false;
    const r = secao.getBoundingClientRect(), total = r.height - innerHeight;
    const p = reduz ? 1 : Math.max(0, Math.min(1, -r.top / (total || 1)));
    const e = curva.inOutCubic(p);
    // centro de layout (offsetLeft ignora transform) → deslocamento até o centro da tela
    const cx = el => el.offsetParent.getBoundingClientRect().left + el.offsetLeft + el.offsetWidth / 2;
    const alvo = innerWidth / 2;
    depois.style.transform = `translateX(${(alvo - cx(depois)) * e}px)`;
    antes.style.transform = `translateX(${(alvo - cx(antes)) * e}px) scale(${1 - (1 - recuo) * e})`;
    antes.style.opacity = String(1 - .6 * e);
    if (p > .85 && !fim) { fim = true; aoFim?.(); }
    if (p < .5) fim = false;
  };
  addEventListener('scroll', () => { if (!pend) { pend = true; requestAnimationFrame(at); } }, { passive: true });
  addEventListener('resize', at); at();
}

/* P-024 · Vitrine de casos com escolha por clique (abas acessíveis).
   abas: botões; paineis: elementos do celular/descrição por caso (mesma ordem);
   historias: [microHistoria...] por caso. Setas ←/→/↑/↓, Home/End navegam.
   avancar: ms para avanço automático (0 = desligado, como na referência). */
export function vitrine(lista, abas, paineis, historias, { avancar = 0 } = {}) {
  lista.setAttribute('role', 'tablist');
  let atual = -1, tm;
  const seleciona = (i, foco = false) => {
    if (i === atual) return;
    if (atual >= 0) historias[atual]?.parar();
    atual = i;
    abas.forEach((a, k) => { a.setAttribute('aria-selected', k === i); a.tabIndex = k === i ? 0 : -1; a.classList.toggle('on', k === i); });
    paineis.forEach(grupo => grupo.forEach((p, k) => { p.hidden = k !== i; }));
    historias[i]?.tocar();
    if (foco) abas[i].focus();
    clearTimeout(tm); if (avancar && !reduz) tm = setTimeout(() => seleciona((i + 1) % abas.length), avancar);
  };
  abas.forEach((a, k) => {
    a.setAttribute('role', 'tab');
    const id = a.id || (a.id = 'aba-' + Math.random().toString(36).slice(2, 8));
    paineis.forEach(grupo => { grupo[k].setAttribute('role', 'tabpanel'); grupo[k].setAttribute('aria-labelledby', id); });
    a.addEventListener('click', () => seleciona(k));
    a.addEventListener('keydown', e => {
      const n = abas.length, mapa = { ArrowDown: k + 1, ArrowRight: k + 1, ArrowUp: k - 1, ArrowLeft: k - 1, Home: 0, End: n - 1 };
      if (e.key in mapa) { e.preventDefault(); seleciona((mapa[e.key] + n) % n, true); }
    });
  });
  aoVer(lista, () => seleciona(0), .3);
  if (atual < 0) { abas.forEach((a, k) => a.setAttribute('aria-selected', k === 0)); paineis.forEach(g => g.forEach((p, k) => (p.hidden = k !== 0))); }
  return { seleciona };
}

export { traco, mao, seta, desenharAoVer, redesenhar };
