// Script for building classes

class Building
{
    /*
    Integer xposition
    Integer yposition
    Integer towerLevel
    String buildingType
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
}

class OffenseTower extends Building
{
    /*
    Creep creepType
    Float bossMultiplier <-- = 1 if normal creep, > 1 if boss creep 
    */

    constructor(xpos, ypos, type)
    {
        super(xpos, ypos, type);
        switch (type)
        {
            case "CreeperSpawn":
                break;
            case "QuicksterSpawn":
                break;
            case "SwarmieSpawn":
                break;
            case "RotundoSpawn":
                break;
            case "MassimoSpawn":
                break;
        }
    }

    // Spawns the creep associated with the tower type
    spawn()
    {

    }

    upgrade()
    {
        super.upgrade();
    }
}

class DefenseTower extends Building
{
    /*
    Integer baseDamage
    Float multDamage
    Integer baseRate
    Float multRate
    Integer baseRange
    Float multRange
    String priority
    */

    constructor(xpos, ypos, type)
    {
        super(xpos, ypos, type);
        switch (type)
        {
            // Basic tower
            case "BasicTower":
                break;
            // Fast shooting tower, good on Quicksters
            case "AirTower":
                break;
            // Splash damage tower, good on Swarmies
            case "WaterTower":
                break;
            // High single shot damage tower, good on Rotundos and Massimos
            case "EarthTower":
                break;
            // Shoots fast, splash, and high damage. Good on everything
            case "FireTower":
                break;
        }
    }

    // Calculate straight line distance from tower to a creep
    distanceFrom(creep)
    {

    }

    // Deals damage to one creep based on the tower's stats
    attack(creepList)
    {

    }

    upgrade()
    {
        super.upgrade();
    }
}

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
        calculateIncome();
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
        super.upgrade
    }
}

module.exports = Building;
