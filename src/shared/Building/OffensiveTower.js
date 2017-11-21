
const Building = require("../Building");

class OffenseTower extends Building
{
    /*
    Creep creepType
    Float bossMultiplier <-- = 1 if normal creep, > 1 if boss creep
    */

    constructor(xpos, ypos, type, cost)
    {
        super(xpos, ypos, type, cost);
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

    upgrade(resources)
    {
        super.upgrade(resources);
    }
}

module.exports = OffenseTower;
