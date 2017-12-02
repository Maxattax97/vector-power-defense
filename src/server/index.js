const SocketServer = require("ws").Server;
const express = require("express");
//const World = require("../shared/World");
const app = express();

// Lists of all game objects
var creeps = [];
var buildings = [];

//init Express Router
//var router = express.Router();

app.use(express.static("public"));

const port = process.env.PORT || 3000;
const server = app.listen(port);
const wss = new SocketServer({ server });

wss.on("connection", function connection(ws)
{
    console.log("connection ...");

    ws.on("message", function incoming(message)
    {
        var response = updateObjects(message);
        ws.send(response);
    });

    //ws.send("message from server at: " + new Date());
});

// Updates all lists. Message is a JSON with lists of new creeps, removed creeps, etc.
function updateObjects(message)
{
    var changes = JSON.parse(message.data);
    var i;
    var creep;
    var building;
    for (building in changes.newBuildings)
    {
        buildings.push(building);
    }
    for (building in changes.removedBuilding)
    {
        for (i = 0; i < buildings.length; i++)
        {
            if (buildings[i].xposition === building.xposition && buildings[i].yposition === building.yposition)
            {
                buildings.splice(i, i+1);
                break;
            }
        }
    }
    for (creep in changes.newCreeps)
    {
        creeps.push(creep);
    }
    for (creep in changes.removedCreeps)
    {
        for (i = 0; i < creeps.length; i++)
        {
            if (creeps[i].xposition === creep.xposition && creeps[i].yposition === creep.yposition)
            {
                creeps.splice(i, i+1);
                break;
            }
        }
    }
    var objects;
    objects.Creeps = creeps;
    objects.Buildings = buildings;
    return JSON.stringify(objects);
}
/*
function initiateGame(err, count)
{
var bodyParser = require("body-parser");
var express = require("express");
var app = express();

var port = process.env.PORT || 3000;
var publicHtmlDir = __dirname + "/../client/"

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
}));

// Probably a bad idea... HTTPS.
app.get("/", function(req, res) {
    // Check for cookie, if no cookie respond with login.
    console.log(req.headers, req.header);
    res.sendFile(publicHtmlDir + "login.html");
});

app.post("/auth", function(req, res) {
    console.log(req.body);
    res.send("Received a POST request at /auth");
});

}
*/
