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
        if (type.indexOf("Tower") !== -1)
        {
            this.buildings.push(new DefenseTower(xpos, ypos, type));
        }
        else if (type.indexOf("Spawn") !== -1)
        {
            this.buildings.push(new OffenseTower(xpos, ypos, type));
        }
        else
        {
            console.log("Invalid building type");
        }
    }
}

module.exports = Player;
