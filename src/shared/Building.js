// Script for building classes

class Building
{
    /*
    Integer xposition
    Integer yposition
    Integer buildingLevel   :: Level for building, for tower and creep stat growth. Starts at 0.
    String buildingType     :: Type of building. See switch cases in each subclass's constructor.
    Integer upgradeCost     :: Cost for next buildingLevel to be reached.
    Integer totalValue      :: Sum of cost for purchase and all previous upgrades.
    Boolean isCollapsed     :: Indicates building should be rendered as being destroyed
    Tile[][] map              :: Map instance containing the building
    Boolean isRendered
    */

    constructor(xpos, ypos, type, cost, map)
    {
        this.xposition = xpos;
        this.yposition = ypos;
        this.buildingType = type;
        this.upgradeCost = cost/2;
        this.totalValue = cost;
        this.buildingLevel = 0;
        this.isCollapsed = false;
        this.isRendered = false;
        this.map = map;
    }

    get string()
    {
        return ("Type: " + this.buildingType + " X: " + this.xposition + " Y: " + this.yposition);
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
        this.isCollapsed = true;
    }
}

module.exports = Building;
