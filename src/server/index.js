const express = require("express");
const app = express();

const port = process.env.PORT || 3000;

app.use(express.static("public"));
app.listen(port);

const net = require("net");

var socket = net.createConnection();

// Start a server to accept connections
var server = net.createServer(function(socket)
{
    socket.write("Server connected\r\n");
    socket.pipe(socket);
    server.maxConnections = 5;
});

server.listen(port, "127.0.0.1");

// Wait for five connections before starting game
socket.on("connection",
{
    server.getConnections(initiateGame)
    {
        if(count === server.maxConnections)
        {
            callback(initiateGame(err, count));
        }
    }
});

const LENGTH = 1920;
const HEIGHT = 1080;

function initiateGame(err, count)
{
    var world = new World(LENGTH, HEIGHT);
}
