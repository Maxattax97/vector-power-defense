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
