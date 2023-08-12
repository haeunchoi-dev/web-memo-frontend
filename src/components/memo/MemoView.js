import './MemoModal.js';
import './MemoSummary.js';
import MemoStore from '../../libs/MemoStore.js';

class MemoView extends HTMLElement {
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
        padding: 0 10px;
      }

      .memo-summary{
        cursor: pointer;
      }

      .memo .delete_btn {
        position: absolute;
        bottom: 10px;
        right: 10px;
        cursor: pointer;

        background-color: rgb(250 160 40);
        border-radius: 10%;
        padding: 5px;
        color: white;
        font-weight: bold;
      }

      .memo .delete_btn {
        background: rgb(255, 146, 0);
      }
    `;

    // Attach the created elements to the shadow dom
    this.shadow.appendChild(style);
  }

  render() {
    const template = `
        <div class="memo">
          <div class="memo-summary"><memo-summary memoId="${this.memoId}" mode="view"></memo-summary></div>
          
          <a class="delete_btn">삭제</a>
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
      .querySelector('.memo-summary')
      .addEventListener('click', ({ target }) => {
        self.setState({ isModalOpen: !self.state.isModalOpen });
      });

    self.shadow
      .querySelector('.delete_btn')
      .addEventListener('click', ({ target }) => {
        self.removeMemo();
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

  removeMemo() {
    if (confirm('메모를 삭제하시겠습니까?')) {
      MemoStore.remove({ id: this.memoId });
      this._handleEditCloseCallback();
    }
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
