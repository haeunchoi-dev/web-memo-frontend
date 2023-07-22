class TitleContainer extends HTMLElement {
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
        h2 {
            outline: none;
        }

        .placeholder {
            color: #b3b1b1;
        }
    `;
    this.shadow.appendChild(style);
  }

  render() {
    const template = `
        <h2 contenteditable="true">${this.title}</h2>
    `;

    this.shadow.innerHTML = template;
    this.setStyle();
    this.setEvent();
  }

  setEvent() {
    const self = this;

    const $editableHeading = self.shadow.querySelector('h2');
    const placeholderText = '제목';

    if (!$editableHeading.textContent) {
      addPlaceHolder();
    }

    function addPlaceHolder() {
      $editableHeading.textContent = placeholderText;
      $editableHeading.classList.add('placeholder');
    }

    function removePlaceHolder() {
      $editableHeading.textContent = '';
      $editableHeading.classList.remove('placeholder');
    }

    $editableHeading.addEventListener('focus', function () {
      if (this.textContent === placeholderText) {
        removePlaceHolder();
      }
    });

    $editableHeading.addEventListener('blur', function () {
      if (!this.textContent.trim()) {
        addPlaceHolder();
      }
    });

    $editableHeading.addEventListener('keyup', function (e) {
      //console.log(e.target.innerHTML);
      //디바운싱을 적용할 수 있을까?
      self._handleTitleCallback(e.target.innerHTML);
    });
  }

  initState() {
    this.state = { isModalOpen: false };
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.render();
  }

  get title() {
    return this.getAttribute('title') || '';
  }

  set handleTitleCallback(callback) {
    //console.log(callback);
    this._handleTitleCallback = callback;
  }
}

customElements.define('title-container', TitleContainer);
