require("dotenv").config();
const express = require("express");

const bodyParser = require("body-parser");
const path = require("path");
const usersRoutes = require('./routes/users.js');
const adminRoutes = require('./routes/admin.js');
const fileUpload = require('express-fileupload');

const passport = require("passport");
const cookieParser = require('cookie-parser');
const session = require('express-session');

const flash = require('connect-flash');

const app = express();
const PORT = 4000;

// Passport Config
require('./middleware/auth')(passport);

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }))

//use cookie parser
app.use(cookieParser('secret'));

//config session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // 86400000 1 day
    }
}));
// Require static assets from public folder
app.use(express.static(path.join(__dirname, 'public')))
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')))
app.use('/fontawesome', express.static(path.join(__dirname, 'node_modules/@fortawesome/fontawesome-free/css')))
app.use('/upload', express.static(path.join(__dirname, 'upload')))

// Set 'views' directory for any views 
// being rendered res.render()
app.set('views', path.join(__dirname, 'views'));
// Connect flash
app.use(flash());
//Config passport middleware
app.use(passport.initialize());
app.use(passport.session());
app.use(fileUpload({
    createParentPath: true,
}));

// Set view engine as EJS
app.set('view engine', 'ejs');

//app.use('/users', usersRoutes);
app.use('/admin', adminRoutes);

app.get('/', (req, res) => {
    console.log('[Test]!');
    res.send('Hello there');
})

app.listen(PORT, () => console.log(`Server Running... http://localhost:${PORT}`))