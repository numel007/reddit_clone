const User = require("../models/user");
const jwt = require("jsonwebtoken");

module.exports = (app) => {
  // Sign Up Form
  app.get("/sign-up", (req, res) => {
    res.render("sign-up");
  });

  app.post("/sign-up", (req, res) => {
    // Create new user and JWT
    const newUser = new User(req.body);

    newUser
      .save()
      .then((user) => {
        var token = jwt.sign({ _id: user._id }, process.env.SECRET, {
          expiresIn: "60 days",
        });
        res.cookie("nToken", token, { maxAge: 900000, httpOnly: true });
        res.redirect("/");
      })
      .catch((err) => {
        console.log(err.message);
        return res.status(400).send({ err: err });
      });
  });

  app.get("/logout", (req, res) => {
    res.clearCookie("nToken");
    res.redirect("/");
  });

  app.get("/login", (req, res) => {
    res.render("login");
  });

  app.post("/login", (req, res) => {
    // Errors if not passing the selected field 'username password'
    User.findOne({ username: req.body.username }, "username password")
      .then((user) => {
        if (!user) {
          return res.status(401).send({ message: "Username not found." });
        }
        user.comparePassword(req.body.password, (err, isMatch) => {
          if (!isMatch) {
            return res.status(401).send({ message: "Password is incorrect." });
          }
          const token = jwt.sign(
            { _id: user._id, username: user.username },
            process.env.SECRET,
            { expiresIn: "60 days" }
          );
          res.cookie("nToken", token, { maxAge: 900000, httpOnly: true });
          res.redirect("/");
        });
      })
      .catch((err) => {
        throw err.message;
      });
  });
};
