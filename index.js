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

const minifyHTMLLiterals = require('minify-html-literals').minifyHTMLLiterals;

module.exports = function (snowpackConfig, pluginOptions = {}) {
  return {
    name: 'snowpack-plugin-minify-html-literals',
    async transform({ id, contents, isDev, fileExt }) {
      if (!['.js', '.mjs', '.ts'].includes(fileExt)) {
        return;
      }

      const result = minifyHTMLLiterals(
        contents,
        {
          fileName: id,
          ...pluginOptions.options
        }
      );

      if (!result) {
        return;
      }

      return result.code;
    },
  };
};
