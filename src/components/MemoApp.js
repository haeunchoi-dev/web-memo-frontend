import './common/Header.js';
import './common/Aside.js';
import './memo/MemoList.js';

class MemoApp extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  setStyle() {
    const linkElem = document.createElement('link');
    linkElem.setAttribute('rel', 'stylesheet');
    linkElem.setAttribute('href', './css/memo-app.css');
    this.shadow.appendChild(linkElem);
  }

  render() {
    const template = `
        <memo-header></memo-header>
        <memo-aside></memo-aside>
        <main class="main">
          <memo-list></memo-list>
        </main>
    `;

    this.shadow.innerHTML = template;
    this.setStyle();
  }
}

customElements.define('memo-app', MemoApp);
