class Header extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  setStyle() {
    const linkElem = document.createElement('link');
    linkElem.setAttribute('rel', 'stylesheet');
    linkElem.setAttribute('href', './css/common/header.css');
    this.shadow.appendChild(linkElem);
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.setStyle();
    const header = document.createElement('header');
    header.classList.add('main-header');

    const template = `
            <div>
                <a class="main-header__brand"> Memo </a>
            </div>
            <nav class="main-nav">
                <ul class="main-nav__items">
                <li class="main-nav__item">
                    <a>login</a>
                </li>
                <li class="main-nav__item main-nav__item--cta">
                    <a>join</a>
                </li>
                </ul>
            </nav>
        `;

    header.innerHTML = template;
    this.shadow.appendChild(header);
  }
}

customElements.define('memo-header', Header);
