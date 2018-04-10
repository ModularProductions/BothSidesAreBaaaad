var express = require("express");
var request = require("request");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

var app = express();
var PORT = 3000;

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Set up a static folder (public) for our web app
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

// if deployed, use the deployed database. otheruse use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongod://localhost/mongoHeadlines";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {
  useMongoClient: true
});

// container for scraped info, database stuff

// add routing here
app.get("/", function(req, res) {
  // Handlebars requires an object to be sent to the index handlebars file

  // do stuff here
  // collate data, maybe append comments to each article
  db.articles.find({}, function(err, data) {
    if (err) {
      console.log(err);
    }
    else {
      res.render("index", data);
    }
  })

});

app.get("/scrape", function(req, res) {
  axios.get("https://patribotics.blog").then(function(response) {
    var $ = cheerio.load(response.data);
    $(".entry-title").each(function(i, element) {
      // refer to "20-Scraping-With-Mongoose" server.js
      var title = $(element).children("a").text();
      var link = $(element).children("a").attr("href");
      var summary = $(element).children(".entry-excerpt").children("p").text();
      if (title && link) {
        // create result object
        // don't forget which wing
        // push to articlesLeft array?
      }
    })
  }).then(function(value) {
    axios.get("https://www.infowars.com/category/us-news").then(function(response) {
      var $ = cheerio.load(response.data);
      $(".article-content").each(function(i, element) {
        var title = $(element).children("h3").children("a").text();
        var link = $(element).children("h3").children("a").attr("href");
        var summary = $(element).children("h4").text();
        if (title && link) {
          // create result object
          // don't forget which wing
          // push to articlesRight array?
        }

        // figure out how to collate into single set
        db.collections.insert({ headline: $(element).text()})
      })
    })

  })

  
})

// more routes if needed

// start app
app.listen(PORT, function() {
  console.log("App runing on port", PORT);
});