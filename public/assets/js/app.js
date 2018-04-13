// Grab the articles as a json on page load
$.getJSON("/scrape", function(data) {
  displayArticles(data);
  $("#current").text("Viewing current headlines").css("background-color", "#bfb");
  $("#saved").text("View saved headlines").css("background-color", "initial");
  $("#archive").text("View archived headlines").css("background-color", "initial");
});

$(document).on("click", "#saved", function() {
  $.getJSON("/articles/saved", function(data) {
    displayArticles(data);
    $("#current").text("View current headlines").css("background-color", "initial");
    $("#saved").text("Viewing saved headlines").css("background-color", "#bfb");
    $("#archive").text("View archived headlines").css("background-color", "initial");
  })
})

$(document).on("click", "#archive", function() {
  $.getJSON("/articles", function(data) {
    displayArticles(data);
    $("#current").text("View current headlines").css("background-color", "initial");
    $("#saved").text("View saved headlines").css("background-color", "initial");
    $("#archive").text("Viewing archived headlines").css("background-color", "#bfb");
  })
})

// "save article" button
$(document).on("click", ".saveArticle", function() {
  // this apparently doesn't work
  var isSaved = $(this).attr("saved");
  var thisId = $(this).attr("value");
  $.ajax({
    method: "POST",
    url: "/articles/save/" + thisId,
    data: {
      saved: true
    }
  });
  if (typeof isSaved !== typeof undefined && isSaved !== false) {
    $(this).removeAttr("saved").text("Save article");
  } else {
    $(this).attr("saved", "true").text("Forget article");
  }
});

// "view comments" button
$(document).on("click", ".viewComments", function() {
  var thisId = $(this).attr("value");
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    .then(function(data) {
      // whatever
    })
  $(this).closest(".article").children(".comments").slideToggle();

  // insert this if no comments have been made on article
  // var noComments = $("<li>").text("There are no comments yet. ").append($("<button>").addClass("addComment").text("Add one!"));
   
});

function displayArticles(data) {
  $("#articles").empty();
  var articles = $("<ul>");
  data.forEach(ele => {
    var singleArticle = $("<li>").addClass("article");
    var title = $("<h2>").append($("<a>").attr("href", ele.link).attr("target", "_blank").text(ele.title));
    var summary = $("<p>").text(ele.summary);
    var wingAndButtonDiv = $("<div>").addClass("wingAndButtonDiv");
    var wing = $("<img>");
    var saveArticle = $("<button>").attr("value", ele._id).addClass("saveArticle");
    ele.saved ? saveArticle.text("Forget article").attr("saved", "true") : saveArticle.text("Save article");
    var viewComments = $("<button>").attr("value", ele._id).addClass(".viewComments").text("View Comments");
    wingAndButtonDiv.append(wing, saveArticle, viewComments);
    ele.wing === "left" ? wing.attr("src", "assets/images/blueduck.png").parent().addClass("left") : wing.attr("src", "assets/images/redduck.png").parent().addClass("right");
    var commentArea = $("<ul>").addClass("comments");
    singleArticle.append(wingAndButtonDiv, title, summary, commentArea);
    articles.append(singleArticle);
  })
  $("#articles").append(articles);
}
