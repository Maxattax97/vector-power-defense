// Script for creep class

class Creep
{
    var xposition;
    var yposition;
    var creepType;
    var currHealth;
    var maxHealth;
    var baseSpeed;
    var baseDamage;
    var baseRange;

    // Build creep
    constructor(xpos, ypos, type)
    {
        this.xposition = xpos;
        this.yposition = ypos;
        switch(type)
        {
            case "Regular":
                break;
            case "Speedster":
                break;
            case "Swarmster":
                break;
            case "Toughster":
                break;
        }
    }

    get xposition()
    {
        return this.xposition;
    }

    get yposition()
    {
        return this.yposition;
    }

    get creepType()
    {
        return this.creepType;
    }

    get currHealth()
    {
        return this.currHealth;
    }

    get maxHealth()
    {
        return this.maxHealth;
    }

    get speed()
    {
        return this.baseSpeed;
    }

    get range()
    {
        return this.baseRange;
    }

    // Function to deal damage to a power node in range
    attack(node)
    {

    }

    // Function to begin death sequence and eventual removal
    perish()
    {

    }
}

module.exports = Creep;
