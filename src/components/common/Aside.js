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
    const template = `
        <aside class="aside-tab">
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
        </aside>
          `;

    this.shadow.innerHTML = template;
    this.setStyle();
  }
}

customElements.define('memo-aside', Aside);
