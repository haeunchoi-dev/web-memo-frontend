import '../container/TitleContainer.js';
import '../container/TextContainer.js';
import MemoStore from '../../libs/MemoStore.js';

class MemoSummary extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.initState();
  }

  connectedCallback() {
    this.render();
  }

  disconnectedCallback() {}

  setStyle() {
    const style = document.createElement('style');

    style.textContent = `
        .main {
          height: ${this.mode ? '230px' : '500px'};
          overflow-y: auto;
        }

        .main::-webkit-scrollbar {
          width: 8px;  /* 스크롤바의 너비 */
        }
      
        .main::-webkit-scrollbar-thumb {
            //height: 30%; /* 스크롤바의 길이 */
            background: rgb(250 160 40); /* 스크롤바의 색상 */
            
            border-radius: 10px;
        }

        .main::-webkit-scrollbar-thumb:hover {
          background: rgb(255, 146, 0);
        }
      
        .main::-webkit-scrollbar-track {
            background: rgb(244 140 33 / 10%);  /*스크롤바 뒷 배경 색상*/
        }
    `;
    this.shadow.appendChild(style);
  }

  render() {
    const template = `
      <title-container title="${this.state.title}" mode=${
        this.mode ? 'view' : 'edit'
      }></title-container>
      <div  class="main">
        ${this.state.containerList
          .map((o, i) => {
            return `<text-container mode=${
              this.mode ? 'view' : 'edit'
            } index="${i}" id="${o.id}" type="${o.type}" text="${
              o.text
            }" cursor="${o.startOffset}"} ></text-container>`;
          })
          .join('')}
      </div>
    `;
    this.shadow.innerHTML = template;
    this.setStyle();
  }

  initState() {
    this.state = MemoStore.findById(this.memoId);
  }

  get memoId() {
    return this.getAttribute('memoId') || crypto.randomUUID();
  }

  get mode() {
    const mode = this.getAttribute('mode');
    return mode && mode === 'view' ? true : false;
  }
}

customElements.define('memo-summary', MemoSummary);
