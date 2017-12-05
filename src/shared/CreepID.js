// Script for creep id class

class CreepID
{
    /*
    Integer idCounter;
    */

    constructor()
    {
        this.idCounter = 0;
    }

    get creepID()
    {
        if (this.idCounter === Number.MAX_SAFE_INTEGER)
        {
            this.idCounter = 0;
        }
        else
        {
            this.idCounter++;
        }
        return this.idCounter;
    }
}

module.exports = CreepID;
