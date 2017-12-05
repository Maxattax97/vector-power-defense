
const paper = require("paper");
const {Point, Path, Color, Group} = paper;
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

function shootBetween(a, b, color) {
    if (color === undefined) {
        color = a.strokeColor;
    }

    const path = new Path(a.position, b.position);
    path.strokeColor = color;

    path.onFrame = function(event) {
        path.strokeColor.alpha -= 1 * event.delta;
        if (path.strokeColor.alpha <= 0) {
            path.remove();
        }
    };
}

function shootSplash(a, b, items, splashRange) {
    shootBetween(a, b);

    const actualSplashRange = splashRange * settings.squareSize;

    const splashColor = new Color(a.strokeColor);
    splashColor.alpha *= 2/3;

    for (var i = 0; i < items.length; i++) {
        const item = items[i];
        if (b.position.subtract(item.position).length < actualSplashRange) {
            shootBetween(b, item, splashColor);
        }
    }
}

function init() {
    var rect = new Path.Rectangle({
        point: [0, 0],
        size: [paper.view.size.width, paper.view.size.height],
        strokeColor: "black",
        fillColor: "#000000",
        selected: true,
    });
    rect.sendToBack();
}

function render(world) {
    const colors = [
        "#eeeeee",
        "#8ffcff",
        "#4d4dff",
        "#fd5f00",
        "#dd0048",
    ];

    for (var building in world.buildings)
    {
        var color;
        switch (building.buildingType)
        {
            case "BasicTower":
                color = colors[0];
                break;
            case "AirTower":
                color = colors[1];
                break;
            case "WaterTower":
                color = colors[2];
                break;
            case "EarthTower":
                color = colors[3];
                break;
            case "FireTower":
                color = colors[4];
                break;
        }
        const tower = createTower(building.buildingLevel, color);
        positionTower(tower, building.xposition, building.yposition);
    }

    // const items = [].concat.apply([], towers);
    // shootBetween(basicTowers[0], basicTowers[1]);
    // shootSplash(airTowers[0], earthTowers[4], items, 1.5);
}

module.exports = {
    render,
    init,
};
