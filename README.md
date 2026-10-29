# LP Eva Maternidade v2

Landing page B2B da Eva Maternidade (benefício corporativo de maternidade). HTML, CSS e JS estáticos, sem build. Publicada no GitHub Pages com `noindex` enquanto for rascunho.

Governança, estrutura e decisões ficam fora deste repositório (projeto `lp/site_evamaternidade_v2`).

## Estrutura

| Caminho | Conteúdo |
|---|---|
| `index.html` | Página, seções na ordem aprovada (S01–S12) e `<template>` do formulário |
| `css/tema.css` | Tokens do app Eva |
| `css/biblioteca.css`, `js/lib/` | Biblioteca de motion própria |
| `css/base.css` | Tipografia, botões, navegação, rodapé, barra móvel, formulário |
| `css/secoes.css` | Seções |
| `js/main.js` | Navegação, menu Jornadas, gaveta, barra móvel, CTA ao formulário mais próximo, medição |
| `js/formulario.js` | Formulário compartilhado (abertura + conversão). `CONFIG.modo = 'prototipo'` não envia nada |

## Rodar local

```
python -m http.server 8020
```

Módulos ES não rodam em `file://`.
