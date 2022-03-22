import {createConfiguration, PluginTransformOptions} from 'snowpack';
import {Template, TemplatePart} from 'parse-literals';

import plugin from '../src/index';

describe('plugin', () => {
  const defaultTransformOpts: PluginTransformOptions = {
    id: 'file.js',
    srcPath: '/file.js',
    fileExt: '.js',
    contents: '',
    isDev: false,
    isHmrEnabled: false,
    isSSR: false,
    isPackage: false,
  };

  describe('when tagged html literal is not included', () => {
    test('returns null', async () => {
      const contents = `
        document.body.innerHTML = \`
          <div>
            <p>Hello, World!</p>
          </div>
        \`;
      `;

      const transform = plugin(createConfiguration()).transform;
      if (!transform) {
        fail('transform must be not null');
      }

      const actual = await transform({...defaultTransformOpts, contents});
      expect(actual).toBeNull();
    });
  });

  describe('when tagged html literal is included', () => {
    test('returns minified contents', async () => {
      const contents = `
        const html = (strings) => strings.raw[0];
        document.body.innerHTML = html\`
          <div>
            <p>Hello, World!</p>
          </div>
        \`;
      `;
      const expected = `
        const html = (strings) => strings.raw[0];
        document.body.innerHTML = html\`<div><p>Hello, World!</p></div>\`;
      `;

      const transform = plugin(createConfiguration()).transform;
      if (!transform) {
        fail('transform must be not null');
      }

      const actual = await transform({...defaultTransformOpts, contents});
      expect(actual).toEqual(expected);
    });
  });

  describe('when untagged html literal is included and shouldMinify returns false', () => {
    test('returns null', async () => {
      const contents = `
        document.body.innerHTML = \`
          <div data-minify="true">
            <p>Hello, World!</p>
          </div>
        \`;
      `;

      const transform = plugin(createConfiguration()).transform;
      if (!transform) {
        fail('transform must be not null');
      }

      const actual = await transform({...defaultTransformOpts, contents});
      expect(actual).toBeNull();
    });
  });

  describe('when untagged html literal is included and shouldMinify returns true', () => {
    test('returns minified contents', async () => {
      const contents = `
        document.body.innerHTML = \`
          <div data-minify="true">
            <p>Hello, World!</p>
          </div>
        \`;
      `;
      const expected = `
        document.body.innerHTML = \`<div data-minify="true"><p>Hello, World!</p></div>\`;
      `;

      const opts = {
        options: {
          shouldMinify: (template: Template) => {
            return template.parts.some((part: TemplatePart) =>
              part.text.includes('data-minify="true"')
            );
          },
        },
      };
      const transform = plugin(createConfiguration(), opts).transform;
      if (!transform) {
        fail('transform must be not null');
      }

      const actual = await transform({...defaultTransformOpts, contents});
      expect(actual).toEqual(expected);
    });
  });

  describe('when fileExt is not included in exts option', () => {
    test('returns null', async () => {
      const contents = `
        const html = (strings) => strings.raw[0];
        document.body.innerHTML = html\`
          <div>
            <p>Hello, World!</p>
          </div>
        \`;
      `;

      const opts = {exts: ['.ts']};
      const transform = plugin(createConfiguration(), opts).transform;
      if (!transform) {
        fail('transform must be not null');
      }

      const actual = await transform({...defaultTransformOpts, contents});
      expect(actual).toBeNull();
    });
  });

  describe('when fileExt is included in exts option', () => {
    test('returns not null', async () => {
      const contents = `
        const html = (strings) => strings.raw[0];
        document.body.innerHTML = html\`
          <div>
            <p>Hello, World!</p>
          </div>
        \`;
      `;

      const opts = {exts: ['.js']};
      const transform = plugin(createConfiguration(), opts).transform;
      if (!transform) {
        fail('transform must be not null');
      }

      const actual = await transform({...defaultTransformOpts, contents});
      expect(actual).not.toBeNull();
    });
  });
});
