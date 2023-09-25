let nodes = [];
let links = [];
let sitemapXml;

function preload() {
    const url = '/sitemap.xml';
    sitemapXml = loadXML(url);
}

async function setup() {
    initCanvas();

    const postUrls = sitemapXml
        .getChildren('loc')
        .map(loc => loc.getContent())
        .filter(url => {
            const pathPattern = (new URL(url)).pathname.split('/').filter(a => a);
            return pathPattern.length === 2 && pathPattern[0] === 'post'
        });
    const posts = [];
    for (let postUrl of postUrls) {
        const res = await httpGet(postUrl);
        const parser = new DOMParser();
        const doc = parser.parseFromString(res, 'text/html');
        const title = doc.querySelector('.page__body h1').innerText;
        const li = [...doc.querySelectorAll('.tags .tag a')];
        const tags = li.map(element => element.innerText.match(/^\[(.*)\]$/)[1]);
        const pathPattern = (new URL(postUrl)).pathname.split('/').filter(a => a);
        nodes.push({
            title,
            url: postUrl,
            tags,
            lastUrl: pathPattern[1],
        });
    }
    
    for (let sourceNode of nodes) {
        for (let sourceTag of sourceNode.tags) {
            const targetNodes = nodes
                .filter(node => node.tags.find(tag => tag === sourceTag));
            for (let targetNode of targetNodes) {
                links.push({
                    id: links.length + 1,
                    source: sourceNode.url,
                    target: targetNode.url,
                    tag: sourceTag,
                });
            }
        }
    }
    links = links.filter(link => {
        const sameLinks = links.filter(l => {
            return (l.source === link.source && l.target === link.target) ||
                (l.source === link.target && l.target === link.source)
        });
        return sameLinks && link.id === min(sameLinks.map(l => l.id)) && link.source !== link.target;
    });
}

function draw() {
    background(0);

    push();
    fill(255);
    noStroke();
    textSize(15);
    textAlign(RIGHT, CENTER);
    nodes.forEach((node, i) => {
        const y = map(i, 0, nodes.length, 15, height);
        text(node.lastUrl, 190, y);
    });
    pop();

    push();
    noFill();
    stroke(255, 80);
    links.forEach((link, i) => {
        const source = nodes.find(n => n.url === link.source);
        const sourceIndex = nodes.indexOf(source);
        const sourceY = map(sourceIndex, 0, nodes.length, 15, height);
        const target = nodes.find(n => n.url === link.target);
        const targetIndex = nodes.indexOf(target);
        const targetY = map(targetIndex, 0, nodes.length, 15, height);
        // curve(
        //     -1000, sourceY,
        //     10, sourceY,
        //     10, targetY,
        //     -1000, targetY
        // );
        bezier(
            190 + 10, sourceY,
            width, sourceY,
            width, targetY,
            190 + 10, targetY
        );

        // push();
        // textAlign(LEFT, CENTER);
        // textSize(10);
        // fill(255);
        // noStroke();
        // let x = bezierPoint(190 + 10, width, width, 190 + 10, 0.5) + 5;
        // let y = bezierPoint(sourceY, sourceY, targetY, targetY, 0.5);
        // text(link.tag, x, y);
        // pop();
    });
    pop();
}

// function loadPostUrls(callback) {
//     const url = '/sitemap.xml';
//     loadXML(url, res => {
//         const posts = res.getChildren('loc')
//             .map(loc => loc.getContent())
//             .filter(url => {
//                 const pathPattern = (new URL(url)).pathname.split('/').filter(a => a);
//                 return pathPattern.length === 2 && pathPattern[0] === 'post'
//             });
//         callback(posts);
//     });
// }

function countTaggedPost(tag, callback) {
    httpGet(`/tags/${tag}/`, res => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(res, 'text/html');
        const li = doc.querySelectorAll('.page__body li');
        callback(li.length)
    });
}

function loadTags(callback) {
    const url = '/sitemap.xml';
    loadXML(url, res => {
        const tags = res.getChildren('loc')
            .map(loc => {
                const url = new URL(loc.getContent());
                return url.pathname.split('/').filter(a => a);
            })
            .filter(pathPattern => {
                return pathPattern.length === 2 && pathPattern[0] === 'tags'
            })
            .map(pathPattern => pathPattern[1]);
        callback(tags);
    });
}
