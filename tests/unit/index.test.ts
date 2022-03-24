// Copyright 2022 Akiomi Kamakura
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {createConfiguration, PluginTransformOptions} from 'snowpack';
import {Template, TemplatePart} from 'parse-literals';

import plugin from '../../src/index';
import '../matchers/syntax';
import toTransform from '../matchers/to-transform';

beforeEach(() => {
  expect.extend({toTransform});
});

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

  const jsWithTag = `
    const html = (strings) => strings.raw[0];
    document.body.innerHTML = html\`
      <div>
        <p>Hello, World!</p>
      </div>
    \`;
  `;
  const minifiedJsWithTag = `
    const html = (strings) => strings.raw[0];
    document.body.innerHTML = html\`<div><p>Hello, World!</p></div>\`;
  `;
  const jsWithoutTag = `
    document.body.innerHTML = \`
      <div data-minify="true">
        <p>Hello, World!</p>
      </div>
    \`;
  `;
  const minifiedJsWithoutTag = `
    document.body.innerHTML = \`<div data-minify="true"><p>Hello, World!</p></div>\`;
  `;

  describe('when tagged html literal is not included', () => {
    test('returns null', async () => {
      const contents = `
        document.body.innerHTML = \`
          <div>
            <p>Hello, World!</p>
          </div>
        \`;
      `;
      const opts = {...defaultTransformOpts, contents};
      await expect(plugin(createConfiguration())).not.toTransform(opts);
    });
  });

  describe('when tagged html literal is included', () => {
    test('returns minified contents', async () => {
      const opts: PluginTransformOptions = {
        ...defaultTransformOpts,
        contents: jsWithTag,
      };
      const p = plugin(createConfiguration());
      await expect(p).toTransform(opts, minifiedJsWithTag);
    });
  });

  describe('when untagged html literal is included and shouldMinify returns false', () => {
    test('does not transform', async () => {
      const opts = {...defaultTransformOpts, contents: jsWithoutTag};
      await expect(plugin(createConfiguration())).not.toTransform(opts);
    });
  });

  describe('when untagged html literal is included and shouldMinify returns true', () => {
    test('transforms', async () => {
      const shouldMinify = (template: Template) => {
        return template.parts.some((part: TemplatePart) =>
          part.text.includes('data-minify="true"')
        );
      };
      const pluginOpts = {options: {shouldMinify}};
      const opts = {...defaultTransformOpts, contents: jsWithoutTag};
      const p = plugin(createConfiguration(), pluginOpts);
      await expect(p).toTransform(opts, minifiedJsWithoutTag);
    });
  });

  describe('when fileExt is not included in exts option', () => {
    test('does not transform', async () => {
      const pluginOpts = {exts: ['.ts']};
      const opts = {...defaultTransformOpts, contents: jsWithTag};
      expect(plugin(createConfiguration(), pluginOpts)).not.toTransform(opts);
    });
  });

  describe('when fileExt is included in exts option', () => {
    test('transforms', async () => {
      const pluginOpts = {exts: ['.js']};
      const opts = {...defaultTransformOpts, contents: jsWithTag};
      expect(plugin(createConfiguration(), pluginOpts)).toTransform(opts);
    });
  });
});
