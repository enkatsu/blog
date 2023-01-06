+++
author = "Katsuya Endoh"
title = "p5.jsとMatter.jsを組み合わせる"
date = "2023-01-05"
description = "p5.jsとMatter.jsを組み合わせる"
tags = [
    "p5.js",
    "Matter.js",
]
+++


[p5.js](https://p5js.org/)と
[Matter.js](https://github.com/liabru/matter-js)を
組み合わせる資料が意外と少なかったのでメモ。

# シンプルなやつ

シンプルに、staticな壁で囲んで、中にボールをいくつか入れるやつ。

<video controls playsinline muted="true" width="100%" src="/videos/matter-p5js-simple-480.mov" type="video/mp4" >
 Sorry, your browser doesn't support embedded videos.
</video>

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>circle</title>
  <script src="https://cdn.jsdelivr.net/npm/p5@1.5.0/lib/p5.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.18.0/matter.min.js" integrity="sha512-5T245ZTH0m0RfONiFm2NF0zcYcmAuNzcGyPSQ18j8Bs5Pbfhp5HP1hosrR8XRt5M3kSRqzjNMYpm2+it/AUX/g==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
  <script src="./sketch.js"></script>
</head>
<body style="background-color: #222222">
</body>
</html>
```

```js
let engine;
const bodies = [];
let Engine, Runner, Bodies, Composite;

function setup() {
  createCanvas(600, 600);

  Engine = Matter.Engine;
  Runner = Matter.Runner;
  Bodies = Matter.Bodies;
  Composite = Matter.Composite;

  engine = Engine.create();

  for (let i = 0; i < 30; i++) {
    const circle = Bodies.circle(
      width / 2 + random(-100, 100),
      height / 2 + random(-100, 100),
      random(20, 50),
    );
    bodies.push(circle);
  }

  bodies.push(Bodies.rectangle(width / 2, 10, width - 10, 10, { isStatic: true }));
  bodies.push(Bodies.rectangle(width / 2, height - 10, width - 10, 10, { isStatic: true }));
  bodies.push(Bodies.rectangle(width - 10, height / 2, 10, height - 10, { isStatic: true }));
  bodies.push(Bodies.rectangle(10, height / 2, 10, height - 10, { isStatic: true }));

  Composite.add(engine.world, bodies);
  const runner = Runner.create();
  Runner.run(runner, engine);
}

function draw() {
  background(50);
  bodies.forEach(body => {
    push();
    fill(100, 200, 250);
    stroke(255);
    beginShape();
    body.vertices.forEach(v => {
      vertex(v.x, v.y);
    });
    endShape(CLOSE);
    pop();
  });
}
```

# レンダリングは少し変えたやつ

物理演算でレイアウトする必要があったので、その際のコードも置いておく。
シンプルなやつの、ボールに内接する正方形をレンダリングするやつ。

<video controls playsinline muted="true" width="100%" src="/videos/matter-p5js-480.mov" type="video/mp4" >
 Sorry, your browser doesn't support embedded videos.
</video>

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>circle</title>
  <script src="https://cdn.jsdelivr.net/npm/p5@1.5.0/lib/p5.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.18.0/matter.min.js" integrity="sha512-5T245ZTH0m0RfONiFm2NF0zcYcmAuNzcGyPSQ18j8Bs5Pbfhp5HP1hosrR8XRt5M3kSRqzjNMYpm2+it/AUX/g==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
  <script src="./sketch.js"></script>
</head>
<body style="background-color: #222222">
</body>
</html>
```


```js
let engine;
const bodies = [];
let Engine, Runner, Bodies, Composite;
let displayBody = true;

function setup() {
  createCanvas(600, 600);
  rectMode(CENTER);

  Engine = Matter.Engine;
  Runner = Matter.Runner;
  Bodies = Matter.Bodies;
  Composite = Matter.Composite;

  engine = Engine.create();

  for (let i = 0; i < 30; i++) {
    const circle = Bodies.circle(
      width / 2 + random(-100, 100),
      height / 2 + random(-100, 100),
      random(20, 50),
      { visible: true, angle: random(PI * 2) }
    );
    bodies.push(circle);
  }

  bodies.push(Bodies.rectangle(width / 2, 10, width - 10, 10, { isStatic: true, visible: false }));
  bodies.push(Bodies.rectangle(width / 2, height - 10, width - 10, 10, { isStatic: true, visible: false }));
  bodies.push(Bodies.rectangle(width - 10, height / 2, 10, height - 10, { isStatic: true, visible: false }));
  bodies.push(Bodies.rectangle(10, height / 2, 10, height - 10, { isStatic: true, visible: false }));

  Composite.add(engine.world, bodies);
  const runner = Runner.create();
  Runner.run(runner, engine);
}

function draw() {
  background(255);

  bodies.forEach(body => {
    if (displayBody) {
      push();
      noFill();
      stroke(255, 50, 50);
      beginShape();
      body.vertices.forEach(v => {
        vertex(v.x, v.y);
      });
      endShape(CLOSE);
      pop();
    }

    if (!body.visible) {
      return;
    }

    const x = body.position.x;
    const y = body.position.y;
    const circleWidth = body.bounds.max.x - body.bounds.min.x;
    const w = (circleWidth / 2) * Math.sqrt(2);
    push();
    noFill();
    stroke(0);
    translate(x, y);
    rotate(body.angle);
    square(0, 0, w, w / 10);
    pop();

    // textAlign(CENTER, CENTER);
    // text(degrees(body.angle).toFixed(2), x, y);
  });
}
```
