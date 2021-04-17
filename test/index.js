const app = require('./../server');
const chai = require('chai');
const chaiHTTP = require("chai-http");
const should = chai.should();

chai.use(chaiHTTP);

describe("site", function() {
    // Parameter "done" tells Mocha to execute the function to complete this test
    it("Should display homepage", function(done) {
        chai.request(app)
        .get('/')
        .end(function(err, res) {
            if (err) {
                return done(err);
            }
            res.status.should.be.equal(200);
            // Calling done() ensures async code above has completed before
            // moving on, or in some cases is used to ensure the test modified
            // something completely before performing a check.
            return done()
        })
    })
})