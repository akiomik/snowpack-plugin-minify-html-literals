# snowpack-plugin-minify-html-literals

[![npm version](https://badge.fury.io/js/snowpack-plugin-minify-html-literals.svg)](https://badge.fury.io/js/snowpack-plugin-minify-html-literals)
[![Node.js CI](https://github.com/akiomik/snowpack-plugin-minify-html-literals/actions/workflows/node-ci.yml/badge.svg)](https://github.com/akiomik/snowpack-plugin-minify-html-literals/actions/workflows/node-ci.yml)
[![CodeQL](https://github.com/akiomik/snowpack-plugin-minify-html-literals/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/akiomik/snowpack-plugin-minify-html-literals/actions/workflows/codeql-analysis.yml)

`snowpack-plugin-minify-html-literals` is a [snowpack](https://www.snowpack.dev) plugin to minify HTML template literal strings, using [minify-html-literals](https://github.com/asyncLiz/minify-html-literals).

## Installation

```bash
npm install -D snowpack-plugin-minify-html-literals
```

## Usage

### Tagged templates

```js
// snowpack.config.mjs
export default {
  plugins: ['snowpack-plugin-minify-html-literals'],
};
```

```js
// index.js
const html = (strings) => strings.raw[0];
const template = html`
  <div>
    <p>Hello, World!</p>
  </div>
`;

const body = document.querySelector('body');
body.innerHTML = template;
```

```js
// A transformation result of index.js
const html = (strings) => strings.raw[0];
const template = html`<div><p>Hello, World!</p></div>`;

const body = document.querySelector('body');
body.innerHTML = template;
```

### Non-tagged templates

```js
// snowpack.config.mjs
export default {
  plugins: [[
    'snowpack-plugin-minify-html-literals',
    {
      options: {
        shouldMinify: (template) => {
          return template.parts.some(part => part.text.includes('data-minify="true"'));
        },
      },
    },
  ]],
};
```

```js
// index.js
const template = `
  <div data-minify="true">
    <p>Hello, World!</p>
  </div>
`;

const body = document.querySelector('body');
body.innerHTML = template;
```

```js
// A transformation result of index.js
const template = `<div data-minify="true"><p>Hello, World!</p></div>`;

const body = document.querySelector('body');
body.innerHTML = template;
```

## Options

```js
// snowpack.config.mjs
export default {
  plugins: [[
    'snowpack-plugin-minify-html-literals',
    {
      options: null, // minify-html-literals options. See https://github.com/asyncLiz/minify-html-literals#options
      exts: ['.js', '.mjs', '.ts'], // target file extensions
    }
  ]],
};
```
