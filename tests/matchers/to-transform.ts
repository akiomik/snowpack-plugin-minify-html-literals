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

import type {SnowpackPlugin, PluginTransformOptions} from 'snowpack';

export default async function toTransform(
  received: SnowpackPlugin,
  opts: PluginTransformOptions,
  to?: string
): Promise<jest.CustomMatcherResult> {
  if (!received.transform) {
    return {
      pass: false,
      message: () => 'transform is not defined.',
    };
  }

  const transformed = await received.transform(opts);
  const pass = to === undefined ? transformed !== null : transformed === to;
  const message = () =>
    transformed ? `transformed to ${transformed}` : 'not transformed';

  return {
    pass,
    message,
  };
}
