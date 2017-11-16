
const Building = require("../Building");

class PowerNode extends Building
{
    /*
    Integer baseIncome
    Integer currHealth
    Integer maxHealth
    */

    constructor(xpos, ypos, type, health)
    {
        super(xpos, ypos, type);
        this.currHealth = health;
        this.maxHealth = health;
        this.calculateIncome();
    }

    // Calculates the base income of the node using factors such as
    // number of players, type of node, etc.
    calculateIncome()
    {

    }

    // Generates income
    generate()
    {

    }

    upgrade()
    {
        super.upgrade;
    }
}

module.exports = PowerNode;
