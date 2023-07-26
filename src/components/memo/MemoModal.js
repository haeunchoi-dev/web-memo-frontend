import './MemoMain.js';

class MemoModal extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    console.log('connect modal', this.isOpen);
    this.render();
  }

  disconnectedCallback() {}

  setStyle() {
    const style = document.createElement('style');

    style.textContent = `
        .modal {
          width: 500px;
          padding: 35px 20px 20px 20px;
          background-color: #fefefe;
          border: 1px solid #888;
          border-radius: 3px;

          position: fixed;
          display: ${this.isOpen === 'true' ? 'block' : 'none'};
          //display: block;
          box-shadow:
            0 4px 8px 0 rgba(0, 0, 0, 0.2),
            0 6px 20px 0 rgba(0, 0, 0, 0.19);
          z-index: 10000;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          ms-transform: translate(-50%, -50%);
          webkit-transform: translate(-50%, -50%);
        }

        .modal .modal_close_btn {
          position: absolute;
          top: 10px;
          right: 10px;
          cursor: pointer;

          background-color: rgb(250 160 40);
          border-radius: 10%;
          padding: 5px;
          color: white;
          font-weight: bold;
        }

        .modal .modal_close_btn:hover {
          background: rgb(255, 146, 0);
        }

        .modal_bg {
          display: ${this.isOpen === 'true' ? 'block' : 'none'};
          //display: block;
          position: fixed;
          z-index: 9999;
          left: 0px;
          top: 0px;
          width: 100%;
          height: 100%;
          overflow: auto;
          background-color: rgba(0, 0, 0, 0.4);
        }
    `;

    // Attach the created elements to the shadow dom
    this.shadow.appendChild(style);
  }

  render() {
    const template = `
    <div class="modal">
      <memo-main></memo-main>
      <a class="modal_close_btn">닫기</a>
    </div>
    <div class="modal_bg"></div>  
    `;
    this.shadow.innerHTML = template;
    this.setStyle();
    this.setEvent();
  }

  setEvent() {
    const self = this;
    self.shadow
      .querySelector('.modal_close_btn')
      .addEventListener('click', ({ target }) => {
        //닫기 호출
        self._handleModalCloseCallback(false);
      });
  }
  get isOpen() {
    return this.getAttribute('isOpen') || false;
  }

  set handleModalCloseCallback(callback) {
    this._handleModalCloseCallback = callback;
  }
}

customElements.define('memo-modal', MemoModal);
