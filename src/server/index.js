const https = require("https");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const SocketServer = require("ws").Server;
const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const ObjectID = mongodb.ObjectID;
const express = require("express");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const session = require("express-session");

//init Express Router
//var router = express.Router();

const app = express();
const cookieSecret = require(path.resolve(__dirname + " /../../secrets.json")).cookieSecret;
const credentials = {
    key: fs.readFileSync(__dirname + "/security/privateKey.pem").toString(),
    cert: fs.readFileSync(__dirname + "/security/certificate.pem").toString(),
};


app.use(express.static("public"));
app.use(helmet()); // Security enhancements.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
}));
// TODO: Implement MongoDB session persistence for production environment.
app.set("trust proxy", 1);
const sessionParser = session({
    cookie: {
        secure: true,
    },
    secret: cookieSecret,
    resave: true,
    saveUninitialized: false,
});
app.use(sessionParser);

// HACK: We have to wait for a single request to fetch the store.
var sessionStore = null;

const port = process.env.PORT || 2701;
const publicHtmlDir = __dirname + "/../client/";

// Make the main app use our port and operate over HTTPS.
const httpsServer = https.createServer(credentials, app).listen(port);

// Create a surrogate HTTP server to redirect all requests over HTTP.
const redirectApp = express();

redirectApp.get("*", function(req, res) {
    res.redirect("https://" + req.headers.host + req.url);
});

const redirectServer = redirectApp.listen(port - 1);

// Create one more server for handling websockets. Wrapped in Express.
const wss = new SocketServer({
    server: httpsServer,
    verifyClient: (info, done) => {
        sessionParser(info.req, {}, () => {
            done(info.req.session.userId);
        });
    },
});


