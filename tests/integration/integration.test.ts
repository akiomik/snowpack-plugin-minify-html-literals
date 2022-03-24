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

import {execAsync} from './helper';
import '../matchers/syntax';
import toBeMinified from '../matchers/to-be-minified';

beforeEach(() => {
  expect.extend({toBeMinified});
});

describe('integration', () => {
  test.each([['cjs'], ['esm']])(
    'creates minified index.js on %s',
    async (dirname: string) => {
      const root = path.join(__dirname, dirname);
      await execAsync('npm run build', {cwd: root});
      await expect(path.join(root, 'dist', 'index.js')).toBeMinified();
    }
  );
});
