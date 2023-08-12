import './MemoAdd.js';
import './MemoView.js';
import MemoStore from '../../libs/MemoStore.js';

class MemoList extends HTMLElement {
  constructor() {
    super();
    this.connectedStore();
    this.shadow = this.attachShadow({ mode: 'open' });

    this.initState();
  }

  connectedStore() {
    console.log(MemoStore.selectAll());
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
        ${this.state
          .map((data) => {
            return `<memo-view memoId="${data.id}"></memo-view>`;
          })
          .join('')}
    </section>
    `;

    this.shadow.innerHTML = template;
    this.setStyle();
    this.setEvent();
  }

  setEvent() {
    const self = this;

    self.handleEditClose = self.handleEditClose.bind(self);
    const memoAdd = self.shadow.querySelector('memo-add');
    if (memoAdd) {
      memoAdd.handleEditCloseCallback = self.handleEditClose;
    }

    const memoList = self.shadow.querySelectorAll('memo-view');
    memoList.forEach((memo) => {
      memo.handleEditCloseCallback = self.handleEditClose;
    });
  }

  initState() {
    this.state = MemoStore.selectAll();
  }

  reRender() {
    this.state = MemoStore.selectAll();
    this.render();
  }

  handleEditClose() {
    this.reRender();
  }
}

customElements.define('memo-list', MemoList);
