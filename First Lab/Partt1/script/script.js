testShapes();

function testShapes() {
  const type = prompt("Перетин - 1, симетричне відображення - 2, інверсія - 3");

  switch(type) {
    case "1":
      const shape1 = askShape();
      const shape2 = askShape();
      const intersectionPoints = getIntersectionPoints(shape1, shape2);
  
      if (intersectionPoints) {
        let message = "Точки перетину:";
      
        for (let i = 0; i < intersectionPoints.length; i++) {
          message += `\n${i+1}) (${intersectionPoints[i].x}, ${intersectionPoints[i].y})`;
        }
      
        alert(message);
      } else {
        alert("Точок перетину немає або їх нескінченна кількість");
      }
      break;
    case "2":
      const line = askLine();
      const shape3 = askShape();
      printShape(line.reflect(shape3));
      break;
    case "3":
      const circle = askCircle();
      const shape4 = askShape();
      printShape(circle.inverse(shape4));
      break;
  }
}

function askLine() {
  return new Line(+prompt("ax+by+c=0\na?"), +prompt("ax+by+c=0\nb?"), +prompt("ax+by+c=0\nc?"));
}

function askCircle() {
  return new Circle(+prompt("(x-x0)^2+(y-y0)^2=r^2\nx0?"), +prompt("(x-x0)^2+(y-y0)^2=r^2\ny0?"), +prompt("(x-x0)^2+(y-y0)^2=r^2\nr?"));
}

function askShape() {
  const shapeType = prompt("Пряма - 1, коло - 2");
  if (shapeType === "1") return askLine();
  return askCircle();
  
}

function printShape(shape) {
  let message = `Тип: ${shape.constructor.name}`;

  for (let key in shape) {
    message += `\n${key}: ${shape[key]}`;
  }

  alert(message);
}