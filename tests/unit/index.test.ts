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

import fs from 'fs';
import path from 'path';

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

  const fixtures = path.join(__dirname, '..', 'fixtures');
  const plainJs = path.join(fixtures, 'plain.js');
  const taggedJs = path.join(fixtures, 'tagged.js');
  const taggedMinJs = path.join(fixtures, 'tagged.min.js');
  const untaggedJs = path.join(fixtures, 'untagged.js');
  const untaggedMinJs = path.join(fixtures, 'untagged.min.js');

  describe('when tagged html literal is not included', () => {
    test('returns null', async () => {
      const input = await fs.promises.readFile(plainJs, 'utf8');
      const opts = {...defaultTransformOpts, contents: input.toString()};
      await expect(plugin(createConfiguration())).not.toTransform(opts);
    });
  });

  describe('when tagged html literal is included', () => {
    test('returns minified contents', async () => {
      const input = await fs.promises.readFile(taggedJs, 'utf8');
      const output = await fs.promises.readFile(taggedMinJs, 'utf8');
      const opts: PluginTransformOptions = {
        ...defaultTransformOpts,
        contents: input.toString(),
      };
      const p = plugin(createConfiguration());
      await expect(p).toTransform(opts, output.toString());
    });
  });

  describe('when untagged html literal is included and shouldMinify returns false', () => {
    test('does not transform', async () => {
      const input = await fs.promises.readFile(untaggedJs, 'utf8');
      const opts = {...defaultTransformOpts, contents: input.toString()};
      await expect(plugin(createConfiguration())).not.toTransform(opts);
    });
  });

  describe('when untagged html literal is included and shouldMinify returns true', () => {
    test('transforms', async () => {
      const input = await fs.promises.readFile(untaggedJs, 'utf8');
      const output = await fs.promises.readFile(untaggedMinJs, 'utf8');
      const shouldMinify = (template: Template) => {
        return template.parts.some((part: TemplatePart) =>
          part.text.includes('data-minify="true"')
        );
      };
      const pluginOpts = {options: {shouldMinify}};
      const opts = {...defaultTransformOpts, contents: input.toString()};
      const p = plugin(createConfiguration(), pluginOpts);
      await expect(p).toTransform(opts, output.toString());
    });
  });

  describe('when fileExt is not included in exts option', () => {
    test('does not transform', async () => {
      const input = await fs.promises.readFile(taggedJs, 'utf8');
      const pluginOpts = {exts: ['.ts']};
      const opts = {...defaultTransformOpts, contents: input.toString()};
      expect(plugin(createConfiguration(), pluginOpts)).not.toTransform(opts);
    });
  });

  describe('when fileExt is included in exts option', () => {
    test('transforms', async () => {
      const input = await fs.promises.readFile(taggedJs, 'utf8');
      const pluginOpts = {exts: ['.js']};
      const opts = {...defaultTransformOpts, contents: input.toString()};
      expect(plugin(createConfiguration(), pluginOpts)).toTransform(opts);
    });
  });
});
