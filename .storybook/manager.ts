import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

addons.setConfig({
  theme: create({
    base: 'dark',
    brandTitle: 'Dimension UI',
    brandUrl: 'https://dimension.pt',
    colorPrimary: '#4f8cff',
    colorSecondary: '#2f6fe0',
    appBg: '#07090f',
    appContentBg: '#0d111b',
    appBorderColor: '#1e2942',
    barBg: '#0d111b',
  }),
});
