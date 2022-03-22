const html = strings => strings.raw[0];
const template = html`
  <div>
    <p>Hello, World!</p>
  </div>
`;

const body = document.querySelector('body');
body.innerHTML = template;
