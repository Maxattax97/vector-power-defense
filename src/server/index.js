const SocketServer = require("ws").Server;
const express = require("express");
//const World = require("../shared/World");
const app = express();

// Lists of all game objects
/*
var creeps = [];
var defenseTowers = [];
var offenseTowers = [];
var powerNodes = [];
var playerList = [];

//init Express Router
var router = express.Router();
*/

app.use(express.static("public"));

const port = process.env.PORT || 3000;
const server = app.listen(port);
const wss = new SocketServer({ server });

wss.on("connection", function connection(ws)
{
    console.log("connection ...");

    ws.on("message", function incoming(message)
    {
        console.log("received: %s", message);
    });

    ws.send("message from server at: " + new Date());
});

/*
function initiateGame(err, count)
{

}
*/
