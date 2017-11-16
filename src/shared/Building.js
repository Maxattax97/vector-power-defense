// Script for building classes

class Building
{
    /*
    Integer xposition
    Integer yposition
    Integer towerLevel
    String buildingType
    Integer currHealth
    Integer maxHealth
    */

    constructor(xpos, ypos, type)
    {
        this.xposition = xpos;
        this.yposition = ypos;
        this.buildingType = type;
    }

    upgrade()
    {

    }

    collapse()
    {

    }
}

module.exports = Building;
