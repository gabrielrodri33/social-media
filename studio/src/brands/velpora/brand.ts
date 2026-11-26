// Tokens oficiais da VELPORA (briefing, seção 5). Fonte: brands/velpora/BRAND.md
import '@fontsource/playfair-display/500.css';
import '@fontsource/playfair-display/600.css';
import '@fontsource/playfair-display/500-italic.css';
import '@fontsource/montserrat/400.css';
import '@fontsource/montserrat/500.css';
import '@fontsource/montserrat/600.css';

export const V = {
  forest: '#1F3B2E', // principal
  sage: '#8FA98F', // secundária
  cream: '#F7F3E8', // fundos
  sand: '#E5D8C6', // apoio
  caramel: '#C49A6C', // detalhes premium
} as const;

export const SERIF = '"Playfair Display", Georgia, serif';
export const SANS = 'Montserrat, Helvetica, Arial, sans-serif';

// TODO(logo): o arquivo oficial do logo da VELPORA ainda não foi enviado.
// Não desenhe nem simule um logo (nem um "VELPORA" estilizado). Quando chegar,
// ele entra em brands/velpora/brand-kit/ e vira um componente <VelporaLogo />.
