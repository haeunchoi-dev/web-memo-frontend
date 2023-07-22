class Aside extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  setStyle() {
    const linkElem = document.createElement('link');
    linkElem.setAttribute('rel', 'stylesheet');
    linkElem.setAttribute('href', './css/common/aside.css');
    this.shadow.appendChild(linkElem);
  }

  render() {
    this.setStyle();
    const aside = document.createElement('aside');
    aside.classList.add('aside-tab');

    const template = `
                    <nav class="categories">
                        <div class="bd-categories-filter">
                        <input
                            id="categoriesFilter"
                            class="input"
                            type="text"
                            name=""
                            placeholder="Filter"
                        />
                        </div>
                        <p class="bd-category-group">Group</p>
                    </nav>
                    `;
    aside.innerHTML = template;
    this.shadow.appendChild(aside);
  }
}

customElements.define('memo-aside', Aside);
