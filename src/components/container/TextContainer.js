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

    const $editableDiv = self.shadow.querySelector('div');
    $editableDiv.addEventListener('keyup', function (e) {
      let newList = [
        {
          index: self.index,
          id: self.id,
          type: self.type,
          text: e.target.innerHTML,
        },
      ];
      self._handleContainerUpdateCallback(self.index, newList);
    });

    $editableDiv.addEventListener('keypress', function (e) {
      const isShiftKey = e.shiftKey;
      const key = e.key;
      if (key === 'Enter' && !isShiftKey) {
        console.log('Enter pressed');
        e.preventDefault();

        const newList = self.getNewContainerByCursor();
        self._handleContainerUpdateCallback(self.index, newList);
      }
    });
  }

  createTextContainer(text) {
    return {
      id: crypto.randomUUID(),
      text,
      type: 'text',
    };
  }

  getCurrentNodeIndex() {
    const selection = this.shadow.getSelection();

    let childIndex = -1;
    if (selection.rangeCount > 0) {
      const parentDiv = this.shadow.querySelector('div');
      const range = selection.getRangeAt(0);

      const startNode = range.startContainer;

      for (let i = 0; i < parentDiv.childNodes.length; i++) {
        if (parentDiv.childNodes[i] === startNode) {
          childIndex = i;
          break;
        }
      }
      if (childIndex === -1) {
        //br에서 엔터시
        childIndex = range.startOffset;
      }
    }

    return childIndex === -1 ? 0 : childIndex;
  }

  getNewContainerByCursor() {
    let textBeforeCursor = this.shadow.querySelector('div').innerHTML;
    let textAfterCursor = '';
    const selection = this.shadow.getSelection();

    if (selection.rangeCount > 0) {
      const parentDiv = this.shadow.querySelector('div');
      const cursorIndex = this.getCurrentNodeIndex();
      const range = selection.getRangeAt(0);
      const startNode = range.startContainer;
      const startOffset = range.startOffset;

      function getBefor(index, array) {
        let prevHtml = '';
        for (let i = 0; i < index; i++) {
          if (array[i].nodeType === Node.TEXT_NODE) {
            prevHtml += array[i].data;
          } else {
            prevHtml += array[i].outerHTML;
          }
        }
        return prevHtml;
      }

      function getAfter(index, array) {
        let nextHtml = '';
        for (let i = index + 1; i < array.length; i++) {
          if (array[i].nodeType === Node.TEXT_NODE) {
            nextHtml += array[i].data;
          } else {
            nextHtml += array[i].outerHTML;
          }
        }
        return nextHtml;
      }

      if (startNode.nodeType === Node.TEXT_NODE) {
        const befor = startNode.data.slice(0, startOffset);
        const after = startNode.data.slice(startOffset);

        textBeforeCursor = getBefor(cursorIndex, parentDiv.childNodes) + befor;
        textAfterCursor = after + getAfter(cursorIndex, parentDiv.childNodes);
      } else {
        //br에서 엔터시
        textBeforeCursor = getBefor(cursorIndex, parentDiv.childNodes);
        textAfterCursor = '<br/>' + getAfter(cursorIndex, parentDiv.childNodes);
      }
    }

    return [
      this.createTextContainer(textBeforeCursor),
      this.createTextContainer(textAfterCursor),
    ];
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
    this._handleContainerUpdateCallback = callback;
  }

  get index() {
    return Number(this.getAttribute('index'));
  }

  get id() {
    return this.getAttribute('id') || crypto.randomUUID();
  }

  get type() {
    return this.getAttribute('type') || 'text';
  }

  get text() {
    return this.getAttribute('text') || '';
  }
}

customElements.define('text-container', TextContainer);
