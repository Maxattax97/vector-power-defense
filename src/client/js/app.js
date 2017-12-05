
const paper = require("paper");
const Player = require("../../shared/Player");
const World = require("../../shared/World");
const Util = require("util");
//const Render = require("./gui/render");

var world = new World(0, 0);
var player = new Player(0, 0, null, 0, 0);
var play = false;
var lastTick = performance.now();
var tickLength = 50;


const WIDTH = 500;
const HEIGHT = 300;

const BUILDSIZE = 4;

var buildType = "Neutral";
var newBuildings = [];
var changedBuildings = [];
var removedBuildings = [];
var newCreeps = [];
var changedCreeps = [];
var removedCreeps = [];
var buildMap = [];

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

const ws = new WebSocket("wss://" + location.host);

ws.onopen = function() {
    console.log("Connection established");
};

window.onload = function() {
    const canvas = document.getElementById("canvas");
    paper.setup(canvas);
};

window.addEventListener("keypress", function(e){
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
            if (!(player.isDefense))
            {
                buildType = "Promote";
            }
            break;
        case 83:    // S key
            buildType = "Sell";
            break;
        case 85:    // U key
            buildType = "Upgrade";
            break;
        default:
            buildType = "Neutral";
    }
});

window.addEventListener("keyup", function(){
    buildType = "Neutral";
});

window.addEventListener("click", function(e){
    if (play === false || !(1 <= buildType && buildType <= 5))
    {
        if (buildType === "Sell")
        {
            sell(e);
        }
        else if (buildType === "Upgrade")
        {
            upgrade(e);
        }
        else if (buildType === "Promote")
        {
            promote(e);
        }
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
            console.log(player.resources);
            if ((building))
            {
                world.addBuilding(building);
                newBuildings.push(building);
                for (var x = building.xposition; x < building.xposition + BUILDSIZE; x++)
                {
                    for (var y = building.yposition; y < building.yposition + BUILDSIZE; y++)
                    {
                        buildMap[x][y] = building;
                    }
                }
            }
        }
    }
});

function sell(e)
{
    var building = buildMap[e.clientX][e.clientY];
    if ((building))
    {
        player.sellBuilding(building);
        world.removeBuilding(building);
        removedBuildings.push(building);
        for (var x = building.xposition; x < building.xposition + BUILDSIZE; x++)
        {
            for (var y = building.yposition; y < building.yposition + BUILDSIZE; y++)
            {
                buildMap[x][y] = null;
            }
        }
    }
}

function upgrade(e)
{
    var building = buildMap[e.clientX][e.clientY];
    if ((building))
    {
        player.upgradeBuilding(building);
        changedBuildings.push(building);
    }
}

function promote(e)
{
    var building = buildMap[e.clientX][e.clientY];
    if ((building))
    {
        player.promoteSpawner(building);
        changedBuildings.push(building);
    }
}

(function () {
    function main(tFrame) {
        window.requestAnimationFrame(main);
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
        //Render.render(world);
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
        var creep;
        var tower;
        var spawner;
        var target;
        if (player.isDefense)
        {
            for (tower in player.buildings)
            {
                target = tower.attack(world.creeps);
                if (target !== null)
                {
                    if (target.currHealth <= 0)
                    {
                        removedCreeps.push(target);
                        world.removeCreep(target);
                    }
                    else
                    {
                        changedCreeps.push(target);
                    }
                }
            }
        }
        else
        {
            for (creep in world.creeps)
            {
                creep.move();
                changedCreeps.push(creep);
            }
            for (spawner in player.buildings)
            {
                for (creep in spawner.spawn)
                {
                    newCreeps.push(creep);
                    world.addCreep(creep);
                }
            }
        }
        player.receiveIncome();

        var objects =
        {
            "newBuildings" : newBuildings,
            "changedBuildings" : changedBuildings,
            "removedBuildings" : removedBuildings,
            "newCreeps" : newCreeps,
            "changedCreeps" : changedCreeps,
            "removedCreeps" : removedCreeps,
        };
        ws.send(JSON.stringify(Util.inspect(objects)));
        newBuildings = [];
        changedBuildings = [];
        removedBuildings = [];
        newCreeps = [];
        changedCreeps = [];
        removedCreeps = [];
    }

    lastTick = performance.now();
    tickLength = 500; //This sets your simulation to run at 20Hz (50ms)

    setInitialState();
    main(performance.now()); // Start the cycle

    ws.onmessage = function(message) {
        var changes = JSON.parse(message.data);

        console.log("Changes: ", changes);

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
            world.creeps = changes.creeps;
            world.buildings = changes.buildings;
            console.log(world.string);
        }

        play = changes.play;

        if (changes.start) {
            main(performance.now());
        }
    };

})();
