
const Building = require("../Building");
const Creep = require("../Creep");

class OffenseTower extends Building
{
    /*
    Integer creepType
    Boolean isBoss
    Integer baseRoundDelay
    Integer currentRoundDelay
    Float averageSpawnDelay
    Float deviationSpawnDelay
    */

    constructor(xpos, ypos, type, cost)
    {
        super(xpos, ypos, type, cost);
        this.isBoss = false;
        switch (type)
        {
            case "CreeperSpawn":
                this.averageSpawnDelay = 1.0;
                this.deviationSpawnDelay = 0.0;
                this.creepType = "Creeper";
                break;
            case "QuicksterSpawn":
                this.averageSpawnDelay = 3.5;
                this.deviationSpawnDelay = 2.5;
                this.creepType = "Quickster";
                break;
            case "SwarmieSpawn":
                this.averageSpawnDelay = 1.0;
                this.deviationSpawnDelay = 0.5;
                this.creepType = "Swarmie";
                break;
            case "RotundoSpawn":
                this.averageSpawnDelay = 2.0;
                this.deviationSpawnDelay = 1.5;
                this.creepType = "Rotundo";
                break;
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
        spawnList.push(new Creep(this.xpos, this.ypos - 5, this.creepType, this.buildingLevel, this.isBoss));
        if (this.creepType === "Swarmie")
        {
            spawnList.push(new Creep(this.xpos - 5, this.ypos - 5, this.creepType, this.buildingLevel, this.isBoss));
            spawnList.push(new Creep(this.xpos + 5, this.ypos - 5, this.creepType, this.buildingLevel, this.isBoss));
        }
        return spawnList;
    }

    upgrade(resources)
    {
        return super.upgrade(resources);
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
                    this.currentRoundDelay = 0;
                }
                break;
            case "QuicksterSpawn":
                if (resources >= 600)
                {
                    resources -= 600;
                    this.isBoss = true;
                    this.baseRoundDelay = 2;
                    this.currentRoundDelay = 0;
                }
                break;
            case "SwarmieSpawn":
                if (resources >= 400)
                {
                    resources -= 400;
                    this.isBoss = true;
                    this.baseRoundDelay = 1;
                    this.currentRoundDelay = 0;
                }
                break;
            case "RotundoSpawn":
                if (resources >= 700)
                {
                    resources -= 750;
                    this.isBoss = true;
                    this.baseRoundDelay = 2;
                    this.currentRoundDelay = 0;
                }
                break;
            case "MassimoSpawn":
                if (resources >= 800)
                {
                    resources -= 1000;
                    this.isBoss = true;
                    this.baseRoundDelay = 3;
                    this.currentRoundDelay = 0;
                }
                break;
        }
        return resources;
    }
}

module.exports = OffenseTower;
