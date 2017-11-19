
const Building = require("../Building");

class DefenseTower extends Building
{
    /*
    Integer baseDamage
    Float multDamage
    Integer baseRate
    Float multRate
    Integer baseRange
    Float multRange
    Integer baseSplash
    Float multSplash
    String priority
    */

    constructor(xpos, ypos, type, cost)
    {
        super(xpos, ypos, type, cost);

        this.baseDamage = 1;
        this.multDamage = 0.25;
        this.baseRate = 1;
        this.multRate = 0.25;
        this.baseRange = 3.5;
        this.multRange = 0.25;
        this.baseSplash = 0;

        switch (type)
        {
            // Basic tower, average growth all around
            case "BasicTower":
                this.baseRange = 2.5;
                break;
            // Fast shooting tower, good on Quicksters
            case "AirTower":
                this.baseRate = 2;
                this.multDamage = 0.2;
                this.multRate = 0.35;
                break;
            // Splash damage tower, good on Swarmies
            case "WaterTower":
                this.baseSplash = 2;
                this.multRange = 0.2;
                break;
            // High single shot damage tower, good on Rotundos and Massimos
            case "EarthTower":
                this.baseDamage = 2;
                this.multDamage = 0.35;
                this.multRate = 0.2;
                break;
            // Shoots fast, splash, and high damage. Good on everything
            case "FireTower":
                this.baseDamage = 2;
                this.multDamage = 0.2;
                this.baseRate = 2;
                this.multRate = 0.2;
                this.baseRange = 5;
                this.multRange = 0.2;
                this.baseSplash = 2;
                break;
        }
    }

    get damage()
    {
        return (this.baseDamage * (1 + (this.buildingLevel * this.multDamage)));
    }

    get rate()
    {
        return (this.baseRate * (1 + (this.buildingLevel * this.multRate)));
    }

    get range()
    {
        return (this.baseRange * (1 + (this.buildingLevel * this.multDamage)));
    }

    // Calculate straight line distance from tower to a creep
    distanceFrom(creep)
    {
        // Pythagorean theorem.
        return Math.sqrt(Math.exp(this.xpos - creep.xpos, 2) + Math.exp(this.ypos - creep.ypos, 2));
    }

    // Deals damage to one creep based on the tower's stats
    attack(creepList)
    {
        var minDistance = -1;
        var minCreep = null;
        for (var creep in creepList) {
            var dist = this.distanceFrom(creep);
            if ((minDistance < 0) || (dist < minDistance)) {
                minCreep = creep;
            }
        }

        if ((minCreep) && (minDistance <= this.range)) {
            minCreep.currHealth -= this.damage;

            if (minCreep.currHealth <= 0) {
                minCreep.perish();
            }
        }
    }

    upgrade(resources)
    {
        super.upgrade(resources);
    }
}

module.exports = DefenseTower;
