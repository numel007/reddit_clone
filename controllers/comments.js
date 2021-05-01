const { Mongoose } = require("mongoose");
const { readyState } = require("../data/reddit-db");
const bodyParser = require("body-parser");
const Comment = require("../models/comments");
const Post = require("../models/posts.js");
const User = require("../models/user");

module.exports = (app) => {
  // Create comment
  app.post("/posts/:postId/comments", function (req, res) {
    const newComment = new Comment(req.body);
    newComment.author = req.user._id;

    // Save document to database
    newComment
      .save()
      .then((newComment) => {
        // Return comment's parent Post
        return Post.findById(req.params.postId);
      })
      .then((parentPost) => {
        // Add new comment to parentPost's comments list
        parentPost.comments.unshift(newComment);
        // Save and return a promise
        return parentPost.save();
      })
      .then((post) => {
        // Redirect to homepage after saving comment to parentPost
        res.redirect("/");
      })
      .catch((err) => {
        console.log(err);
      });
  });
};
