class RBTree {
  constructor() {
    this.key = null;
    this.value = null;
    this.parent = null;
    this.left = null;
    this.right = null;
    this.isBlack = true;
  }  

  get(key) {
    const resNode = this.getNode(key);
    return resNode ? resNode.value : null;
  }

  add(key, value) {
    let currNode = this.left;
    const newNode = new RBTree();
    newNode.key = key;
    newNode.value = value;

    if (currNode === null) {
      this.left = newNode;
      newNode.parent = this;
      return;
    }

    newNode.isBlack = false;

    while (true) {
      if (currNode.key > key) {
        if (currNode.left !== null) {
          currNode = currNode.left;
          continue;
        }
        newNode.parent = currNode;
        currNode.left = newNode;
        break;
      } else {
        if (currNode.right !== null) {
          currNode = currNode.right;
          continue;
        }
        newNode.parent = currNode;
        currNode.right = newNode;
        break;
      }
    }

    newNode.addBalancing();
  }

  delete(key) {
    const resNode = this.getNode(key);

    if (resNode === null) return;

    const deleteValue = resNode.value;

    if (!resNode.left || !resNode.right) {
      resNode.deleteBalancing();
      return deleteValue;
    }

    let replaceNode = resNode.left;

    while(replaceNode.right !== null) replaceNode = replaceNode.right;

    resNode.key = replaceNode.key;
    resNode.value = replaceNode.value;

    replaceNode.deleteBalancing();

    return deleteValue;
  }

  addBalancing() {
    if (this.parent.key === null) {      
      this.isBlack = true;
      return;
    }

    if (this.parent.isBlack) return;

    const uncle = this.getUncle();
    const grandparent = this.getGrandparent();

    if (!this.parent.isBlack && uncle && !uncle.isBlack) {
      this.parent.isBlack = true;
      uncle.isBlack = true;
      grandparent.isBlack = false;
      grandparent.addBalancing();
      return;
    }

    if (this.parent.left === this && grandparent.right === this.parent) {
      this.parent.rotateRight();
      this.right.addBalancing();
      return;
    }

    if (this.parent.right === this && grandparent.left === this.parent) {
      this.parent.rotateLeft();
      this.left.addBalancing();
      return;
    }

    this.parent.isBlack = true;
    grandparent.isBlack = false;

    if (this.parent.left === this) grandparent.rotateRight();
    else grandparent.rotateLeft();    
  }

  deleteBalancing() {
    const replaceChild = this.left === null ? this.right : this.left;

    if (replaceChild !== null) replaceChild.parent = this.parent;
    if (this.parent.left === this) this.parent.left = replaceChild;
    else this.parent.right = replaceChild;

    if (!this.isBlack) return;

    if (replaceChild !== null && !replaceChild.isBlack) {
      replaceChild.isBlack = true;
      return;
    }

    if (this.parent.key === null) return;

    const sibling = this.getSibling();

    if (!sibling.isBlack) {
      this.parent.isBlack = false;
      sibling.isBlack = true;
      
      if (this.parent.left === this) this.parent.rotateLeft();
      else this.parent.rotateRight();
    }

    if (this.parent.isBlack && sibling.left === null && sibling.right === null) {
      sibling.isBlack = false;
      this.parent.deleteBalancing();
      return;
    }

    if (!this.parent.isBlack && sibling.left === null && sibling.right == right) {
      sibling.isBlack = false;
      this.parent.isBlack = true;
      return;
    }

    if (this.parent.left === this && sibling.left !== null && sibling.right === null) {
      sibling.isBlack = false;
      sibling.left.isBlack = true;
      sibling.rotateRight();
    }

    if (this.parent.right === this && sibling.right !== null && sibling.left === null) {
      sibling.isBlack = false;
      sibling.right.isBlack = true;
      sibling.rotateLeft();
    }

    sibling.isBlack = this.parent.isBlack;
    this.parent.isBlack = true;

    if (this.parent.left === this) {
      sibling.right.isBlack = true;
      this.parent.rotateLeft();
    } else {
      sibling.left.isBlack = true;
      this.parent.rotateRight();
    }
  }

  rotateLeft() {    
    const pivot = this.right; 

    this.right = pivot.left;
    pivot.left = this;
    if (this.right) this.right.parent = this;

    pivot.parent = this.parent;
    this.parent = pivot;
    if (pivot.parent.left === this) pivot.parent.left = pivot;      
    else pivot.parent.right = pivot;
  }

  rotateRight() {    
    const pivot = this.left; 

    this.left = pivot.right;
    pivot.right = this;
    if (this.left) this.left.parent = this;

    pivot.parent = this.parent;
    this.parent = pivot;
    if (pivot.parent.left === this) pivot.parent.left = pivot;      
    else pivot.parent.right = pivot;
  }

  getNode(key) {
    let currNode = this.left;

    while(currNode !== null) {
      if (currNode.key === key) return currNode;

      if (currNode.key > key) currNode = currNode.left;
      else currNode = currNode.right;
    }

    return null;
  }

  getGrandparent() {
    return this.parent.parent;
  }

  getUncle() {
    const grandparent = this.getGrandparent();

    if (grandparent.left === this.parent) return grandparent.right;
    return grandparent.left;
  }

  getSibling() {
    if (this.parent.left === this) return this.parent.right;
    return this.parent.left;
  }
}