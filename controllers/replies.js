var Post = require("../models/posts");
var Comment = require("../models/comments");
var User = require("../models/user");
const { post } = require("../server");

module.exports = (app) => {
  app.get("/posts/:postId/comments/:commentId/replies/new", (req, res) => {
    var currentUser = req.user;
    let post;
    Post.findById(req.params.postId)
      .lean()
      .then((p) => {
        post = p;
        return Comment.findById(req.params.commentId).lean();
      })
      .then((comment) => {
        console.log(`---------${comment}----------`);
        res.render("replies-new", { post, comment, currentUser });
      })
      .catch((err) => {
        console.log(err.message);
      });
  });

  app.post("/posts/:postId/comments/:commentId/replies", (req, res) => {
    const reply = new Comment(req.body);
    reply.author = req.user._id;

    Post.findById(req.params.postId).then((post) => {
      Promise.all([reply.save(), Comment.findById(req.params.commentId)])
        .then(([reply, comment]) => {
          comment.comments.unshift(reply._id);
          return Promise.all([comment.save()]);
        })
        .then(() => {
          res.redirect(`/posts/${req.params.postId}`);
        })
        .catch(console.error);
      return post.save();
    });
  });
};
