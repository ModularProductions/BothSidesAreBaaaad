var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  summary: {
    type: String
  },
  // multiple comments vs one note
  // comments: {
  //   type: [],
  //   ref: "Comment"
  // },
  wing: {
    type: String
  },
  saved: {
    type: Boolean,
    default: false
  }
});

// This creates our model from the above schema, using mongoose's model method
module.exports = mongoose.model("Article", ArticleSchema);