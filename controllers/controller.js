var express = require("express");

var router = express.Router();

var article = require("../models/Article.js");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var cheerio = require("cheerio");
var axios = require("axios");

var db = require("../models");


// add routing here
router.get("/", function(req, res) {

  // do stuff here
  // collate data, maybe append comments to each article
  db.Article.find({})
    .then(function(dbArticle) {
      res.render("Article");
    })
    .catch(function(err) {
      res.json(err);
    });
});

router.get("/scrape", function(req, res) {
  // var articles = [];
  var newLeftArticles = [];
  var newRightArticles = [];
  console.log("about to get Left");  
  axios.get("https://patribotics.blog").then(function(response) {
    var $ = cheerio.load(response.data);
    $(".post-content").each(function(i, element) {
      var result = {};
      // refer to "20-Scraping-With-Mongoose" server.js
      var title = $(element).find(".entry-title").children("a").text();
      var link = $(element).find(".entry-title").children("a").attr("href");
      var summary = $(element).find(".entry-content").children("p").text();
      if (title && link) {
        result.title = title;
        result.link = link;
        result.summary = summary;
        result.wing = "left";
        newLeftArticles.push(result);
      }
    })
  }).then(function(value) {
    console.log("about to get Right");
    axios.get("https://www.infowars.com/category/us-news").then(function(response) {
      var $ = cheerio.load(response.data);
      $(".article-content").each(function(i, element) {
        var result = {};
        var title = $(element).children("h3").children("a").text();
        var link = $(element).children("h3").children("a").attr("href");
        var summary = $(element).children("h4").text();
        if (title && link) {
          result.title = title;
          result.link = link;
          result.summary = summary;
          result.wing = "right";
          newRightArticles.push(result);
        }
      })
      var newArticles = [];
      var listLength = newRightArticles.length > newLeftArticles.length ? newLeftArticles.length : newRightArticles.length;
      for (let i = 0; i < listLength; i++) {
        if (newLeftArticles[i]) newArticles.push(newLeftArticles[i]);
        if (newRightArticles[i]) newArticles.push(newRightArticles[i]);
      }
      // newArticles.forEach(ele => {
      //   db.Article.create(ele).then(function(dbArticle) {
      //     console.log(dbArticle);
      //   })
      //   .catch(function(err) {
      //     return res.json(err);
      //   });
      // })
      res.json(newArticles);      
    })
  })
})

// route for getting all articles from db
router.get("/articles", function(req, res) {
  db.Article.find({})
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// route for getting a specific article by ID, populate with its comment
router.get("/articles/:id", function(req, res) {
  db.Article.findOne({ _id: req.params.id })
    .populate("comment")
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err)
    });
});

// route for updating an article's comment
router.post("/articles/:id", function(req, res) {
  db.Comment.create(req.body)
    .then(function(dbComment) {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbComment._id }, { new: true });
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// more routes if needed

module.exports = router;