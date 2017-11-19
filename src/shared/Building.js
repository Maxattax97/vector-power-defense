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
    */

    constructor(xpos, ypos, type, cost)
    {
        this.xposition = xpos;
        this.yposition = ypos;
        this.buildingType = type;
        this.upgradeCost = cost/2;
    }

    upgrade(resources)
    {
        if (resources >= this.upgradeCost)
        {
            resources -= this.upgradeCost;
            this.buildingLevel++;
            this.upgradeCost *= 1 + (this.buildingLevel * 0.2);
        }
        return resources;
    }

    collapse()
    {

    }
}

module.exports = Building;
