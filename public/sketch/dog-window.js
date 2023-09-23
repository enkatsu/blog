let img = null;
let pressed = null;

function preload() {
}

function setup() {
    initCanvas();
    img = loadImage(`https://placedog.net/${width}/${height}/g`);
}

function draw() {
    background(0);

    if (pressed) {
        const x = min(mouseX, pressed.x);
        const y = min(mouseY, pressed.y);
        const w = abs(mouseX - pressed.x);
        const h = abs(mouseY - pressed.y);
        if (w <= 0 || h <= 0) {
            return;
        }
        const cropped = img.get(x, y, w, h);
        image(cropped, x, y);
    } else {
        fill(255);
        textAlign(CENTER, CENTER);
        text("Please drag", width / 2, height / 2);
    }
}

function mousePressed() {
    pressed = createVector(mouseX, mouseY);
}

function mouseReleased() {
    pressed = null;
}

function mouseDragged() {
}
