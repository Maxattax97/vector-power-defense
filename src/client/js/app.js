
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

const WIDTH = 16;
const HEIGHT = 16;
const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 640;

const BUILDSIZE = 4;

var buildType = "Neutral";
var newBuildings = [];
window.newBuildings = newBuildings;
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
    console.log("Connected");
};

ws.onmessage = function(message) {
    var changes = JSON.parse(message.data);

    // console.log("c", changes);
    if (changes.playerInfo)
    {
        const elem = document.getElementById("highscore");
        elem.innerText = `highscore: ${changes.highscore}`;
        console.log(elem);
        console.log('test', changes.highscore);

        world = new World(CANVAS_WIDTH, CANVAS_HEIGHT);
        const xpos = Math.round(changes.xpos * CANVAS_WIDTH);
        const ypos = Math.round(changes.ypos * CANVAS_HEIGHT);
        player = new Player(xpos, ypos, world, changes.isDefense, 4);
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
        if (play === false)
        {
            window.requestAnimationFrame(main);
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
        window.requestAnimationFrame(main);
    }

    function queueUpdates(numTicks) {
        for (var i=0; i < numTicks; i++) {
            lastTick = lastTick + tickLength; //Now lastTick is this tick.
            // console.log('update');
            update(numTicks, lastTick);
        }
    }

    function setInitialState()
    {
        // world.calculatePathing();
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

        if (newBuildings.length > 0) {
            console.log("newBuildings", newBuildings);
        }
        if (changedBuildings.length > 0) {
            console.log("changedBuildings", changedBuildings);
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
            // for (let i = 0; i < world.creeps.length; i++)
            // {
            //     world.creeps[i].move();
            //     changedCreeps.push(world.creeps[i]);
            // }
            // for (let i = 0; i < player.buildings.length; i++)
            // {
            //     var spawnList = player.buildings[i].spawn;
            //     for (let j = 0; j < spawnList.length; j++)
            //     {
            //         newCreeps.push(spawnList[j]);
            //         console.log(spawnList[j].string);
            //         world.addCreep(spawnList[j]);
            //     }
            // }
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
            if (newBuildings.length > 0) {
                console.log("out", newBuildings);
            }

            ws.send(JSON.stringify(objects));
        }
        else {
            console.log("Done");
        }

        newBuildings = [];
        changedBuildings = [];
        removedBuildings = [];
        newCreeps = [];
        changedCreeps = [];
        removedCreeps = [];
    }
    for (var x = 0; x < CANVAS_WIDTH; x++)
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

    canvas.addEventListener("click", function(e){
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
        else
        {
            if (buildType > 0) {
                const xClick = Math.floor(e.clientX / 40);
                const yClick = Math.floor(e.clientY / 40);
                console.log(xClick, yClick);

                if (world.isValidSpot(xClick, yClick, player.xposition, player.yposition))
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
                    var building = player.purchaseBuilding(xClick, yClick, type);
                    if (building)
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
                else {
                    console.log('failed');
                }

            }
        }
    });

    onload();
};
