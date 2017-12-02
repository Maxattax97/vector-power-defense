const SocketServer = require("ws").Server;
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
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

const port = process.env.PORT || 27001;
var publicHtmlDir = __dirname + "/../client/";

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

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
}));

// Probably a bad idea... needs HTTPS.

console.log(path.resolve(publicHtmlDir + "game.html"));
app.post("/auth", function(req, res) {
    // Check for cookie, if no cookie respond with login.
    console.log("Received a POST request at /auth");
    console.log(req.headers, req.header);
    res.sendFile(path.resolve(publicHtmlDir + "game.html"));
    // Redirect to game lobby.
});

app.get("/game", function(req, res) {
    res.sendFile(path.resolve(publicHtmlDir + "game.html"));
});

app.get("/", function(req, res) {
    res.sendFile(path.resolve(publicHtmlDir + "login.html"));
});

