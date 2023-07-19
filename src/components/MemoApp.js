import './common/Header.js';
import './common/Aside.js';

class MemoApp extends HTMLElement {
  constructor() {
    super();
    this.connectedStore();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  connectedStore() {}

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
            <section class="memo-list">
                <div class="memo">
                  <img src="./assets/plus.png" width="100px" />
                </div>
            </section>
        </main>
    `;

    this.shadow.innerHTML = template;
    this.setStyle();
  }
}

customElements.define('memo-app', MemoApp);
