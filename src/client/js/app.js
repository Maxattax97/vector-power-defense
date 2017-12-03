
const paper = require("paper");
const World = require("../../shared/World");

var world;
var player;

const WIDTH = 500;
const HEIGHT = 300;
/*
const SIZE = 20;

const BASECOLOR = "#85929e";    // Gray
const AIRCOLOR = "#d0d3d4";     // Light Gray
const EARTHCOLOR = "#196f3d";   // Green
const WATERCOLOR = "#3498db";   // Blue
const FIRECOLOR = "#c0392b";    // Red

const CREEPCOLOR = "#6c3483";   // Purple
const QUICKCOLOR = "#d834db";   // Pink
const SWARMCOLOR = "#73c6b6";   // Light Green
const ROTUNDCOLOR = "#d4aC0d";  // Yellow
const MASSCOLOR = "#d35400";    // Orange

const NODECOLOR = "#f7dc6f";    // Light Yellow
*/

// Might be needed to clear canvas at each frame
//var renderList = [];
var buildType = "Neutral";

const defenseTypes = [
    "BasicTower",
    "AirTower",
    "WaterTower",
    "EarthTower",
    "FireTower",
];

const offenseTypes = [
    "CreeperSpawn",
    "QuicksterSpawn",
    "SwarmieSpawn",
    "RotundoSpawn",
    "MassimoSpawn",
];

window.onload = function() {
    const canvas = document.getElementById("canvas");
    paper.setup(canvas);
    world = new World(WIDTH, HEIGHT, 4);
};

window.addEventLister("keypress", function(e){
    switch (e.keyCode)
    {
        case 49:
            buildType = 1;
            break;
        case 50:
            buildType = 2;
            break;
        case 51:
            buildType = 3;
            break;
        case 52:
            buildType = 4;
            break;
        case 53:
            buildType = 5;
            break;
        case 83:
            buildType = "Sell";
            break;
        case 85:
            buildType = "Upgrade";
            break;
    }
});

window.addEventLister("keyup", function(){
    buildType = "Neutral";
});

window.addEventLister("click", function(e){
    if (buildType === "Neutral" || buildType === "Sell" || buildType === "Upgrade")
    {
        return;
    }
    else
    {
        if (world.isValidSpot(e.clientX, e.clientY))
        {
            var type;
            if (player.isDefense)
            {
                type = defenseTypes[buildType - 1];
            }
            else
            {
                type = offenseTypes[buildType - 1];
            }
            var building = player.purchaseBuilding(e.clientX, e.clientY, type);
            if (building !== null)
            {
                building.addEventListener("click", upgradeListener(e));
                building.addEventListener("click", sellListener(e));
            }
        }
    }
});

function sellListener(e)
{
    if (buildType === "Sell")
    {
        player.sellBuilding(e.currentTarget);
        delete e.currentTarget;
    }
}

function upgradeListener(e)
{
    if (buildType === "Upgrade")
    {
        player.upgradeBuilding(e.currentTarget);
    }
}

/*function onFrame(event)
{
    paper.project.activeLayer.removeChildren();
    for (var building in world.buildings)
    {
        var rectangle = new Path.Rectangle(new Point(building.xposition, building.yposition), new Size(SIZE, SIZE));
        switch (building.buildingType)
        {
            case "AirTower":
                rectangle.fillColor = AIRCOLOR;
                break;
            case "WaterTower":
                rectangle.fillColor = WATERCOLOR;
                break;
            case "EarthTower":
                rectangle.fillColor = EARTHCOLOR;
                break;
            case "FireTower":
                rectangle.fillColor = FIRECOLOR;
                break;
            case "CreeperSpawn":
                rectangle.fillColor = CREEPCOLOR;
                break;
            case "QuicksterSpawn":
                rectangle.fillColor = QUICKCOLOR;
                break;
            case "SwarmieSpawn":
                rectangle.fillColor = SWARMCOLOR;
                break;
            case "RotundoSpawn":
                rectangle.fillColor = ROTUNDCOLOR;
                break;
            case "MassimoSpawn":
                rectangle.fillColor = MASSCOLOR;
                break;
            case "PowerNode":
                rectangle.fillColor = NODECOLOR;
                break;
            default:
                rectangle.fillColor = BASECOLOR;
        }
    }
    for (var creep in world.creeps)
    {
        var circle = new Path.Circle(new Point(creep.xposition, creep.yposition), creep.creepSize);
        switch (creep.creepType)
        {
            case "Quickster":
                circle.fillColor = QUICKCOLOR;
                break;
            case "Swarmie":
                circle.fillColor = SWARMCOLOR;
                break;
            case "Rotundo":
                circle.fillColor = ROTUNDCOLOR;
                break;
            case "Massimo":
                circle.fillColor = MASSCOLOR;
                break;
            default:
                circle.fillColor = CREEPCOLOR;
        }
    }
}*/
