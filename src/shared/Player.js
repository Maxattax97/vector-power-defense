// Script for player class
const DefenseTower = require("./Building/DefensiveTower");
const OffenseTower = require("./Building/OffensiveTower");
const PowerNode = require("./Building/PowerNode");

const BASECOST = 100;
const AIRCOST = 150;
const WATERCOST = 200;
const EARTHCOST = 250;
const FIRECOST = 500;
const CREEPCOST = 100;
const QUICKCOST = 200;
const SWARMCOST = 200;
const ROTUNDCOST = 250;
const MASSCOST = 300;

class Player
{
    /*
    Integer resources       :: Amount of money that the player has.
    Building[] buildings    :: List of buildings owned by the player.
    PowerNode powerNode     :: Power node owned by the player.
    Boolean isDefense       :: Whether the player is a defender or not.
    World world             :: World instance that player is playing with.
    */

    constructor(xpos, ypos, world, isDefense, numDefenders)
    {
        this.resources = 0;
        this.buildings = [];
        this.world = world;
        if (isDefense)
        {
            this.powerNode = new PowerNode(xpos, ypos, this.world, numDefenders);
        }
        this.isDefense = isDefense;
    }

    purchaseBuilding(xpos, ypos, type)
    {
        var cost = 0;
        if (type.indexOf("Tower") !== -1)
        {
            switch (type)
            {
                case "BasicTower":
                    cost = BASECOST;
                    break;
                case "AirTower":
                    cost = AIRCOST;
                    break;
                case "WaterTower":
                    cost = WATERCOST;
                    break;
                case "EarthTower":
                    cost = EARTHCOST;
                    break;
                case "FireTower":
                    cost = FIRECOST;
                    break;
            }
            if (this.resources >= cost)
            {
                this.resources -= cost;
                this.buildings.push(new DefenseTower(xpos, ypos, type, cost, this.world));
            }
        }
        else if (type.indexOf("Spawn") !== -1)
        {
            switch (type)
            {
                case "CreeperSpawn":
                    cost = CREEPCOST;
                    break;
                case "QuicksterSpawn":
                    cost = QUICKCOST;
                    break;
                case "SwarmieSpawn":
                    cost = SWARMCOST;
                    break;
                case "RotundoSpawn":
                    cost = ROTUNDCOST;
                    break;
                case "MassimoSpawn":
                    cost = MASSCOST;
                    break;
            }
            if (this.resources >= cost)
            {
                this.resources -= cost;
                this.buildings.push(new OffenseTower(xpos, ypos, type, cost, this.world));
            }
        }
        if (cost === 0)
        {
            console.log("Invalid building type");
        }
    }

    sellBuilding(building)
    {
        var value = 0;
        var pblock = -1;
        var i;
        for (i = 0; i < this.buildings.length; i++)
        {
            if (this.buildings[i].xposition === building.xposition && this.buildings[i].yposition === building.yposition)
            {
                pblock = i;
                break;
            }
        }
        if (pblock === -1)
        {
            return;
        }
        var type = building.buildingType;
        if (type.indexOf("Tower") !== -1)
        {
            switch (type)
            {
                case "BasicTower":
                    value = building.totalValue * (4 / 5) * BASECOST;
                    break;
                case "AirTower":
                    value = building.totalValue * (4 / 5) * AIRCOST;
                    break;
                case "WaterTower":
                    value = building.totalValue * (4 / 5) * WATERCOST;
                    break;
                case "EarthTower":
                    value = building.totalValue * (4 / 5) * EARTHCOST;
                    break;
                case "FireTower":
                    value = building.totalValue * (4 / 5) * FIRECOST;
                    break;
            }
        }
        else if (type.indexOf("Spawn") !== -1)
        {
            switch (type)
            {
                case "CreeperSpawn":
                    value = building.totalValue * (4 / 5) * CREEPCOST;
                    break;
                case "QuicksterSpawn":
                    value = building.totalValue * (4 / 5) * QUICKCOST;
                    break;
                case "SwarmieSpawn":
                    value = building.totalValue * (4 / 5) * SWARMCOST;
                    break;
                case "RotundoSpawn":
                    value = building.totalValue * (4 / 5) * ROTUNDCOST;
                    break;
                case "MassimoSpawn":
                    value = building.totalValue * (4 / 5) * MASSCOST;
                    break;
            }
        }
        else
        {
            console.log("Invalid building type");
        }
        this.buildings.splice(pblock, pblock + 1);
        this.resources += value;
    }

    upgradeBuilding(building)
    {
        this.resources = building.upgrade(this.resources);
    }

    promoteSpawner(spawner)
    {
        this.resources = spawner.promote(this.resources);
    }
}

module.exports = Player;
