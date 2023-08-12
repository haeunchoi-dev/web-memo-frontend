import './MemoModal.js';
import './MemoSummary.js';

class MemoView extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });

    this.initState();
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
        border-radius: 0.25rem;
        cursor: pointer;
        padding: 0 10px;
      }
    `;

    // Attach the created elements to the shadow dom
    this.shadow.appendChild(style);
  }

  render() {
    const template = `
        <div class="memo">
          <memo-summary memoId="${this.memoId}" mode="view"></memo-summary>
        </div>
        <memo-modal memoId="${this.memoId}" isOpen=${this.state.isModalOpen}></memo-modal>
    `;

    this.shadow.innerHTML = template;
    this.setStyle();
    this.setEvent();
  }

  setEvent() {
    const self = this;
    self.shadow
      .querySelector('.memo')
      .addEventListener('click', ({ target }) => {
        self.setState({ isModalOpen: !self.state.isModalOpen });
      });

    self.handleModalClose = self.handleModalClose.bind(self);
    const memoModal = self.shadow.querySelector('memo-modal');
    if (memoModal) {
      memoModal.handleModalCloseCallback = self.handleModalClose;
    }
  }

  initState() {
    this.state = { isModalOpen: false };
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.render();
  }

  get memoId() {
    return this.getAttribute('memoId') || crypto.randomUUID();
  }

  handleModalClose() {
    this.setState({ isModalOpen: false });
    this._handleEditCloseCallback();
  }

  set handleEditCloseCallback(callback) {
    this._handleEditCloseCallback = callback;
  }
}

customElements.define('memo-view', MemoView);
