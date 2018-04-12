var express = require("express");
var request = require("request");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var logger = require("morgan");

var app = express();
var PORT = 3000;

var exphbs = require("express-handlebars");

// Set up a static folder (public) for our web app
app.use(express.static("public"));
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// if deployed, use the deployed database. otheruse use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

// container for scraped info, database stuff

var routes = require("./controllers/controller.js");
app.use(routes);

// start app
app.listen(PORT, function() {
  console.log("App running on port", PORT);
});