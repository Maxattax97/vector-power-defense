const SocketServer = require("ws").Server;
const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");
const helmet = require("helmet");
const app = express();

const credentials = {
    key: fs.readFileSync(__dirname + "/security/privateKey.pem").toString(),
    cert: fs.readFileSync(__dirname + "/security/certificate.pem").toString(),
};

/* Lists of all game objects
var creeps = [];
var defenseTowers = [];
var offenseTowers = [];
var powerNodes = [];
var playerList = [];
*/

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

    ws.on("message", function incoming(message)
    {
        console.log("received: %s", message);
    });

    ws.send("message from server at: " + new Date());
});

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

