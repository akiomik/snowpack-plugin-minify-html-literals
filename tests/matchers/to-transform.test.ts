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

import type {PluginTransformOptions} from 'snowpack';

import toTransform from './to-transform';

describe('toTransform', () => {
  const plugin = {
    name: 'snowpack-plugin-dummy',
    transform: (): Promise<string | null> => Promise.resolve('a'),
  };
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

  describe('when transform is not defined', () => {
    test('returns { pass: false }', async () => {
      const emptyPlugin = {name: 'snowpack-plugin-dummy'};
      const result = await toTransform(emptyPlugin, defaultTransformOpts);
      expect(result).toHaveProperty('pass', false);
      expect(result.message()).toEqual('transform is not defined.');
    });
  });

  describe('when null value is received', () => {
    test('returns { pass: false }', async () => {
      const nullPlugin = {
        name: 'snowpack-plugin-dummy',
        transform: (): Promise<string | null> => Promise.resolve(null),
      };
      const result = await toTransform(nullPlugin, defaultTransformOpts);
      expect(result).toHaveProperty('pass', false);
      expect(result.message()).toEqual('not transformed');
    });
  });

  describe('when non-null value is received', () => {
    test('returns { pass: true }', async () => {
      const result = await toTransform(plugin, defaultTransformOpts);
      expect(result).toHaveProperty('pass', true);
      expect(result.message()).toEqual('transformed to a');
    });
  });

  describe('when returned value is matched to `to`', () => {
    test('returns { pass: true }', async () => {
      const result = await toTransform(plugin, defaultTransformOpts, 'a');
      expect(result).toHaveProperty('pass', true);
      expect(result.message()).toEqual('transformed to a');
    });
  });

  describe('when returned value is not matched to `to`', () => {
    test('returns { pass: true }', async () => {
      const result = await toTransform(plugin, defaultTransformOpts, 'b');
      expect(result).toHaveProperty('pass', false);
      expect(result.message()).toEqual('transformed to a');
    });
  });
});
