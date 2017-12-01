
const Tile = require("./Tile");
const Player = require("./Player");

class World
{
    /*
    Integer xsize
    Integer ysize
    Tiles[][] map
    Player offensePlayer
    Player[] defensePlayers
    Building[] buildings
    PowerNode[] nodes
    Creep[] creeps
    */
    constructor(xsize, ysize, numDefenders)
    {
        this.map = [];
        this.defensePlayers = [];
        this.buildings = [];
        this.creeps = [];
        this.xsize = xsize;
        this.ysize = ysize;
        for (var x = 0; x < xsize; x++) {
            for (var y = 0; y < ysize; y++) {
                this.map[x][y] = new Tile(x, y, "#444444", true, true);
            }
        }
        this.offensePlayer = new Player(xsize/2, ysize/2, this, false, 0);
        if (numDefenders >= 1)
        {
            this.defensePlayers.push(new Player(xsize/16, ysize/16, this, true, numDefenders));
            this.buildings.push(this.defensePlayers[0].powerNode);
            this.nodes.push(this.defensePlayers[0].powerNode);
        }
        if (numDefenders >= 2)
        {
            this.defensePlayers.push(new Player(xsize/16, ysize*15/16, this, true, numDefenders));
            this.buildings.push(this.defensePlayers[1].powerNode);
            this.nodes.push(this.defensePlayers[1].powerNode);
        }
        if (numDefenders >= 3)
        {
            this.defensePlayers.push(new Player(xsize*15/16, ysize/16, this, true, numDefenders));
            this.buildings.push(this.defensePlayers[2].powerNode);
            this.nodes.push(this.defensePlayers[2].powerNode);
        }
        if (numDefenders === 4)
        {
            this.defensePlayers.push(new Player(xsize*15/16, ysize*15/16, this, true, numDefenders));
            this.buildings.push(this.defensePlayers[3].powerNode);
            this.nodes.push(this.defensePlayers[3].powerNode);
        }



    }

    // Called by client side to update the objects in the world for rendering
    update(buildingsNew, creepsNew, buildingsLost, creepsLost)
    {
        var i;
        var building;
        for (building in buildingsNew)
        {
            this.buildings.push(building);
        }
        for (building in buildingsLost)
        {
            for (i = 0; i < this.buildings.length; i++)
            {
                if (this.buildings[i].xposition === building.xposition && this.buildings[i].yposition === building.yposition)
                {
                    this.buildings.splice(i, i+1);
                    break;
                }
            }
        }
        var creep;
        for (creep in creepsNew)
        {
            this.creeps.push(creep);
        }
        for (creep in creepsLost)
        {
            for (i = 0; i < this.creeps.length; i++)
            {
                if (this.creeps[i].xposition === creep.xposition && this.creeps[i].yposition === creep.yposition)
                {
                    this.creeps.splice(i, i+1);
                    break;
                }
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
