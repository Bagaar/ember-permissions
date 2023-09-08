import { embroiderOptimized, embroiderSafe } from '@embroider/test-setup';
import emberSourceChannelURL from 'ember-source-channel-url';

export default {
  packageManager: 'yarn',
  testCommand: ['yarn', 'test:ember'],
  scenarios: [
    {
      name: 'ember-lts-4.8',
      packageJson: {
        devDependencies: {
          'ember-source': '~4.8.0',
        },
      },
    },
    {
      name: 'ember-lts-4.12',
      packageJson: {
        devDependencies: {
          'ember-source': '~4.12.0',
        },
      },
    },
    {
      name: 'ember-release',
      packageJson: {
        devDependencies: {
          'ember-source': await emberSourceChannelURL('release'),
        },
      },
    },
    {
      name: 'ember-beta',
      packageJson: {
        devDependencies: {
          'ember-source': await emberSourceChannelURL('beta'),
        },
      },
    },
    {
      name: 'ember-canary',
      packageJson: {
        devDependencies: {
          'ember-source': await emberSourceChannelURL('canary'),
        },
      },
    },
    embroiderSafe(),
    embroiderOptimized(),
  ],
};
