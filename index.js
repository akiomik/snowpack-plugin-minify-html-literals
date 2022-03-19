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
