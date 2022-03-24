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

import {minifyHTMLLiterals} from 'minify-html-literals';

import {execAsync} from './helper';

describe('cjs', () => {
  const root = path.join(__dirname, 'cjs');

  test('creates minified index.js', async () => {
    const content = await fs.promises.readFile(
      path.join(root, 'index.js'),
      'utf8'
    );
    const minified = minifyHTMLLiterals(content.toString());
    if (!minified) {
      fail('minified must be not null');
    }

    await execAsync('npm run build', {cwd: root});
    const actual = await fs.promises.readFile(
      path.join(root, 'dist', 'index.js'),
      'utf8'
    );
    expect(actual.toString()).toEqual(minified.code);
  });
});
