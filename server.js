const express           = require("express");
const mustacheExpress   = require("mustache-express");
const path              = require("path");
const routesBase        = require("./routes/base");
const routesApi         = require("./routes/api");
const morgan            = require("morgan");
const bodyParser        = require("body-parser");
const passport          = require('passport');
const LocalStrategy     = require('passport-local').Strategy;
const BasicStrategy     = require('passport-http').BasicStrategy;
const session           = require('express-session');
const flash             = require('express-flash-messages');
const model             = require("./models/index");
const User              = require("./models/index").User;
const Deck              = require("./models/index").Deck;
const Card              = require("./models/index").Card;
const bcrypt            = require("bcrypt");
const cookieParser      = require('cookie-parser')
const app               = express();

app.use(express.static(path.join(__dirname, "public")));

app.engine("mustache", mustacheExpress());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "mustache");
app.set("layout", "layout");

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(morgan("dev"));
//copy below
app.use(cookieParser())
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
//this too
app.use(passport.initialize());
app.use(passport.session());
app.use(flash())
app.use(function(req, res, next) {
    res.locals.errorMessage = req.flash('error')
    next()
});
//copy below
const authenticateUser = function(username, passwordHash, done) {
  User.findOne({
    where: {
      'username': username.toLowerCase()
    }
  }).then(function (user) {
    if (user == null) {
      return done(null, false, { message: 'Invalid email and/or password: please try again' })
    }

    let hashedPassword = bcrypt.hashSync(passwordHash, user.salt)

    if (user.passwordHash === hashedPassword) {
      return done(null, user)
    }

    return done(null, false, { message: 'Invalid email and/or password: please try again' })
  })
}

passport.use(new LocalStrategy(authenticateUser))
passport.use(new BasicStrategy(authenticateUser))

passport.serializeUser(function(user, done) {
  done(null, user.id)
})

passport.deserializeUser(function(id, done) {
  User.findOne({
    where: {
      'id': id
    }
  }).then(function (user) {
    if (user == null) {
      done(new Error('Wrong user id'))
    }

    done(null, user)
  })
})

app.use('/api', require('./routes/api'));
app.use('/', require("./routes/base"));


app.use(routesBase);
app.use(routesApi);


if(require.main === module){
    app.listen(3003, function() {
        console.log("App is running on localhost:3003");
    });
}



module.exports = app;
