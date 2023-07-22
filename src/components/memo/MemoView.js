import './MemoModal.js';
class MemoView extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    console.log('memo view start');
    this.render();
  }

  setStyle() {
    const style = document.createElement('style');

    style.textContent = `
    .memo {
        margin: 10px auto;
        background-color: rgb(255, 255, 255);
        box-shadow:
          rgba(10, 10, 10, 0.1) 0px 0.5em 1em -0.125em,
          rgba(10, 10, 10, 0.02) 0px 0px 0px 1px;
        color: rgb(74, 74, 74);
        max-width: 100%;
        position: relative;
        height: 300px;
        width: 300px;
        text-align: center;
        line-height: 300px;
        border-radius: 0.25rem;
        cursor: pointer;
      }
    `;

    // Attach the created elements to the shadow dom
    this.shadow.appendChild(style);
  }

  render() {
    const template = `
        <div class="memo">
            
        </div>
        <memo-modal isOpen=${false}></memo-modal>
    `;

    this.shadow.innerHTML = template;
    this.setStyle();
  }
}

customElements.define('memo-view', MemoView);
