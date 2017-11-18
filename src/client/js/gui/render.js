
const paper = require("paper");
const {Point, Path, Group} = paper;
const settings = {
    squareSize: 50,
    borderSize: 1,
};

settings.buildingSize = settings.squareSize - settings.borderSize * 2;
settings.buildingSize = Math.floor(settings.buildingSize / 2) * 2 - 1;

function createTower(level, color) {
    const l = settings.buildingSize;
    const baseRotateDelta = 45;
    const rotateDelta = baseRotateDelta + 10 * level;

    const children = [];

    const circle = new Path.Circle(new Point(0, 0), l/2);
    circle.strokeColor = color;
    children.push(circle);

    const outline = new Path.RegularPolygon(new Point(0, 0), level, l/4);
    const vertices = outline.segments.map((segment) => segment.point);
    let triangleSideLength = l/8;

    if (level === 1) {
        vertices[0] = new Point(0, 0);
        triangleSideLength = l/6;
    }

    vertices.forEach((vertex) => {
        const triangle = new Path.RegularPolygon(vertex, 3, triangleSideLength);
        triangle.fillColor = color;

        triangle.rotate(vertex.angle - 90, vertex);

        triangle.onFrame = function(event) {
            triangle.rotate(event.delta * rotateDelta, circle.position);
        };

        children.push(triangle);
    });

    outline.remove();

    const tower = new Group(children);

    return tower;
}

function positionTower(tower, xpos, ypos) {
    const x = (xpos + 0.5) * settings.squareSize;
    const y = (ypos + 0.5) * settings.squareSize;
    tower.position = new Point(x, y);
}

function render() {
    var rect = new Path.Rectangle({
        point: [0, 0],
        size: [paper.view.size.width, paper.view.size.height],
        strokeColor: 'black',
        fillColor: '#000000',
        selected: true,
    });
    rect.sendToBack();

    const basicTowers = [];
    const airTowers = [];
    const waterTowers = [];
    const earthTowers = [];
    const fireTowers = [];

    const towers = [
        basicTowers,
        airTowers,
        waterTowers,
        earthTowers,
        fireTowers,
    ];

    const colors = [
        "#eeeeee",
        "#8ffcff",
        "#4d4dff",
        "#fd5f00",
        "#dd0048",
    ];

    for (let type = 0; type < colors.length; type++) {
        const moreTowers = towers[type];
        const color = colors[type];
        for (let level = 0; level <= 4; level++) {
            const tower = createTower(level, color);
            positionTower(tower, level, type);
            moreTowers.push(tower);
        }
    }
}

module.exports = render;
