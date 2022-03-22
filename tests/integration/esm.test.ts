import * as fs from 'fs/promises';
import * as path from 'path';

import {minifyHTMLLiterals} from 'minify-html-literals';

import {execAsync} from './helper';

describe('esm', () => {
  const root = path.join(__dirname, 'esm');

  test('creates minified index.js', async () => {
    const content = await fs.readFile(path.join(root, 'index.js'));
    const minified = minifyHTMLLiterals(content.toString());
    if (!minified) {
      fail('minified must be not null');
    }

    await execAsync('npm run build', {cwd: root});
    const actual = await fs.readFile(path.join(root, 'dist', 'index.js'));
    expect(actual.toString()).toEqual(minified.code);
  });
});
