const express = require('express');

const app = express();

// Middleware
const exphbs = require('express-handlebars');

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars')

// Routes
app.get('/', (req, res) => {
    res.render('home')
})

// Server start
app.listen(3000, () => {
    console.log('Reddit listening on port localhost:3000')
});