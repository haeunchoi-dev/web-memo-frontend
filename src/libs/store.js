export default class Store {
  constructor(name) {
    const localStorage = window.localStorage;

    let liveMemos;

    this.getLocalStorage = () => {
      return liveMemos || JSON.parse(localStorage.getItem(name) || '[]');
    };

    this.setLocalStorage = (memos) => {
      localStorage.setItem(name, JSON.stringify((liveMemos = memos)));
    };
  }

  selectAll() {
    return [...this.getLocalStorage()];
  }

  findById(id, callback) {
    const items = this.getLocalStorage();
    let i = items.length;

    let findItem = null;
    while (i--) {
      if (items[i].id === id) {
        findItem = { ...items[i] };
        break;
      }
    }

    if (callback) {
      callback(findItem);
    }

    return findItem;
  }

  update(update, callback) {
    const id = update.id;
    const items = this.getLocalStorage();
    let i = items.length;
    let k;

    while (i--) {
      if (items[i].id === id) {
        for (k in update) {
          items[i][k] = update[k];
        }
        break;
      }
    }

    this.setLocalStorage(items);

    if (callback) {
      callback([...items]);
    }
  }

  insert(item, callback) {
    const items = this.getLocalStorage();
    items.push(item);
    this.setLocalStorage(items);

    if (callback) {
      callback([...items]);
    }
  }

  remove(query, callback) {
    let k;

    const items = this.getLocalStorage().filter((item) => {
      for (k in query) {
        if (query[k] !== item[k]) {
          return true;
        }
      }
      return false;
    });

    this.setLocalStorage(items);

    if (callback) {
      callback([...items]);
    }
  }
}
