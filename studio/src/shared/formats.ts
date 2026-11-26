// Formatos padrão do Instagram. Use sempre estes, não números soltos.
export const FORMATS = {
  feed: {width: 1080, height: 1440}, // 3:4, feed vertical (padrão atual do grid)
  feed45: {width: 1080, height: 1350}, // 4:5, compatibilidade
  story: {width: 1080, height: 1920}, // 9:16, Stories e Reels
} as const;

// Margens de segurança (px). Stories/Reels: a UI do Instagram cobre topo e base.
export const SAFE = {
  feed: {x: 90, top: 100, bottom: 100},
  story: {x: 90, top: 250, bottom: 340},
} as const;

export const FPS = 30;
