// Formatos padrão (decididos pelo Gabriel em 2026-11-26). Use sempre estes, não números soltos.
export const FORMATS = {
  feed: {width: 1080, height: 1350}, // criativos de feed e carrossel (4:5)
  story: {width: 1080, height: 1920}, // Stories e Reels (9:16)
} as const;

// Área segura.
// Feed: TODO o conteúdo (texto, logo, produto) dentro do quadrado central 1080×1080 (y 135 a 1215),
// com margem lateral de 90 px (o grid 3:4 do perfil corta ~35 px de cada lado de um 4:5).
// As faixas de 135 px em cima e embaixo recebem só fundo.
// Story/Reels: a interface do Instagram cobre topo e base.
export const FEED_SQUARE = {top: 135, bottom: 135} as const;
export const SAFE = {
  feed: {x: 90, top: FEED_SQUARE.top + 50, bottom: FEED_SQUARE.bottom + 50},
  story: {x: 90, top: 250, bottom: 340},
} as const;

export const FPS = 30;