MongoClient.connect("mongodb://localhost:27017/vpd").then(function(db) {
    //////////////////////
    // WEBSOCKET SERVER //
    //////////////////////

    // Lists of all game objects
    var creeps = [];
    var buildings = [];
    var numConnections = 0;

    wss.on("connection", function connection(ws, req)
    {
        console.log(`connection from user ${req.session.userId}`);

        db.collection("accounts", {}, function(err, col) {
            col.findOne({_id: new ObjectID(req.session.userId)}, {}).then(function(account) {
                console.log(account);

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
        });
    });

    function initializePlayer(currConnections)
    {
        var playerInfo = {};
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
        for (building in changes.changedBuilding)
        {
            for (i = 0; i < buildings.length; i++)
            {
                if (buildings[i].xposition === building.xposition && buildings[i].yposition === building.yposition)
                {
                    buildings[i] = building;
                    break;
                }
            }
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
        for (creep in changes.changedCreeps)
        {
            for (i = 0; i < creeps.length; i++)
            {
                if (creeps[i].creepID === creep.creepID)
                {
                    creeps[i] = creep;
                    break;
                }
            }
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
        objects.creeps = creeps;
        objects.buildings = buildings;
        return JSON.stringify(objects);
    }

    //////////////////////////
    // HTTPS EXPRESS SERVER //
    //////////////////////////

    app.post("/auth", function(req, res) {
        trySaveSessionStore(req.sessionStore);

        if (req.session.userId) {
            console.log(req.session.userId);
            res.redirect("/game");
            return;
        }

        if (req.body && req.body.username && req.body.password) {
            if ((req.body.username === "root") && (req.body.password === "toor")) {
                // For debugging.
                console.log("root [ ID -1 ] succesfully authenticated");
                req.session.userId = -1;
                res.redirect("/game");
            } else {
                db.collection("accounts", {}, function(err, col) {
                    if (err) {
                        console.error(err);
                    } else {
                        col.findOne({username: req.body.username}, {}).then(function(doc) {
                            if (! doc) {
                                delete req.session.userId;
                                res.redirect("/login.html?msg=User+Does+Not+Exist&color=red");
                            } else {
                                var saltBuf = Buffer.from(doc.salt, "hex");
                                crypto.pbkdf2(req.body.password, saltBuf, doc.iterations, 256, "sha256", function(err, passHash) {
                                    if (err) {
                                        console.error(err);
                                        delete req.session.userId;
                                        res.redirect("/login.html?msg=Internal+Error&color=red");
                                    } else if (passHash.toString("hex") === doc.hash) {
                                        console.log(req.body.username + " [ ID", doc._id, "] succesfully authenticated");
                                        req.session.userId = doc._id;
                                        res.redirect("/game");
                                    } else {
                                        delete req.session.userId;
                                        if (! req.session.loginAttempts) {
                                            req.session.loginAttempts = 0;
                                        }
                                        req.session.loginAttempts++;
                                        console.log("Failed login attempt (" + req.session.loginAttempts + ")");
                                        res.redirect("/login.html?msg=Incorrect+Password&color=red");
                                    }
                                });
                            }
                        }).catch(function(err) {
                            console.error(err);
                            delete req.session.userId;
                            res.redirect("/login.html?msg=Internal+Error&color=red");
                        });
                    }
                });
            }
        } else {
            delete req.session.userId;
            res.redirect("/login.html?msg=Login+Failed&color=red");
        }
    });

    app.post("/logout", function(req, res) {
        trySaveSessionStore(req.sessionStore);

        delete req.session.userId;
        res.redirect("/login.html?msg=Logged+Out&color=green");
    });

    app.get("/logout", function(req, res) {
        trySaveSessionStore(req.sessionStore);

        delete req.session.userId;
        res.redirect("/login.html?msg=Logged+Out&color=green");
    });

    app.post("/newaccount", function(req, res) {
        trySaveSessionStore(req.sessionStore);

        if (req.body && req.body.email && req.body.username && req.body.password) {
            // TODO: Check that username and email are not yet in use.

            var iterations = 100000;
            crypto.randomBytes(128, function(err, saltBuf) {
                crypto.pbkdf2(req.body.password, saltBuf, iterations, 256, "sha256", function(err, passHash) {
                    db.collection("accounts", {}, function(err, col) {
                        if (err) {
                            console.error(err);
                            return;
                        }

                        console.log({
                            email: req.body.email,
                            username: req.body.username,
                            iterations: iterations,
                            salt: saltBuf.toString("hex"),
                            hash: passHash.toString("hex"),
                            statistics: {
                                highscore: 0,
                            },
                        });

                        col.insertOne({
                            email: req.body.email,
                            username: req.body.username,
                            iterations: iterations,
                            salt: saltBuf.toString("hex"),
                            hash: passHash.toString("hex"),
                            statistics: {
                                highscore: 0,
                            },
                        }, {}).then(function() {
                            console.log("Sucesfully created a new account for " + req.body.username);
                            res.redirect("/?msg=Account+Created&color=green");
                        }).catch(function(err) {
                            console.error(err);
                        });
                    });
                });
            });
        } else {
            res.redirect("/register?msg=Invalid+Fields&color=red");
        }
    });

    app.get("/game", function(req, res) {
        trySaveSessionStore(req.sessionStore);

        if (req.session.userId) {
            res.sendFile(path.resolve(publicHtmlDir + "game.html"));
        } else {
            res.redirect("/login.html");
        }
    });

    app.get("/register", function(req, res) {
        trySaveSessionStore(req.sessionStore);

        res.sendFile(path.resolve(publicHtmlDir + "register.html"));
    });

    app.get("/", function(req, res) {
        trySaveSessionStore(req.sessionStore);

        if (req.session.userId) {
            res.redirect("/game");
        } else {
            res.sendFile(path.resolve(publicHtmlDir + "login.html"));
        }
    });

    var shutdownMutex = 0;
    function shutdown() {
        if (shutdownMutex <= 0) {
            shutdownMutex = 1;
            console.log("MongoDB closing ...");
            db.close();
            console.log("HTTPS server closing ...");
            httpsServer.close();
            console.log("HTTP redirect server closing ...");
            redirectServer.close();
            console.log("WS server closing ...");
            wss.close();
            console.log("Shutdown process complete");
            shutdownMutex = 2;
        }
    }

    function trySaveSessionStore(store) {
        if (!sessionStore) {
            sessionStore = store;
            console.log("Fetched and saved reference to session store");
            console.log(sessionStore);
        }
    }

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
    process.on("exit", shutdown);
}).catch(function(err) {
    console.error(err);
});
