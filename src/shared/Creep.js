// Script for creep class

class Creep
{
    /*
    Integer xposition
    Integer yposition
    String creepType
    Integer creepSize
    Integer creepLevel
    Integer currHealth
    Integer maxHealth
    Integer baseSpeed
    Float multSpeed
    Integer baseDamage
    Float multSpeed
    Integer baseRange
    Float multSpeed
    */

    // Build creep
    constructor(xpos, ypos, type, level, bossMultiplier)
    {
        this.xposition = xpos;
        this.yposition = ypos;
        switch(type)
        {
            // Basic creep
            case "Creeper":
                break;
            // Creep with higher base speed, but less health
            case "Quickster":
                break;
            // Smaller creep that spawns in hords, but less health and damage
            case "Swarmie":
                break;
            // Creep with highest health, but less base speed
            case "Rotundo":
                break;
            // Larger creep with higher health and damage, but lowest base speed
            case "Massimo":
                break;
        }
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
