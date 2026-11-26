import path from 'node:path';
import {Config} from '@remotion/cli/config';

// O logo da Nexora é importado de ../brands/nexora/brand-kit (fora desta pasta). Força uma única cópia do React,
// senão o componente do logo resolveria outro React e quebraria os hooks.
Config.overrideWebpackConfig((config) => ({
  ...config,
  resolve: {
    ...config.resolve,
    alias: {
      ...(config.resolve?.alias ?? {}),
      react: path.resolve(process.cwd(), 'node_modules/react'),
      'react-dom': path.resolve(process.cwd(), 'node_modules/react-dom'),
    },
  },
}));
