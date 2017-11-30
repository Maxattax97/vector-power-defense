// Script for building classes

class Building
{
    /*
    Integer xposition
    Integer yposition
    Integer buildingLevel
    String buildingType
    Integer currHealth
    Integer maxHealth
    Integer upgradeCost
    Integer totalValue
    */

    constructor(xpos, ypos, type, cost)
    {
        this.xposition = xpos;
        this.yposition = ypos;
        this.buildingType = type;
        this.upgradeCost = cost/2;
        this.totalValue = cost;
    }

    upgrade(resources)
    {
        if (resources >= this.upgradeCost)
        {
            resources -= this.upgradeCost;
            this.buildingLevel++;
            this.totalValue += this.upgradeCost;
            this.upgradeCost *= 1 + (this.buildingLevel * 0.2);
        }
        return resources;
    }

    collapse()
    {

    }
}

module.exports = Building;
