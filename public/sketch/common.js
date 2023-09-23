
function initCanvas() {
    var canvasDiv = document.getElementById('sketch-holder');
    var isSquare = canvasDiv.offsetWidth < 640;
    var width = isSquare ? canvasDiv.offsetWidth: 640;
    var height = isSquare ? width: 480;
    var cnv = createCanvas(width, height);
    cnv.style('display', 'block');
    cnv.parent('sketch-holder');
}
