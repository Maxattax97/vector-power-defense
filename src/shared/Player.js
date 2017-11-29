// Script for player class
const DefenseTower = require("./Building/DefensiveTower");
const OffenseTower = require("./Building/OffensiveTower");
const PowerNode = require("./Building/PowerNode");

class Player
{
    /*
    Integer resources
    Building[] buildings
    PowerNode powerNode
    */

    constructor(xpos, ypos)
    {
        this.resources = 0;
        this.powerNode = new PowerNode(xpos, ypos, "PowerNode", 100);
    }

    purchaseBuilding(xpos, ypos, type)
    {
        var cost;
        if (type.indexOf("Tower") !== -1)
        {
            switch (type)
            {
                case "BasicTower":
                    cost = 100;
                    break;
                case "AirTower":
                    cost = 150;
                    break;
                case "WaterTower":
                    cost = 200;
                    break;
                case "EartTower":
                    cost = 250;
                    break;
                case "FireTower":
                    cost = 500;
                    break;
            }
            if (this.resources >= cost)
            {
                this.resources -= cost;
                this.buildings.push(new DefenseTower(xpos, ypos, type, cost));
            }
        }
        else if (type.indexOf("Spawn") !== -1)
        {
            switch (type)
            {
                case "CreeperSpawn":
                    cost = 100;
                    break;
                case "QuicksterSpawn":
                    cost = 200;
                    break;
                case "SwarmieSpawn":
                    cost = 200;
                    break;
                case "RotundoSpawn":
                    cost = 250;
                    break;
                case "MassimoSpawn":
                    cost = 300;
                    break;
            }
            if (this.resources >= cost)
            {
                this.resources -= cost;
                this.buildings.push(new OffenseTower(xpos, ypos, type, cost));
            }
        }
        else
        {
            console.log("Invalid building type");
        }
    }
}

module.exports = Player;
