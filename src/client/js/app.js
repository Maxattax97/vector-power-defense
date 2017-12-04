
const paper = require("paper");
const Player = require("../../shared/Player");
const World = require("../../shared/World");
const WebSocket = require("ws");
//const World = require("../../shared/World");

var world;
var player;
var play = false;


const WIDTH = 500;
const HEIGHT = 300;

var buildType = "Neutral";
var newBuildings = [];
var removedBuildings = [];
//var newCreeps = [];
//var removedCreeps = [];

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

const ws = new WebSocket("ws://www.maxocull.com/vpd", {
    perMessageDeflate: false,
});

ws.on("open", function() {
    ws.send("Assign Player");
});

ws.on("message", function(message) {
    var changes = message.data;
    if (changes.playerInfo === true)
    {
        world = new World(WIDTH, HEIGHT);
        player = new Player(changes.xpos * WIDTH, changes.ypos * HEIGHT, world, changes.isDefense, 4);
        if (changes.isDefense)
        {
            newBuildings.push(player.powerNode);
            world.addBuilding(player.powerNode);
        }
    }
    else
    {
        world.creeps = changes.Creeps;
        world.buildings = changes.Buildings;
    }
    play = changes.play;
});

window.onload = function() {
    const canvas = document.getElementById("canvas");
    paper.setup(canvas);
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
    if (play === false || buildType === "Neutral" || buildType === "Sell" || buildType === "Upgrade")
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
            world.addBuilding(building);
            newBuildings.push(building);
            if (building !== null)
            {
                building.addEventListener("click", sellListener(e));
                building.addEventListener("click", upgradeListener(e));
            }
        }
    }
});

function sellListener(e)
{
    if (buildType === "Sell")
    {
        player.sellBuilding(e.currentTarget);
        world.removeBuilding(e.currentTarget);
        removedBuildings.push(e.currentTarget);
    }
}

function upgradeListener(e)
{
    if (buildType === "Upgrade")
    {
        player.upgradeBuilding(e.currentTarget);
    }
}
