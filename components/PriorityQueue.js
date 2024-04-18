export default class PriorityQueue {
    constructor() {
      this.heap = [null];
    }
  
    insert(order) {
      this.heap.push(order);
      let current = this.heap.length - 1;
      while (current > 1 && this.heap[Math.floor(current / 2)].total < this.heap[current].total) {
        [this.heap[Math.floor(current / 2)], this.heap[current]] = [this.heap[current], this.heap[Math.floor(current / 2)]];
        current = Math.floor(current / 2);
      }
    }
  
    remove() {
      let largest = this.heap[1];
      if (this.heap.length > 2) {
        this.heap[1] = this.heap[this.heap.length - 1];
        this.heap.splice(this.heap.length - 1);
        if (this.heap.length === 3) {
          if (this.heap[1] && this.heap[1].total < this.heap[2].total) {
            [this.heap[1], this.heap[2]] = [this.heap[2], this.heap[1]];
          }
          return largest;
        }
        let current = 1;
        let leftChildIndex = current * 2;
        let rightChildIndex = current * 2 + 1;
        while (this.heap[leftChildIndex] && this.heap[rightChildIndex] && (this.heap[current].total < this.heap[leftChildIndex].total ||
            this.heap[current].total < this.heap[rightChildIndex].total)
        ) {
          if (this.heap[leftChildIndex].total > this.heap[rightChildIndex].total) {
            [this.heap[current], this.heap[leftChildIndex]] = [this.heap[leftChildIndex], this.heap[current]];
            current = leftChildIndex;
          } else {
            [this.heap[current], this.heap[rightChildIndex]] = [this.heap[rightChildIndex], this.heap[current]];
            current = rightChildIndex;
          }
          leftChildIndex = current * 2;
          rightChildIndex = current * 2 + 1;
        }
      } else if (this.heap.length === 2) {
        this.heap.splice(1, 1);
      } else {
        return null;
      }
      return largest;
    }

    destroy() {
      this.heap = [null];
    }
  }