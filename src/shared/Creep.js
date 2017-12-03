// Script for creep class

const MAXSPEED = 8;

class Creep
{
    /*
    Integer xposition
    Integer yposition
    String creepType
    Integer creepSize   :: Health is heavily based on the size.
    Integer creepLevel  :: Level for stat growth calculations.
    Integer currHealth
    Integer maxHealth
    Integer baseSpeed
    Float multSpeed
    Integer baseDamage
    Float multDamage
    Integer baseBounty
    Boolean isDead      :: Indicates if creep should be represented as dead for rendering.
    Integer speedTick   :: Timer for delay between tile movements.
    Tile[] map          :: Map instance containing the creep.
    Integer creepID     :: Used to tell creeps apart
    */

    // Build creep
    constructor(xpos, ypos, type, level, map, isBoss, id)
    {
        this.xposition = xpos || 0;
        this.yposition = ypos || 0;
        this.creepType = type || "Creeper";
        this.creepLevel = level || 0;
        this.map = map;
        this.creepID = id;

        this.creepSize = 1;
        this.baseSpeed = 4;
        this.baseDamage = 1;
        this.baseBounty = 2;
        this.speedTick = 0;

        this.multSpeed = 0.25;
        this.multDamage = 0.25;

        switch (this.creepType)
        {
            // Basic creep
            case "Creeper":
                break;
            // Creep with higher base speed, but less health
            case "Quickster":
                this.baseSpeed = 8;
                this.baseBounty = 3;
                this.multSpeed = 0.35;
                this.multDamage = 0.20;
                break;
            // Smaller creep that spawns in hords, but less health and damage
            case "Swarmie":
                this.baseDamage = 0.5;
                this.creepSize = 0.5;
                this.baseBounty = 1;
                break;
            // Creep with highest health, but less base speed
            case "Rotundo":
                this.creepSize = 3;
                this.baseSpeed = 2;
                this.baseBounty = 4;
                this.multSpeed = 0.20;
                this.multDamage = 0.35;
                break;
            // Larger creep with higher health and damage, but lowest base speed
            case "Massimo":
                this.creepSize = 2;
                this.baseDamage = 2;
                this.baseSpeed = 1;
                this.baseBounty = 5;
                this.multSpeed = 0.15;
                this.multDamage = 0.40;
                break;
        }
        if (isBoss)
        {
            this.creepSize *= 1.5;
        }

        this.maxHealth = this.creepSize * (1 + (this.creepLevel * 0.2));
        this.currHealth = this.maxHealth;
    }

    get damage()
    {
        return (this.baseDamage * (1 + (this.creepLevel * this.multDamage)));
    }

    get speed()
    {
        return (this.baseSpeed * (1 + (this.creepLevel * this.multSpeed)));
    }

    // Function to deal damage to a building in range
    attack(powerNode)
    {
        powerNode.currHealth -= this.damage;

        if (powerNode.currHealth <= 0) {
            powerNode.collapse();
        }
    }

    move()
    {
        this.speedTick += this.speed;
        while (this.speedTick >= MAXSPEED)
        {
            this.speedTick -= MAXSPEED;
            this.xposition = this.map[this.xposition][this.yposition].nextTile.xposition;
            this.yposition = this.map[this.xposition][this.yposition].nextTile.yposition;
        }
    }

    // Function to begin death sequence and eventual removal
    perish()
    {
        this.isDead = true;
    }
}

module.exports = Creep;
