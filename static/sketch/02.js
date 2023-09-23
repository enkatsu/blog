function setup() {
    initCanvas();
    background(0);
}

function draw() {
    background(0, 10);
    stroke(255);
    for (var x = 0; x < width; x++) {
        var y = noise(x * 0.01, frameCount * 0.005);
        point(x, height * y);
    }
}
