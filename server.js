const express = require('express');

const app = express();

// Set db
require('./data/reddit-db');

// Middleware
const exphbs = require('express-handlebars');
const expressValidator = require('express-validator');

app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(expressValidator());

require('./controllers/posts.js')(app);
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars')

// Routes
app.get('/', (req, res) => {
    res.render('home');
})

app.get('/posts/new', (req, res) => {
    console.log('Loading posts-new')
    res.render('posts-new');
})

// Server start
app.listen(3000, () => {
    console.log('Reddit listening on port localhost:3000')
});