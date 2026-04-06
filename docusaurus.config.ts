import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';

const config: Config = {
  title: 'DSA.ref',
  tagline: 'Personal DSA reference — solved, explained, remembered.',
  favicon: 'img/favicon.ico',
  url: 'https://your-site.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: { defaultLocale: 'en', locales: ['en'] },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',   // serve docs at root
        },
        blog: false,            // no blog needed
        theme: {
          customCss: './src/css/custom.css',
        },
      },
    ],
  ],

  themeConfig: {
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: true,      // always dark
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: '⬡ DSA.ref',
      items: [
        { type: 'docSidebar', sidebarId: 'dsa', position: 'left', label: 'Problems' },
      ],
    },
    prism: {
      theme: prismThemes.oneDark,
      darkTheme: prismThemes.oneDark,
      additionalLanguages: ['swift'],
    },
    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: true,
      },
    },
  },
};

export default config;
