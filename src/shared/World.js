
const Tile = require("./Tile");
//const Player = require("./Player");

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
            for (var y = 0; y < ysize; y++) {
                this.map[x][y] = new Tile(x, y, "#444444", true, true);
            }
        }
    }

    isValidSpot(xpos, ypos)
    {
        return this.map[xpos][ypos].isBuildable;
    }

    addBuilding(building)
    {
        this.buildings.push(building);
    }

    removeBuilding(building)
    {
        var i;
        for (i = 0; i < this.buildings.length; i++)
        {
            if (this.buildings[i].xposition === building.xposition && this.buildings[i].yposition === building.yposition)
            {
                this.buildings.splice(i, i+1);
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
