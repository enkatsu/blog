+++
author = "Katsuya Endoh"
title = "Processingでフォントのアウトラインを取得する"
date = "2022-12-22"
description = "Processingでフォントのアウトラインを取得する"
tags = [
    "Processing",
]
+++


```java
PFont font;
PShape pShape;

void setup() {
  size(300, 200);
  font = createFont("HiraginoSans-W3", 100);
  pShape = font.getShape('P', 1);
  pShape.beginShape();
  pShape.strokeWeight(1);
  pShape.stroke(0);
  pShape.fill(255);
  pShape.endShape();

  background(100);

  translate(100, 100);
  shape(pShape, 0, 0);
}

void draw() {
}
```

![/images/p5-font-outline.png](/images/p5-font-outline.png)


```java
PFont font;
PShape anchor, shape;
ArrayList<PVector> vectors;
float x = 100;
float y = 100;
int holdIndex = -1;

void setup() {
  size(300, 200);
  font = createFont("HiraginoSans-W3", 100);
  shape = font.getShape('P', 1);
  shape.beginShape();
  shape.strokeWeight(1);
  shape.stroke(0);
  shape.fill(255);
  shape.endShape();
  
  anchor = font.getShape('P', 1);
  
  vectors = new ArrayList<PVector>();
  for (int i = 0; i < shape.getVertexCount(); i++) {
    vectors.add(new PVector(0, 0));
  }
}

void draw() {
  for (int i = 0; i < shape.getVertexCount(); i++) {
    if (i == holdIndex) {
      continue;
    }
    PVector shapeVertex = shape.getVertex(i).copy();
    PVector anchorVertex = anchor.getVertex(i).copy();
    PVector sub = PVector.sub(anchorVertex, shapeVertex);
    PVector vector = vectors.get(i);
    vector.mult(0.8);
    vector.add(sub);
    shape.setVertex(i, PVector.add(shapeVertex, vector));
  }
  
  
  background(100);
  translate(x, y);
  shape(shape, 0, 0);
}

void mousePressed() {
  for (int i = 0; i < shape.getVertexCount(); i++) {
    PVector v = shape.getVertex(i);
    float d = dist(mouseX, mouseY, v.x + x, v.y + y);
    if (d < 10) {
      holdIndex = i;
      break;
    }
    if (i == shape.getVertexCount() - 1) {
      holdIndex = -1;
    }
  }
}

void mouseReleased() {
  holdIndex = -1;
}

void mouseDragged() {
  if (holdIndex == -1) {
    return;
  }
  PVector v = new PVector(float(mouseX - pmouseX), float(mouseY - pmouseY));
  PVector newVertex = shape.getVertex(holdIndex).add(v);
  shape.setVertex(holdIndex, newVertex);
}

```

<video controls playsinline muted="true" src="/videos/p5-font-outline.mov" type="video/mp4" >
 Sorry, your browser doesn't support embedded videos.
</video>
