import '../container/TitleContainer.js';
import '../container/TextContainer.js';
import MemoStore from '../../libs/MemoStore.js';

class MemoMain extends HTMLElement {
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
      <div  class="main">
        ${this.state.containerList
          .map((o, i) => {
            return `<text-container index="${i}" id="${o.id}" type="${o.type}" text="${o.text}" cursor="${o.startOffset}"} ></text-container>`;
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
    self.handleContainerArrowUpCallback =
      self.handleContainerArrowUpCallback.bind(self);
    self.handleContainerArrowDownCallback =
      self.handleContainerArrowDownCallback.bind(self);
    const containers = self.shadow.querySelectorAll('text-container');
    containers.forEach((o) => {
      o.handleContainerUpdateCallback = self.handleContainerUpdate;
      o.handleContainerArrowUpCallback = self.handleContainerArrowUpCallback;
      o.handleContainerArrowDownCallback =
        self.handleContainerArrowDownCallback;
    });
  }

  initState() {
    let memo = MemoStore.findById(this.memoId);
    if (!memo) {
      memo = {
        id: this.memoId,
        title: '',
        containerList: [this.createContainer()],
      };
    }
    this.state = memo;
  }

  setState(newState, isRender = true) {
    this.state = { ...this.state, ...newState };
    if (isRender) {
      this.render();
      //커서 있는 곳 포커스
      let focusIndex = 0;
      this.state.containerList.forEach((c, _i) => {
        if (c.focus) {
          focusIndex = _i;
        }
      });
      const containers = this.shadow.querySelectorAll('text-container');
      containers[focusIndex].setFocus();
    }
  }

  createContainer() {
    return {
      id: crypto.randomUUID(),
      text: '',
      type: 'text',
    };
  }

  handleTitle(value) {
    this.setState({ title: value }, false);
    //update store (title)
    MemoStore.update({
      id: this.state.id,
      title: value,
    });
  }

  handleContainerUpdate(index, valueList) {
    let newContainerList = this.state.containerList.map((c) => {
      return { ...c, focus: false };
    });
    if (valueList.length > 1) {
      newContainerList.splice(index, 1, ...valueList);
      this.setState({
        containerList: newContainerList,
      });
    } else {
      newContainerList[index] = valueList[0];
      this.setState({ containerList: newContainerList }, false);
    }

    MemoStore.update({
      id: this.state.id,
      containerList: newContainerList,
    });
  }

  handleContainerArrowUpCallback(index) {
    let newContainerList = this.state.containerList.map((c) => {
      return { ...c, focus: false };
    });
    if (index !== 0) {
      newContainerList[index - 1] = {
        ...newContainerList[index - 1],
        focus: true,
        startOffset: newContainerList[index].startOffset,
      };
      this.setState({
        containerList: newContainerList,
      });
    }
  }

  handleContainerArrowDownCallback(index) {
    let newContainerList = this.state.containerList.map((c) => {
      return { ...c, focus: false };
    });
    if (index !== this.state.containerList.length - 1) {
      newContainerList[index + 1] = {
        ...newContainerList[index + 1],
        focus: true,
        startOffset: newContainerList[index].startOffset,
      };
      this.setState({
        containerList: newContainerList,
      });
    }
  }

  get memoId() {
    return this.getAttribute('memoId') || crypto.randomUUID();
  }
}

customElements.define('memo-main', MemoMain);
