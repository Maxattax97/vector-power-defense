
const paper = require("paper");
const Player = require("../../shared/Player");
const World = require("../../shared/World");
//const Util = require("util");
const Render = require("./gui/render");

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

};

ws.onmessage = function(message) {
    var changes = JSON.parse(message.data);
    console.log(changes);
    if (changes.playerInfo === true)
    {
        world = new World(WIDTH, HEIGHT);
        player = new Player(Math.round(changes.xpos * WIDTH), Math.round(changes.ypos * HEIGHT), world, changes.isDefense, 4);
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
    }
    play = true;
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

const onload = function () {
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
        // Render.render(world);
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

    function addWorld(list) {
        for (var i = 0; i < list.length; i++) {
            list[i].map = world;
        }
        return list;
    }

    function removeWorld(list) {
        const list2 = [];
        for (var i = 0; i < list.length; i++) {
            list2[i] = Object.assign({}, list[i]);
            delete list2[i].map;
        }
        return list2;
    }

    function update(tick)
    {
        if (tick === 0)
        {
            return;
        }

        addWorld(newBuildings);
        addWorld(changedBuildings);
        addWorld(removedBuildings);
        addWorld(newCreeps);
        addWorld(changedCreeps);
        addWorld(removedCreeps);

        var target = null;
        if (player.isDefense)
        {
            for (let i = 0; i < player.buildings.length; i++)
            {
                target = player.buildings[i].attack(world.creeps);
                if ((target))
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
            for (let i = 0; i < world.creeps.length; i++)
            {
                world.creeps[i].move();
                changedCreeps.push(world.creeps[i]);
            }
            for (let i = 0; i < player.buildings.length; i++)
            {
                var spawnList = player.buildings[i].spawn;
                for (let j = 0; j < spawnList.length; j++)
                {
                    newCreeps.push(spawnList[j]);
                    console.log(spawnList[j].string);
                    world.addCreep(spawnList[j]);
                }
            }
        }
        player.receiveIncome();

        var objects =
        {
            newBuildings : removeWorld(newBuildings),
            changedBuildings : removeWorld(changedBuildings),
            removedBuildings : removeWorld(removedBuildings),
            newCreeps : removeWorld(newCreeps),
            changedCreeps : removeWorld(changedCreeps),
            removedCreeps : removeWorld(removedCreeps),
        };

        if (ws.readyState === 1) {
            ws.send(JSON.stringify(objects));
        }
        else {
            console.log('Done');
        }

        newBuildings = [];
        changedBuildings = [];
        removedBuildings = [];
        newCreeps = [];
        changedCreeps = [];
        removedCreeps = [];
    }
    for (var x = 0; x < WIDTH; x++)
    {
        buildMap[x] = [];
    }

    lastTick = performance.now();
    tickLength = 500; //This sets your simulation to run at 20Hz (50ms)

    setInitialState();

    Render.init();
    main(performance.now());
};

window.onload = function() {
    const canvas = document.getElementById("canvas");
    paper.setup(canvas);

    onload();
};
