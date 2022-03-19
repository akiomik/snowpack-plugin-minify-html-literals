snowpack-plugin-minify-html-literals
------------------------------------

A [snowpack](https://www.snowpack.dev) plugin to minify HTML template literal strings, uses [minify-html-literals](https://github.com/asyncLiz/minify-html-literals).

## Usage

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

## Options

```js
// snowpack.config.mjs
export default {
  plugins: [
    [
      'snowpack-plugin-minify-html-literals',
      {
        options: null // minify-html-literals options. See https://github.com/asyncLiz/minify-html-literals#options
      }
    ],
  ],
};
```
