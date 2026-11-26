import React from 'react';
import {Composition, Folder} from 'remotion';
import {FORMATS, FPS} from './shared/formats';
import {QuoteCard} from './brands/velpora/QuoteCard';
import {StatementCard} from './brands/nexora/StatementCard';

// Convenção de ID: <Marca>-<Template> (ex.: Velpora-QuoteCard). Só letras, números e hífen.
// Cada post usa um template + props; as props de cada post ficam em brands/<marca>/posts/<post>/props.json
// e são passadas no render com --props.
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
        {...FORMATS.feed45}
        defaultProps={{
          eyebrow: 'SEM PROMESSA MILAGROSA',
          title: 'Vocês garantem número de pacientes? Não.',
          highlight: 'Não.',
          body: 'E desconfie de quem garante. Nosso trabalho é colocar sua clínica na frente de quem procura o tratamento.',
        }}
      />
    </Folder>
  </>
);
