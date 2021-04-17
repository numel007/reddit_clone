const { Mongoose } = require('mongoose');
const { readyState } = require('../data/reddit-db');
const bodyParser = require('body-parser');
const Post = require('../models/posts');

module.exports = app => {
    // Create Post
    app.post("/posts/new", (req, res) => {
        console.log('Recieved post')
        const post = new Post(req.body)
        console.log(post)

        new_post = Post.findById(post.id)
        console.log(`New post's id: ${new_post.id}`)

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

    // Display specific post by ID
    app.get('/posts/:id', function(req, res) {
        // Filter posts by ID
        Post.findById(req.params.id).lean()
        .then(selectedPost => {
            res.render("posts-show", {selectedPost});
        }).catch(err => {
            console.log(err.message);
        })
    })

}