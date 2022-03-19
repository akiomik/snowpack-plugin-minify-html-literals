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

import type {
  SnowpackPluginFactory,
  SnowpackConfig,
  PluginTransformOptions,
} from 'snowpack';
import {minifyHTMLLiterals, Options} from 'minify-html-literals';

interface PluginOptions {
  options?: Options;
  exts?: string[];
}

const plugin: SnowpackPluginFactory<PluginOptions> = (
  snowpackConfig: SnowpackConfig,
  pluginOptions: PluginOptions = {}
) => ({
  name: 'snowpack-plugin-minify-html-literals',
  async transform({id, contents, fileExt}: PluginTransformOptions) {
    const defaultOptions = {exts: ['.js', '.mjs', '.ts']};
    const options = {
      ...defaultOptions,
      ...pluginOptions,
    };

    if (!options.exts.includes(fileExt)) {
      return null;
    }

    const result = minifyHTMLLiterals(contents.toString(), {
      fileName: id,
      ...pluginOptions.options,
    });

    if (!result) {
      return null;
    }

    return result.code;
  },
});

export default plugin;
