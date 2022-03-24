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

import path from 'path';

import toBeMinified from './to-be-minified';

describe('toBeMinified', () => {
  describe('when file is already minified', () => {
    test('returns { pass: true }', async () => {
      const filename = path.join(__dirname, '..', 'fixtures', 'tagged.min.js');
      const result = await toBeMinified(filename);
      expect(result).toHaveProperty('pass', true);
      expect(result.message()).toEqual('minified');
    });
  });

  describe('when file is not minified', () => {
    test('returns { pass: false }', async () => {
      const filename = path.join(__dirname, '..', 'fixtures', 'tagged.js');
      const result = await toBeMinified(filename);
      expect(result).toHaveProperty('pass', false);
      expect(result.message()).toEqual('not minified');
    });
  });
});
