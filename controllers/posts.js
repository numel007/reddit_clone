const { Mongoose } = require('mongoose');
const { readyState } = require('../data/reddit-db');
const bodyParser = require('body-parser');
const Post = require('../models/posts');

module.exports = app => {
    // Create Post
    app.post("/posts/new", (req, res) => {
        console.log('Recieved post')
        console.log(req.body)
        const post = new Post(req.body)
        console.log(post)

        new_post = Post.findById(post.id)

        post.save((err, post) => {
            if (err) {
                console.log(err)
            } else {
                return res.redirect('/')
            }
        })
    })

    // Get all posts
    app.get('/', (req, res) => {
        Post.find({}).lean()
            // Return lean version of all stored posts as 'posts'
            .then(posts => {
                // Passes 'posts' to template
                res.render('posts-index', {posts});
            })
            .catch(err => {
                console.log(err.message);
            })
    })
}