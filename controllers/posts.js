const { Mongoose } = require('mongoose');
const { readyState } = require('../data/reddit-db');
const bodyParser = require('body-parser');
const Post = require('../models/posts');

module.exports = app => {
    // Create Post
    app.post("/posts/new", (req, res) => {
        const post = new Post(req.body)

        new_post = Post.findById(post.id)

        post.save((err, post) => {
            if (err) {
                console.log(err)
            } else {
                return res.redirect('/')
            }
        })
    });

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
    });

    app.get('/posts/new', (req, res) => {
        console.log('Loading posts-new')
        res.render('posts-new');
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
    });

    app.get('/n/:subreddit', function(req, res) {
        console.log(req.params.subreddit)
        // Find only posts from specified subreddit
        Post.find({subreddit: req.params.subreddit})
        .lean()
        .then(posts => {
            // Build posts-index with only specified posts
            res.render("posts-index", {posts})
        })
        .catch(err => {
            console.log(err)
        })
    });
}