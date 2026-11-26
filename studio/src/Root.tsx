import React from 'react';
import {Composition, Folder} from 'remotion';
import {FORMATS, FPS} from './shared/formats';
import {QuoteCard} from './brands/velpora/QuoteCard';
import {StatementCard} from './brands/nexora/StatementCard';
import {Reel, calculateReelMetadata} from './brands/nexora/Reel';
import {Slide} from './brands/nexora/Slide';
import {Story} from './brands/nexora/Story';

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
        defaultProps={{kind: 'cover' as const, index: 1, total: 6, eyebrow: 'GOOGLE MAPS', title: 'Por que sua clínica não aparece no Maps?', highlight: 'não aparece'}}
      />
      <Composition
        id="Nexora-Story"
        component={Story}
        durationInFrames={1}
        fps={FPS}
        {...FORMATS.story}
        defaultProps={{title: 'Sua agenda tem buraco no meio da semana?', highlight: 'buraco', sticker: 'poll' as const}}
      />
    </Folder>
  </>
);
