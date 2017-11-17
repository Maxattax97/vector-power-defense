
const paper = require("paper");
const {Point, Path, Group} = paper;
const settings = {
    squareSize: 50,
    borderSize: 1,
};

settings.buildingSize = settings.squareSize - settings.borderSize * 2;

// function create() {
//
// }

function createBasicTower() {
    const radius = settings.buildingSize / 2;
    const circle = new Path.Circle(new Point(0, 0), radius);
    circle.strokeColor = "#383838";
    return circle;
}

function createAirTower(level) {
    const l = settings.buildingSize;
    const baseRotateDelta = 45;
    const rotateDelta = baseRotateDelta + 10 * level;

    const children = [];

    const circle = new Path.Circle(new Point(0, 0), l/2);
    circle.strokeColor = "#73dafe";
    circle.fillColor = "#ffffff";
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
        triangle.fillColor = "#73dafe";

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
    const basicTower = createBasicTower();
    positionTower(basicTower, 0, 0);

    const airTowers = [];
    for (let i = 0; i <= 4; i++) {
        const airTower = createAirTower(i);
        positionTower(airTower, 1 + i, 0);
        airTowers.push(airTower);
    }
}

module.exports = render;
