require("dotenv").config();
const express = require("express");
var cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const app = express();

// Set db
require("./data/reddit-db");

// Middleware
const exphbs = require("express-handlebars");
const expressValidator = require("express-validator");
var checkAuth = (req, res, next) => {
  console.log("Checking auth");
  if (typeof req.cookies.nToken == "undefined" || req.cookies.nToken === null) {
    console.log("No valid cookie found");
    req.user = null;
  } else {
    var token = req.cookies.nToken;
    // complete: true returns payload with header and signature. Missing this option only returns payload.
    var decodedToken = jwt.decode(token, { complete: true }) || {};
    req.user = decodedToken.payload;
  }
  next();
};

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());
app.use(checkAuth);

// Import controller routes
require("./controllers/posts.js")(app);
require("./controllers/comments.js")(app);
require("./controllers/auth.js")(app);
require("./controllers/replies.js")(app);

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Routes
app.get("/", (req, res) => {
  res.render("home");
});

// Server start
app.listen(3000, () => {
  console.log("Reddit listening on port localhost:3000");
});

module.exports = app;
