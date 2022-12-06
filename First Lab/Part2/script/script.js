const form = document.forms[0];
const decodeForm = document.forms[1];
const encodedLink = document.getElementById("encodedText");
const decodedLink = document.getElementById("decodedText");
let str1, str2;

form.onsubmit =  function(event) {
  const file = form.elements[0].files[0];
  const reader = new FileReader();

  reader.readAsText(file);

  event.preventDefault();

  reader.onload = function() {
    const [encodedString, huffmanTree] = encode(reader.result.split(""));    
    const length = Math.ceil(encodedString.length / 8);
    let lastCharLength = encodedString.length % 8 === 0 ? 8 : encodedString.length % 8;    
    let result = JSON.stringify(huffmanTree) + "HTEnd" + lastCharLength;    
    const buffer = new ArrayBuffer(length);
    const view = new Uint8Array(buffer);

    for (let i = 0; i < length; i++) {
      let currChar = "0b";
      let jLength = i === length - 1 ? lastCharLength : 8;
      for (let j = 0; j < jLength; j++) {
        currChar += encodedString[8 * i + j];
      }                  
      view[i] = +currChar;
    }
    
    encodedLink.href = URL.createObjectURL(new Blob([result, view.buffer], {type: "text/plain"}));
    alert("Ready");
  }
};

decodeForm.onsubmit =  function(event) {
  const file = decodeForm.elements[0].files[0];  
  const reader = new FileReader();

  reader.readAsBinaryString(file);

  event.preventDefault();

  reader.onload = function() {    
    const byteOffset = reader.result.split("HTEnd")[0].length + 6;

    reader.readAsArrayBuffer(file);

    reader.onload = function() {
      const textDecoder = new TextDecoder("utf-8");
      const viewer = new Uint8Array(reader.result);      
      const huffmanTree = JSON.parse(textDecoder.decode(viewer.subarray(0, byteOffset - 6)));      
      let binaryEncodedString = "";
      const lastCharLength = String.fromCharCode(viewer[byteOffset-1]);
      let resultString;
  
      for (let i = byteOffset; i < viewer.length; i++) {
        const charCode = viewer[i].toString(2);
        const zeroLength = i === viewer.byteLength - 1 ? lastCharLength : 8;
        binaryEncodedString += "0".repeat(zeroLength - charCode.length) + charCode;
      }
  
      resultString = decode(binaryEncodedString, huffmanTree).join("");
  
      decodedLink.href = URL.createObjectURL(new Blob([resultString], {type: "text/plain"}));
      alert("Ready");    
    }
  }
};