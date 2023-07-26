import '../container/TitleContainer.js';
import '../container/TextContainer.js';

class MemoMain extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.initState();
  }

  connectedCallback() {
    console.log('connect memo main', this.isOpen);
    this.render();
  }

  disconnectedCallback() {}

  setStyle() {
    const style = document.createElement('style');

    style.textContent = `
        .main {
          height: 500px;
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
      <title-container title=${this.state.title}></title-container>
      <div class="main">
        ${this.state.containerList
          .map((o, i) => {
            return `<text-container index="${o.index}" id="${o.id}" type="${o.type}" text="${o.text}"} ></text-container>`;
          })
          .join('')}
      </div>
    `;
    this.shadow.innerHTML = template;
    this.setStyle();
    this.setEvent();
  }

  setEvent() {
    const self = this;

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
      containerList: [this.createContainer(0)],
    };
  }

  setState(newState, isRender = true) {
    this.state = { ...this.state, ...newState };
    if (isRender) {
      this.render();
    }
    console.log(this.state);
  }

  createContainer(index) {
    return {
      index,
      id: crypto.randomUUID(),
      text: '',
      type: 'text',
    };
  }

  handleTitle(value) {
    this.setState({ title: value }, false);
  }

  handleContainerUpdate(index, valueList) {
    let newContainerList = [...this.state.containerList];
    if (valueList.length > 1) {
      newContainerList.splice(index, 1, ...valueList);
      //index 재조정
      this.setState({
        containerList: newContainerList.map((container, _i) => {
          return {
            ...container,
            index: _i,
          };
        }),
      });

      //focus?
    } else {
      newContainerList[index] = valueList[0];
      this.setState({ containerList: newContainerList }, false);
    }
  }
}

customElements.define('memo-main', MemoMain);
