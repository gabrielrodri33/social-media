// Tokens da Nexora (espelho de tailwind.config.ts do repo lp-nexora).
// O LOGO não usa estas cores: ele vem pronto do brand-kit.
import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/montserrat/700.css';

export {NexoraLogo} from '../../../../brands/nexora/brand-kit/react/NexoraLogo';

export const C = {
  navy: '#071a33', // fundo escuro dos criativos
  navy2: '#0B2A4F', // = tailwind navy
  cyan: '#00C8E8',
  sky: '#5BB8E8',
  ice: '#EAF4FB',
  white: '#FFFFFF',
} as const;

export const FONT = 'Inter, system-ui, sans-serif';
export const DISPLAY = 'Montserrat, Inter, sans-serif';
