class Line {
  constructor (a, b, c) { // this.a*x + this.b*y + this.c = 0    
    this.a = a;
    this.b = b;
    this.c = c;
  }

  hasPoint(p) {
    return this.a * p.x + this.b * p.y + this.c === 0;
  }

  reflect(shape) {
    if (shape instanceof Point) {      
      return new Point(
        shape.x - 2 * this.a * (this.a * shape.x + this.b * shape.y + this.c) / (this.a**2 + this.b**2),
        shape.y - 2 * this.b * (this.a * shape.x + this.b * shape.y + this.c) / (this.a**2 + this.b**2)
      );
    } else if (shape instanceof Line) {
      let p1, p2;

      if (shape.a === 0) {
        p1 = new Point(0, -shape.c / shape.b);
        p2 = new Point(1, -shape.c / shape.b);
      } else if (shape.b === 0) {
        p1 = new Point(-shape.c / shape.a, 0);
        p2 = new Point(-shape.c / shape.a, 1);
      } else {
        p1 = new Point(0, -shape.c / shape.b);
        p2 = new Point(-shape.c / shape.a, 0);
      }

      return Line.createFromTwoPoints(this.reflect(p1), this.reflect(p2));
    } else if (shape instanceof Circle) {
      const newCenter = this.reflect(new Point(shape.x, shape.y));

      return new Circle(newCenter.x, newCenter.y, shape.r);
    }

    return null;
  }
}

Line.createFromTwoPoints = function(p1, p2) {
  if (p1.x === p2.x) return new Line(1, 0, -p1.x);
  else if (p1.y === p2.y) return new Line(0, 1, -p1.y);
  return new Line(p2.y - p1.y, p1.x - p2.x, p1.y * p2.x - p1.x * p2.y);
}

class Circle {
  constructor (x, y, r) { // (x-this.x)^2 + (y-this.y)^2 = this.r^2
    this.x = x;
    this.y = y;
    this.r = r;
  }

  hasPoint(p) {
    return (p.x - this.x)**2 + (p.y - this.y)**2 === this.r**2;
  }

  inverse(shape) {
    if (shape instanceof Point) {
      return new Point(
        this.x + (this.r**2 * (shape.x - this.x)) / ((shape.x - this.x)**2 + (shape.y - this.y)**2),
        this.y + (this.r**2 * (shape.y - this.y)) / ((shape.x - this.x)**2 + (shape.y - this.y)**2)
      );
    } else if (shape instanceof Line) {
      if (shape.hasPoint(new Point(this.x, this.y))) return new Line(shape.a, shape.b, shape.c);

      let p1, p2, p3;

      if (shape.a === 0) {
        p1 = new Point(0, -shape.c / shape.b);
        p2 = new Point(1, -shape.c / shape.b);
        p3 = new Point(2, -shape.c / shape.b);
      } else if (shape.b === 0) {
        p1 = new Point(-shape.c / shape.a, 0);
        p2 = new Point(-shape.c / shape.a, 1);
        p3 = new Point(-shape.c / shape.a, 2);
      } else {
        p1 = new Point(0, -shape.c / shape.b);
        p2 = new Point(-shape.c / shape.a, 0);
        p3 = new Point(1, -(shape.c + shape.a) / shape.b)
      }

      return Circle.createFromThreePoints(this.inverse(p1), this.inverse(p2), this.inverse(p3));
    } else if (shape instanceof Circle) {
      if (shape.hasPoint(new Point(this.x, this.y))) {
        const p1 = new Point(2 * shape.x - this.x, 2 * shape.y - this.y);
        const p2 = new Point(shape.x + this.y - shape.y, shape.y + shape.x - this.x);

        return Line.createFromTwoPoints(this.inverse(p1), this.inverse(p2));
      }

      const p1 = new Point(shape.x, shape.y + shape.r);
      const p2 = new Point(shape.x, shape.y - shape.r);
      const p3 = new Point(shape.x + shape.r, shape.y);

      return Circle.createFromThreePoints(this.inverse(p1), this.inverse(p2), this.inverse(p3));
    }

    return null;
  }
}

Circle.createFromThreePoints = function(p1, p2, p3) {
  const p4 = new Point((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
  const p5 = new Point((p2.x + p3.x) / 2, (p2.y + p3.y) / 2);
  const line1 = Line.createFromTwoPoints(p1, p2);
  const line2 = Line.createFromTwoPoints(p2, p3);
  const line3 = Line.createFromTwoPoints(p4, new Point(p4.x + line1.a, p4.y + line1.b));
  const line4 = Line.createFromTwoPoints(p5, new Point(p5.x + line2.a, p5.y + line2.b));
  const center = getIntersectionPoints(line3, line4)[0];

  return new Circle(center.x, center.y, Point.getDistance(p1, center));
}

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

Point.getDistance = function(p1, p2) {
  return Math.sqrt((p1.x - p2.x)**2 + (p1.y - p2.y)**2);
}

function getIntersectionPoints(shape1, shape2) {
  if (shape1 instanceof Line && shape2 instanceof Line) {
    if (shape1.a === shape2.a && shape1.b === shape2.b) return null;

    return [new Point(
      (shape1.b * shape2.c - shape2.b * shape1.c) / (shape1.a * shape2.b - shape2.a * shape1.b),
      (shape2.a * shape1.c - shape1.a * shape2.c) / (shape1.a * shape2.b - shape2.a * shape1.b)
    )];
  } else if ((shape1 instanceof Line && shape2 instanceof Circle) || (shape1 instanceof Circle && shape2 instanceof Line)) {
    let line, circle;

    if (shape1 instanceof Line) {
      line = shape1;
      circle = shape2;
    } else {
      line = shape2;
      circle = shape1;
    }

    const d = line.a * circle.x + line.b * circle.y + line.c;    

    if (line.b === 0) {
      const x1 = -d / line.a;

      if (Math.abs(x1) > circle.r) return null;
      else if (Math.abs(x1) === circle.r) return [new Point(x1 + circle.x, circle.y)];
      
      const y11 = Math.sqrt(circle.r**2 - x1**2);
      const y12 = -y11;

      return [new Point(x1 + circle.x, y11 + circle.y), new Point(x1 + circle.x, y12 + circle.y)];
    }

    const discriminant = line.a**2 * line.b**2 * circle.r**2 - line.b**2 * d**2 + line.b**4 * circle.r**2;

    if (discriminant < 0) return null;
    else if (discriminant === 0) {
      const x1 = -(line.a * d) / (line.a**2 + line.b**2);
      const y1 = -(line.a * x1 + d) / line.b;

      return [new Point(x1 + circle.x, y1 + circle.y)];
    }

    const x11 = -(line.a * d + Math.sqrt(discriminant)) / (line.a**2 + line.b**2);
    const x12 = -(line.a * d - Math.sqrt(discriminant)) / (line.a**2 + line.b**2);
    const y11 = -(line.a * x11 + d) / line.b;
    const y12 = -(line.a * x12 + d) / line.b;

    return [new Point(x11 + circle.x, y11 + circle.y), new Point(x12 + circle.x, y12 + circle.y)];
  } else if (shape1 instanceof Circle && shape2 instanceof Circle) {
    if (shape1.x === shape2.x && shape1.y === shape2.y) return null;

    const line = new Line(2 * (shape1.x - shape2.x), 
      2 * (shape1.y - shape2.y), 
      (shape2.x**2 - shape1.x**2 + shape2.y**2 - shape1.y**2 + shape1.r**2 - shape2.r**2));

    return getIntersectionPoints(shape1, line);
  }
  
  return null;
}