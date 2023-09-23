let languages = [];

function setup() {
    var url = 'https://enkatsu.github.io/my-data/languages.json';
    loadJSON(url, res => {
        const repositories = res.user.repositories.nodes;
        languages = repositories.map(repository => {
            return repository.languages.edges.map(edge => {
                return edge.node
            })
        })
        .flat()
        .toSorted((a, b) => a.name > b.name);
    });
    
    initCanvas();
}

function draw() {
    background(0);
    noStroke();

    let hoverLanguage = null;

    languages.forEach((language, i) => {
        const x = map(i, 0, languages.length, 0, width);
        const w = width / languages.length;
        if (language.color) {
            fill(language.color);
        } else {
            noFill();
        }
        rect(x, 0, w, height);
        const isHover = x <= mouseX && mouseX <= x + w;
        if (isHover) {
            hoverLanguage = language;
        }
    });

    if (hoverLanguage) {
        push();
        stroke(0);
        fill(255);
        textSize(15);
        text(hoverLanguage.name, 10, height - 10);
        pop();
    }
}
