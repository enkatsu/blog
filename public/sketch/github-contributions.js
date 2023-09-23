let totalContributions = -1;
let contributions = [];

function setup() {
    var url = 'https://enkatsu.github.io/my-data/contributions.json';
    loadJSON(url, res => {
        totalContributions = res.user.contributionsCollection.contributionCalendar.totalContributions;
        contributions = res.user.contributionsCollection.contributionCalendar.weeks
            .map(week => week.contributionDays)
            .flat();
    });
    
    initCanvas();
}

function draw() {
    background(0);
    
    noStroke();
    fill(255, 50);
    for (let i = 1; i < 6; i++) {
        beginShape();
        vertex(0, height);
        contributions.forEach((contribution, index) => {
            const x = map(index, 0, contributions.length, 0, width);
            const y = map(contribution.contributionCount * i, 0, totalContributions, height, 0);
            vertex(x, y);
        });
        vertex(width, height);
        endShape();
    }
}
