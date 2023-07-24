import '../container/TitleContainer.js';
import '../container/TextContainer.js';

class MemoModal extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.initState();
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

        .modal_main {
          height: 500px;
          overflow-y: auto;
        }

        .modal_main::-webkit-scrollbar {
          width: 8px;  /* 스크롤바의 너비 */
        }
      
        .modal_main::-webkit-scrollbar-thumb {
            //height: 30%; /* 스크롤바의 길이 */
            background: rgb(250 160 40); /* 스크롤바의 색상 */
            
            border-radius: 10px;
        }

        .modal_main::-webkit-scrollbar-thumb:hover {
          background: rgb(255, 146, 0);
        }
      
        .modal_main::-webkit-scrollbar-track {
            background: rgb(244 140 33 / 10%);  /*스크롤바 뒷 배경 색상*/
        }
    `;

    // Attach the created elements to the shadow dom
    this.shadow.appendChild(style);
  }

  render() {
    const template = `
    <div class="modal">
      <title-container title=${this.state.title}></title-container>
      <div class="modal_main">
        ${this.state.containerList
          .map((o, i) => {
            return `<text-container index="${i}" id=${o.id} type=${o.type} text="${o.text}"} ></text-container>`;
          })
          .join('')}
      </div>
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
      .querySelector('.modal_main')
      .addEventListener('keypress', (e) => {
        const isShiftKey = e.shiftKey;

        const keyCode = e.keyCode || e.which;

        if (keyCode === 13 && isShiftKey) {
          console.log('Shift + Enter pressed');
        } else if (keyCode === 13) {
          console.log('Enter pressed');

          const closestContainer = e.target.closest('text-container');
          console.log(closestContainer);
          const index = Number(closestContainer.getAttribute('index'));
          const newContainerList = [...self.state.containerList];
          newContainerList.splice(index + 1, 0, {
            //id: index + 1, //id를 생성해주는 로직 작성하기
            text: '',
            type: 'text',
          });
          self.setState({ containerList: newContainerList });
          //커서 강제로 이동시키기
        }
      });

    self.shadow
      .querySelector('.modal_close_btn')
      .addEventListener('click', ({ target }) => {
        //데이터 저장
        //닫기 호출
        self._handleModalCloseCallback(false);
      });

    self.handleTitle = self.handleTitle.bind(self);
    const titleContainer = self.shadow.querySelector('title-container');
    if (titleContainer) {
      titleContainer.handleTitleCallback = self.handleTitle;
    }

    self.handleContainerUpdate = self.handleContainerUpdate.bind(self);
    const containers = self.shadow.querySelectorAll('text-container');
    containers.forEach((o) => {
      o.handleContainerUpdateCallback = self.handleContainerUpdate;
    });
  }

  initState() {
    this.state = {
      title: '',
      containerList: [{ text: '', type: 'text' }],
    };
  }

  setState(newState, isRender = true) {
    this.state = { ...this.state, ...newState };
    if (isRender) {
      this.render();
    }
    console.log(this.state);
  }

  handleTitle(value) {
    this.setState({ title: value }, false);
  }

  handleContainerUpdate(index, value) {
    const newContainerList = [...this.state.containerList];
    newContainerList[index] = value;
    this.setState({ containerList: newContainerList }, false);
  }

  get isOpen() {
    return this.getAttribute('isOpen') || false;
  }

  set handleModalCloseCallback(callback) {
    this._handleModalCloseCallback = callback;
  }
}

customElements.define('memo-modal', MemoModal);
