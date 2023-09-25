let nodes = [];
let links = [];
let sitemapXml;
let Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Composites = Matter.Composites,
    Common = Matter.Common,
    Constraint = Matter.Constraint,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    Composite = Matter.Composite,
    Bodies = Matter.Bodies,
    Body = Matter.Body;
let engine = Engine.create(),
    world = engine.world;
engine.gravity.x = 0.0;
engine.gravity.y = 0.0;
let runner = Runner.create();
Runner.run(runner, engine);

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
    for (let i = 0; i < postUrls.length; i++) {
        const postUrl = postUrls[i];
        const res = await httpGet(postUrl);
        const parser = new DOMParser();
        const doc = parser.parseFromString(res, 'text/html');
        const title = doc.querySelector('.page__body h1').innerText;
        const li = [...doc.querySelectorAll('.tags .tag a')];
        const tags = li.map(element => element.innerText.match(/^\[(.*)\]$/)[1]);
        const pathPattern = (new URL(postUrl)).pathname.split('/').filter(a => a);
        const body = Bodies.circle(
            random(100, 400), random(100, 400),
            20,
            {
                frictionAir: 0.3,
                friction: 0.1,
                collisionFilter: {
                    // mask: (i * 2) + 1,
                    // mask: 0b1 << (i + 1) + 1,
                    mask: 1,
                },
            });
        // body.force.x = 0.2;
        // body.force.y = 0.2;
        nodes.push({
            title,
            url: postUrl,
            tags,
            lastUrl: pathPattern[1],
            body,
        });
    }
    Composite.add(world, nodes.map(n => n.body));
    
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

    for (let link of links) {
        const constraint = Constraint.create({
            bodyA: nodes.find(n => n.url === link.source).body,
            bodyB: nodes.find(n => n.url === link.target).body,
            length: 180,
            stiffness: 0.005,
        });
        link.constraint = constraint;
        Composite.add(world, [constraint]);
    }

    Composite.add(world, [
        // walls
        // Bodies.rectangle(400, 0, 640, 50, { isStatic: true, collisionFilter: { mask: 1 }, }),
        // Bodies.rectangle(400, 480, 640, 50, { isStatic: true, collisionFilter: { mask: 1 }, }),
        // Bodies.rectangle(640, 300, 50, 480, { isStatic: true, collisionFilter: { mask: 1 }, }),
        // Bodies.rectangle(0, 300, 50, 480, { isStatic: true, collisionFilter: { mask: 1 }, }),
        Bodies.rectangle(width / 2, 0, width, 50, { isStatic: true }),
        Bodies.rectangle(width / 2, 480, 640, 50, { isStatic: true }),
        Bodies.rectangle(640, height / 2, 50, 480, { isStatic: true }),
        Bodies.rectangle(0, height / 2, 50, 480, { isStatic: true }),
    ]);

    var render = Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: width,
            height: height,
            showAngleIndicator: true
        }
    });

    Render.run(render);
}

function draw() {
    background(0);

    push();
    stroke(255, 100);
    for (let link of links) {
        line(
            link.constraint.bodyA.position.x,
            link.constraint.bodyA.position.y,
            link.constraint.bodyB.position.x,
            link.constraint.bodyB.position.y,
        );
    }
    pop();

    for (let node of nodes) {
        push();
        if (node.dragged) {
            fill(200, 0, 200);
        } else {
            fill(255)
        }
        // ellipse(node.body.position.x, node.body.position.y, 40, 40);
        textAlign(CENTER, CENTER);
        text(node.lastUrl, node.body.position.x, node.body.position.y);
        pop();
    }
}

function mousePressed() {
    for (let node of nodes) {
        const d = dist(node.body.position.x, node.body.position.y, mouseX, mouseY);
        if (d < 20) {
            node.dragged = true;
            break;
        }
    }
}

function mouseDragged() {
    const draggedNode = nodes.find(n => n.dragged);
    if (!draggedNode) {
        return;
    }
    
    const x = constrain(mouseX, 20, width - 20);
    const y = constrain(mouseY, 20, height - 20);
    Body.setPosition(draggedNode.body, { x, y });
}

function mouseReleased() {
    for (let node of nodes) {
        node.dragged = false;
    }
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
