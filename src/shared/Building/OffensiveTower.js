
const Building = require("../Building");
const Creep = require("../Creep");

class OffenseTower extends Building
{
    /*
    Integer creepType           :: Type of the creep spawned by the tower.
    Boolean isBoss              :: Whether this is a boss spawner. Boss status increases
                                health substantially, at the cost of spawner cooldown.
                                Boss status has no effect on upgrade costs for spawner.
    Integer baseRoundDelay      :: Number of rounds boss spawner is cooling down for.
    Integer currentRoundDelay   :: Number of rounds since last spawn.
    Float averageSpawnDelay     :: Average time creep spawns after round begins.
    Float deviationSpawnDelay   :: Amount of possible deviation in spawn time.
    */

    constructor(xpos, ypos, type, cost, world)
    {
        super(xpos, ypos, type, cost, world);
        this.isBoss = false;
        this.currentRoundDelay = 0;
        this.baseRoundDelay = 0;
        switch (type)
        {
            // Always spawns at a set delay
            case "CreeperSpawn":
                this.averageSpawnDelay = 1.0;
                this.deviationSpawnDelay = 0.0;
                this.creepType = "Creeper";
                break;
            // Spawns latest on average since faster than others. Varies widely
            case "QuicksterSpawn":
                this.averageSpawnDelay = 3.5;
                this.deviationSpawnDelay = 2.5;
                this.creepType = "Quickster";
                break;
            // Spawns around the same time as normal creepers
            case "SwarmieSpawn":
                this.averageSpawnDelay = 1.0;
                this.deviationSpawnDelay = 0.5;
                this.creepType = "Swarmie";
                break;
            // Usually spawns after creepers and swarmies with massimos
            case "RotundoSpawn":
                this.averageSpawnDelay = 2.0;
                this.deviationSpawnDelay = 1.5;
                this.creepType = "Rotundo";
                break;
            // Usually spawns after creepers and swarmies with rotundos
            case "MassimoSpawn":
                this.averageSpawnDelay = 1.5;
                this.deviationSpawnDelay = 1.0;
                this.creepType = "Massimo";
                break;
        }
    }

    // Spawns the creep associated with the tower type
    get spawn()
    {
        var spawnList = [];
        if (this.currentRoundDelay === 0)
        {
            spawnList.push(new Creep(this.xpos, this.ypos - 5, this.creepType, this.buildingLevel, this.isBoss));
            if (this.creepType === "Swarmie")
            {
                spawnList.push(new Creep(this.xpos - 5, this.ypos - 5, this.creepType, this.buildingLevel, this.isBoss));
                spawnList.push(new Creep(this.xpos + 5, this.ypos - 5, this.creepType, this.buildingLevel, this.isBoss));
            }
            this.currentRoundDelay = this.baseRoundDelay;
        }
        return spawnList;
    }

    // Promote creep spawner into a boss spawner
    promote(resources)
    {
        switch (this.creepType)
        {
            case "CreeperSpawn":
                if (resources >= 500)
                {
                    resources -= 500;
                    this.isBoss = true;
                    this.baseRoundDelay = 1;
                }
                break;
            case "QuicksterSpawn":
                if (resources >= 600)
                {
                    resources -= 600;
                    this.isBoss = true;
                    this.baseRoundDelay = 2;
                }
                break;
            // Benefits least from health, so actually cheaper
            case "SwarmieSpawn":
                if (resources >= 400)
                {
                    resources -= 400;
                    this.isBoss = true;
                    this.baseRoundDelay = 1;
                }
                break;
            case "RotundoSpawn":
                if (resources >= 700)
                {
                    resources -= 700;
                    this.isBoss = true;
                    this.baseRoundDelay = 2;
                }
                break;
            case "MassimoSpawn":
                if (resources >= 800)
                {
                    resources -= 800;
                    this.isBoss = true;
                    this.baseRoundDelay = 3;
                }
                break;
        }
        return resources;
    }
}

module.exports = OffenseTower;
