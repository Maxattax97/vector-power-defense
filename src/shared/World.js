
const Tile = require("./Tile");
const Player = require("./Player");

class World
{
    /*
    Tiles[][] map
    Player offensePlayer
    Player[] defensePlayers
    Building[] buildings
    Creep[] creeps
    */

    /*
    Integer xsize
    Integer ysize
    */
    constructor(xsize, ysize)
    {
        this.map = [];
        this.defensePlayers = [];
        this.buildings = [];
        this.creeps = [];
        for (var x = 0; x < xsize; x++) {
            for (var y = 0; y < ysize; y++) {
                this.map[x][y] = new Tile(x, y, "#444444", true, true);
            }
        }
        this.offensePlayer = new Player(0, 0, false);
        this.defensePlayers.push(new Player(xsize/16, ysize/16, true));
        this.buildings.push(this.defensePlayers[0].powerNode);
        this.defensePlayers.push(new Player(xsize/16, ysize*15/16, true));
        this.buildings.push(this.defensePlayers[1].powerNode);
        this.defensePlayers.push(new Player(xsize*15/16, ysize/16, true));
        this.buildings.push(this.defensePlayers[2].powerNode);
        this.defensePlayers.push(new Player(xsize*15/16, ysize*15/16, true));
        this.buildings.push(this.defensePlayers[3].powerNode);
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
}

module.exports = World;
