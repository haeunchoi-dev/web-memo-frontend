import './MemoAdd.js';
import './MemoView.js';

class MemoList extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    console.log('memo list start');
    this.render();
  }

  setStyle() {
    const style = document.createElement('style');

    style.textContent = `
    .memo-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      }
    `;

    // Attach the created elements to the shadow dom
    this.shadow.appendChild(style);
  }

  render() {
    const template = `
    <section class="memo-list">
        <memo-add></memo-add>
    </section>
    `;

    this.shadow.innerHTML = template;
    this.setStyle();
  }
}

customElements.define('memo-list', MemoList);
