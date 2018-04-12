// Grab the articles as a json on page load
$.getJSON("/scrape", function(data) {
  var articles = $("<ul>");
  data.forEach(ele => {
    var singleArticle = $("<li>").addClass("article");
    var title = $("<p>").append($("<a>").attr("href", ele.link).attr("target", "_blank").text(ele.title));
    var summary = $("<p>").text(ele.summary);
    var wingAndViewCommentDiv = $("<div>").addClass("wingAndViewCommentDiv");
    var wing = $("<img>");
    var viewComments = $("<button>").attr("value", ele._id).text("View Comments");
    wingAndViewCommentDiv.append(wing, viewComments);
    ele.wing === "left" ? wing.attr("src", "assets/images/blueduck.png").parent().addClass("left") : wing.attr("src", "assets/images/redduck.png").parent().addClass("right");
    singleArticle.append(wingAndViewCommentDiv, title, summary);
    articles.append(singleArticle);
  })
  $("#articles").append(articles);
});

// $(document).on
