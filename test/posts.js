const app = require('./../server');
const chai = require('chai');
const chaiHTTP = require('chai-http');
const expect = chai.expect;

const Post = require('../models/posts');
const server = require('../server');
const { isValidObjectId } = require('mongoose');

const should = chai.should();
chai.use(chaiHTTP)

describe("Posts", function() {
    // Using request.agent() to retain cookies in order to access a subsequent page
    const agent = chai.request.agent(server);

    const newPost = {
        title: 'test post',
        url: 'https://www.google.com',
        summary: 'test post summary',
        subreddit: 'subreddit-for-mocha'
    };

    it("Should create a new POST for /posts/new", function(done) {
        // Get current number of posts before adding another post
        Post.estimatedDocumentCount()
        .then(function (firstDocCount) {
            // Fakes a POST since Mocha can't fill out the HTML form
            agent.post('/posts/new')
            // Set headers
            .set("content-type", "application/x-www-form-urlencoded")
            // Send payload
            .send(newPost)
            .then(function(res) {
                // Get new document count after POST
                Post.estimatedDocumentCount()
                .then(function (secondDocCount) {
                    // First ensure the database responds, meaning at least 1 post exists
                    expect(res).to.have.status(200);
                    // Then check secondDocCount == firstDocCount + 1
                    expect(secondDocCount).to.be.equal(firstDocCount + 1)
                    // call done() with no params to signal end of successful test
                    done();
                })
                .catch(function (err) {
                    done(err);
                })
            })
            .catch(function (err) {
                done(err)
            })
        })
        .catch(function (err) {
            done(err)
        })
    })

    // Delete post after testing
    after(function () {
        Post.findOneAndDelete(newPost)
        .then(function(res) {
        })
        .catch(function (err) {
            console.log(err)
        });
    })
})