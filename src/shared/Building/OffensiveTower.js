
const Building = require("../Building");

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

module.exports = OffenseTower;
