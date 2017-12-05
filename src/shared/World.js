
const Tile = require("./Tile");
//const Player = require("./Player");

// Number of tiles that a building takes up on one side
const BUILDSIZE = 4;

class World
{
    /*
    Integer xsize
    Integer ysize
    Tiles[][] map
    Building[] buildings
    PowerNode[] nodes
    Creep[] creeps
    */
    constructor(xsize, ysize)
    {
        this.map = [];
        this.buildings = [];
        this.creeps = [];
        this.xsize = xsize;
        this.ysize = ysize;
        for (var x = 0; x < xsize; x++) {
            this.map[x] = [];
            for (var y = 0; y < ysize; y++) {
                this.map[x][y] = new Tile(x, y, "#444444", true, true);
            }
        }
    }

    get string()
    {
        var result = "Buildings: ";
        for (var building in this.buildings)
        {
            result = result + "(" + building.string + ") ";
        }
        result = result + "\r\nCreeps: ";
        for (var creep in this.creeps)
        {
            result = result + "(" + creep.string + ") ";
        }
        result = result + "\r\n";
    }

    isValidSpot(buildx, buildy, playerx, playery)
    {
        if (playerx === this.xsize/16)
        {
            if (playery === this.ysize/16)
            {
                // Tower built in upper left
                if (!(0 < buildx && buildx < this.xsize/3 && 0 < buildy && buildy < this.ysize/2))
                {
                    return false;
                }
            }
            else if (playery === this.ysize * (15/16))
            {
                // Tower built in lower left
                if (!(0 < buildx && buildx < this.xsize/3 && this.ysize/2 < buildy && buildy < this.ysize))
                {
                    return false;
                }
            }
        }
        else if (playerx === this.xsize * (15/16))
        {
            if (playery === this.ysize/16)
            {
                // Tower built in upper right
                if (!(this.xsize * (2/3) < buildx && buildx < this.xsize && 0 < buildy && buildy < this.ysize/2))
                {
                    return false;
                }
            }
            else if (playery === this.ysize * (15/16))
            {
                // Tower built in lower right
                if (!(this.xsize * (2/3) < buildx && buildx < this.xsize && this.ysize/2 < buildy && buildy < this.ysize))
                {
                    return false;
                }
            }
        }
        else
        {
            // Spawner built in spawning area
            if (!(this.xsize * (1/3) < buildx && buildx < this.xsize * (2/3)))
            {
                return false;
            }
        }
        return this.map[buildx][buildy].isBuildable;
    }

    addBuilding(building)
    {
        this.buildings.push(building);
        var x = 0;
        var y = 0;
        for (x = building.xposition; x < BUILDSIZE; x++)
        {
            for (y = building.yposition; y < BUILDSIZE; y++)
            {
                this.map[x][y].isBuildable = false;
            }
        }

        /*
        Add this feature if we can afford to recalculate pathing

        if(building.buildingType.indexOf("Tower") !== -1)
        {
            map[building.xposition][building.yposition].isWalkable = false;
        }
        */
    }

    removeBuilding(building)
    {
        var i;
        for (i = 0; i < this.buildings.length; i++)
        {
            if (this.buildings[i].xposition === building.xposition && this.buildings[i].yposition === building.yposition)
            {
                this.buildings.splice(i, i+1);
                var x = 0;
                var y = 0;
                for (x = building.xposition; x < BUILDSIZE; x++)
                {
                    for (y = building.yposition; y < BUILDSIZE; y++)
                    {
                        this.map[x][y].isBuildable = true;
                    }
                }
                return;
            }
        }
    }

    addCreep(creep)
    {
        this.creeps.push(creep);
    }

    removeCreep(creep)
    {
        var i;
        for (i = 0; i < this.creeps.length; i++)
        {
            if (this.creeps[i].creepID === creep.creepID)
            {
                this.creeps.splice(i, i+1);
                return;
            }
        }
    }

    // Call once tiles are set
    calculatePathing()
    {
        // Tiles currently visited
        var visited = [];
        var tileQueue = [];
        for (var source in this.nodes)
        {
            var x = source.xposition;
            var y = source.yposition;
            tileQueue.push(this.map[x][y]);
            visited[x][y] = true;
            while (tileQueue.length !== 0)
            {
                var node = tileQueue.shift();
                x = node.xposition;
                y = node.yposition;
                if (x < this.xsize && visited[x+1][y] === false && this.map[x+1][y].isWalkable === true)
                {
                    this.map[x+1][y].nextTile = node;
                    tileQueue.push(this.map[x+1][y]);
                    visited[x+1][y] = true;
                }
                if (x > 0 && visited[x-1][y] === false && this.map[x-1][y].isWalkable === true)
                {
                    this.map[x-1][y].nextTile = node;
                    tileQueue.push(this.map[x-1][y]);
                    visited[x-1][y] = true;
                }
                if (y < this.ysize && visited[x][y+1] === false && this.map[x][y+1].isWalkable === true)
                {
                    this.map[x][y+1].nextTile = node;
                    tileQueue.push(this.map[x][y+1]);
                    visited[x][y+1] = true;
                }
                if (y > 0 && visited[x][y-1] === false && this.map[x][y-1].isWalkable === true)
                {
                    this.map[x][y-1].nextTile = node;
                    tileQueue.push(this.map[x][y-1]);
                    visited[x][y-1] = true;
                }
            }
        }
    }
}

module.exports = World;
