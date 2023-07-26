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
        <div contenteditable="true">${this.text}</div>
      `;

    this.shadow.innerHTML = template;
    this.setStyle();
    this.setEvent();
  }

  setEvent() {
    const self = this;

    //디바운싱 적용
    let textTimer;
    const $editableDiv = self.shadow.querySelector('div');
    $editableDiv.addEventListener('keyup', function (e) {
      const textValue = e.target.innerHTML;
      if (textTimer) {
        clearTimeout(textTimer);
      }
      textTimer = setTimeout(function () {
        self._handleContainerUpdateCallback(self.index, {
          id: self.id,
          type: self.type,
          text: textValue,
        });
      }, 200);
    });
  }

  initState() {
    console.log(this.index, this.text);
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
    return Number(this.getAttribute('index'));
  }

  get id() {
    //id가 없다면 생성
    return this.getAttribute('id') || 0;
  }

  get type() {
    return this.getAttribute('type') || 'text';
  }

  get text() {
    return this.getAttribute('text') || '';
  }
}

customElements.define('text-container', TextContainer);
