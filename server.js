const express = require('express');
const routes = require('./controllers/');
const sequelize = require('./config/connection');

// use express-session module
const session = require('express-session');
const SequelizeStore =  require('connect-session-sequelize')(session.Store);

const sess = {
    secret: 'Super secret secret',
    cookie: {},
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({ db:sequelize })
};

// require path to import the stylesheet
const path = require('path');

//import handlebars variables
const exhbs = require('express-handlebars');
const hbs = exhbs.create({});

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// session middleware
app.use(session(sess));

//middleware for front end
app.use(express.static(path.join(__dirname, 'public')));

//handlebars middleware
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

//turn on routes
app.use(routes);

//turn on connection to db and server
sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log('now listening'));
});