// Script for tile class

class Tile
{
    /*
    Integer xposition
    Integer yposition
    String tileColor        :: Color to be rendered as.
    Integer sideLength      :: Length of each tile.
    Boolean isWalkable      :: Whether tile can be walked on by creep.
    Boolean isBuildable     :: Whether tile can be built on.
    Integer nextTileX       :: Tile that creep pathing will go to next.
    Integer nextTileY
    */

    constructor(xpos, ypos, color, walkable, buildable)
    {
        this.xposition = xpos;
        this.yposition = ypos;
        this.tileColor = color;
        this.isWalkable = walkable;
        this.isBuildable = buildable;
        this.sideLength = 1; // Constant value for size of each tile, use same units as creep size
        this.nextTileX = -1;
        this.nextTileY = -1;
    }
}

module.exports = Tile;
