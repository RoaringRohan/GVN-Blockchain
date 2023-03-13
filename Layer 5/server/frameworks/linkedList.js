const Node = require('../frameworks/node');

class LinkedList {
    constructor() {
        this.head = null;
        this.size = 0;
    }
  
    add(data) {
        const node = new Node(data);
        if (!this.head) {
        this.head = node;
        } else {
        let current = this.head;
        while (current.next) {
            current = current.next;
        }
        current.next = node;
        }
        this.size++;
    }
  
    remove(data) {
        let current = this.head;
        let previous = null;
        while (current) {
        if (current.data === data) {
            if (previous) {
            previous.next = current.next;
            } else {
            this.head = current.next;
            }
            this.size--;
            return true;
        }
        previous = current;
        current = current.next;
        }
        return false;
    }

    toString() {
        let current = this.head;
        let str = '';
        while (current) {
          str += JSON.stringify(current.data) + ',';
          current = current.next;
        }
        return str.slice(0, -1); // Remove the last comma
      }
}

module.exports = LinkedList;