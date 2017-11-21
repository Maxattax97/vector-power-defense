
const Building = require("../Building");

class PowerNode extends Building
{
    /*
    Integer baseIncome
    Integer currHealth
    Integer maxHealth
    */

    constructor(xpos, ypos, type, cost, health, numPlayers)
    {
        super(xpos, ypos, type, cost);
        this.currHealth = health;
        this.maxHealth = health;
        this.baseIncome = 100/numPlayers;
    }


    // Use PowerNode.income for obtaining the income of each node
    get income()
    {
        return (this.baseIncome * (1 + (this.buildingLevel * 0.2)));
    }

    upgrade(resources)
    {
        super.upgrade(resources);
    }
}

module.exports = PowerNode;
