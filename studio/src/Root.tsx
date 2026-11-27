import React from 'react';
import {Composition, Folder} from 'remotion';
import {FORMATS, FPS} from './shared/formats';
import {QuoteCard} from './brands/velpora/QuoteCard';
import {StatementCard} from './brands/nexora/StatementCard';
import {Reel, calculateReelMetadata} from './brands/nexora/Reel';
import {Slide} from './brands/nexora/Slide';
import {Story} from './brands/nexora/Story';
import {PhotoCard} from './brands/nexora/PhotoCard';
import {Promo, PROMO_FRAMES} from './brands/nexora/Promo';
import {Spot, calculateSpotMetadata} from './brands/nexora/Spot';
import {Seal3D} from './brands/nexora/Seal3D';
import {Strike3D, calculateStrikeMetadata} from './brands/nexora/Strike3D';

// ATENÇÃO: o Remotion mistura defaultProps com as props do post. Não coloque em defaultProps campos
// opcionais (eyebrow, body, sub...), senão eles vazam para todo post que não os define.
// Convenção de ID: <Marca>-<Template> (ex.: Velpora-QuoteCard). Só letras, números e hífen.
// As props de cada post ficam em brands/<marca>/posts/<dia>/props.json (feed) e story.props.json (story)
// e são passadas no render com --props (scripts/render-post.sh faz isso).
export const Root: React.FC = () => (
  <>
    <Folder name="Velpora">
      <Composition
        id="Velpora-QuoteCard"
        component={QuoteCard}
        durationInFrames={60}
        fps={FPS}
        {...FORMATS.feed}
        defaultProps={{
          eyebrow: 'OUR BRAND',
          quote: 'Because every pet deserves a little extra care.',
          emphasis: 'a little extra care.',
          footer: 'Care Beyond Expectations.',
        }}
      />
    </Folder>
    <Folder name="Nexora">
      <Composition
        id="Nexora-StatementCard"
        component={StatementCard}
        durationInFrames={1}
        fps={FPS}
        {...FORMATS.feed}
        defaultProps={{
          eyebrow: 'SEM PROMESSA MILAGROSA',
          title: 'Vocês garantem número de pacientes? Não.',
          highlight: 'Não.',
          body: 'E desconfie de quem garante. Nosso trabalho é colocar sua clínica na frente de quem procura o tratamento.',
        }}
      />
      <Composition
        id="Nexora-Reel"
        component={Reel}
        durationInFrames={300}
        fps={FPS}
        {...FORMATS.story}
        calculateMetadata={calculateReelMetadata}
        defaultProps={{
          scenes: [
            {text: 'Cadeira parada não paga aluguel.', highlight: 'parada'},
            {text: 'Peça seu diagnóstico gratuito.', highlight: 'diagnóstico gratuito.', button: 'Link na bio'},
          ],
        }}
      />
      <Composition
        id="Nexora-Slide"
        component={Slide}
        durationInFrames={1}
        fps={FPS}
        {...FORMATS.feed}
        defaultProps={{kind: 'cover' as const, index: 1, total: 6, title: 'Por que sua clínica não aparece no Maps?', highlight: 'não aparece'}}
      />
      <Composition
        id="Nexora-Story"
        component={Story}
        durationInFrames={1}
        fps={FPS}
        {...FORMATS.story}
        defaultProps={{title: 'Sua agenda tem buraco no meio da semana?', highlight: 'buraco', sticker: 'poll' as const}}
      />
      <Composition
        id="Nexora-Promo"
        component={Promo}
        durationInFrames={PROMO_FRAMES}
        fps={FPS}
        {...FORMATS.story}
        defaultProps={{seal: ['BLACK FRIDAY', '80% OFF'] as [string, string], priceFrom: 'R$ 2.500', priceTo: 'R$ 500',
          offer: 'CONFIGURAÇÃO DO TRÁFEGO PAGO + CALENDÁRIO EDITORIAL', delivery: 'ENTREGA EM 1 DIA ÚTIL', cta: 'FALE COM A NEXORA'}}
      />
      <Composition
        id="Nexora-Spot"
        component={Spot}
        durationInFrames={450}
        fps={FPS}
        {...FORMATS.story}
        calculateMetadata={calculateSpotMetadata}
        defaultProps={{scenes: [{kind: 'final' as const, lines: ['BLACK FRIDAY NEXORA'], cta: 'CHAME AGORA'}]}}
      />
      <Composition
        id="Nexora-Seal3D"
        component={Seal3D}
        durationInFrames={150}
        fps={FPS}
        {...FORMATS.story}
        defaultProps={{top: 'BLACK FRIDAY', bottom: '80% OFF'}}
      />
      <Composition
        id="Nexora-Strike3D"
        component={Strike3D}
        durationInFrames={360}
        fps={FPS}
        {...FORMATS.story}
        calculateMetadata={calculateStrikeMetadata}
        defaultProps={{title: ['ATENÇÃO,', 'CLÍNICAS ODONTOLÓGICAS'] as [string, string], priceFrom: 'R$ 2.500', priceTo: 'R$ 500', off: '80% OFF',
          services: ['CONFIGURAÇÃO DO TRÁFEGO PAGO', 'CALENDÁRIO EDITORIAL PARA INSTAGRAM'] as [string, string], delivery: 'ENTREGA EM 1 DIA ÚTIL', cta: 'FALE AGORA!'}}
      />
      <Composition
        id="Nexora-PhotoCard"
        component={PhotoCard}
        durationInFrames={1}
        fps={FPS}
        {...FORMATS.feed}
        defaultProps={{photo: 'assets/nexora/unsplash/cadeira-vazia.jpg', title: 'Cadeira parada não paga aluguel.', highlight: 'parada'}}
      />
    </Folder>
  </>
);
