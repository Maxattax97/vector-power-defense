
const Building = require("../Building");

class PowerNode extends Building
{
    /*
    Integer baseIncome
    Integer currHealth
    Integer maxHealth
    */

    constructor(xpos, ypos, numDefenders)
    {
        super(xpos, ypos, "PowerNode", 100);
        this.currHealth = 100;
        this.maxHealth = 100;
        this.baseIncome = 100/numDefenders;
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
