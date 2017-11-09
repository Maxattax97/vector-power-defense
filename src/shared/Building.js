// Script for building classes

class Building
{
    var xpos;
    var ypos;
    var type;

    constructor(xpos, ypos, type)
    {
        this.xpos = xpos;
        this.ypos = ypos;
        this.type = type;
    }

    get xposition()
    {
        return this.xpos;
    }

    get yposition()
    {
        return this.ypos;
    }

    get type()
    {
        return this.type;
    }
}

class OffenseTower extends Building
{
    var creepType;

    // Spawns the creep associated with the tower type
    spawn()
    {

    }
}

class DefenseTower extends Building
{
    var baseDamage;
    var baseRate;
    var baseRange;
    var priority; // Closest to tower, lowest health, etc.

    // Calculate straight line distance from tower to a creep
    distanceFrom(creep)
    {

    }

    // Deals damage to one creep based on the tower's stats
    attack(creepList)
    {

    }
}

class PowerNode extends Building
{
    var baseIncome;
    var currHealth;
    var maxHealth;

    // Generates income
    generate()
    {

    }
}

module.exports = Building;
