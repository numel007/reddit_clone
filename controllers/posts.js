const { Mongoose } = require("mongoose");
const { readyState } = require("../data/reddit-db");
const bodyParser = require("body-parser");
const Post = require("../models/posts");
const User = require("../models/user");

module.exports = (app) => {
  // Create Post
  app.post("/posts/new", (req, res) => {
    //   Return status 401 if user attempts to post without being logged in.
    if (req.user) {
      const post = new Post(req.body);
      post.author = req.user._id;
      post.upVotes = [];
      post.downVotes = [];
      post.voteScore = 0;

      post
        .save()
        .then((post) => {
          // Get user that is creating the new post
          return User.findById(req.user._id);
        })
        .then((user) => {
          // Add new post to user's posts array
          console.log("----ADDING POST TO USER----");
          user.posts.unshift(post);
          user.save();
          console.log("----SAVING USER----");
          res.redirect(`/posts/${post._id}`);
        })
        .catch((err) => {
          throw err.message;
        });
    }
  });

  // Get all posts
  app.get("/", (req, res) => {
    var currentUser = req.user;

    Post.find({})
      .lean()
      .populate("author")
      // Return lean version of all stored posts as 'posts'
      .then((posts) => {
        // Passes 'posts' to template
        res.render("posts-index", { posts, currentUser });
      })
      .catch((err) => {
        console.log(err.message);
      });
  });

  app.get("/posts/new", (req, res) => {
    var currentUser = req.user;
    console.log("Loading posts-new");
    res.render("posts-new", { currentUser });
  });

  // Display specific post by ID
  app.get("/posts/:id", function (req, res) {
    var currentUser = req.user;
    // Filter posts by ID
    Post.findById(req.params.id)
      .populate("comments")
      .lean()
      // Now selectedPost object includes associated comments, comment authors, and the post author
      .then((selectedPost) => {
        res.render("posts-show", { selectedPost, currentUser });
      })
      .catch((err) => {
        console.log(err.message);
      });
  });

  app.get("/n/:subreddit", function (req, res) {
    var currentUser = req.user;
    // Find only posts from specified subreddit
    Post.find({ subreddit: req.params.subreddit })
      .lean()
      .then((posts) => {
        // Build posts-index with only specified posts
        res.render("posts-index", { posts, currentUser });
      })
      .catch((err) => {
        console.log(err);
      });
  });

  app.put("/posts/:id/vote-up", function (req, res) {
    Post.findById(req.params.id).exec(function (err, post) {
      post.upVotes.push(req.user._id);
      post.voteScore = post.voteScore + 1;
      post.save();

      res.status(200);
    });
  });

  app.put("/posts/:id/vote-down", function (req, res) {
    Post.findById(req.params.id).exec(function (err, post) {
      post.downVotes.push(req.user._id);
      post.voteScore = post.voteScore - 1;
      post.save();

      res.status(200);
    });
  });
};
