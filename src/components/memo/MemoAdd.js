import './MemoModal.js';
import MemoStore from '../../libs/MemoStore.js';

class MemoAdd extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });

    this.initState();
  }

  connectedCallback() {
    console.log('memo add start');
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
      
      .memo img {
        vertical-align: middle;
      }
    `;

    // Attach the created elements to the shadow dom
    this.shadow.appendChild(style);
  }

  render() {
    const template = `
        <div class="memo">
            <img src="./assets/plus.png" width="100px" />
        </div>
        <memo-modal memoId="${this.state.id}" isOpen=${this.state.isModalOpen} ></memo-modal>
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
        //localstorage insert
        MemoStore.insert({
          id: self.state.id,
          title: '',
          containerList: [
            {
              id: crypto.randomUUID(),
              text: '',
              type: 'text',
            },
          ],
        });
        self.setState({ isModalOpen: !self.state.isModalOpen });
      });

    self.handleModalClose = self.handleModalClose.bind(self);
    const memoModal = self.shadow.querySelector('memo-modal');
    if (memoModal) {
      memoModal.handleModalCloseCallback = self.handleModalClose;
    }
  }

  initState() {
    this.state = { isModalOpen: false, id: crypto.randomUUID() };
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.render();
  }

  handleModalClose() {
    this.setState({ isModalOpen: false });
    //id로 검색후 title이 비었고 list가 비었으면 삭제
    const newMemo = MemoStore.findById(this.state.id);
    if (
      newMemo.title.replace(/&nbsp;/g, '').trim() === '' &&
      (newMemo.containerList.length === 0 ||
        newMemo.containerList[0].text.replace(/&nbsp;/g, '').trim() === '')
    ) {
      MemoStore.remove({ id: this.state.id });
    }
    this._handleEditCloseCallback();
  }

  set handleEditCloseCallback(callback) {
    this._handleEditCloseCallback = callback;
  }
}

customElements.define('memo-add', MemoAdd);
