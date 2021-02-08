class Queue {
  constructor() {
    this.items = [];
  }
  enqueue(element) {
    this.items.push(element);
  }
  dequeue() {
    if (this.isEmpty()) {
      return "Empty";
    }
    this.items.shift();
  }
  front() {
    if (this.isEmpty()) {
      return null;
    }
    return this.items[0];
  }
  isEmpty() {
    if (this.items.length == 0) {
      return true;
    }
    return false;
  }
  show() {
    return this.items;
  }
  clear() {
    this.items = [];
  }
}

module.exports = Queue;
