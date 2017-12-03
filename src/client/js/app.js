
const paper = require("paper");
const Player = require("../../shared/Player");
const World = require("../../shared/World");
const WebSocket = require("ws");
const Render = require("./gui/render");
//const World = require("../../shared/World");

var world;
var player;
var play = false;
var lastTick = performance.now();
var tickLength = 50;


const WIDTH = 500;
const HEIGHT = 300;

var buildType = "Neutral";
var newBuildings = [];
var removedBuildings = [];
var newCreeps = [];
var removedCreeps = [];

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
    var changes = JSON.parse(message.data);
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
        case 80:    // P key
            buildType = "Promote";
            break;
        case 83:    // S key
            buildType = "Sell";
            break;
        case 85:    // U key
            buildType = "Upgrade";
            break;
    }
});

window.addEventLister("keyup", function(){
    buildType = "Neutral";
});

window.addEventLister("click", function(e){
    if (play === false || !(1 <= buildType && buildType <= 5))
    {
        return;
    }
    else
    {
        if (world.isValidSpot(e.clientX, e.clientY, player.xposition, player.yposition))
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
                if(!player.isDefense)
                {
                    building.addEventListener("click", promoteListener(e));
                }
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

function promoteListener(e)
{
    if (buildType === "Promote")
    {
        player.promoteSpawner(e.currentTarget);
    }
}

(function () {
    function main(tFrame) {
    //start = window.requestAnimationFrame(main);
        if (play === false)
        {
            return;
        }
        var nextTick = lastTick + tickLength;
        var numTicks = 0;

        //If tFrame < nextTick then 0 ticks need to be updated (0 is default for numTicks).
        //If tFrame = nextTick then 1 tick needs to be updated (and so forth).
        //Note: As we mention in summary, you should keep track of how large numTicks is.
        //If it is large, then either your game was asleep, or the machine cannot keep up.
        if (tFrame > nextTick) {
            var timeSinceTick = tFrame - lastTick;
            numTicks = Math.floor( timeSinceTick / tickLength );
        }

        queueUpdates(numTicks);
        Render.render(world);
    }

    function queueUpdates(numTicks) {
        for (var i=0; i < numTicks; i++) {
            lastTick = lastTick + tickLength; //Now lastTick is this tick.
            update(lastTick);
        }
    }

    function setInitialState()
    {
        world.calculatePathing();
    }

    function update(tick)
    {
        if (tick === 0)
        {
            return;
        }
        while (tick > 0)
        {
            if (player.isDefense)
            {
                var tower;
                var target;
                for (tower in player.buildings)
                {
                    target = tower.attack(world.creeps);
                    if (target !== null)
                    {
                        removedCreeps.push(target);
                        world.removeCreep(target);
                    }
                }
            }
            else
            {
                var spawner;
                for (spawner in player.buildings)
                {
                    var creep;
                    for (creep in spawner.spawn)
                    {
                        newCreeps.push(creep);
                        world.addCreep(creep);
                    }
                }
            }
            tick--;
        }
        var objects;
        objects.newBuildings = newBuildings;
        objects.removedBuildings = removedBuildings;
        objects.newCreeps = newCreeps;
        objects.removedCreeps = removedCreeps;
        newBuildings = [];
        removedBuildings = [];
        newCreeps = [];
        removedCreeps = [];
        ws.send(JSON.stringify(objects));

    }

    lastTick = performance.now();
    tickLength = 50; //This sets your simulation to run at 20Hz (50ms)

    setInitialState();
    main(performance.now()); // Start the cycle
})();
