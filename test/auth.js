const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server");
const should = chai.should();
chai.use(chaiHttp);

const agent = chai.request.agent(server);

const User = require("../models/user");
const { deleteOne } = require("../models/user");

describe("User", function () {
  it("should not be able to log in if they have not registered", function (done) {
    agent
      .post("/login", { email: "email@email.com", password: "password" })
      .end((err, res) => {
        res.status.should.be.equal(401);
        done();
      });
  });

  it("should be able to sign up", function (done) {
    User.findOneAndRemove({ username: "testone" }, function () {
      agent
        .post("/sign-up")
        .send({ username: "testone", password: "password" })
        .end(function (err, res) {
          console.log(res.body);
          res.should.have.status(200);
          agent.should.have.cookie("nToken");
          done();
        });
    });
  });

  after(function () {
    agent.close();
  });
});
