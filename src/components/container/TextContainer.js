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

    function changeContainer(e) {
      const key = e.key;
      if (key !== 'ArrowUp' && key !== 'ArrowDown') {
        const startOffset = self.shadow
          .getSelection()
          .getRangeAt(0).startOffset;
        let newList = [
          {
            id: self.id,
            type: self.type,
            text: e.target.innerHTML,
            focus: true,
            startOffset,
          },
        ];
        self._handleContainerUpdateCallback(self.index, newList);
      }
    }

    $editableDiv.addEventListener('keyup', changeContainer);
    $editableDiv.addEventListener('click', changeContainer);

    $editableDiv.addEventListener('keydown', function (e) {
      const isShiftKey = e.shiftKey;
      const key = e.key;
      if (key === 'Enter' && !isShiftKey) {
        e.preventDefault();
        const newList = self.getNewContainerByCursor();
        self._handleContainerUpdateCallback(self.index, newList);
      } else if (key === 'ArrowUp') {
        //TODO:div의 맨윗줄일때
        console.log('위');
        e.preventDefault();
        self._handleContainerArrowUpCallback(self.index);
      } else if (key === 'ArrowDown') {
        //TODO:div의 맨 아랫줄일때
        console.log('아래');
        e.preventDefault();
        self._handleContainerArrowDownCallback(self.index);
      }
    });

    $editableDiv.addEventListener('focus', function (e) {});
  }

  createTextContainer(text, focus = false) {
    return {
      id: crypto.randomUUID(),
      text,
      type: 'text',
      focus,
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
        const befor = parentDiv.childNodes[cursorIndex];
        textBeforeCursor =
          getBefor(cursorIndex, parentDiv.childNodes) +
          (befor ? befor.outerHTML : '');
        textAfterCursor = '<br>' + getAfter(cursorIndex, parentDiv.childNodes);
      }
    }

    return [
      this.createTextContainer(textBeforeCursor),
      this.createTextContainer(textAfterCursor, true),
    ];
  }

  initState() {
    this.state = { isModalOpen: false };
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.render();
  }

  set handleContainerUpdateCallback(callback) {
    this._handleContainerUpdateCallback = callback;
  }

  set handleContainerArrowUpCallback(callback) {
    this._handleContainerArrowUpCallback = callback;
  }

  set handleContainerArrowDownCallback(callback) {
    this._handleContainerArrowDownCallback = callback;
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

  get cursor() {
    const offset = this.getAttribute('cursor') || '';
    return isNaN(offset) ? 0 : Number(offset);
  }

  setFocus() {
    console.log('포커스됨');
    this.shadow.querySelector('div').focus();
    // console.log(this.cursor);
    // if (this.cursor !== 0) {
    //   const selection = this.shadow.getSelection();
    //   console.log(selection.getRangeAt(0).endContainer);
    //   const range = selection.getRangeAt(0);
    //   const node = this.shadow.querySelector('div');
    //   range.setStart(node.firstChild, 0);
    //   range.setEnd(node, this.cursor);
    // }
  }
}

customElements.define('text-container', TextContainer);
