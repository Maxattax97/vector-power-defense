const SocketServer = require("ws").Server;
const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");
const helmet = require("helmet");
const app = express();

// Lists of all game objects
var creeps = [];
var buildings = [];
var numConnections = 0;

//init Express Router
//var router = express.Router();

const credentials = {
    key: fs.readFileSync(__dirname + "/security/privateKey.pem").toString(),
    cert: fs.readFileSync(__dirname + "/security/certificate.pem").toString(),
};

app.use(express.static("public"));
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
}));

const port = process.env.PORT || 27001;
var publicHtmlDir = __dirname + "/../client/";

// Make the main app use our port and operate over HTTPS.
https.createServer(credentials, app).listen(port);

// Create a surrogate HTTP server to redirect all requests over HTTP.
const redirectServer = express();

redirectServer.get("*", function(req, res) {
    res.redirect("https://" + req.headers.host + req.url);
});

redirectServer.listen(port - 1);

// Create one more server for handling websockets. Wrapped in Express.
const expressWsServer = http.createServer(express());
const wss = new SocketServer({ expressWsServer, port: port + 1 });

//////////////////////
// WEBSOCKET SERVER //
//////////////////////

wss.on("connection", function connection(ws)
{
    console.log("connection ...");
    var currConnections = ++numConnections;
    if (numConnections > 5)
    {
        ws.deny = true;
    }

    ws.on("message", function incoming(message)
    {
        var response;
        if (message === "Assign Player")
        {
            response = initializePlayer(currConnections);
        }
        else
        {
            response = updateObjects(message);
        }
        ws.send(response);
    });

    //ws.send("message from server at: " + new Date());
});

function initializePlayer(currConnections)
{
    var playerInfo;
    playerInfo.isDefense = true;
    playerInfo.playerInfo = true;
    playerInfo.play = false;
    switch (currConnections)
    {
        case 1:
            playerInfo.isDefense = false;
            playerInfo.xpos = 1/2;
            playerInfo.ypos = 1/2;
            break;
        case 2:
            playerInfo.xpos = 1/16;
            playerInfo.ypos = 1/16;
            break;
        case 3:
            playerInfo.xpos = 15/16;
            playerInfo.ypos = 1/16;
            break;
        case 4:
            playerInfo.xpos = 1/16;
            playerInfo.ypos = 15/16;
            break;
        case 5:
            playerInfo.xpos = 15/16;
            playerInfo.ypos = 15/16;
            playerInfo.play = true;
            break;
    }
    return JSON.stringify(playerInfo);
}

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
            if (creeps[i].creepID === creep.creepID)
            {
                creeps.splice(i, i+1);
                break;
            }
        }
    }
    var objects;
    objects.playerInfo = false;
    objects.play = true;
    objects.Creeps = creeps;
    objects.Buildings = buildings;
    return JSON.stringify(objects);
}

/////////////////
// HTTP SERVER //
/////////////////

app.post("/auth", function(req, res) {
    console.log("Received a POST request at /auth");
    // Check for cookie, if no cookie respond with login.
    if (req.body && req.body.username && req.body.password) {
        if ((req.body.username === "root") && (req.body.password === "toor")) {
            res.redirect("/game");
        } else {
            res.redirect("/?msg=Login+Failed&color=red");
        }
    } else {
        res.redirect("/?msg=Login+Failed&color=red");
    }
});

app.post("/newaccount", function(req, res) {
    console.log("Receive a POST request at /newaccount");
    res.redirect("/?msg=Account+Created&color=green");
});

app.get("/game", function(req, res) {
    res.sendFile(path.resolve(publicHtmlDir + "game.html"));
});

app.get("/register", function(req, res) {
    res.sendFile(path.resolve(publicHtmlDir + "register.html"));
});

app.get("/", function(req, res) {
    res.sendFile(path.resolve(publicHtmlDir + "login.html"));
});
