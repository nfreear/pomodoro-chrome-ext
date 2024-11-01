/**
 * Build a manifest file, targetting Chromium/Webkit or Gecko-based browsers.
 *
 * @copyright © Nick Freear and contributors, 19-Aug-2024.
 *
 * @see https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json
 */

const fs = require('fs').promises;
const { resolve } = require('path');

console.log('Building manifest - targetting:', process.env.UA);

const IS_GECKO = process.env.UA === 'gecko';

const FILE_PATH = resolve(__dirname, '..', 'manifest.json');
const SERVICE_WORKER = 'lib/service-worker.js';
const AUTHOR_NAME = 'Nick Freear';
// const BACKGROUND_PAGE = 'pages/background.html';

const TEMPLATE = {
  manifest_version: 3,

  short_name: 'My Pomodoro',
  name: 'My Pomodoro: work, relax, focus',
  version: '1.0',

  description: 'A Pomodoro countdown timer that helps you focus by blocking access to distracting websites.',
  homepage_url: 'https://github.com/nfreear/pomodoro-browser-ext#readme',
  author: {
    email: 'n.d.freear@gmail.com'
  },

  icons: {
    96: 'assets/icon-96.png',
    128: 'assets/icon-128.png'
  },

  permissions: [
    'activeTab',
    'notifications',
    'scripting',
    'storage',
    'webNavigation'
  ],

  host_permissions: [
    'https://*/*',
    'http://*/*'
  ],

  // content_security_policy: "script-src 'self'; font-src 'self' https://fonts.gstatic.com/; upgrade-insecure-requests;",

  background: {
    // scripts: ['lib/service-worker.js'],
    // service_worker: 'lib/service-worker.js'
    type: 'module'
  },

  action: {
    default_popup: 'pages/index.html',
    default_title: 'My Pomodoro'
  },

  options_ui: {
    open_in_tab: true,
    page: 'options/options.html'
  },

  // content_scripts: [],

  web_accessible_resources: [
    {
      matches: ['https://*/*'],
      resources: [
        'assets/app-icons.svg',
        'assets/content-style.css',
        // 'assets/evergreen_tree.svg',
        // 'assets/emoji.svg',
        'lib/emoji-svg.js',
        'lib/Icons.js'
      ]
    }
  ]
};

const GECKO = {
  browser_specific_settings: {
    gecko: {
      id: 'my-pomodoro-ext@nick.freear.org.uk',
      strict_min_version: '42.0'
    }
  }
};

const MANIFEST = IS_GECKO ? { ...TEMPLATE, ...GECKO } : TEMPLATE;

if (IS_GECKO) {
  // MANIFEST.background.page = BACKGROUND_PAGE;
  MANIFEST.background.scripts = [SERVICE_WORKER];

  MANIFEST.author = AUTHOR_NAME;
} else {
  // Chromium-specific.
  MANIFEST.background.service_worker = SERVICE_WORKER;
  MANIFEST.background.type = 'module';

  MANIFEST.permissions.push('offscreen');
}

const jsonData = JSON.stringify(MANIFEST, null, 2);

fs.writeFile(FILE_PATH, jsonData)
  .then(() => console.log('File written OK:', FILE_PATH))
  .catch((err) => {
    console.error('ERROR: failed to write:', FILE_PATH, err);
    process.exit(1);
  });
