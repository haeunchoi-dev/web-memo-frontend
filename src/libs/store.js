export default class Store {
  constructor(name) {
    const localStorage = window.localStorage;

    let liveMemos;

    this.getLocalStorage = () => {
      return liveMemos || JSON.parse(localStorage.getItem(name) || []);
    };

    this.setLocalStorage = (memos) => {
      localStorage.setItem(name, JSON.stringify((liveMemos = memos)));
    };
  }
}
