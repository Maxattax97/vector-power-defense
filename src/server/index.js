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

app.listen(port);
