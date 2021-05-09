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
      .then(() => {
        return Promise.all([Post.findById(req.params.postId)]);
      })
      .then(([post, user]) => {
        post.comments.unshift(newComment);
        return Promise.all([post.save()]);
      })
      .then((post) => {
        res.redirect(`/posts/${req.params.postId}`);
      })
      .catch((err) => {
        console.log(err);
      });
  });
};
