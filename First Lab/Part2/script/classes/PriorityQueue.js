class PriorityQueue {
  #priority = null;
  #value = new Queue(); 
  #parent = null;
  #left = null;
  #right = null;
  #isBlack = true; 
  #length = 0;

  get length() {
    return this.#length;
  }
  
  insert(priority, value) {
    let currNode = this.#left;
    const newNode = new PriorityQueue();
    newNode.#priority = priority;
    newNode.#value.push(value);
    this.#length++;

    if (currNode === null) {
      this.#left = newNode;
      newNode.#parent = this;
      return;
    }

    newNode.#isBlack = false;

    while (true) {
      if (currNode.#priority > priority) {
        if (currNode.#left !== null) {
          currNode = currNode.#left;
          continue;
        }
        newNode.#parent = currNode;
        currNode.#left = newNode;
        break;
      } else if (currNode.#priority < priority) {
        if (currNode.#right !== null) {
          currNode = currNode.#right;
          continue;
        }
        newNode.#parent = currNode;
        currNode.#right = newNode;
        break;
      } else {
        currNode.#value.push(value);
        return;
      }
    }

    newNode.#insertBalancing();
  }

  extractMax() {
    if (this.#length === 0) return null;

    let maxNode = this.#left;
    this.#length--;

    while(maxNode.#right !== null) maxNode = maxNode.#right;        

    if (maxNode.#value.length > 1) {
      return {
        key: maxNode.#priority,
        value: maxNode.#value.shift()
      };
    }

    maxNode.#delete();    

    return {
      key: maxNode.#priority,
      value: maxNode.#value.get()
    };
  }

  extractMin() {
    if (this.#length === 0) return null;

    let minNode = this.#left;
    this.#length--;

    while(minNode.#left !== null) minNode = minNode.#left;        

    if (minNode.#value.length > 1) {
      return {
        key: minNode.#priority,
        value: minNode.#value.shift()
      };
    }

    minNode.#delete();

    return {
      key: minNode.#priority,
      value: minNode.#value.get()
    };
  }

  getMax() {
    if (this.#length === 0) return null;

    let maxNode = this.#left;

    while(maxNode.#right !== null) maxNode = maxNode.#right;      

    return {
      key: maxNode.#priority,
      value: maxNode.#value.get()
    };
  }

  getMin() {
    if (this.#length === 0) return null;

    let minNode = this.#left;

    while(minNode.#left !== null) minNode = minNode.#left;      

    return {
      key: minNode.#priority,
      value: minNode.#value.get()
    };
  }

  #delete() {
    const replaceChild = this.#left === null ? this.#right : this.#left;

    if (replaceChild !== null) replaceChild.#parent = this.#parent;

    if (!this.#isBlack) {
      if (this.#parent.#left === this) this.#parent.#left = replaceChild;
      else this.#parent.#right = replaceChild;

      return;
    }

    if (replaceChild !== null && !replaceChild.#isBlack) {
      replaceChild.#isBlack = true;

      if (this.#parent.#left === this) this.#parent.#left = replaceChild;
      else this.#parent.#right = replaceChild;

      return;
    }

    this.#deleteBalancing();

    if (this.#parent.#left === this) this.#parent.#left = replaceChild;
    else this.#parent.#right = replaceChild;
  }

  #insertBalancing() {
    if (this.#parent.#priority === null) {      
      this.#isBlack = true;
      return;
    }

    if (this.#parent.#isBlack) return;

    const uncle = this.#getUncle();
    const grandparent = this.#getGrandparent();

    if (!this.#parent.#isBlack && uncle && !uncle.#isBlack) {
      this.#parent.#isBlack = true;
      uncle.#isBlack = true;
      grandparent.#isBlack = false;
      grandparent.#insertBalancing();
      return;
    }

    if (this.#parent.#left === this && grandparent.#right === this.#parent) {
      this.#parent.#rotateRight();
      this.#right.#insertBalancing();
      return;
    }

    if (this.#parent.#right === this && grandparent.#left === this.#parent) {
      this.#parent.#rotateLeft();
      this.#left.#insertBalancing();
      return;
    }

    this.#parent.#isBlack = true;
    grandparent.#isBlack = false;

    if (this.#parent.#left === this) grandparent.#rotateRight();
    else grandparent.#rotateLeft();    
  }

  #deleteBalancing() {
    let sibling = this.#getSibling();

    if (this.#parent.#priority === null) return;

    if (!sibling.#isBlack) {
      this.#parent.#isBlack = false;
      sibling.#isBlack = true;
      
      if (this.#parent.#left === this) this.#parent.#rotateLeft();
      else this.#parent.#rotateRight();

      sibling = this.#getSibling();
    }

    if (this.#parent.#isBlack && (sibling.#left === null || sibling.#left.#isBlack) && (sibling.#right === null || sibling.#right.#isBlack)) {
      sibling.#isBlack = false;

      this.#parent.#deleteBalancing();

      return;
    }

    if (!this.#parent.#isBlack && (sibling.#left === null || sibling.#left.#isBlack) && (sibling.#right === null || sibling.#right.#isBlack)) {
      sibling.#isBlack = false;
      this.#parent.#isBlack = true;

      return;
    }

    if (this.#parent.#left === this && sibling.#left !== null && (sibling.#right === null || sibling.#right.#isBlack)) {
      sibling.#isBlack = false;
      sibling.#left.#isBlack = true;
      sibling.#rotateRight();
      sibling = this.#getSibling();
    }

    if (this.#parent.#right === this && sibling.#right !== null && (sibling.#left === null || sibling.#left.#isBlack)) {
      sibling.#isBlack = false;
      sibling.#right.#isBlack = true;
      sibling.#rotateLeft();
      sibling = this.#getSibling();
    }

    sibling.#isBlack = this.#parent.#isBlack;
    this.#parent.#isBlack = true;

    if (this.#parent.#left === this) {
      sibling.#right.#isBlack = true;
      this.#parent.#rotateLeft();
    } else {
      sibling.#left.#isBlack = true;
      this.#parent.#rotateRight();
    }
  }

  #rotateLeft() {    
    const pivot = this.#right; 

    this.#right = pivot.#left;
    pivot.#left = this;
    if (this.#right) this.#right.#parent = this;

    pivot.#parent = this.#parent;
    this.#parent = pivot;
    if (pivot.#parent.#left === this) pivot.#parent.#left = pivot;      
    else pivot.#parent.#right = pivot;
  }

  #rotateRight() {    
    const pivot = this.#left; 

    this.#left = pivot.#right;
    pivot.#right = this;
    if (this.#left) this.#left.#parent = this;

    pivot.#parent = this.#parent;
    this.#parent = pivot;
    if (pivot.#parent.#left === this) pivot.#parent.#left = pivot;      
    else pivot.#parent.#right = pivot;
  }

  #getGrandparent() {
    return this.#parent.#parent;
  }

  #getUncle() {
    const grandparent = this.#getGrandparent();

    if (grandparent.#left === this.#parent) return grandparent.#right;
    return grandparent.#left;
  }

  #getSibling() {
    if (this.#parent.#left === this) return this.#parent.#right;
    return this.#parent.#left;
  }
}