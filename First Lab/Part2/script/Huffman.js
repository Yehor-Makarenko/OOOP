function encode(sequence) {
  if (sequence.length === 0) {
    return ["", null];
  }

  let encodedString = "";
  const repeats = countRepeats(sequence);
  const priorityQueue = new PriorityQueue();

  for (let item of repeats.keys()) {
    priorityQueue.insert(repeats.get(item), item);
  }

  let huffmanTree, huffmanTable;

  if (repeats.size > 1) {
    huffmanTree = makeHuffmanTree(priorityQueue);      
    huffmanTable = makeHuffmanTable(huffmanTree);
  } else {    
    huffmanTree = new BinaryTree(sequence[0]);
    huffmanTable = new Map([[sequence[0], 0]]);
  }

  for (let item of sequence) {
    encodedString += huffmanTable.get(item);
  }

  console.log(encodedString.length / 8);
  return [encodedString, huffmanTree];
}

function decode(string, huffmanTree) {
  let result = [];
  let huffmanTreePointer = huffmanTree;

  for (let i = 0; i < string.length;) {
    while (huffmanTreePointer.value === null) {
      huffmanTreePointer = string[i] === "0" ? huffmanTreePointer.left : huffmanTreePointer.right;
      i++;
    }
    result.push(huffmanTreePointer.value);
    huffmanTreePointer = huffmanTree;
  }

  return result;
}

function countRepeats(items) {
  const repeatsCounter = new Map();

  for (let item of items) {
    if (repeatsCounter.has(item)) repeatsCounter.set(item, repeatsCounter.get(item) + 1);
    else repeatsCounter.set(item, 1);
  }

  return repeatsCounter;
}

function makeHuffmanTree(priorityQueue) {
  while (priorityQueue.length > 1) {
    const firstMin = priorityQueue.extractMin();
    const secondMin = priorityQueue.extractMin();
    const leftSubtree = firstMin.value instanceof BinaryTree ? firstMin.value : new BinaryTree(firstMin.value);
    const rightSubtree = secondMin.value instanceof BinaryTree ? secondMin.value : new BinaryTree(secondMin.value);
    const tree = new BinaryTree();

    tree.left = leftSubtree;
    tree.right = rightSubtree;
    priorityQueue.insert(firstMin.key + secondMin.key, tree);
  }

  return priorityQueue.extractMin().value;
}

function makeHuffmanTable(huffmanTree, huffmanTable = new Map(), code = "") {
  if (huffmanTree.value !== null) {
    huffmanTable.set(huffmanTree.value, code);
    return;
  }

  makeHuffmanTable(huffmanTree.left, huffmanTable, code + "0");
  makeHuffmanTable(huffmanTree.right, huffmanTable, code + "1");

  return huffmanTable;
}