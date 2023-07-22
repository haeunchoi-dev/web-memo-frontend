class TextContainer extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });

    this.initState();
  }

  connectedCallback() {
    this.render();
  }

  setStyle() {
    const style = document.createElement('style');

    style.textContent = `
          div {
              outline: none;
          }
      `;
    this.shadow.appendChild(style);
  }

  render() {
    const template = `
        <div contenteditable="true"></div>
      `;

    this.shadow.innerHTML = template;
    this.setStyle();
    this.setEvent();
  }

  setEvent() {
    const self = this;
  }

  initState() {
    this.state = { isModalOpen: false };
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.render();
  }
}

customElements.define('text-container', TextContainer);
