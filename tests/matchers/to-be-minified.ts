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

import {minifyHTMLLiterals} from 'minify-html-literals';

export default async function toBeMinified(
  filename: string
): Promise<jest.CustomMatcherResult> {
  const content = await fs.promises.readFile(filename, 'utf8');
  const result = minifyHTMLLiterals(content.toString());
  const pass = result === null;
  const message = () => (pass ? 'minified' : 'not minified');

  return {pass, message};
}
