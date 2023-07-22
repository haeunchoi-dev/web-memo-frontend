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
        <div contenteditable="true">${this.value.text}</div>
      `;

    this.shadow.innerHTML = template;
    this.setStyle();
    this.setEvent();
  }

  setEvent() {
    const self = this;

    const $editableDiv = self.shadow.querySelector('div');
    $editableDiv.addEventListener('keyup', function (e) {
      self._handleContainerUpdateCallback(self.index, {
        ...self.value,
        text: e.target.innerHTML,
      });
    });
  }

  initState() {
    console.log(this.index, this.value);
    this.state = { isModalOpen: false };
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.render();
  }

  set handleContainerUpdateCallback(callback) {
    console.log(callback);
    this._handleContainerUpdateCallback = callback;
  }

  get index() {
    return this.getAttribute('index');
  }

  get value() {
    return JSON.parse(this.getAttribute('value'));
  }
}

customElements.define('text-container', TextContainer);
