const { Mongoose } = require("mongoose");
const { readyState } = require("../data/reddit-db");
const bodyParser = require("body-parser");
const Comment = require("../models/comments");
const Post = require("../models/posts.js");
const User = require("../models/user");

module.exports = (app) => {
  // Create comment
  app.post("/posts/:postId/comments", function (req, res) {
    const comment = new Comment(req.body);
    comment.author = req.user._id;

    // Save document to database
    comment
      .save()
      .then(() => {
        return Promise.all([Post.findById(req.params.postId)]);
      })
      .then(([post]) => {
        post.comments.unshift(comment);
        return Promise.all([post.save()]);
      })
      .then(() => {
        res.redirect(`/posts/${req.params.postId}`);
      })
      .catch((err) => {
        console.log(err);
      });
  });
};
